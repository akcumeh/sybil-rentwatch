export function getTier(score: number): string {
    if (score >= 750) return 'clear';
    if (score >= 500) return 'clouded';
    if (score >= 250) return 'disturbed';
    return 'criminal';
}

export async function computeTenantScore(
    userId: string,
    supabase: import('@supabase/supabase-js').SupabaseClient
): Promise<{ payment_reliability: number; property_care: number; lease_compliance: number; community_rating: number; total: number }> {
    const { data: payments } = await supabase
        .from('payments')
        .select('status, grade_points')
        .eq('tenant_id', userId)
        .eq('status', 'confirmed');

    const confirmed = payments ?? [];
    const avgPoints = confirmed.length > 0
        ? confirmed.reduce((sum, p) => sum + (p.grade_points ?? 15), 0) / confirmed.length
        : 15;

    const section1 = Math.round(Math.min((avgPoints / 25) * 250, 250));

    const { data: disputes } = await supabase
        .from('disputes')
        .select('id')
        .eq('tenant_id', userId);

    const disputeCount = (disputes ?? []).length;
    const section2 = Math.max(0, 200 - disputeCount * 30);
    const section3 = confirmed.length > 0 ? 200 : 150;

    const { data: ratings } = await supabase
        .from('ratings')
        .select('overall_score')
        .eq('rated_user_id', userId);

    const ratingList = ratings ?? [];
    const section4 = ratingList.length > 0
        ? Math.round((ratingList.reduce((s, r) => s + r.overall_score, 0) / ratingList.length / 5) * 250)
        : 0;

    const total = section1 + section2 + section3 + section4;

    return { payment_reliability: section1, property_care: section2, lease_compliance: section3, community_rating: section4, total };
}

export async function computeLandlordScore(
    userId: string,
    supabase: import('@supabase/supabase-js').SupabaseClient
): Promise<{ maintenance_responsiveness: number; deposit_integrity: number; property_accuracy: number; behavioral_rating: number; total: number }> {
    const { data: disputes } = await supabase
        .from('disputes')
        .select('id, status')
        .eq('landlord_id', userId);

    const disputeList = disputes ?? [];
    const section1 = Math.max(0, 200 - disputeList.filter(d => d.status !== 'resolved').length * 25);
    const section2 = Math.max(0, 200 - disputeList.filter(d => d.status === 'resolved').length * 10);

    const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('landlord_id', userId);

    const section3 = (properties ?? []).length > 0 ? 200 : 150;

    const { data: ratings } = await supabase
        .from('ratings')
        .select('overall_score')
        .eq('rated_user_id', userId);

    const ratingList = ratings ?? [];
    const section4 = ratingList.length > 0
        ? Math.round((ratingList.reduce((s, r) => s + r.overall_score, 0) / ratingList.length / 5) * 250)
        : 0;

    const total = section1 + section2 + section3 + section4;

    return { maintenance_responsiveness: section1, deposit_integrity: section2, property_accuracy: section3, behavioral_rating: section4, total };
}
