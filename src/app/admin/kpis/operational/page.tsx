"use client";

import { motion } from "framer-motion";
import { 
  ChevronRight,
  CheckCircle2,
  Clock,
  Edit3,
  ArrowUp,
  Filter,
  User as UserIcon,
  ArrowRight,
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, responsablesApi } from "@/lib/api";

export default function OperationalKpisPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [retouchTableData, setRetouchTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [data, profileRes] = await Promise.all([
        api.get('/kpis/operational'),
        user?.email ? responsablesApi.getProfile(user.email).catch(() => null) : Promise.resolve(null)
      ]);

      setStats(data.stats || []);
      setRetouchTableData(data.retouchTable || []);
      setProfile(profileRes);
    } catch (err: any) {
      console.error("Operational Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completionStat = useMemo(() => stats.find(s => s.label === "Taux d'achèvement"), [stats]);
  const durationStat = useMemo(() => stats.find(s => s.label === "Durée moyenne"), [stats]);
  const retouchStat = useMemo(() => stats.find(s => s.label === "Taux de retouches"), [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase animate-pulse">Synchronisation des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-on-surface">
      
      {/* Breadcrumbs */}
      <nav className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <span className="text-[9px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase">ACCUEIL</span>
          <ChevronRight size={10} className="text-on-secondary-container opacity-20" />
          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">KPIs OPÉRATIONNELS</span>
        </div>
      </nav>

      <section className="px-6 pb-12 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display text-4xl text-on-surface tracking-tight leading-none"
            >
              Performance <span className="italic font-light opacity-30 text-primary">Opérationnelle</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-on-secondary-container max-w-xl font-body text-sm italic opacity-60 leading-relaxed"
            >
              Analyse en temps réel de l&apos;excellence d&apos;exécution et de la satisfaction client pour <span className="text-on-surface font-bold not-italic">Signature 8</span>.
            </motion.p>
          </div>
          
          <div className="flex items-center gap-4 bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <History size={18} />
            </div>
            <div className="pr-4">
              <p className="text-[8px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase">Dernier Refresh</p>
              <p className="text-[10px] font-bold text-on-surface">Aujourd&apos;hui, 15:42</p>
            </div>
          </div>
        </div>

        {/* Hero Stats - Consolidated Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Objectif Trimestriel (Success Rate) */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                <Target size={20} strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded text-green-600 border border-green-100">
                <TrendingUp size={10} />
                <span className="text-[8px] font-bold tracking-tight">EN HAUSSE</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-bold tracking-[0.3em] text-on-secondary-container opacity-40 uppercase mb-1">OBJECTIF TRIMESTRIEL</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl text-on-surface tracking-tighter">{completionStat?.value || 0}%</span>
                  <span className="font-display text-xl text-primary italic font-light">Succès</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${completionStat?.value || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary" 
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[9px] text-on-secondary-container/60 italic font-medium">
                    Target: <span className="text-on-surface font-bold not-italic">{completionStat?.target || 90}%</span>
                  </p>
                  <span className="text-[9px] font-bold text-primary italic">Excellent</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Durée Moyenne */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-[#12110F] p-6 rounded-2xl shadow-xl relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 bg-primary/10 w-32 h-32 rounded-full blur-3xl opacity-20" />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-primary">
                <Clock size={20} strokeWidth={1.5} />
              </div>
              <div className="bg-red-500/10 px-2 py-1 rounded text-red-400 border border-red-500/20">
                <span className="text-[8px] font-bold tracking-tighter">+{durationStat?.trend || "0"}J</span>
              </div>
            </div>
            
            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-[8px] font-bold tracking-[0.3em] text-white/40 uppercase mb-1">DURÉE MOYENNE / PROJET</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl text-white tracking-tighter">{durationStat?.value || 0}</span>
                  <span className="font-display text-xl text-primary italic font-light">Jours</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                  />
                </div>
                <p className="text-[9px] text-white/40 font-medium italic">
                  Objectif: Réduire à <span className="text-white font-bold not-italic">12 jours</span>.
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3. Taux de Retouche */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-primary/5 rounded-xl text-primary">
                <Edit3 size={20} strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-primary/5 rounded border border-primary/10">
                <Sparkles size={10} className="text-primary" />
                <span className="text-[8px] font-bold text-primary tracking-widest">QUALITÉ</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-bold tracking-[0.3em] text-on-secondary-container opacity-40 uppercase mb-1">TAUX DE RETOUCHE</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl text-on-surface tracking-tighter">{retouchStat?.value || "0%"}</span>
                  <span className="font-display text-xl text-primary italic font-light">Global</span>
                </div>
              </div>
              
              <div className="flex items-end h-8 gap-1">
                {[40, 70, 30, 90, 50, 80, 45, 60, 35, 75].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "flex-1 rounded-t-[1px] transition-all duration-500",
                      i === 7 ? "bg-primary" : "bg-primary/10 group-hover:bg-primary/20"
                    )}
                  />
                ))}
              </div>
              
              <p className="text-[9px] text-on-secondary-container/60 italic font-medium">
                {retouchStat?.sub || "Excellence maintenue ce trimestre."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Retouch Details Section */}
        <div className="bg-white rounded-2xl border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-5 border-b border-outline-variant/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers size={14} className="text-primary" />
                <h3 className="font-display text-xl text-on-surface italic">Détail des <span className="not-italic opacity-40">Retouches</span></h3>
              </div>
              <p className="text-[8px] font-bold tracking-[0.3em] text-on-secondary-container opacity-40 uppercase">ANALYSE QUALITATIVE PAR PROJET</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={12} />
                <button className="pl-8 pr-4 py-2 bg-gray-50 border border-outline-variant/10 rounded-xl text-[9px] font-bold tracking-[0.1em] uppercase hover:bg-gray-100 transition-all flex items-center gap-2">
                  Filtrer les données
                </button>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-on-secondary-container">
                <BarChart3 size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50/50">
                <tr className="text-left border-b border-outline-variant/5">
                  <th className="px-6 py-3 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase">PROJET / SECTEUR</th>
                  <th className="px-6 py-3 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase">RESPONSABLE</th>
                  <th className="px-6 py-3 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase text-center">CYCLES</th>
                  <th className="px-6 py-3 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase">MOTIF PRINCIPAL</th>
                  <th className="px-6 py-3 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container opacity-40 uppercase text-right">IMPACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {retouchTableData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Zap size={32} strokeWidth={1} className="mb-2" />
                        <p className="text-[10px] font-bold tracking-widest uppercase italic">Aucun incident qualité ce mois-ci.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  retouchTableData.map((row, i) => (
                    <tr key={i} className="group hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                      <td className="px-6 py-3.5">
                        <div className="font-display text-lg text-on-surface group-hover:text-primary transition-colors tracking-tight">{row.project}</div>
                        <div className="text-[7px] font-bold text-on-secondary-container opacity-30 uppercase tracking-[0.2em] mt-0.5">{row.sector || "General"}</div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-secondary-container border border-outline-variant/5 group-hover:scale-110 transition-transform shadow-inner">
                            <UserIcon size={14} className="opacity-20" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface/70">{row.manager}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[8px] font-bold tracking-[0.1em] uppercase shadow-sm",
                          row.isCritical ? "bg-red-50 text-red-500 border border-red-100" : "bg-gray-50 text-on-secondary-container/60 border border-outline-variant/10"
                        )}>
                          {row.cycles?.toUpperCase() || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={cn(
                          "text-[10.5px] italic font-medium leading-tight block max-w-[200px]",
                          row.isCritical ? "text-on-surface font-bold opacity-100" : "text-on-secondary-container opacity-60"
                        )}>
                          {row.reason}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-display text-lg">
                        <span className={cn(row.isCritical ? "text-red-500" : "text-on-surface opacity-80")}>
                          {row.impact}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50/30 border-t border-outline-variant/5 flex justify-center">
            <button className="flex items-center gap-2.5 text-[9px] font-bold tracking-[0.3em] text-primary hover:text-on-surface transition-all group uppercase">
              Accéder au registre complet <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-on-secondary-container/30 pt-10 border-t border-outline-variant/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Signature 8 Internal Metrics — 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Direct Link: Operational API — V2.4</span>
          </div>
        </div>
      </section>
    </div>
  );
}
