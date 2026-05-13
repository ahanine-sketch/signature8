"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Layers, 
  Star, 
  ArrowUpRight, 
  MoreVertical,
  ChevronRight,
  Search,
  Plus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, profileData] = await Promise.all([
        dashboardApi.getStats(),
        user?.email ? fetch(`/api/responsables/profile?email=${user.email}`).then(res => res.json()).catch(() => null) : Promise.resolve(null)
      ]);
      setStats(statsData);
      setProfile(profileData);
    } catch (error) {
      toast.error("Échec du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const mainStats = [
    { 
      label: "Chiffre d'Affaire", 
      value: new Intl.NumberFormat('fr-FR').format(stats.stats?.totalRevenue || 0), 
      unit: "MAD", 
      sub: "Total cumulé", 
      icon: TrendingUp, 
      color: "text-primary" 
    },
    { 
      label: "Clients Actifs", 
      value: (stats.stats?.totalClients || 0).toString(), 
      sub: "Base de données clients", 
      icon: Users, 
      color: "text-[#b8975a]" 
    },
    { 
      label: "Total Demandes", 
      value: (stats.stats?.totalDemandes || 0).toString(), 
      sub: "Flux de leads entrants", 
      icon: Star, 
      color: "text-green-600" 
    },
    { 
      label: "Projets Actifs", 
      value: (stats.stats?.totalProjects || 0).toString(), 
      sub: "En cours d'exécution", 
      icon: Layers, 
      color: "text-blue-500" 
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      
      {/* Breadcrumbs */}
      <div className="px-8 pt-6 flex items-center gap-2 text-[9px] tracking-[0.2em] font-bold uppercase text-on-secondary-container">
        <span className="opacity-50">ADMIN SECTION</span>
        <ChevronRight size={12} className="opacity-30" />
        <span className="text-primary">TABLEAU DE BORD</span>
      </div>

      <div className="px-8 py-4">
        {/* Header Area */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h3 className="font-display text-4xl lg:text-5xl text-on-surface mb-1 tracking-tight">
              Bonjour, <span className="italic">{profile?.nom || user?.email?.split('@')[0] || "Administrateur"}</span>
            </h3>
            <p className="text-on-secondary-container font-body max-w-2xl italic text-base opacity-60">Suivi en temps réel des performances et de l&apos;activité de Signature 8.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mainStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container-lowest p-6 rounded-xl ambient-shadow group transition-all duration-500 hover:-translate-y-1 border border-outline-variant/5"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-surface-container mb-4 transition-colors shadow-inner", stat.color)}>
                <stat.icon size={20} strokeWidth={1} />
              </div>
              <p className="editorial-label text-[10px] text-on-secondary-container opacity-40 mb-2">{stat.label}</p>
              <h4 className="font-display text-2xl text-on-surface mb-1 tracking-tight">
                {stat.value} {stat.unit && <span className="text-sm font-body tracking-tight opacity-20">{stat.unit}</span>}
              </h4>
              <span className="text-[9px] font-bold text-foreground/20 tracking-[0.2em] uppercase italic">{stat.sub}</span>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Recent Activity Card */}
          <div className="lg:col-span-2 bg-[#12110F] text-white p-8 lg:p-10 rounded-xl ambient-shadow relative overflow-hidden group border-none">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                   <h5 className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">Dernières Demandes Clients</h5>
                </div>
                
                <div className="space-y-4 mt-6">
                  {(stats.recentActivity || []).map((demande: any, i: number) => (
                    <motion.div 
                      key={demande.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{demande.clients?.nom_complet || demande.nom_complet}</span>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest">{demande.type_projet} — {new Date(demande.date_demande || demande.cree_le).toLocaleDateString()}</span>
                      </div>
                      <span className={cn(
                        "text-[8px] font-bold px-2 py-0.5 rounded uppercase",
                        demande.statut === 'nouveau' ? "bg-primary text-white" : "bg-white/10 text-white"
                      )}>
                        {demande.statut}
                      </span>
                    </motion.div>
                  ))}
                  {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                    <p className="text-white/20 italic text-xs">Aucune activité récente.</p>
                  )}
                </div>
             </div>
             <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000" />
          </div>

          {/* Business Insights Card */}
          <div className="bg-surface-container-lowest p-8 lg:p-10 rounded-xl ambient-shadow flex flex-col justify-between group border border-outline-variant/5">
              <div>
                <h5 className="text-[10px] font-bold tracking-[0.2em] text-on-secondary-container mb-10 uppercase">REVENU PAR SEGMENT</h5>
                <div className="relative w-36 h-36 mx-auto mb-10 group-hover:scale-105 transition-transform duration-1000">
                   <div className="absolute inset-0 border-[15px] border-primary rounded-full opacity-10" />
                   <div 
                    className="absolute inset-0 rounded-full" 
                    style={{ 
                      background: `conic-gradient(#745B23 ${Math.round((stats.revenueBySegment?.residentiel / stats.stats.totalRevenue) * 360) || 0}deg, transparent 0deg)`,
                      maskImage: 'radial-gradient(circle, transparent 58%, black 60%)',
                      WebkitMaskImage: 'radial-gradient(circle, transparent 58%, black 60%)'
                    }} 
                   />
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-display text-on-surface">
                        {stats.stats.totalRevenue > 0 
                          ? Math.round((stats.revenueBySegment?.residentiel / stats.stats.totalRevenue) * 100) 
                          : 0}%
                      </span>
                      <span className="text-[7px] leading-none text-center uppercase tracking-widest opacity-30">RÉSIDENTIEL</span>
                   </div>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between text-[9px] font-bold tracking-tight">
                   <span className="flex items-center gap-2 text-on-secondary-container/60"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> RÉSIDENTIEL</span>
                   <span className="text-on-surface">
                    {new Intl.NumberFormat('fr-FR').format(stats.revenueBySegment?.residentiel || 0)} MAD
                   </span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold tracking-tight">
                   <span className="flex items-center gap-2 text-on-secondary-container/60"><div className="w-1.5 h-1.5 rounded-full bg-[#b8975a]" /> COMMERCIAL</span>
                   <span className="text-on-surface">
                    {new Intl.NumberFormat('fr-FR').format(stats.revenueBySegment?.commercial || 0)} MAD
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
