import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const { paymentId, tenantEmail } = await req.json();

        if (!paymentId || !tenantEmail) {
            return NextResponse.json(
                { error: 'paymentId and tenantEmail are required' },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        const { data: payment, error } = await supabase
            .from('payments')
            .select('id, lease_id, tenant_id, amount_naira, due_date, payment_type, status')
            .eq('id', paymentId)
            .eq('status', 'pending')
            .single();

        if (error || !payment) {
            return NextResponse.json(
                { error: 'Payment not found or already processed' },
                { status: 404 }
            );
        }

        const txRef = `RW-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const amountKobo = payment.amount_naira * 100;

        // SHA-512 hash: txRef + merchantCode + payItemId + amount(kobo) + hashKey
        const hashInput = `${txRef}${process.env.INTERSWITCH_MERCHANT_CODE}${process.env.INTERSWITCH_PAY_ITEM_ID}${amountKobo}${process.env.INTERSWITCH_HASH_KEY}`;
        const hash = crypto.createHash('sha512').update(hashInput).digest('hex');

        await supabase
            .from('payments')
            .update({ status: 'processing', interswitch_tx_ref: txRef })
            .eq('id', paymentId);

        const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/tenant`;

        return NextResponse.json({
            merchantCode:         process.env.INTERSWITCH_MERCHANT_CODE,
            payItemId:            process.env.INTERSWITCH_PAY_ITEM_ID,
            amount:               amountKobo,
            transactionReference: txRef,
            hash,
            customerEmail:        tenantEmail,
            redirectUrl,
            // Metadata - used by the modal for display only, not sent to Interswitch
            _meta: {
                paymentId,
                paymentType: payment.payment_type,
                amountNaira: payment.amount_naira,
                dueDate:     payment.due_date,
            },
        });
    } catch (err) {
        console.error('[/api/payments/initiate]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
