"use client";

import { motion } from "framer-motion";
import { KanjiBackground } from "@/components/ui/KanjiBackground";
import { ScoreHeroBlock } from "@/components/ui/ScoreHeroBlock";
import { SectionScoreCard } from "@/components/ui/SectionScoreCard";
import { ScoreHistoryChart } from "@/components/ui/ScoreHistoryChart";
import { TierProgressBar } from "@/components/ui/TierProgressBar";
import { ImprovementHintCard } from "@/components/ui/ImprovementHintCard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-void bg-grid-texture relative flex text-text-primary overflow-x-hidden">
      <KanjiBackground char="色" className="opacity-5 mix-blend-screen text-tier-gold" />
      
      {/* Sidebar Mock */}
      <aside className="w-72 border-r border-border-subtle bg-surface-0/80 backdrop-blur-xl hidden lg:flex flex-col p-10 sticky top-0 h-screen z-50 shadow-2xl">
        <div className="font-display text-2xl tracking-widest text-text-primary select-none mb-20 drop-shadow-md">RentWatch</div>
        <nav className="flex flex-col gap-8 font-body text-sm uppercase tracking-wider font-bold text-text-muted">
           <div className="text-scanner flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-scanner animate-pulse" /> System Dashboard</div>
           <div className="hover:text-text-primary transition-colors cursor-pointer pl-4.5">Verification</div>
           <div className="hover:text-text-primary transition-colors cursor-pointer pl-4.5">Asset Hub</div>
           <div className="hover:text-text-primary transition-colors cursor-pointer pl-4.5">Smart Contracts</div>
           <div className="hover:text-text-primary transition-colors cursor-pointer mt-auto pl-4.5">Identity Settings</div>
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 xl:p-16 relative z-10 w-full overflow-y-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ staggerChildren: 0.1 }}
             className="lg:col-span-8 flex flex-col gap-12"
           >
              <section className="flex flex-col items-center gap-8 w-full">
                 <ScoreHeroBlock targetScore={847} tier="gold" label="Gold" />
                 <TierProgressBar currentScore={847} currentTier="Gold" nextTier="Platinum" nextThreshold={900} />
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                 <SectionScoreCard title="Payment Reliability" score={245} maxScore={250} statusLabel="Consistently early" />
                 <SectionScoreCard title="Property Respect" score={210} maxScore={250} statusLabel="No confirmed violations" />
                 <SectionScoreCard title="Communication" score={190} maxScore={250} statusLabel="2 minor disputes noted" />
                 <SectionScoreCard title="Community Rating" score={0} maxScore={250} statusLabel="" isBuilding={true} />
              </section>

              <section className="w-full">
                 <ScoreHistoryChart />
              </section>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 flex flex-col gap-8"
           >
              <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-2xl flex flex-col gap-6">
                 <h2 className="font-display text-2xl text-text-primary">System Advisories</h2>
                 <p className="font-body text-xs text-text-secondary leading-relaxed">Execute the following actions to improve behavioral standing and unlock higher tier privileges.</p>
                 
                 <div className="flex flex-col gap-4 mt-2">
                    <ImprovementHintCard hint="Pay your next cycle at least 1 day before due to earn the Early+ grade." action="Go to Payments" />
                    <ImprovementHintCard hint="Raise a maintenance request promptly to document property issues on arrival." action="Log a Ticket" />
                    <ImprovementHintCard hint="Complete your lease compliance record without violations to secure Gold tier." action="Review Lease" />
                 </div>
              </div>
           </motion.div>

        </div>
      </main>
    </div>
  );
}
