# RentWatch: Mutual Accountability Platform for Lagos Real Estate

## 1. Executive Summary

RentWatch is a mutual accountability platform for Lagos real estate. It gives landlords and tenants a shared trust infrastructure that the market has never had: verified identities, escrow-protected payments, and a two-way reputation score called the Hue Score.

Lagos rentals run on personal relationships because there is no system. RentWatch is that system. It does not try to replace the annual payment model the market is built on. It makes that model fair for both sides.

> - At least 1 in 5 property transactions in Lagos involve fraud, misrepresentation, or illegal documentation.
> - Between January and July 2025 alone, estimated losses to real estate scams across Nigeria reached ₦16.2 billion.
> - A 2024 survey shows 63% of Lagos renters prefer paying annually. The annual payment model is not a problem to fix.
> - Every major competitor (Spleet, RentSmallSmall, iPropty) solves access and payment flexibility. None solve mutual trust.

---

## 2. Problem Statement

### 2.1 Market Failures

Nigerian real estate has operated on relationships and social trust for decades. Landlords ask for 1–2 years upfront not because it is ideal, but because there is no reliable alternative signal of tenant commitment. There is no credit scoring. Eviction protections are slow and expensive. So landlords take what they can upfront and bear the risk alone.

Tenants pay large sums into arrangements with no enforceable recourse. Deposits disappear. Properties are misrepresented. Maintenance gets ignored after move-in. There is no equivalent risk protection on their side.

| Problem | Who Bears It | Current State |
|---|---|---|
| No rental history system | Both | Good tenants cannot prove reliability; bad actors reset freely |
| Deposit theft | Tenants | Landlords withhold deposits with no accountability |
| Property misrepresentation | Tenants | Listings routinely overstate features, size, and amenities |
| Fake landlords and agents | Tenants | Fraud is endemic; losses hit ₦16.2B in H1 2025 |
| Landlord impunity on maintenance | Tenants | No mechanism to record or surface negligent landlord behaviour |
| Power asymmetry on documents | Tenants | Landlords hold all documents, deposits, and terms |
| No formal dispute resolution | Both | Courts are too slow and expensive for most rent disputes |

### 2.2 The Competitive Gap

Spleet raised $2.6 million building monthly payment infrastructure and by 2024 was laying off staff. The unit economics collapsed under inflation and slow repayments. The problem was never payment frequency. It was trust.

No platform in the Nigerian rental market tracks landlord behavior, records mutual accountability, or gives tenants any persistent reputation that follows them across properties. That is what RentWatch builds.

---

## 3. Solution Overview

RentWatch is the trust layer the Lagos rental market is missing. Three mechanisms deliver this:

| Mechanism | What It Does |
|---|---|
| Hue Score | A two-way reputation score for both landlords and tenants, scored out of 1000 across four sections each. 75% objective data, 25% subjective ratings. |
| Smart Escrow | Rent and deposit payments held in a smart contract. Release conditions are transparent and enforced on-chain. Both parties are protected. |
| Verified Identity | Mock BVN/NIN verification for demo. Cross-property tracking prevents identity reset scams. |

> The escrow protects the annual payment that already happens. Tenants pay upfront; funds sit protected; release conditions are visible to both parties.

---

## 4. The Hue Score System

Every user on RentWatch has a Hue Score out of 1000. It is made up of four sections worth 250 points each. Tenants and landlords have different sections reflecting their respective responsibilities.

The score is recalculated every time a relevant event occurs: a payment is recorded, a review is submitted, a dispute is resolved, or a maintenance request is updated.

Every recalculation writes to `hue_score_history` with a trigger type. The latest value is cached on the `users` table for fast reads. This separation enables both performance and historical charting.

> - Behavioral ratings (subjective) represent 25% of the total score. A single bad review cannot sink a user's score.
> - Unverified reports, complaints not upheld, and violations not confirmed carry zero penalty in any section.
> - Lifetime history is used across all sections. No rolling window for MVP.

---

### 4.1 Tenant Hue Score

| Section | Max Points | Default (New Tenant) |
|---|---|---|
| Payment Reliability | 250 | 250 |
| Property Care | 250 | 250 |
| Lease Compliance | 250 | 200 |
| Behavioral Rating (from landlords) | 250 | 200 |
| **Total** | **1000** | **900** |

#### 4.1.1 Payment Reliability (250 pts)

Every payment due is graded individually. The average grade across all payments is scaled to 250.

**Monthly payment windows:**

| When payment lands | Grade | Points |
|---|---|---|
| More than 3 days before due date (early bird) | Early+ | 100 |
| On the exact due date | Early | 90 |
| After due date, within 4-day on-time window | On-time | 80 |
| After the on-time window | Late | 50 |

**Annual payment windows:**

| When payment lands | Grade | Points |
|---|---|---|
| 1 day before due date (early bird) | Early+ | 100 |
| On the exact due date | Early | 90 |
| After due date, within 21-day on-time window | On-time | 80 |
| After the 21-day on-time window | Late | 50 |

```
payment_reliability_score = (average of all payment grades / 100) × 250
```

> **Annual example:** rent due March 1. Early bird: Feb 28. On-time window: Mar 2–22. Late: anything after Mar 22.

**Default for new tenants:** 250

#### 4.1.2 Property Care (250 pts)

Based on damage disputes filed against the tenant and exit inspection outcomes.

| Situation | Score |
|---|---|
| No damage disputes on record | 250 |
| Dispute filed, resolved in tenant's favour | 210 |
| Dispute filed, resolved in landlord's favour | 140 |
| Multiple confirmed damage disputes | 70 |
| Unresolved dispute at scoring time | 70 |

**Default for new tenants:** 250

#### 4.1.3 Lease Compliance (250 pts)

Starts at 250. Points are deducted per confirmed lease violation or breach event. Unverified reports carry no penalty. Floor: 0. Score is based on lifetime lease history.

| Event | Deduction |
|---|---|
| Unauthorized early termination | −90 |
| Each confirmed violation (subletting, noise, unauthorized occupants, etc.) | −40 |
| Violation reported but not upheld | 0 |

> **Default for new tenants: 200**, not 250. Lease compliance history is unknown on entry; the system does not assume perfection.

#### 4.1.4 Behavioral Rating (250 pts)

Star ratings given by landlords at the end of a lease. Covers relational and behavioral conduct that the system cannot observe directly.

```
behavioral_score = (average star rating / 5) × 250
```

**Default for new tenants:** 200 (neutral, not penalized for having no history)

---

### 4.2 Landlord Hue Score

| Section | Max Points | Default (New Landlord) |
|---|---|---|
| Maintenance Responsiveness | 250 | 200 |
| Deposit Integrity | 250 | 250 |
| Property Accuracy | 250 | 250 |
| Behavioral Rating (from tenants) | 250 | 200 |
| **Total** | **1000** | **900** |

#### 4.2.1 Maintenance Responsiveness (250 pts)

Each maintenance request is scored individually based on response time. Scores are averaged, then scaled to 250.

| Response time from request filed | Per-request score |
|---|---|
| Within 24 hours | 100 |
| Within 3 days | 80 |
| Within 7 days | 60 |
| Beyond 7 days | 30 |
| No response / unresolved | 0 |

```
maintenance_score = (average of all request scores / 100) × 250
```

> **Default for new landlords: 200**, not 250. Absence of maintenance requests is not evidence of good maintenance.

#### 4.2.2 Deposit Integrity (250 pts)

Based on how deposits are handled at the end of each lease. Where multiple leases exist, the score is averaged across all of them.

| Situation | Score |
|---|---|
| Deposit returned in full within 7 days of lease end | 250 |
| Returned in full, 8–14 days after lease end | 210 |
| Partial return with documented, accepted reason | 180 |
| Partial return, tenant disputed and won | 80 |
| Not returned, landlord won dispute (valid deduction) | 130 |
| Not returned, tenant won dispute (wrongful withholding) | 0 |
| Unresolved at scoring time | 60 |

**Default for new landlords:** 250

#### 4.2.3 Property Accuracy (250 pts)

Starts at 250. Deductions are applied for confirmed inaccuracy complaints filed by tenants. Complaints not upheld carry no penalty. Floor: 0. Score is per active listing and averaged across all landlord properties.

**Categories of inaccuracy:**
- Size misrepresentation
- Advertised features that do not exist (cupboard, heater, generator, AC)
- Basic amenities missing or non-functional (electricity meter, water, working plumbing)
- Any other confirmed material misrepresentation

| Situation | Adjustment |
|---|---|
| No complaints filed | 250 |
| Complaint filed, not upheld | 250 (no deduction) |
| Each confirmed inaccuracy (minor or major) | −25 per item, minimum |
| Severe or multiple confirmed inaccuracies | Higher deductions at team discretion |

**Default for new landlords:** 250

#### 4.2.4 Behavioral Rating (250 pts)

Star ratings given by tenants at the end of a lease. Covers responsiveness, communication, and general conduct.

```
behavioral_score = (average star rating / 5) × 250
```

**Default for new landlords:** 200

---

### 4.3 Score Tiers

Tiers drive UI presentation only. A higher tier means the user has a stronger track record. It does not gate features or payment options.

| Tier | Score Range | Color | Meaning |
|---|---|---|---|
| Platinum | 900–1000 | Indigo | Exceptional, long-standing track record |
| Gold | 750–899 | Amber | Strong, consistent performer |
| Silver | 600–749 | Gray | Reliable, no major flags |
| Bronze | 400–599 | Orange | Mixed history; caution advised |
| Red | 0–399 | Red | Significant concerns on record |

---

## 5. MVP Scope (Hackathon Build)

The MVP demonstrates one complete loop: registration through to a rated, scored landlord-tenant relationship. Five screens, one story.

> **The demo story:** ₦16.2 billion in losses in 6 months. No platform tracks landlord behaviour. No tenant can prove their reliability. RentWatch is the trust infrastructure this market never had.

### 5.1 The Five-Screen Demo Flow

| Screen | What It Shows | Key Demo Moment |
|---|---|---|
| 1. Identity & Verification | Mock BVN/NIN input, role selection (Tenant / Landlord) | Cross-property identity — same person cannot reset by re-registering |
| 2. Property Listing | Landlord creates listing, uploads docs. System flags it as RentWatch Verified vs unverified | Visual trust signal directly attacking the fake landlord problem |
| 3. Lease & Escrow | Tenant selects property, lease terms set, payment goes into escrow. Both parties sign digitally | Show funds sitting protected. Show conditions for release. |
| 4. Hue Score Dashboard | Both parties see their scores with full breakdown: tier, section scores, what actions improve each | Dual-sided accountability — both parties have skin in the game |
| 5. Rating Flow | Post-lease simulation. Both parties rate each other across behavioral categories. Show score update | Close the loop — show the system learning from real events |

### 5.2 In Scope

- User registration with role selection (Tenant / Landlord)
- Mock BVN/NIN verification (simulated, not live API)
- Property listing creation with image upload and feature fields
- RentWatch Verified badge logic based on document upload completeness
- Lease creation flow with configurable terms
- Interswitch payment integration (test mode) with escrow wallet creation
- Smart contract escrow: deposit lock, conditional release, dispute hold
- Dual Hue Score dashboard with tier display, section breakdown, and improvement hints
- Post-lease rating flow for both roles
- Score recalculation on rating submission, payment record, dispute resolution, maintenance update
- `hue_score_history` table with trigger type tracking, enabling score-over-time chart
- Demo time-travel (`/setdate` page) for simulating lease progression

### 5.3 Out of Scope (Post-Hackathon)

- Live BVN/NIN API integration
- Community or professional arbitration platform
- ML-based scoring algorithms
- Multi-country support (Ghana, Senegal, etc.)
- Mobile app (web-first for MVP)
- Recurring payment automation (Quickteller subscription model)
- Cross-border rental history portability

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind | Server components for data-heavy pages; client components for interactivity |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) | RLS policies per role; `@supabase/ssr` for server/browser client separation |
| Blockchain | Hardhat + ethers.js | Solidity escrow contract deployed to testnet |
| Payments | Interswitch Payment Gateway (test mode) | Escrow wallet creation, hold and release logic |
| Storage | Supabase Storage | Property images, lease documents, inspection photos |

### 6.2 Database Schema Overview

| Table | Purpose |
|---|---|
| `users` | All user accounts. Stores role, cached `hue_score`, BVN hash, and profile data |
| `properties` | Property listings. Linked to landlord user. Stores verification status. |
| `leases` | Active and past leases. Links tenant, landlord, property. Stores terms and status. |
| `payments` | Payment records linked to leases. Stores amount, due date, paid date, grade. |
| `maintenance_requests` | Filed by tenants, responded to by landlords. Timestamps drive scoring. |
| `disputes` | Filed against either party. Stores type, status, outcome. |
| `ratings` | Post-lease ratings submitted by either party. Star rating + optional comment. |
| `hue_score_history` | Every Hue Score recalculation. Stores score, trigger type, timestamp. Enables charting. |
| `system_config` | Stores demo time offset for the `/setdate` time-travel feature. |

### 6.3 Blockchain Integration

The smart contract is a simple escrow with three functions: lock funds, release to landlord, return to tenant. Hardhat handles local development and testnet deployment. ethers.js connects the Next.js frontend to the contract.

The blockchain layer is intentionally minimal for the MVP. Its purpose is to prove the concept of enforceable, transparent release conditions.

> - The contract needs only three functions for the MVP: `lock()`, `release()`, `refund()`.
> - Use Hardhat's built-in test network for local dev. Deploy to Sepolia only for the final demo.

### 6.4 Payment Flow

| Step | What Happens |
|---|---|
| 1 | Tenant initiates payment in the RentWatch UI |
| 2 | Interswitch Payment Gateway processes the transaction |
| 3 | Backend receives confirmation webhook from Interswitch |
| 4 | Backend calls smart contract `lock()` with the transaction details |
| 5 | Funds are held in escrow. Both parties see the status. |
| 6 | On release condition (time elapsed, maintenance confirmed, dispute resolved): `release()` is called |
| 7 | Payment record is written to the `payments` table |
| 8 | Hue Score recalculation is triggered for the tenant |

---

## 7. User Stories

### 7.1 Tenant

| As a... | I want to... | So that... |
|---|---|---|
| New tenant with no history | Start building my Hue Score from day one | Future landlords can see I am reliable even before I have a long track record |
| Tenant with strong payment history | Have my score reflect my reliability visually and concretely | I can negotiate from a position of trust rather than starting from zero every time |
| Tenant paying annual rent upfront | Know my deposit is protected in escrow with clear release conditions | I do not have to rely on the landlord's goodwill to get my deposit back |
| Tenant who moved in and found inaccuracies | File a property accuracy complaint with evidence | The landlord's score reflects the misrepresentation and future tenants are protected |

### 7.2 Landlord

| As a... | I want to... | So that... |
|---|---|---|
| Landlord with well-maintained properties | Have my maintenance responsiveness reflected in my score | High-quality tenants can see I am a reliable landlord before signing a lease |
| Landlord listing a new property | Get a RentWatch Verified badge by uploading ownership documents | Prospective tenants trust my listing and I stand out from unverified listings |
| Landlord at end of lease | Handle the deposit return through RentWatch with a transparent record | My deposit integrity score reflects my honesty and I avoid disputes |
| New landlord | Understand what actions build or hurt my score | I can manage my property in ways that attract better tenants over time |

---

## 8. Success Metrics

### 8.1 Hackathon Demo

- Complete end-to-end flow: registration → listing → lease → escrow → rating → score update
- Working Interswitch integration in test mode
- Deployed and callable escrow smart contract on testnet
- Dual Hue Score dashboard with visible breakdown and tier logic
- At least one simulated lease cycle completing with score change visible

### 8.2 Post-Launch KPIs

| Metric | Target | Timeframe |
|---|---|---|
| Verified user registrations | 10,000 | 6 months post-launch |
| Transaction volume through escrow | ₦500M | 6 months post-launch |
| Dispute resolution within 7 days | 80% | Ongoing |
| Reduction in fake landlord incidents | 90% vs baseline | At launch |
| Average Hue Score across verified users | 750+ | 12 months post-launch |

---

## 9. Development Roadmap

### 9.1 Hackathon Sprint (3 Days)

| Day | Focus | Deliverables |
|---|---|---|
| Day 1 | Scaffolding + Auth + Data | Next.js setup, Supabase schema, seed data, auth with role selection, middleware, dashboard routing, HueScore component |
| Day 2 | Core Features + Blockchain | Property listing, lease creation, Interswitch payment integration, smart contract deployment, escrow lock/release, Hue Score calculation utility |
| Day 3 | Scoring + Rating + Polish | Score recalculation triggers, `hue_score_history` writes, post-lease rating flow, score-over-time chart, `/setdate` time-travel page, demo seeding, end-to-end testing |

### 9.2 Post-Hackathon Phases

**Phase 2: Pilot (3 months)**
- Live BVN/NIN integration
- Production Interswitch setup
- Lagos pilot: 50 landlords, 200 tenants
- Feedback collection and scoring algorithm refinement

**Phase 3: Scale (6–12 months)**
- Expand to Abuja, Port Harcourt
- Mobile app development
- Property management company partnerships
- Cross-border rental history portability (Ghana, Senegal)

---

## 10. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Low early adoption | Platform fails to reach critical mass | Partner with property management firms; onboarding incentives for early landlords |
| Score gaming | Users manipulate inputs to inflate scores | Multi-factor scoring; unverified reports carry no weight; anomaly flags for review |
| Blockchain complexity alienating users | Low trust in the escrow mechanism | Abstract all blockchain interaction behind familiar UI. No wallet setup required from users. |
| Interswitch API integration delays | Payment flow incomplete for demo | Mock the payment confirmation webhook first; swap in live integration last |
| Regulatory uncertainty | Government restrictions on blockchain or payment escrow | Engage regulators early; hybrid model with traditional payment rails as fallback |

---

## Appendix A: Seed Data Requirements

| Dataset | Volume | Notes |
|---|---|---|
| Property listings | 50+ | Across Lagos LGAs. Mix of verified and unverified. |
| Landlord profiles | 30 | Range of Hue scores across all tiers |
| Tenant profiles | 100 | Range of scores; include new tenants at 900 default |
| Payment histories | 2 years per tenant | Include mix of Early+, On-time, Late to produce varied scores |
| Maintenance requests | Per landlord | Include fast and slow responders to show score spread |
| Dispute cases | 10–15 | Resolved in both directions; a few unresolved |
| Post-lease ratings | Per completed lease | Cover all star ranges for both roles |

---

## Appendix B: Hue Score Default Summary

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

## Appendix C: Hue Score Recalculation Triggers

| Trigger Event | Affected Section(s) |
|---|---|
| Payment recorded | Tenant: Payment Reliability |
| Post-lease rating submitted | Both: Behavioral Rating |
| Dispute resolved | Tenant: Property Care or Lease Compliance / Landlord: Deposit Integrity or Property Accuracy |
| Maintenance request updated (response recorded) | Landlord: Maintenance Responsiveness |
| Property accuracy complaint confirmed or dismissed | Landlord: Property Accuracy |
