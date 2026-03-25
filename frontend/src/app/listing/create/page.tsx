"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Info } from "lucide-react";
import { HueScoreBadge } from "@/components/ui/HueScoreBadge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ScannerLine } from "@/components/ui/ScannerLine";

const AVAILABLE_FEATURES = ["AC", "Generator", "Water", "Serviced"];

export default function CreateListingPage() {
  const [title, setTitle] = useState("Off-grid Compound");
  const [price, setPrice] = useState("4500000");
  const [location, setLocation] = useState("Lekki Phase 1, Lagos");
  const [features, setFeatures] = useState<string[]>(["Generator"]);
  const [hasUploadedDocs, setHasUploadedDocs] = useState(false);

  const toggleFeature = (f: string) => {
    setFeatures(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  return (
    <div className="min-h-screen bg-void bg-grid-texture relative overflow-x-hidden flex flex-col font-body text-text-primary">
      {/* Top Navigation */}
      <nav className="h-16 border-b border-border-subtle bg-surface-0/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50 shadow-md">
        <div className="font-display text-xl tracking-widest text-text-primary select-none drop-shadow-md">RentWatch</div>
        <div className="relative h-full w-48 flex items-center justify-end">
          <div className="absolute top-1/2 -translate-y-1/2 right-0 scale-[0.35] origin-right opacity-90">
             <HueScoreBadge score={847} tier="gold" label="Gold Tier" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12 xl:px-20 relative z-10 w-full">
        {/* Left Column: Form */}
        <section className="flex flex-col gap-8 max-w-xl">
          <header>
            <h1 className="font-display text-3xl text-text-primary tracking-wide drop-shadow-sm">Create Listing</h1>
            <p className="text-text-secondary text-sm mt-2">Enter asset parameters to generate a live system preview.</p>
          </header>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase">Asset Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="bg-surface-1 border border-border-subtle text-text-primary rounded-sm p-4 focus:outline-none focus:border-scanner transition-colors"
                placeholder="e.g. 3 Bedroom Apartment"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase">Annual Price (₦)</label>
                <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  className="bg-surface-1 border border-border-subtle font-mono text-text-primary rounded-sm p-4 focus:outline-none focus:border-scanner transition-colors"
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase">Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="bg-surface-1 border border-border-subtle text-text-primary rounded-sm p-4 focus:outline-none focus:border-scanner transition-colors"
                  placeholder="Coordinates/Area"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase">Metrics & Features</label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_FEATURES.map(f => {
                  const isActive = features.includes(f);
                  return (
                    <button 
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-4 py-3 rounded-sm text-xs uppercase tracking-wider font-bold transition-all border ${
                        isActive 
                          ? 'border-scanner text-scanner bg-scanner/10 shadow-[0_0_10px_rgba(0,229,204,0.1)]' 
                          : 'border-border-subtle text-text-muted bg-transparent hover:bg-surface-2'
                      }`}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>

            <hr className="border-border-subtle my-2" />

            <div className="flex flex-col gap-4">
              <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase">Proof of Ownership</label>
              
              <AnimatePresence>
                {!hasUploadedDocs && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B] p-4 rounded-sm text-sm font-body flex gap-3 items-start mb-4 bg-opacity-10 backdrop-blur-sm">
                      <Info className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">Unverified listings receive 60% less inquiry. Upload ownership documents to earn the <strong className="font-bold tracking-wider">Verified</strong> badge.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setHasUploadedDocs(!hasUploadedDocs)}
                className={`w-full flex flex-col items-center justify-center gap-4 border-dashed border transition-colors py-10 rounded-sm group relative overflow-hidden ${
                  hasUploadedDocs 
                    ? 'border-scanner bg-scanner/5' 
                    : 'border-[rgba(0,229,204,0.12)] bg-surface-0 hover:bg-scanner/5'
                }`}
              >
                {hasUploadedDocs && <ScannerLine className="absolute top-0 w-full" />}
                <UploadCloud className={`w-8 h-8 transition-opacity ${hasUploadedDocs ? 'text-scanner opacity-100' : 'text-scanner opacity-50 group-hover:opacity-100'}`} />
                <span className={`text-sm uppercase tracking-wider transition-colors ${hasUploadedDocs ? 'text-scanner font-bold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                  {hasUploadedDocs ? 'Documents Encrypted & Verified' : 'Upload Title / Deed'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Preview */}
        <section className="relative w-full max-w-lg lg:ml-auto">
          <div className="sticky top-32">
            <div className="flex flex-col gap-4">
              <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase flex items-center gap-3 bg-surface-0/50 p-2 rounded-sm border border-border-subtle backdrop-blur-sm w-fit">
                <span className="w-2 h-2 rounded-full bg-scanner animate-pulse" />
                <span>Live Feed Preview</span>
              </label>

              <motion.div 
                layout
                className="bg-surface-1 border border-border-subtle rounded-sm overflow-hidden shadow-2xl relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-50 pointer-events-none z-10" />
                
                {/* Image Placeholder */}
                <div className="aspect-video bg-surface-2 relative overflow-hidden flex items-center justify-center border-b border-border-subtle">
                  <div className="absolute inset-0 bg-grid-texture opacity-30" />
                  <span className="font-mono text-text-muted tracking-widest opacity-40 select-none text-sm z-0">AWAITING_VISUAL_DATA</span>
                  
                  {/* Verified Badge */}
                  <AnimatePresence>
                    {hasUploadedDocs && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute top-4 right-4 z-20 shadow-[0_0_15px_rgba(0,229,204,0.4)]"
                      >
                        <VerifiedBadge isVerified={true} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col gap-5 relative z-20">
                  <div className="flex flex-col gap-1">
                    <motion.div layout className="font-mono text-3xl text-text-primary tracking-tight">
                      ₦ {Number(price || 0).toLocaleString()} <span className="text-sm text-text-muted tracking-widest uppercase">/ yr</span>
                    </motion.div>
                    <motion.div layout className="font-display text-xl tracking-wide text-text-primary mt-2 flex items-center gap-2">
                       {title || "Untitled Asset"}
                    </motion.div>
                    <motion.div layout className="font-body text-sm text-text-secondary mt-1">
                      {location || "Unknown Sector"}
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {features.length > 0 && (
                      <motion.div layout className="flex flex-wrap gap-2 pt-4 border-t border-border-subtle">
                        {features.map(f => (
                          <motion.span 
                            key={f}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="px-2 py-1 bg-scanner/10 border border-scanner/30 text-scanner text-[10px] uppercase tracking-widest rounded-sm font-semibold"
                          >
                            {f}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
