"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  ChevronRight,
  TrendingUp,
  Target,
  Users,
  Zap,
  Sparkles,
  PieChart,
  Activity,
  ArrowUpRight,
  User,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { strategicApi } from "@/lib/api";

export default function StrategicKpisPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await strategicApi.getKpis();
        setData(res);
      } catch (error) {
        console.error("Error fetching strategic KPIs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const { channelDependency, revenueByManager, leaderStats, globalSatisfaction, satisfactionEvolution } = data || {
    channelDependency: [],
    revenueByManager: [],
    leaderStats: [],
    globalSatisfaction: 0,
    satisfactionEvolution: []
  };

  return (
    <div className="flex flex-col min-h-full bg-surface-container-lowest/50">
      
      <div className="p-4 lg:p-6 space-y-6">
        {/* Breadcrumbs - Compact */}
        <div className="flex items-center gap-2 text-[9px] font-bold editorial-label uppercase text-on-secondary-container tracking-widest">
          <span className="opacity-40">ADMIN</span>
          <ChevronRight size={12} className="opacity-20" />
          <span className="opacity-40">KPIs</span>
          <ChevronRight size={12} className="opacity-20" />
          <span className="text-primary font-bold">STRATÉGIQUE</span>
        </div>

        {/* Header Section - More Compact */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl text-on-surface italic tracking-tight leading-none"
            >
              Performance <span className="not-italic opacity-30 italic">Signature 8</span>
            </motion.h1>
            <p className="text-on-secondary-container text-sm italic opacity-60 mt-1">
              Trajectoire de croissance et indicateurs de satisfaction globale.
            </p>
          </div>
          <div className="flex gap-2">
             <div className="bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 flex items-center gap-2">
                <Activity size={14} className="text-primary" />
                <span className="text-[10px] font-bold editorial-label text-primary uppercase tracking-wider">LIVE DATA</span>
             </div>
          </div>
        </div>

        {/* Top Grid - Leaders & Channel Mix */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Channel Dependency - Sleek Bar Chart */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 shadow-sm overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <p className="editorial-label !text-[10px] text-on-secondary-container font-bold uppercase tracking-widest opacity-50">Canaux d&apos;Acquisition</p>
                <PieChart size={14} className="text-primary opacity-30" />
              </div>
              
              <div className="space-y-3">
                {channelDependency.map((channel: any, i: number) => (
                  <div key={channel.name} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                      <span className="text-on-surface/70">{channel.name}</span>
                      <span className="text-primary">{channel.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${channel.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={cn(
                          "h-full rounded-full",
                          i === 0 ? "bg-primary" : "bg-primary/30"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Top Performers - No Avatars, Initials Only */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderStats.map((leader: any, i: number) => (
              <motion.div 
                key={leader.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/20 transition-all duration-300 relative group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <span className="text-sm font-bold tracking-tighter">{leader.initials}</span>
                </div>
                <p className="editorial-label !text-[9px] text-on-secondary-container mb-1 opacity-40 uppercase tracking-widest font-bold">{leader.name}</p>
                <p className="font-display text-2xl text-on-surface leading-none mb-1 italic">
                  {leader.value}
                  <span className="text-[10px] font-bold opacity-30 ml-1">MAD</span>
                </p>
                <div className="flex items-center gap-1 text-[8px] font-bold text-primary tracking-widest">
                  <ArrowUpRight size={10} />
                  {leader.trend}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap size={12} className="text-primary animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Satisfaction Row */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-2">
              <p className="editorial-label !text-[10px] text-on-secondary-container opacity-40 uppercase tracking-widest font-bold">Niveau d&apos;excellence</p>
              <div className="flex items-baseline gap-4">
                <h4 className="font-display text-6xl text-on-surface italic tracking-tighter leading-none">{globalSatisfaction}%</h4>
                <div className="flex flex-col">
                   <span className="text-primary text-[10px] flex items-center gap-1.5 font-bold italic bg-primary/10 px-2 py-0.5 rounded-full mb-1">
                     <TrendingUp size={12} />
                     +2.4% vs 2023
                   </span>
                   <p className="text-[9px] text-on-secondary-container opacity-40 italic">Moyenne satisfaction client</p>
                </div>
              </div>
            </div>

            <div className="flex items-end gap-2 h-24">
              {satisfactionEvolution.map((h: number, i: number) => (
                <div key={i} className="flex flex-col items-center gap-2 group/bar">
                  <div className="w-3 bg-surface-container-low rounded-full relative overflow-hidden h-20 shadow-inner">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                      className={cn(
                        "absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700",
                        i === satisfactionEvolution.length - 1 ? "bg-primary shadow-lg shadow-primary/20" : "bg-primary/20 group-hover/bar:bg-primary/40"
                      )}
                    />
                  </div>
                  <span className="text-[7px] font-bold opacity-20 uppercase tracking-tighter">M{i+1}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
        </div>

        {/* Detailed Section: CA par Responsable */}
        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8 border-b border-outline-variant/5 pb-4">
            <h5 className="editorial-label !text-[11px] text-on-surface font-bold tracking-[0.2em] uppercase italic">Répartition du Chiffre d&apos;Affaires</h5>
            <div className="text-[10px] editorial-label text-on-secondary-container opacity-40 uppercase tracking-widest font-bold">Vue par Responsable de Projet</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {revenueByManager.map((manager: any, i: number) => (
              <div key={manager.name} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", manager.color)} />
                    <span className="editorial-label !text-[12px] text-on-surface font-bold lowercase italic">{manager.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-xl text-on-surface">{manager.value.toLocaleString()}</span>
                    <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter text-on-secondary-container">MAD</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: manager.width }}
                    transition={{ duration: 1.2, delay: 0.2 + (i * 0.1) }}
                    className={cn("h-full rounded-full", manager.color)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-outline-variant/5 flex justify-between items-center opacity-40 text-[9px] editorial-label italic tracking-widest">
            <span>* Chiffres basés sur les contrats signés et validés</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><Users size={10} /> {revenueByManager.length} Responsables</span>
              <span className="flex items-center gap-1"><Target size={10} /> 100% Attribué</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Accent - Minimal */}
      <footer className="mt-auto py-4 px-6 border-t border-outline-variant/5">
        <div className="flex justify-between items-center opacity-30 text-[8px] font-bold editorial-label tracking-[0.3em] uppercase">
          <p>© 2024 SIGNATURE 8 — STRATEGIC INSIGHTS</p>
          <div className="flex gap-6">
            <Sparkles size={12} />
            <span className="italic tracking-normal">Propulsé par le moteur d&apos;analyse S8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
