import type { SupabaseClient } from '@supabase/supabase-js'
import { computeTenantScore, computeLandlordScore, getTier } from './hueScore'

export async function recomputeAndSave(
  userId: string,
  triggerType: string,
  triggerRefId: string | null,
  supabase: SupabaseClient
) {
  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !user) {
    console.error(`recomputeAndSave: user ${userId} not found`, error)
    return null
  }

  const scores =
    user.role === 'tenant'
      ? await computeTenantScore(userId, supabase)
      : await computeLandlordScore(userId, supabase)

  const tier = getTier(scores.total)
  const keys = Object.keys(scores).filter(k => k !== 'total')

  const s1 = scores[keys[0] as keyof typeof scores] as number
  const s2 = scores[keys[1] as keyof typeof scores] as number
  const s3 = scores[keys[2] as keyof typeof scores] as number
  const s4 = scores[keys[3] as keyof typeof scores] as number

  await supabase.from('hue_score_history').insert({
    user_id:        userId,
    total_score:    scores.total,
    tier,
    section_1_score: s1,
    section_2_score: s2,
    section_3_score: s3,
    section_4_score: s4,
    trigger_type:   triggerType,
    trigger_ref_id: triggerRefId,
  })

  await supabase
    .from('users')
    .update({
      hue_score:      scores.total,
      hue_tier:       tier,
      section_1_score: s1,
      section_2_score: s2,
      section_3_score: s3,
      section_4_score: s4,
      updated_at:     new Date().toISOString(),
    })
    .eq('id', userId)

  return scores
}
