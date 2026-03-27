import { createClient } from "@/lib/supabase/server";
import { ScannerLine } from "@/components/ui/ScannerLine";
import { KanjiBackground } from "@/components/ui/KanjiBackground";
import { DataBlock } from "@/components/ui/DataBlock";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { HueScoreBadge } from "@/components/ui/HueScoreBadge";

export default async function Home() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Authenticated users go straight to their dashboard
    if (user) {
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("supabase_auth_id", user.id)
            .single();
        const { redirect } = await import("next/navigation");
        redirect(profile?.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant");
    }
    return (
        <main className="min-h-screen bg-void bg-grid-texture relative overflow-hidden flex flex-col items-center justify-center p-8">
            <KanjiBackground char="色" />

            <div className="w-full absolute top-0 left-0">
                <ScannerLine />
            </div>

            <div className="z-10 flex flex-col items-center gap-16 max-w-4xl w-full">
                {/* Hue Score Centerpiece */}
                <div className="animate-fade-up">
                    <HueScoreBadge score={847} tier="clear" label="Clear Hue" />
                </div>

                {/* HUD Data Row */}
                <div
                    className="flex flex-wrap items-center justify-center gap-12 bg-surface-0/80 backdrop-blur-md p-6 border border-border-subtle rounded-sm shadow-xl animate-fade-up"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
                >
                    <DataBlock label="Subject ID" value="092-B48" />
                    <DataBlock label="Network Node" value="LAG-01" />

                    <div className="flex items-center gap-8 border-l border-border-subtle pl-8">
                        <div className="flex items-center gap-3">
                            <span className="font-body text-[12px] uppercase tracking-wider text-text-muted font-semibold">Verified</span>
                            <VerifiedBadge isVerified={true} />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-body text-[12px] uppercase tracking-wider text-text-muted font-semibold">Escrow</span>
                            <VerifiedBadge isVerified={false} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
