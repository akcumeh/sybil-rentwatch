import type { SupabaseClient } from '@supabase/supabase-js';

// The /setdate page writes an offset (in days) to system_config.
// All scoring and payment grading should use this instead of new Date().
export async function getDemoDate(supabase: SupabaseClient): Promise<Date> {
    const { data } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'demo_date_offset_days')
        .single();

    const offset = parseInt(data?.value ?? '0', 10);
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
}
