import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { lockPaymentOnChain } from '@/lib/escrow';
import { recomputeAndSave } from '@/lib/scoreRecalc';

export async function POST(req: NextRequest) {
    const payload = await req.json();

    if (payload.responseCode !== '00') {
        return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();
    
    const { data: payment, error } = await supabase
        .from('payments')
        .update({
            paid_date:       new Date().toISOString(),
            status:          'paid',
            interswitch_ref: payload.transactionReference,
        })
        .eq('interswitch_ref', payload.transactionReference)
        .select('*, leases(id, tenant_id, landlord_id, amount)')
        .single();

    if (error || !payment) {
        console.error('Payment update failed', error);
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const lease = payment.leases as { id: string; tenant_id: string; landlord_id: string; amount: number };

    const paymentSnapshot = {
        leaseId:        payment.lease_id,
        tenantId:       lease.tenant_id,
        landlordId:     lease.landlord_id,
        amount:         lease.amount,
        paidAt:         payment.paid_date,
        interswitchRef: payload.transactionReference,
    };

    try {
        const txHash = await lockPaymentOnChain(payment.id, payment.lease_id, paymentSnapshot);
        await supabase
            .from('payments')
            .update({ blockchain_tx_hash: txHash })
            .eq('id', payment.id);
    } catch (err) {
        console.error('Blockchain write failed', err);
    }

    try {
        await recomputeAndSave(lease.tenant_id, 'payment_recorded', payment.id, supabase);
    } catch (err) {
        console.error('Score recomputation failed', err);
    }

    return NextResponse.json({ success: true });
}
