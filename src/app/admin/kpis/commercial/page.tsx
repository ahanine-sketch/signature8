"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2,
  ShieldCheck,
  RefreshCcw,
  Clock,
  ArrowUp,
  ArrowDown,
  Timer,
  Target,
  BarChart3,
  TrendingUp,
  Trophy,
  Zap,
  MousePointer2,
  PieChart,
  Layers,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { commercialApi, requestsApi } from "@/lib/api";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  Share2, ShieldCheck, RefreshCcw, Clock, Timer, Target, BarChart3, TrendingUp
};

export default function CommercialKpisPage() {
  const [data, setData] = useState<{
    kpiStats: any[];
    funnelData: any[];
    mainObjective: { value: number; trend: string };
    recentLeads: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [expenseSource, setExpenseSource] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const response = await commercialApi.getKpis();
      setData(response);
    } catch (error) {
      console.error("Failed to load commercial KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateObjective = async () => {
    if (!newObjective) return;
    setSaving(true);
    try {
      await commercialApi.updateObjective(Number(newObjective));
      toast.success("Objectif mis à jour !");
      await loadData();
      setNewObjective("");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseSource || !expenseAmount) return;
    setSaving(true);
    try {
      await commercialApi.addExpense(expenseSource, Number(expenseAmount));
      toast.success("Dépense enregistrée !");
      await loadData();
      setExpenseSource("");
      setExpenseAmount("");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleLogResponse = async (id: string) => {
    setSaving(true);
    try {
      // Set response time to NOW
      await requestsApi.update(id, { date_premiere_reponse: new Date().toISOString() });
      toast.success("Réponse enregistrée !");
      await loadData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const { kpiStats, funnelData, mainObjective } = data;
  return (
    <div className="flex flex-col min-h-full relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
      
      <div className="px-8 py-6 flex flex-col gap-6 relative z-10">
        {/* Header Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-display italic tracking-tight text-on-surface"
              >
                Performance <span className="not-italic opacity-20 font-light">Commerciale</span>
              </motion.h3>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-px w-24 bg-primary/30 mt-2" 
              />
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowConfig(!showConfig)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold tracking-widest flex items-center gap-2 border transition-all active:scale-95",
                  showConfig 
                    ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20" 
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/10"
                )}
              >
                <Layers size={14} className={showConfig ? "text-white" : "text-primary"} />
                {showConfig ? "FERMER CONFIG" : "CONFIGURATION"}
              </button>
            </div>
          </div>

          {/* Inline Configuration Panel */}
          <AnimatePresence>
            {showConfig && (
              <motion.div 
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 bg-surface-container-low/50 rounded-[2rem] border border-primary/20 glass backdrop-blur-xl relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] -mr-8 -mt-8" />
                  
                  {/* Monthly Objective Form */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Trophy size={14} className="text-primary" />
                      </div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-on-surface/60">Objectif du Mois</h4>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-on-surface/40 italic">Fixez le chiffre d'affaires visé pour ce mois (MAD)</p>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Ex: 1000000"
                          value={newObjective}
                          onChange={(e) => setNewObjective(e.target.value)}
                          className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                        />
                        <button 
                          onClick={handleUpdateObjective}
                          disabled={saving}
                          className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                          {saving ? "..." : "Valider"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Expense Form */}
                  <div className="space-y-4 relative z-10 border-t lg:border-t-0 lg:border-l border-outline-variant/10 pt-6 lg:pt-0 lg:px-8">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Target size={14} className="text-primary" />
                      </div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-on-surface/60">Dépenses Marketing (CAC)</h4>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-on-surface/40 italic">Ajoutez vos dépenses publicitaires</p>
                      <div className="flex flex-col gap-2">
                        <input 
                          type="text" 
                          placeholder="Source (Ex: Instagram)"
                          value={expenseSource}
                          onChange={(e) => setExpenseSource(e.target.value)}
                          className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors w-full"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            placeholder="Montant (MAD)"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-colors"
                          />
                          <button 
                            onClick={handleAddExpense}
                            disabled={saving}
                            className="px-4 py-3 bg-on-surface text-surface-container-lowest rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                          >
                            {saving ? "..." : "Ajouter"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lead Response Logging */}
                  <div className="space-y-4 relative z-10 border-t lg:border-t-0 lg:border-l border-outline-variant/10 pt-6 lg:pt-0 lg:pl-8">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Clock size={14} className="text-primary" />
                      </div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-on-surface/60">Réponse aux Leads</h4>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] text-on-surface/40 italic">Marquez les leads comme répondus pour calculer le temps de réponse</p>
                      <div className="max-h-[120px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {data.recentLeads.length > 0 ? (
                          data.recentLeads.map((lead: any) => (
                            <div key={lead.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                              <div className="min-w-0 flex-1 mr-2">
                                <p className="text-[11px] font-bold truncate text-on-surface">{lead.nom_complet}</p>
                                <p className="text-[9px] text-on-surface/40 truncate italic">{lead.source} • {new Date(lead.date_demande).toLocaleDateString()}</p>
                              </div>
                              <button 
                                onClick={() => handleLogResponse(lead.id)}
                                disabled={saving}
                                className="shrink-0 p-2 bg-primary/10 hover:bg-primary text-primary hover:text-on-primary rounded-lg transition-colors group"
                                title="Répondu maintenant"
                              >
                                <Zap size={12} className="group-hover:fill-current" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-center border border-dashed border-outline-variant/20 rounded-xl">
                            <p className="text-[10px] text-on-surface/30">Aucun lead en attente</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {/* Main Objective Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="md:col-span-2 lg:col-span-2 row-span-2 bg-primary text-on-primary rounded-2xl p-6 shadow-2xl relative overflow-hidden group border border-white/10"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Trophy size={16} className="text-white" strokeWidth={1.5} />
                    </div>
                    <p className="editorial-label !text-[9px] text-white/70 tracking-[0.2em]">OBJECTIF MENSUEL</p>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-6xl font-display leading-none tracking-tighter">{mainObjective.value}</span>
                    <span className="text-xl font-light opacity-40">%</span>
                  </div>
                  <p className="text-xs font-medium text-white/60 mb-6 italic tracking-wide">
                    {mainObjective.trend}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${mainObjective.value}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="bg-white h-full rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
                    </motion.div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-white/50">
                    <span>PROGRESSION</span>
                    <span>100% CIBLE</span>
                  </div>
                </div>
              </div>
              
              {/* Background Shapes */}
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl transition-transform duration-1000 group-hover:scale-150" />
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={80} strokeWidth={0.5} />
              </div>
            </motion.div>

            {/* KPI Cards */}
            {kpiStats.map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={cn(
                  "glass ambient-shadow rounded-2xl p-4 border border-outline-variant/10 flex flex-col justify-between group hover:border-primary/30 transition-all duration-500",
                  stat.size === "medium" && "md:col-span-2",
                  stat.size === "large" && "md:col-span-2 lg:col-span-2"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="editorial-label !text-[8px] text-on-surface/40 tracking-widest">{stat.label}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className={cn(
                        "font-display text-on-surface",
                        stat.size === "large" ? "text-3xl" : "text-xl"
                      )}>
                        {stat.value}
                      </span>
                      {stat.unit && <span className="text-[9px] font-bold text-primary opacity-60">{stat.unit}</span>}
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {(() => {
                      const IconComponent = iconMap[stat.icon as string] || Share2;
                      return <IconComponent size={14} className="text-on-surface/30 group-hover:text-primary transition-colors" strokeWidth={1.5} />;
                    })()}
                  </div>
                </div>

                <div className={cn(
                  "mt-3 pt-3 border-t border-outline-variant/5 flex items-center justify-between",
                  stat.trendUp ? "text-green-600" : stat.trendDown ? "text-red-500" : "text-on-surface/40"
                )}>
                  <div className="flex items-center gap-1.5">
                    {stat.trendUp && <div className="p-1 rounded-full bg-green-50"><ArrowUp size={10} /></div>}
                    {stat.trendDown && <div className="p-1 rounded-full bg-red-50"><ArrowDown size={10} /></div>}
                    {!stat.trendUp && !stat.trendDown && <RefreshCcw size={10} />}
                    <span className="text-[9px] font-bold tracking-wider uppercase">{stat.trend}</span>
                  </div>
                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Funnel Section */}
        <section className="bg-surface-container-lowest/50 rounded-3xl p-8 border border-outline-variant/10 glass backdrop-blur-md">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <h3 className="text-3xl font-display italic tracking-tight text-on-surface">Tunnel <span className="not-italic opacity-20">de Vente</span></h3>
              <p className="text-[10px] font-medium tracking-[0.2em] text-primary/60 mt-1 uppercase">Visualisation de la conversion</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10">
              <span className="editorial-label !text-[10px] text-on-surface/40 mr-2 uppercase">TOTAL CONVERSION :</span>
              <span className="text-xl font-display text-primary italic">12%</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-2 relative">
            {/* Background connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent -translate-x-1/2 pointer-events-none" />

            {funnelData.map((step, i) => (
              <motion.div 
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group relative"
              >
                <div className="flex items-center justify-between py-4">
                  {/* Left: Metric Name */}
                  <div className="w-[180px] text-right pr-8">
                    <p className="editorial-label !text-[8px] text-on-surface/40 mb-1">{step.label}</p>
                    <p className="text-2xl font-display text-on-surface group-hover:text-primary transition-colors">{step.value}</p>
                  </div>

                  {/* Center: Visual Bar */}
                  <div className="flex-1 flex justify-center px-4 relative">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="relative h-12 flex items-center justify-center cursor-pointer"
                      style={{ width: step.width }}
                    >
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: "circOut" }}
                        className={cn(
                          "absolute inset-0 rounded-2xl shadow-lg bg-gradient-to-r origin-left",
                          step.color
                        )}
                      />
                      <span className="relative z-10 text-white font-display text-sm italic tracking-widest transition-transform duration-500 group-hover:scale-110">
                        {step.percentage}
                      </span>
                      
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl blur-md transition-opacity pointer-events-none" />
                    </motion.div>
                  </div>

                  {/* Right: Insight */}
                  <div className="w-[180px] pl-8">
                    {step.insight && (
                      <div className="flex items-start gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Zap size={10} className="text-primary mt-1 shrink-0" />
                        <p className="text-[10px] font-medium leading-snug italic text-on-surface/60">{step.insight}</p>
                      </div>
                    )}
                    {step.final && (
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                      >
                        <ShieldCheck size={10} className="text-primary" />
                        <span className="editorial-label !text-[8px] text-primary font-bold italic">{step.final}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Insights Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-outline-variant/10 pt-10">
            <div className="p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/5 group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={14} className="text-primary" />
                <h4 className="editorial-label !text-[9px] text-on-surface/60 font-bold tracking-widest italic uppercase">Point de Friction</h4>
              </div>
              <p className="text-[11px] font-body text-on-surface-variant leading-relaxed">
                Le passage de <b className="text-on-surface italic">&ldquo;Qualifiés&rdquo;</b> à <b className="text-on-surface italic">&ldquo;Devis&rdquo;</b> présente une baisse de <span className="text-red-500 font-bold">43%</span>. 
                Les délais de visite technique sont identifiés comme facteur ralentissant.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/5 group hover:border-primary/20 transition-all">
              <div className="flex items-center gap-2 mb-6">
                <Layers size={14} className="text-primary" />
                <h4 className="editorial-label !text-[9px] text-on-surface/60 font-bold tracking-widest italic uppercase">Source Majeure</h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Share2 size={20} className="text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface mb-1">Réseaux Sociaux</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-display italic text-primary">42%</span>
                    <span className="text-[9px] font-bold text-on-surface/30 tracking-tighter bg-surface-container px-2 py-0.5 rounded">ROI: 4.5X</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary shadow-xl shadow-primary/20 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={14} className="text-white/60" />
                  <h4 className="editorial-label !text-[9px] text-white/60 font-bold tracking-widest italic uppercase">Prévision M+1</h4>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display text-white italic">+18</span>
                  <span className="text-xs font-light text-white/40 uppercase tracking-widest">PROJETS ESTIMÉS</span>
                </div>
                <p className="text-[9px] text-white/30 italic mt-4 border-t border-white/5 pt-4">
                  Basé sur l'algorithme prédictif du pipeline actuel.
                </p>
              </div>
              <div className="absolute -top-4 -right-4 opacity-5 text-white">
                <BarChart3 size={100} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
