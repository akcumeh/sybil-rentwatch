// RentWatch - Supabase Seed Script
// Creates auth accounts for demo users and seeds the full demo dataset.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL!;
const serviceKey   = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_PUBLIC_URL or SUPABASE_SECRET_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const IDS = {
    // Landlords
    L1: '11111111-1111-1111-1111-000000000001', // Adeyemi Okafor  (DEMO LOGIN)
    L2: '11111111-1111-1111-1111-000000000002', // Chukwuemeka Adebayo
    L3: '11111111-1111-1111-1111-000000000003', // Babatunde Fashola
    // Tenants
    T1: '22222222-2222-2222-2222-000000000001', // Oluwaseun Adeyemi
    T2: '22222222-2222-2222-2222-000000000002', // Emeka Nwosu
    T3: '22222222-2222-2222-2222-000000000003', // Kingsley Obi    (DEMO LOGIN)
    T4: '22222222-2222-2222-2222-000000000004', // Amaka Eze
    T5: '22222222-2222-2222-2222-000000000005', // Taiwo Adebayo
    // Properties
    P1: '33333333-3333-3333-3333-000000000001', // L1's property (Lekki)
    P2: '33333333-3333-3333-3333-000000000002', // L2's property (Yaba)
    P3: '33333333-3333-3333-3333-000000000003', // L2's property 2 (Ajah)
    // Leases
    LS1: '44444444-4444-4444-4444-000000000001', // L1 <-> T3 (active demo lease)
    LS2: '44444444-4444-4444-4444-000000000002', // L1 <-> T1 (completed)
    LS3: '44444444-4444-4444-4444-000000000003', // L2 <-> T2 (active)
    // Payments for demo lease (LS1 = L1 <-> T3)
    PAY_DEPOSIT: '55555555-5555-5555-5555-000000000001',
    PAY_JAN:     '55555555-5555-5555-5555-000000000002',
    PAY_FEB:     '55555555-5555-5555-5555-000000000003',
    PAY_MAR_OVR: '55555555-5555-5555-5555-000000000004', // OVERDUE - March 2025
    PAY_APR:     '55555555-5555-5555-5555-000000000005', // PENDING  - April 2025
    // Disputes
    D1: '66666666-6666-6666-6666-000000000001',
    // Ratings
    R1: '77777777-7777-7777-7777-000000000001',
};

const DEMO_PASSWORD = 'RentWatch123!';

async function upsertAuthUser(email: string, password: string, appUserId: string) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find(u => u.email === email);
    if (found) {
        console.log(`  Auth user already exists: ${email} (${found.id})`);
        return found.id;
    }

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (error) throw new Error(`Auth create failed for ${email}: ${error.message}`);
    console.log(`  Created auth user: ${email} (${data.user.id})`);
    return data.user.id;
}

async function upsertRow(table: string, row: Record<string, unknown>) {
    const { error } = await supabase.from(table).upsert(row, { onConflict: 'id' });
    if (error) throw new Error(`Upsert failed [${table}]: ${error.message}`);
}

async function main() {
    console.log('\nRentWatch seed starting...\n');

    console.log('Step 1: Creating auth users...');
    const l1AuthId = await upsertAuthUser('adeyemi.okafor@rentwatch.demo', DEMO_PASSWORD, IDS.L1);
    const t3AuthId = await upsertAuthUser('kingsley.obi@rentwatch.demo',   DEMO_PASSWORD, IDS.T3);

    console.log('\nStep 2: Seeding users...');

    const users = [
        {
            id: IDS.L1, supabase_auth_id: l1AuthId,
            role: 'landlord', full_name: 'Adeyemi Okafor',
            email: 'adeyemi.okafor@rentwatch.demo', phone: '+2348031234567',
            bvn_hash: 'hashed_bvn_l1', is_verified: true,
            hue_score: 854, hue_tier: 'gold',
            section_1_score: 122, section_2_score: 244, section_3_score: 245, section_4_score: 243,
            created_at: '2010-06-15T09:00:00Z',
        },
        {
            id: IDS.L2, supabase_auth_id: null,
            role: 'landlord', full_name: 'Chukwuemeka Adebayo',
            email: 'chukwuemeka.adebayo@rentwatch.demo', phone: '+2348051234567',
            bvn_hash: 'hashed_bvn_l2', is_verified: true,
            hue_score: 725, hue_tier: 'silver',
            section_1_score: 75, section_2_score: 250, section_3_score: 200, section_4_score: 200,
            created_at: '2020-01-10T09:00:00Z',
        },
        {
            id: IDS.L3, supabase_auth_id: null,
            role: 'landlord', full_name: 'Babatunde Fashola',
            email: 'babatunde.fashola@rentwatch.demo', phone: '+2348061234567',
            bvn_hash: 'hashed_bvn_l3', is_verified: true,
            hue_score: 755, hue_tier: 'gold',
            section_1_score: 150, section_2_score: 167, section_3_score: 250, section_4_score: 188,
            created_at: '2018-03-20T09:00:00Z',
        },
        {
            id: IDS.T1, supabase_auth_id: null,
            role: 'tenant', full_name: 'Oluwaseun Adeyemi',
            email: 'oluwaseun.adeyemi@rentwatch.demo', phone: '+2348081234567',
            bvn_hash: 'hashed_bvn_t1', is_verified: true,
            hue_score: 939, hue_tier: 'platinum',
            section_1_score: 207, section_2_score: 250, section_3_score: 250, section_4_score: 232,
            created_at: '2017-09-01T09:00:00Z',
        },
        {
            id: IDS.T2, supabase_auth_id: null,
            role: 'tenant', full_name: 'Emeka Nwosu',
            email: 'emeka.nwosu@rentwatch.demo', phone: '+2348091234567',
            bvn_hash: 'hashed_bvn_t2', is_verified: true,
            hue_score: 794, hue_tier: 'gold',
            section_1_score: 194, section_2_score: 250, section_3_score: 200, section_4_score: 150,
            created_at: '2021-08-01T09:00:00Z',
        },
        {
            id: IDS.T3, supabase_auth_id: t3AuthId,
            role: 'tenant', full_name: 'Kingsley Obi',
            email: 'kingsley.obi@rentwatch.demo', phone: '+2348101234567',
            bvn_hash: 'hashed_bvn_t3', is_verified: true,
            hue_score: 773, hue_tier: 'gold',
            section_1_score: 163, section_2_score: 210, section_3_score: 200, section_4_score: 200,
            created_at: '2023-02-15T09:00:00Z',
        },
        {
            id: IDS.T4, supabase_auth_id: null,
            role: 'tenant', full_name: 'Amaka Eze',
            email: 'amaka.eze@rentwatch.demo', phone: '+2348111234567',
            bvn_hash: 'hashed_bvn_t4', is_verified: true,
            hue_score: 898, hue_tier: 'gold',
            section_1_score: 248, section_2_score: 250, section_3_score: 200, section_4_score: 200,
            created_at: '2022-11-01T09:00:00Z',
        },
        {
            id: IDS.T5, supabase_auth_id: null,
            role: 'tenant', full_name: 'Taiwo Adebayo',
            email: 'taiwo.adebayo@rentwatch.demo', phone: '+2348121234567',
            bvn_hash: 'hashed_bvn_t5', is_verified: true,
            hue_score: 823, hue_tier: 'gold',
            section_1_score: 180, section_2_score: 250, section_3_score: 200, section_4_score: 193,
            created_at: '2023-05-01T09:00:00Z',
        },
    ];

    for (const u of users) {
        await upsertRow('users', u);
        console.log(`  - ${u.full_name} (${u.role})`);
    }

    console.log('\nStep 3: Seeding properties...');

    const properties = [
        {
            id: IDS.P1, landlord_id: IDS.L1,
            title: '3-Bedroom Flat - Lekki Phase 1',
            address: '14B Admiralty Way, Lekki Phase 1, Lagos',
            lga: 'Eti-Osa', type: 'flat', bedrooms: 3,
            annual_rent_naira: 1_800_000,
            features: { ac: true, generator: true, water: true, security: true, parking: true, inverter: false },
            images: [],
            is_rentwatch_verified: true,
            verification_docs: ['certificate_of_occupancy', 'government_id'],
            status: 'occupied',
        },
        {
            id: IDS.P2, landlord_id: IDS.L2,
            title: '2-Bedroom Apartment - Yaba',
            address: '7 Herbert Macaulay Way, Yaba, Lagos',
            lga: 'Mainland', type: 'apartment', bedrooms: 2,
            annual_rent_naira: 900_000,
            features: { ac: false, generator: true, water: true, security: false, parking: false, inverter: false },
            images: [],
            is_rentwatch_verified: false,
            verification_docs: [],
            status: 'occupied',
        },
        {
            id: IDS.P3, landlord_id: IDS.L2,
            title: '1-Room Self-Contain - Ajah',
            address: '22 Addo Road, Ajah, Lagos',
            lga: 'Eti-Osa', type: 'room', bedrooms: 1,
            annual_rent_naira: 480_000,
            features: { ac: false, generator: false, water: true, security: false, parking: false, inverter: false },
            images: [],
            is_rentwatch_verified: false,
            verification_docs: [],
            status: 'available',
        },
    ];

    for (const p of properties) {
        await upsertRow('properties', p);
        console.log(`  - ${p.title}`);
    }

    console.log('\nStep 4: Seeding leases...');

    const leases = [
        {
            // DEMO LEASE: L1 <-> T3 (active - Kingsley currently lives in Adeyemi's flat)
            id: IDS.LS1,
            tenant_id: IDS.T3, landlord_id: IDS.L1, property_id: IDS.P1,
            payment_frequency: 'monthly',
            rent_amount_naira: 150_000,       // 1,800,000 / 12
            deposit_amount_naira: 300_000,    // 2 months
            lease_start: '2023-03-01',
            lease_end:   '2025-12-31',
            status: 'active',
            escrow_status: 'pending',
            landlord_signed_at: '2023-02-20T10:00:00Z',
            tenant_signed_at:   '2023-02-22T14:00:00Z',
        },
        {
            // Completed lease: L1 <-> T1 (Oluwaseun rented from Adeyemi 2017-2023)
            id: IDS.LS2,
            tenant_id: IDS.T1, landlord_id: IDS.L1, property_id: IDS.P1,
            payment_frequency: 'annual',
            rent_amount_naira: 1_500_000,
            deposit_amount_naira: 1_500_000,
            lease_start: '2017-09-01',
            lease_end:   '2023-01-31',
            status: 'completed',
            escrow_status: 'released',
            deposit_returned: true,
            deposit_return_date: '2023-02-05',
            deposit_return_type: 'full_within_7_days',
            landlord_signed_at: '2017-08-20T10:00:00Z',
            tenant_signed_at:   '2017-08-22T10:00:00Z',
        },
        {
            // Active lease: L2 <-> T2
            id: IDS.LS3,
            tenant_id: IDS.T2, landlord_id: IDS.L2, property_id: IDS.P2,
            payment_frequency: 'monthly',
            rent_amount_naira: 75_000,
            deposit_amount_naira: 150_000,
            lease_start: '2022-01-01',
            lease_end:   '2025-12-31',
            status: 'active',
            escrow_status: 'pending',
            landlord_signed_at: '2021-12-20T10:00:00Z',
            tenant_signed_at:   '2021-12-22T10:00:00Z',
        },
    ];

    for (const l of leases) {
        await upsertRow('leases', l);
        console.log(`  - Lease ${l.id} - ${l.status}`);
    }

    console.log('\nStep 5: Seeding payments...');
    // Focus on the demo lease (LS1 = L1 <-> T3) - mix of paid + one overdue + one upcoming

    const payments = [
        // Deposit - already paid
        {
            id: IDS.PAY_DEPOSIT,
            lease_id: IDS.LS1, tenant_id: IDS.T3,
            payment_type: 'deposit',
            amount_naira: 300_000,
            due_date: '2023-03-01', paid_date: '2023-02-28',
            grade: 'early_plus', grade_points: 100,
            status: 'confirmed',
        },
        // Jan 2025 - on time
        {
            id: IDS.PAY_JAN,
            lease_id: IDS.LS1, tenant_id: IDS.T3,
            payment_type: 'rent',
            amount_naira: 150_000,
            due_date: '2025-01-01', paid_date: '2025-01-02',
            grade: 'early', grade_points: 90,
            status: 'confirmed',
        },
        // Feb 2025 - paid late
        {
            id: IDS.PAY_FEB,
            lease_id: IDS.LS1, tenant_id: IDS.T3,
            payment_type: 'rent',
            amount_naira: 150_000,
            due_date: '2025-02-01', paid_date: '2025-02-10',
            grade: 'late', grade_points: 50,
            status: 'confirmed',
        },
        // Mar 2025 - OVERDUE (demo_today = 2025-03-25, not yet paid)
        {
            id: IDS.PAY_MAR_OVR,
            lease_id: IDS.LS1, tenant_id: IDS.T3,
            payment_type: 'rent',
            amount_naira: 150_000,
            due_date: '2025-03-01',
            status: 'pending',
        },
        // Apr 2025 - UPCOMING (due in 6 days from demo_today)
        {
            id: IDS.PAY_APR,
            lease_id: IDS.LS1, tenant_id: IDS.T3,
            payment_type: 'rent',
            amount_naira: 150_000,
            due_date: '2025-04-01',
            status: 'pending',
        },
    ];

    for (const p of payments) {
        await upsertRow('payments', p);
        console.log(`  - Payment ${p.id} - ${p.payment_type} ${p.status}`);
    }

    console.log('\nStep 6: Seeding disputes...');

    await upsertRow('disputes', {
        id: IDS.D1,
        type: 'property_damage',
        filed_by: 'landlord', against: 'tenant',
        property_id: IDS.P1, landlord_id: IDS.L1, tenant_id: IDS.T3, lease_id: IDS.LS1,
        description: 'Tenant installed solar panel bracket on rooftop without prior approval.',
        filed_at: '2024-08-10T09:00:00Z',
        resolved_at: '2024-09-01T09:00:00Z',
        status: 'resolved',
        outcome: 'tenant_won',
        score_deduction: 0,
    });
    console.log('  - Dispute D1 - property_damage, tenant_won');

    console.log('\nStep 7: Seeding ratings...');
    // T3 has no post-lease ratings yet (active lease), so behavioural = default 200
    console.log('  - No post-lease ratings for T3 yet (active lease) - default 200 applies');

    console.log('\nStep 8: Seeding hue_score_history...');

    const scoreHistory = [
        {
            user_id: IDS.L1, total_score: 854, tier: 'gold',
            section_1_score: 122, section_2_score: 244, section_3_score: 245, section_4_score: 243,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.L2, total_score: 725, tier: 'silver',
            section_1_score: 75, section_2_score: 250, section_3_score: 200, section_4_score: 200,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.L3, total_score: 755, tier: 'gold',
            section_1_score: 150, section_2_score: 167, section_3_score: 250, section_4_score: 188,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.T1, total_score: 939, tier: 'platinum',
            section_1_score: 207, section_2_score: 250, section_3_score: 250, section_4_score: 232,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.T2, total_score: 794, tier: 'gold',
            section_1_score: 194, section_2_score: 250, section_3_score: 200, section_4_score: 150,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.T3, total_score: 773, tier: 'gold',
            section_1_score: 163, section_2_score: 210, section_3_score: 200, section_4_score: 200,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.T4, total_score: 898, tier: 'gold',
            section_1_score: 248, section_2_score: 250, section_3_score: 200, section_4_score: 200,
            trigger_type: 'initial_default',
        },
        {
            user_id: IDS.T5, total_score: 823, tier: 'gold',
            section_1_score: 180, section_2_score: 250, section_3_score: 200, section_4_score: 193,
            trigger_type: 'initial_default',
        },
    ];

    for (const h of scoreHistory) {
        await upsertRow('hue_score_history', { ...h, id: undefined }); // no fixed ID for history rows
        console.log(`  - Score history for user ${h.user_id.slice(-4)} - ${h.total_score}`);
    }

    console.log('\nStep 9: system_config already seeded by schema.sql');

    console.log('\nSeed complete.\n');
    console.log('DEMO LOGINS:');
    console.log('  Landlord 1 -> adeyemi.okafor@rentwatch.demo / RentWatch123!');
    console.log('  Tenant 3   -> kingsley.obi@rentwatch.demo   / RentWatch123!');
    console.log('\nExpected scores post-seed:');
    console.log('  Adeyemi Okafor (L1) -> 854 Gold');
    console.log('  Kingsley Obi   (T3) -> 773 Gold');
}

main().catch(err => {
    console.error('\nSeed failed:', err.message);
    process.exit(1);
});

