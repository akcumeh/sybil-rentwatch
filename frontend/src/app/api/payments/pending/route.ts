import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    const leaseId = req.nextUrl.searchParams.get('leaseId');
    if (!leaseId) return NextResponse.json({ error: 'leaseId required' }, { status: 400 });

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('payments')
        .select('id, payment_type, amount_naira, due_date, status')
        .eq('lease_id', leaseId)
        .in('status', ['pending', 'processing'])
        .order('due_date', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ payments: data ?? [] });
}
