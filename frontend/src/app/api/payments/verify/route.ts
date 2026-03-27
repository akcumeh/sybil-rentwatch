import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { gradePayment } from '@/lib/gradePayment';
import { recomputeAndSave } from '@/lib/scoreRecalc';
import { lockPaymentOnChain } from '@/lib/escrow';

async function getInterswitchToken(): Promise<string> {
    const credentials = Buffer.from(
        `${process.env.INTERSWITCH_CLIENT_ID_PAYMENTS}:${process.env.INTERSWITCH_CLIENT_SECRET_PAYMENTS}`
    ).toString('base64');

    const res = await fetch('https://qa.interswitchng.com/passport/oauth/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&scope=profile',
    });
    const data = await res.json();
    return data.access_token;
}

async function requeryTransaction(txRef: string, amountKobo: number): Promise<boolean> {
    const token = await getInterswitchToken();
    const url = `https://qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode=${process.env.INTERSWITCH_MERCHANT_CODE}&transactionreference=${txRef}&amount=${amountKobo}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.responseCode === '00';
}

export async function POST(req: NextRequest) {
    try {
        const { txnref, amount, resp } = await req.json();

        const supabase = createAdminClient();

        if (resp !== '00') {
            await supabase
                .from('payments')
                .update({ status: 'failed' })
                .eq('interswitch_tx_ref', txnref);
            return NextResponse.json({ status: 'failed' });
        }

        const verified = await requeryTransaction(txnref, amount);
        if (!verified) {
            return NextResponse.json({ status: 'unverified' }, { status: 400 });
        }

        const { data: payment, error } = await supabase
            .from('payments')
            .select('id, lease_id, tenant_id, amount_naira, due_date, leases(payment_frequency, landlord_id)')
            .eq('interswitch_tx_ref', txnref)
            .single();

        if (error || !payment) {
            return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
        }

        const lease = (payment.leases as { payment_frequency: string; landlord_id: string }[])[0];
        const grade = gradePayment(
            new Date(payment.due_date),
            new Date(),
            lease.payment_frequency as 'monthly' | 'annual'
        );

        await supabase
            .from('payments')
            .update({
                status:                 'confirmed',
                paid_date:              new Date().toISOString().split('T')[0],
                grade:                  grade.grade,
                grade_points:           grade.points,
                interswitch_payment_id: txnref,
            })
            .eq('interswitch_tx_ref', txnref);

        try {
            const txHash = await lockPaymentOnChain(payment.id, payment.lease_id, {
                paymentId:   payment.id,
                leaseId:     payment.lease_id,
                tenantId:    payment.tenant_id,
                amountNaira: payment.amount_naira,
                paidDate:    new Date().toISOString().split('T')[0],
                txRef:       txnref,
            });
            await supabase
                .from('payments')
                .update({ blockchain_tx_hash: txHash })
                .eq('id', payment.id);
        } catch (err) {
            console.error('Blockchain record failed (non-fatal):', err);
        }

        await recomputeAndSave(payment.tenant_id, 'payment_recorded', payment.id, supabase);

        return NextResponse.json({ status: 'success', grade: grade.grade, points: grade.points });
    } catch (err) {
        console.error('[/api/payments/verify]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
