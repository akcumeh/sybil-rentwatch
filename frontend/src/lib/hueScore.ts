import type { SupabaseClient } from '@supabase/supabase-js'

// ─── Tier ────────────────────────────────────────────────────────────────────

export function getTier(score: number): string {
  if (score >= 900) return 'platinum'
  if (score >= 750) return 'gold'
  if (score >= 600) return 'silver'
  if (score >= 400) return 'bronze'
  return 'red'
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computePropertyCare(
  damageDisputes: { outcome: string; status: string }[]
): number {
  if (!damageDisputes.length) return 250
  const confirmed  = damageDisputes.filter(d => d.outcome === 'confirmed'  && d.status === 'resolved')
  const tenantWon  = damageDisputes.filter(d => d.outcome === 'tenant_won' && d.status === 'resolved')
  const unresolved = damageDisputes.filter(d => d.status === 'active')
  if (unresolved.length)    return 70
  if (confirmed.length >= 2) return 70
  if (confirmed.length === 1) return 140
  if (tenantWon.length)     return 210
  return 250
}

async function countCleanCompletedLeases(
  tenantId: string,
  leases: { id: string; status: string }[],
  supabase: SupabaseClient
): Promise<number> {
  const completed = leases.filter(l => l.status === 'completed')
  let clean = 0
  for (const lease of completed) {
    const { data: violations } = await supabase
      .from('disputes')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('lease_id', lease.id)
      .eq('type', 'lease_violation')
      .eq('against', 'tenant')
      .eq('outcome', 'confirmed')
    if (!violations || violations.length === 0) clean++
  }
  return clean
}

function depositReturnTypeToScore(returnType: string): number {
  const map: Record<string, number> = {
    full_within_7_days:              250,
    full_8_to_14_days:               210,
    partial_accepted:                180,
    partial_tenant_disputed_won:      80,
    not_returned_landlord_won:       130,
    not_returned_tenant_won_dispute:   0,
    unresolved:                       60,
  }
  return map[returnType] ?? 60
}

function computeDepositIntegrity(
  completedLeases: { deposit_return_type: string }[]
): number {
  if (!completedLeases.length) return 250
  const avg = completedLeases.reduce(
    (s, l) => s + depositReturnTypeToScore(l.deposit_return_type),
    0
  ) / completedLeases.length
  return avg // already on 0-250 scale
}

function computePropertyAccuracy(
  complaints: { outcome: string | null; is_remediated: boolean; score_deduction: number }[]
): number {
  let score = 250
  for (const c of complaints) {
    if (!c.outcome || c.outcome === 'not_upheld' || c.outcome === 'dismissed') continue
    if (c.outcome === 'confirmed') {
      score -= 25
      if (c.is_remediated) score += 20 // PD1: remediated within 30d
    }
  }
  return Math.max(0, score)
}

// ─── Tenant Score ────────────────────────────────────────────────────────────

export async function computeTenantScore(
  tenantId: string,
  supabase: SupabaseClient
) {
  // Section 1: Payment Reliability
  const { data: payments } = await supabase
    .from('payments')
    .select('grade_points')
    .eq('tenant_id', tenantId)
    .not('grade_points', 'is', null)

  const paymentScore = payments?.length
    ? (payments.reduce((s, p) => s + (p.grade_points ?? 0), 0) / payments.length / 100) * 250
    : 250

  // Section 2: Property Care
  const { data: damageDisputes } = await supabase
    .from('disputes')
    .select('outcome, status')
    .eq('tenant_id', tenantId)
    .eq('type', 'property_damage')
    .eq('against', 'tenant')

  const propertyScore = computePropertyCare(damageDisputes ?? [])

  // Section 3: Lease Compliance
  const { data: violations } = await supabase
    .from('disputes')
    .select('outcome')
    .eq('tenant_id', tenantId)
    .eq('type', 'lease_violation')
    .eq('against', 'tenant')
    .eq('outcome', 'confirmed')

  const { data: leases } = await supabase
    .from('leases')
    .select('id, status')
    .eq('tenant_id', tenantId)

  const cleanCompleted = await countCleanCompletedLeases(tenantId, leases ?? [], supabase)
  const baseCompliance = cleanCompleted >= 2 ? 250 : 200
  const confirmedViolations = violations?.length ?? 0
  const leaseScore = Math.max(0, baseCompliance - confirmedViolations * 40)

  // Section 4: Behavioral Rating
  const { data: ratings } = await supabase
    .from('ratings')
    .select('stars')
    .eq('rated_id', tenantId)

  const behavioralScore = ratings?.length
    ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length / 5) * 250
    : 200

  return {
    payment_reliability: Math.round(paymentScore),
    property_care:       Math.round(propertyScore),
    lease_compliance:    Math.round(leaseScore),
    behavioral_rating:   Math.round(behavioralScore),
    total: Math.round(paymentScore + propertyScore + leaseScore + behavioralScore),
  }
}

// ─── Landlord Score ──────────────────────────────────────────────────────────

export async function computeLandlordScore(
  landlordId: string,
  supabase: SupabaseClient
) {
  // Section 1: Maintenance Responsiveness
  const { data: requests } = await supabase
    .from('maintenance_requests')
    .select('per_request_grade')
    .eq('landlord_id', landlordId)
    .not('per_request_grade', 'is', null)

  const maintenanceScore = requests?.length
    ? (requests.reduce((s, r) => s + (r.per_request_grade ?? 0), 0) / requests.length / 100) * 250
    : 200

  // Section 2: Deposit Integrity
  const { data: completedLeases } = await supabase
    .from('leases')
    .select('deposit_return_type')
    .eq('landlord_id', landlordId)
    .eq('status', 'completed')

  const depositScore = completedLeases?.length
    ? computeDepositIntegrity(completedLeases)
    : 250

  // Section 3: Property Accuracy
  const { data: accComplaints } = await supabase
    .from('disputes')
    .select('outcome, is_remediated, score_deduction')
    .eq('landlord_id', landlordId)
    .eq('type', 'property_accuracy')

  const accuracyScore = computePropertyAccuracy(accComplaints ?? [])

  // Section 4: Behavioral Rating
  const { data: ratings } = await supabase
    .from('ratings')
    .select('stars')
    .eq('rated_id', landlordId)

  const behavioralScore = ratings?.length
    ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length / 5) * 250
    : 200

  return {
    maintenance_responsiveness: Math.round(maintenanceScore),
    deposit_integrity:          Math.round(depositScore),
    property_accuracy:          Math.round(accuracyScore),
    behavioral_rating:          Math.round(behavioralScore),
    total: Math.round(maintenanceScore + depositScore + accuracyScore + behavioralScore),
  }
}
