# sybil-rentwatch
RentWatch: Enyata x Interswitch Hackathon entry by Team Sibyl

RentWatch is a mutual accountability platform for Lagos real estate. It gives landlords and tenants a shared trust infrastructure that the market has never had: verified identities, escrow-protected payments, and a two-way reputation score called the **Hue Score**.

> ₦16.2 billion was lost to real estate fraud in Nigeria in the first 7 months of 2025 alone. Every platform in this market built payment flexibility. None built trust. RentWatch is the trust infrastructure the Lagos rental market never had.

---

## Team Members

- **Niyi** ([@Dr-Stone27](https://github.com/Dr-Stone27)) — Product Manager & Team Lead: ideation, UI design, QA testing and feedback
- **Angel** ([@akcumeh](https://github.com/akcumeh)) — Software Engineer & Full-Stack Developer: frontend, backend & web3 integration

---

## Project Access

RentWatch is live here: **[link](https://sibyl-rentwatch.vercel.app/)**

### Demo Accounts

Five pre-seeded personas cover the full Hue Score spectrum. Use any of the accounts below to explore the platform from different perspectives:

Sample Tenant:

`email` - adeyemi.okafor@rentwatch.demo
`password` - RentWatch123!

Sample Landlord:

`email` - adeyemi.okafor@rentwatch.demo
`password` - RentWatch123!

## What RentWatch Does

### The Problem

The Lagos rental market runs on personal relationships because there is no system. Landlords demand 1–2 years of rent upfront because there is no reliable signal of tenant commitment — no rental credit bureau, no eviction fast-track, nothing. Tenants pay millions into arrangements with no enforceable recourse. Deposits disappear. Properties are misrepresented. Maintenance is ignored after move-in.

At least 1 in 5 property transactions in Lagos involves fraud, misrepresentation, or illegal documentation. Every major competitor (Spleet, RentSmallSmall, iPropty) solved access and payment flexibility. None solved mutual trust.

### The Solution

Three mechanisms deliver trust:

**1. The Hue Score** — A two-way reputation score for both landlords and tenants, scored out of 1000 across four sections each. 75% objective data (payments, disputes, maintenance response times), 25% subjective star ratings. The score uses lifetime history — it cannot be reset by creating a new account.

**2. Smart Escrow** — Rent and deposit payments are held in a smart contract on the blockchain. Release conditions are transparent and enforced on-chain. Neither party can access the funds until the conditions are met.

**3. Verified Identity** — BVN-based identity verification cross-checked across properties. The same person cannot register twice. A landlord with a fraud history cannot reset by creating a new email.

---

## The Hue Score System

Every user has a Hue Score out of 1000, made up of four sections worth 250 points each.

### Tenant Sections

| Section | Max | Default (New) | What It Measures |
|---|---|---|---|
| Payment Reliability | 250 | 250 | Consistency and timeliness of rent payments |
| Property Care | 250 | 250 | History of damage disputes and exit inspection outcomes |
| Lease Compliance | 250 | 200 | Record of confirmed lease violations |
| Behavioral Rating | 250 | 200 | Star ratings submitted by landlords post-lease |

### Landlord Sections

| Section | Max | Default (New) | What It Measures |
|---|---|---|---|
| Maintenance Responsiveness | 250 | 200 | Response time on filed maintenance requests |
| Deposit Integrity | 250 | 250 | Track record of returning deposits fairly and promptly |
| Property Accuracy | 250 | 250 | How closely listings match the actual property |
| Behavioral Rating | 250 | 200 | Star ratings submitted by tenants post-lease |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Auth + Database | Supabase (PostgreSQL + Auth + Storage) |
| Payments | Interswitch Web Checkout (Inline, test mode) |
| Transaction Verification | Interswitch Requery API |
| Blockchain / Escrow | Hardhat + Solidity + ethers.js, Sepolia testnet |

### Local Development

```bash
# Clone the repository
git clone https://github.com/akcumeh/sybil-rentwatch.git
cd sybil-rentwatch

# Navigate to the frontend
cd ../frontend

# Copy and fill environment variables
cp ../.env.example .env
```

Fill in your `.env`.

```bash
# Install dependencies and run
npm i
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Seeding the Database

Run the seed script:

```bash
cd data
npx ts-node seed.ts
```

### Smart Contract Deployment (Local)

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network localhost   # local Hardhat network
# or
npx hardhat run scripts/deploy.ts --network sepolia     # Sepolia testnet for demo
```

Copy the deployed contract address into your `.env` as `CONTRACT_ADDRESS`.


## Roadmap

### Phase 2: Pilot (3 months post-hackathon)
- Live BVN/NIN integration via NIBSS API
- Production Interswitch credentials and live escrow settlement
- Lagos pilot: 50 landlords, 200 tenants
- Community arbitration framework for dispute resolution

### Phase 3: Scale (6–12 months)
- Expand to Abuja and Port Harcourt
- Mobile app (iOS + Android)
- Property management company partnerships and bulk onboarding
- Rental credit bureau API — licensing the Hue Score as a signal to other fintech products
- Cross-border rental history portability (Ghana, Senegal)

*Built for the Enyata x Interswitch Hackathon by Team Sibyl.*
