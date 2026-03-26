# RentWatch Hue Score System

The Hue Score is a trust and reputation score assigned to every user on RentWatch. It is scored out of **1000 points**, made up of four sections worth **250 points each**. Tenants and landlords have different sections reflecting their respective responsibilities.

The score is recalculated every time a relevant event occurs: a payment is recorded, a review is submitted, a dispute is resolved, or a maintenance request is updated.

---

## Tenant Hue Score

| Section | Max Points |
|---|---|
| Payment Reliability | 250 |
| Property Care | 250 |
| Lease Compliance | 250 |
| Behavioral Rating (from landlords) | 250 |
| **Total** | **1000** |

---

### 1. Payment Reliability (250 pts)

Every payment due is graded individually, then the average grade across all payments is scaled to 250.

**Monthly payments** — due date window logic:

| When payment lands | Grade | Points |
|---|---|---|
| Before due date (within 3-day early bird window) | Early+ | 100 |
| On exact due date | Early | 90 |
| After due date, within 4-day on-time window | On-time | 80 |
| After on-time window | Late | 50 |

> Example: rent due 1 March. Early bird window: 26 Feb–28 Feb. On-time window: 2 Mar–4 Mar. Anything after 4 Mar is late.

**Annual payments** — wider windows to reflect lump-sum nature:

| When payment lands | Grade | Points |
|---|---|---|
| Before due date (within 1-day early bird window) | Early+ | 100 |
| On exact due date | Early | 90 |
| After due date, within 21-day on-time window | On-time | 80 |
| After on-time window | Late | 50 |

> Example: rent due 1 March. Early bird: 28 Feb. On-time window: 2 Mar–22 Mar. Anything after 22 Mar is late.

**Formula:**

```
payment_reliability_score = (average of all payment grades / 100) × 250
```

**Default for new tenants:** 250 (assumed on-time until history exists)

---

### 2. Property Care (250 pts)

Based on damage disputes filed against the tenant and exit inspection outcomes.

| Situation | Score |
|---|---|
| No damage disputes on record | 250 |
| Dispute filed, resolved in tenant's favour | 210 |
| Dispute filed, resolved in landlord's favour | 140 |
| Multiple confirmed damage disputes | 70 |
| Unresolved dispute at scoring time | 70 |

**Default for new tenants:** 250

---

### 3. Lease Compliance (250 pts)

Starts at 250. Points are deducted per confirmed lease violation or breach event. Deductions are only applied when a report is confirmed — unverified landlord reports carry no penalty.

| Event | Deduction |
|---|---|
| Unauthorized early termination | -100 |
| Each confirmed lease violation (e.g. subletting, noise, unauthorized occupants) | -40 |
| Violation reported but not upheld | 0 |

Floor: 0. Score is based on lifetime lease history.

**Default for new tenants:** 200

---

### 4. Behavioral Rating (250 pts)

Star ratings given by landlords at the end of a lease. Covers relational and behavioral conduct the system cannot observe directly.

```
behavioral_score = (average star rating / 5) × 250
```

**Default for new tenants:** 200 (neutral, not penalized for having no history)

---

## Landlord Hue Score

| Section | Max Points |
|---|---|
| Maintenance Responsiveness | 250 |
| Deposit Integrity | 250 |
| Property Accuracy | 250 |
| Behavioral Rating (from tenants) | 250 |
| **Total** | **1000** |

---

### 1. Maintenance Responsiveness (250 pts)

Each maintenance request is scored individually based on how quickly the landlord resolved it. Scores are averaged across all requests, then scaled to 250.

| Resolution time (from request filed) | Per-request score |
|---|---|
| 1–3 days | 100 |
| 4–7 days | 80 |
| 8–15 days | 65 |
| 16–30 days (standard) | Linear: `65 × (30 - days_to_resolve) / 15` |
| 16–30 days (delay excused) | 65–75 (see note below) |
| Beyond 30 days | 0 |
| No response / unresolved | 0 |

**Excused delay (16–30 days):** If the delay was demonstrably outside the landlord's control — e.g. a contractor/plumber difficulty sourcing parts, a utility company backlog — the landlord can submit a reason and the tenant can independently confirm the delay was not the landlord's fault. Requests marked as excused are scored in the 65–75 range at the platform's discretion rather than the linear formula. Both parties must agree or evidence must be attached; a landlord-only claim is not sufficient.

```
maintenance_score = (average of all request scores / 100) × 250
```

Landlords with no maintenance requests logged default to **200** (not 250 — absence of data is not evidence of excellence).

**Default for new landlords:** 200

---

### 2. Deposit Integrity (250 pts)

Based on how deposits are handled at the end of each lease.

| Situation | Score |
|---|---|
| Deposit returned in full within 7 days of lease end | 250 |
| Returned in full, 8–14 days after lease end | 210 |
| Partial return with documented, accepted reason | 180 |
| Partial return, tenant disputed and won | 80 |
| Not returned, landlord won dispute (valid deduction) | 190 |
| Not returned, tenant won dispute (wrongful withholding) | 0 |
| Unresolved at scoring time | 60 |

Score is based on lifetime lease history. Where multiple leases exist, the deposit integrity score is averaged across all of them.

**Default for new landlords:** 250

---

### 3. Property Accuracy (250 pts)

Based on confirmed inaccuracy complaints filed by tenants. Covers misrepresentation of the property in its listing.

**Categories of inaccuracy:**

- Size misrepresentation
- Advertised features that do not exist (e.g. cupboard, heater, generator, AC)
- Basic amenities missing or non-functional (e.g. electricity meter, water supply, waste management, working plumbing)
- Any other confirmed material misrepresentation

**Scoring:**

Starts at 250. Each confirmed inaccuracy deducts points. Complaints that are not upheld carry no penalty.

| Situation | Adjustment |
|---|---|
| No complaints filed | 250 |
| Complaint filed, not upheld | 250 (no deduction) |
| Each confirmed inaccuracy (minor or major) | -25 per item, minimum |
| Severe or multiple confirmed inaccuracies | higher deductions at team's discretion |

Floor: 0. Score is per active listing and averaged across all landlord properties.

**Default for new landlords:** 250

---

### 4. Behavioral Rating (250 pts)

Star ratings given by tenants at the end of a lease. Covers responsiveness, communication, and general conduct.

```
behavioral_score = (average star rating / 5) × 250
```

**Default for new landlords:** 200

---

## Default Scores Summary

| User | Section | Default |
|---|---|---|
| Tenant | Payment Reliability | 250 |
| Tenant | Property Care | 250 |
| Tenant | Lease Compliance | 200 |
| Tenant | Behavioral Rating | 200 |
| **Tenant starting Hue Score** | | **900 / 1000** |
| Landlord | Maintenance Responsiveness | 200 |
| Landlord | Deposit Integrity | 250 |
| Landlord | Property Accuracy | 250 |
| Landlord | Behavioral Rating | 200 |
| **Landlord starting Hue Score** | | **900 / 1000** |

---

## Notes

- **Lifetime history** is used across all sections. No rolling window for MVP.
- **Unverified reports** (complaints not upheld, violations not confirmed) carry no penalty in any section.
- The behavioral rating section (subjective) represents **25% of the total score**. A single bad review cannot sink a user's score.
- Score recalculation is triggered by: a payment being recorded, a review being submitted, a dispute being resolved, or a maintenance request being updated.
- Every recalculation is written to `hue_score_history` with a trigger type, and the latest value is cached on the `users` table for fast reads.
