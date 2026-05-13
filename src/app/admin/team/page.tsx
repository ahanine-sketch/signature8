"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreHorizontal, ChevronRight, ArrowRight, Edit3, ExternalLink, Instagram, Linkedin, Mail, UserPlus, Loader2, Trash2, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { responsablesApi, projectsApi } from "@/lib/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Default placeholder for missing images
// No default image needed, using icons instead

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    nom: "",
    email: "",
    role: "designer",
    actif: true,
    actif: true,
    performance: 95
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamData, projectsData] = await Promise.all([
        responsablesApi.getAll(),
        projectsApi.getAll()
      ]);
      setTeam(teamData);
      setProjects(projectsData);
    } catch (error) {
      toast.error("Échec du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && editingMemberId) {
        await responsablesApi.update(editingMemberId, newMember);
        toast.success("Membre mis à jour");
      } else {
        await responsablesApi.create(newMember);
        toast.success("Nouveau membre ajouté");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Erreur technique");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      await responsablesApi.delete(memberToDelete.id);
      toast.success("Membre supprimé");
      setIsDeleteConfirmOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Impossible de supprimer ce membre");
    }
  };

  const handleEditMode = (member: any) => {
    setIsEditMode(true);
    setEditingMemberId(member.id);
    setNewMember({
      nom: member.nom,
      email: member.email || "",
      role: member.role,
      actif: member.actif,
      performance: member.performance || 95
    });
    setIsModalOpen(true);
  };

  const handleAddMode = () => {
    setIsEditMode(false);
    setEditingMemberId(null);
    setNewMember({
      nom: "",
      email: "",
      role: "designer",
      actif: true,
      performance: 95
    });
    setIsModalOpen(true);
  };

  const getMemberAllocation = (memberId: string) => {
    return projects.filter(p => p.responsable_id === memberId).length;
  };

  const getMemberPerformance = (memberId: string) => {
    const memberProjects = projects.filter(p => p.responsable_id === memberId);
    if (memberProjects.length === 0) return 0;
    const totalAvancement = memberProjects.reduce((acc, p) => acc + (p.avancement || 0), 0);
    return Math.round(totalAvancement / memberProjects.length);
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-on-surface">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Pre-process top 3 members for the grid
  const topMembers = team.slice(0, 3).map((m, i) => ({
    original: m,
    name: m.nom,
    role: m.role.replace('_', ' ').toUpperCase(),
    status: m.actif ? "ACTIF" : "INACTIF",
    projects: getMemberAllocation(m.id).toString().padStart(2, '0'),
    performance: `${getMemberPerformance(m.id)}%`,
    delay: i * 0.2,
    offset: i === 1
  }));

  return (
    <div className="flex flex-col min-h-screen bg-white text-on-surface">
      
      {/* Top Navigation / Breadcrumbs Area */}
      <div className="px-8 py-4 flex flex-col gap-0.5 border-b border-outline-variant/10 bg-white sticky top-0 z-40 shadow-sm">
        <nav className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] tracking-[0.2em] font-medium text-on-secondary-container uppercase opacity-60">ACCUEIL</span>
          <span className="text-[9px] text-outline-variant opacity-40">/</span>
          <span className="text-[9px] tracking-[0.2em] font-bold text-on-surface uppercase">ÉQUIPE</span>
        </nav>
        <h2 className="font-headline text-2xl italic text-primary leading-none">Gestion Talents</h2>
      </div>

      <div className="p-8 space-y-12 max-w-7xl mx-auto w-full pb-20">
        
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row justify-between items-end gap-8 pt-4">
          <div className="max-w-xl space-y-3">
            <h3 className="font-headline text-5xl mb-1 leading-[0.95] tracking-tight text-on-surface">
              L&apos;Excellence <br/>
              <span className="italic text-primary">Collaborative</span>
            </h3>
            <p className="text-on-secondary-container text-base italic leading-relaxed opacity-60 font-body max-w-lg">
              Gérez les talents de Signature 8. Suivez les performances et l&apos;allocation.
            </p>
          </div>
            <button 
              onClick={handleAddMode}
              className="group flex items-center gap-3 bg-[#745B23] text-white px-8 py-3.5 rounded-xl hover:opacity-90 transition-all duration-700 shadow-xl shadow-[#745B23]/20 hover:-translate-y-1 active:scale-95"
            >
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white">AJOUTER MEMBRE</span>
              <UserPlus size={16} className="group-hover:translate-x-1 group-hover:rotate-12 transition-transform duration-500 text-white" />
            </button>
        </section>

        {/* Team Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMembers.map((member) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: member.delay, duration: 0.8 }}
              className={cn(
                "group relative bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-outline-variant/10 transition-all duration-1000 hover:shadow-lg",
                member.offset && "lg:mt-8"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center transition-all duration-1000 border border-outline-variant/20 shadow-lg group-hover:scale-105">
                  <User size={40} className="text-on-secondary-container/10" />
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-bold tracking-[0.2em] uppercase antialiased",
                  member.status === 'ACTIF' ? "bg-green-50 text-green-700" :
                  "bg-gray-100 text-on-surface-variant opacity-60"
                )}>
                  {member.status}
                </span>
              </div>
              
              <h4 className="font-headline text-2xl mb-0.5 text-on-surface">{member.name}</h4>
              <p className="text-[9px] font-bold tracking-[0.2em] text-on-secondary-container/50 mb-6 uppercase italic">{member.role}</p>
              
              <div className="space-y-3 pt-6 border-t border-outline-variant/10">
                <div className="flex justify-between items-center group/row">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase">PROJET EN COURS</span>
                  <span className="text-base font-display text-on-surface group-hover/row:text-primary transition-colors">{member.projects}</span>
                </div>
                <div className="flex justify-between items-center group/row">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase">PERFORMANCE</span>
                  <span className="text-base font-display text-[#B8975A] group-hover/row:scale-110 transition-transform origin-right">{member.performance}</span>
                </div>
              </div>

                <div className="flex gap-3 mt-8">
                  <button className="flex-1 py-3 text-[9px] font-bold tracking-[0.2em] border-b border-primary/20 hover:border-primary text-on-surface transition-all uppercase flex items-center justify-center gap-2 group/btn">
                    VOIR PROFIL <ArrowRight size={12} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="p-3 bg-white border border-outline-variant/20 text-on-surface hover:bg-gray-50 transition-colors rounded-xl group/btn outline-none cursor-pointer shadow-sm">
                        <MoreHorizontal size={18} className="group-hover/btn:rotate-90 transition-transform" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl border-none shadow-2xl bg-white">
                      <DropdownMenuItem 
                        onClick={() => handleEditMode(member.original)}
                        className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-50 text-on-surface transition-colors"
                      >
                        <Edit3 size={14} />
                        <span className="text-[9px] font-bold tracking-[0.1em] uppercase">Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          setMemberToDelete(member.original);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span className="text-[9px] font-bold tracking-[0.1em] uppercase">Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Personnel List */}
        <div className="pt-10 space-y-8">
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-primary opacity-30"></span>
            <h5 className="text-[9px] font-bold tracking-[0.3em] text-primary uppercase">LISTE DÉTAILLÉE DU PERSONNEL</h5>
          </div>

          <div className="bg-white rounded-[1.5rem] border border-outline-variant/10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-outline-variant/10">
                  <th className="px-8 py-5 text-[9px] font-bold tracking-[0.25em] text-on-secondary-container uppercase font-label">COLLABORATEUR</th>
                  <th className="px-6 py-5 text-[9px] font-bold tracking-[0.25em] text-on-secondary-container uppercase font-label">FONCTION</th>
                  <th className="px-6 py-5 text-[9px] font-bold tracking-[0.25em] text-on-secondary-container uppercase font-label">ALLOCATION</th>
                  <th className="px-6 py-5 text-[9px] font-bold tracking-[0.25em] text-on-secondary-container uppercase font-label">RENDEMENT</th>
                  <th className="px-6 py-5 text-[9px] font-bold tracking-[0.25em] text-on-secondary-container uppercase font-label">STATUT</th>
                  <th className="px-8 py-5 text-[9px] font-bold tracking-[0.25em] text-on-secondary-container uppercase text-right font-label">GESTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {team.map((member) => (
                  <tr key={member.id} className="group hover:bg-gray-50 transition-all duration-500">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-outline-variant/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 bg-white">
                          <User size={20} className="text-on-secondary-container/10" />
                        </div>
                        <span className="text-xs font-bold text-on-surface/80">{member.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-medium text-on-secondary-container/60 uppercase tracking-tight">{member.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-primary">{getMemberAllocation(member.id)} Projets</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1 bg-white border border-outline-variant/20 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getMemberPerformance(member.id)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-[#B8975A]"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-on-surface/50">{getMemberPerformance(member.id)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full", member.actif ? "bg-green-500 animate-pulse" : "bg-outline-variant")} />
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-on-secondary-container/60">{member.actif ? "ACTIF" : "INACTIF"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEditMode(member)}
                        className="p-2 text-outline-variant hover:text-primary hover:bg-white rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setMemberToDelete(member);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="p-2 text-outline-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Aesthetic Footer */}
        <footer className="pt-20 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-outline-variant/10">
          <div className="flex items-center gap-12">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.3em] text-on-secondary-container uppercase block opacity-40">© 2024 SIGNATURE 8</span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#B8975A] uppercase block italic">SKETCH DESIGN STUDIO</span>
            </div>
          </div>
          <div className="flex gap-10">
            {[
              { label: "INSTAGRAM", icon: Instagram },
              { label: "LINKEDIN", icon: Linkedin },
              { label: "CONTACT", icon: Mail }
            ].map((link) => (
              <a 
                key={link.label}
                className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-on-secondary-container/40 hover:text-primary transition-all group" 
                href="#"
              >
                <link.icon size={14} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                {link.label}
              </a>
            ))}
          </div>
        </footer>
      </div>

      {/* Create/Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-outline-variant/10 overflow-hidden"
          >
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="font-headline text-4xl italic text-on-surface">
                    {isEditMode ? "Modifier" : "Nouveau"}{" "}
                    <span className="not-italic opacity-30">Membre</span>
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mt-2">DÉTAILS DU COMPTE</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl col-span-full border border-dashed border-outline-variant/30 hover:border-primary/50 transition-all group">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border border-outline-variant/20 shadow-xl mb-2">
                      <User size={48} className="text-on-secondary-container/10" />
                    </div>
                    <p className="text-[10px] font-bold tracking-[0.1em] text-on-secondary-container/40 uppercase">Icône Utilisateur Standard</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-secondary-container/40 uppercase px-1">Nom Complet</label>
                    <input 
                      required
                      className="w-full bg-white border border-outline-variant/20 shadow-sm rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-primary transition-all"
                      value={newMember.nom}
                      onChange={(e) => setNewMember({...newMember, nom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-secondary-container/40 uppercase px-1">Rendement (%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      className="w-full bg-white border border-outline-variant/20 shadow-sm rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-primary transition-all cursor-not-allowed opacity-50"
                      value={getMemberPerformance(editingMemberId || "")}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-secondary-container/40 uppercase px-1">Email</label>
                    <input 
                      type="email"
                      required
                      className="w-full bg-white border border-outline-variant/20 shadow-sm rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-primary transition-all"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-secondary-container/40 uppercase px-1">Rôle</label>
                    <select 
                      className="w-full bg-white border border-outline-variant/20 shadow-sm rounded-2xl px-6 py-4 text-[11px] font-bold tracking-[0.05em] uppercase focus:ring-1 focus:ring-primary transition-all"
                      value={newMember.role}
                      onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    >
                      <option value="super_admin">SUPER ADMIN</option>
                      <option value="admin">ADMIN</option>
                      <option value="designer">DESIGNER</option>
                      <option value="manager">MANAGER</option>
                      <option value="lecture_seule">LECTURE SEULE</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 px-2 h-[4.5rem]">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold tracking-[0.1em] text-on-secondary-container/40 uppercase block">Statut Actif</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setNewMember({...newMember, actif: !newMember.actif})}
                      className={cn(
                        "w-14 h-8 rounded-full transition-all flex items-center px-1",
                        newMember.actif ? "bg-green-500 justify-end" : "bg-outline-variant justify-start"
                      )}
                    >
                      <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-5 bg-primary text-white text-[11px] font-bold tracking-[0.3em] rounded-2xl hover:opacity-90 transition-all uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (isEditMode ? "METTRE À JOUR" : "CRÉER LE COMPTE")}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsDeleteConfirmOpen(false)}
            className="absolute inset-0 bg-[#12110F]/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-12 text-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-outline-variant/10"
          >
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="text-gray-300 hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Trash2 size={32} />
            </div>
            
            <h4 className="font-headline text-3xl mb-4 italic">Supprimer Membre ?</h4>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              Cette action est irréversible. Toutes les données associées à <span className="font-bold text-black italic">{memberToDelete?.nom}</span> seront déconnectées.
            </p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={handleDelete}
                className="w-full py-5 bg-red-500 text-white rounded-2xl text-[10px] font-bold tracking-[0.2em] hover:bg-red-600 transition-all uppercase"
              >
                Confirmer la Suppression
              </button>
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="w-full py-5 bg-gray-100 text-gray-500 rounded-2xl text-[10px] font-bold tracking-[0.2em] hover:bg-gray-200 transition-all uppercase"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
