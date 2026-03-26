import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { lockPaymentOnChain } from "@/lib/contract";

export async function POST(req: NextRequest) {
    const payload = await req.json();

    if (payload.responseCode !== "00") {
        return NextResponse.json({ received: true });
    }

    const supabase = createClient();

    const { data: payment, error } = await supabase
        .from("payments")
        .update({
            paid_date: new Date().toISOString(),
            status: "paid",
            interswitch_ref: payload.transactionReference
        })
        .eq("interswitch_ref", payload.transactionReference)
        .select("*, leases(id, tenant_id, landlord_id, amount)")
        .single();

    if (error || !payment) {
        console.error("Payment update failed", error);
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const paymentSnapshot = {
        leaseId: payment.lease_id,
        tenantId: payment.leases.tenant_id,
        landlordId: payment.leases.landlord_id,
        amount: payment.leases.amount,
        paidAt: payment.paid_date,
        interswitchRef: payload.transactionReference,
    };

    try {
        const txHash = await lockPaymentOnChain(payment.lease_id, paymentSnapshot);

        await supabase
            .from("payments")
            .update({ blockchain_tx_hash: txHash })
            .eq("id", payment.id);

    } catch (err) {
        console.error("Blockchain write failed", err);
    }

    // ...

    return NextResponse.json({ success: true });
}