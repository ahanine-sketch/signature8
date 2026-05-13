"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  ChevronDown,
  Filter,
  Star,
  MessageCircle,
  TrendingUp,
  Loader2,
  X,
  Eye,
  Pencil,
  Archive,
  Trash2,
  RefreshCw,
  User as UserIcon
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { projectsApi, clientsApi, responsablesApi, retouchesApi } from "@/lib/api";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [responsables, setResponsables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    nom_projet: "",
    client_id: "",
    responsable_id: "",
    type_projet: "residentiel",
    surface_m2: "",
    ville: "",
    ca_total: "",
    statut: "en_attente",
    avancement: 0
  });

  // Retouche State
  const [isRetoucheModalOpen, setIsRetoucheModalOpen] = useState(false);
  const [selectedProjectForRetouche, setSelectedProjectForRetouche] = useState<any>(null);
  const [newRetouche, setNewRetouche] = useState({
    motif: "changement_client",
    description: "",
    impact_jours: "1" as string | number
  });

  const fetchData = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true);
      const [projectsData, clientsData, responsablesData] = await Promise.all([
        projectsApi.getAll(),
        clientsApi.getAll(),
        responsablesApi.getAll()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setResponsables(responsablesData);
    } catch (error) {
      console.error("❌ Data Fetch Error:", error);
      toast.error("Échec du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const resetForm = () => {
    setNewProject({
      nom_projet: "",
      client_id: "",
      responsable_id: "",
      type_projet: "residentiel",
      surface_m2: "",
      ville: "",
      ca_total: "",
      statut: "en_attente",
      avancement: 0
    });
    setIsEditMode(false);
    setEditingProjectId(null);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const projectData = {
        ...newProject,
        surface_m2: Number(newProject.surface_m2),
        ca_total: Number(newProject.ca_total),
        avancement: Number(newProject.avancement)
      };

      if (isEditMode && editingProjectId) {
        await projectsApi.update(editingProjectId, projectData);
        toast.success("Projet mis à jour avec succès");
      } else {
        await projectsApi.create(projectData);
        toast.success("Projet créé avec succès");
      }
      
      setIsModalOpen(false);
      resetForm();
      await fetchData(); // Await to ensure we get new data before enabling any new action
    } catch (error) {
      toast.error(isEditMode ? "Erreur lors de la modification" : "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (project: any) => {
    setProjectToDelete(project);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete || isDeleting) return;
    
    try {
      setIsDeleting(true);
      await projectsApi.delete(projectToDelete.id);
      toast.success("Projet supprimé avec succès");
      setIsDeleteConfirmOpen(false);
      setProjectToDelete(null);
      await fetchData(); // Fetch data and update list
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatut: string) => {
    try {
      await projectsApi.update(id, { statut: newStatut });
      toast.success("Statut mis à jour");
      fetchData();
    } catch (error) {
      toast.error("Erreur de mise à jour du statut");
    }
  };

  const handleEditMode = (project: any) => {
    setEditingProjectId(project.id);
    setIsEditMode(true);
    setNewProject({
      nom_projet: project.nom_projet,
      client_id: project.client_id || "",
      responsable_id: project.responsable_id || "",
      type_projet: project.type_projet,
      surface_m2: (project.surface_m2 ?? 0).toString(),
      ville: project.ville || "",
      ca_total: (project.ca_total ?? 0).toString(),
      statut: project.statut,
      avancement: project.avancement || 0
    });
    setIsModalOpen(true);
  };

  const handleLogRetouche = (project: any) => {
    setSelectedProjectForRetouche(project);
    setNewRetouche({
      motif: "changement_client",
      description: "",
      impact_jours: "1"
    });
    setIsRetoucheModalOpen(true);
  };

  const submitRetouche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForRetouche || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await retouchesApi.create({
        projet_id: selectedProjectForRetouche.id,
        responsable_id: selectedProjectForRetouche.responsable_id || null,
        motif: newRetouche.motif,
        description: newRetouche.description,
        duree_heures: Number(newRetouche.impact_jours), // Map to duree_heures
      });
      toast.success("Retouche enregistrée");
      setIsRetoucheModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la retouche");
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      (p.nom_projet?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.clients?.nom_complet?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (p.type_projet?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || p.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-white">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[8px] font-bold tracking-[0.15em] text-on-secondary-container/60 uppercase">
        <span>Accueil</span>
        <ChevronRight size={10} className="opacity-40" />
        <span className="text-on-surface">Vue d&apos;ensemble</span>
      </nav>

      {/* Hero Section / Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[8px] font-bold text-primary tracking-[0.15em] uppercase">Archive des Réalisations</span>
          <h2 className="font-display text-2xl mt-0.5 italic font-light tracking-tight">Gestion <span className="not-italic opacity-40">Projets</span></h2>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-[#745B23] px-4 py-2 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-all group shadow-xl shadow-[#745B23]/20 uppercase text-[9px] font-bold tracking-[0.15em]"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform" />
          <span>AJOUTER UN PROJET</span>
        </button>
      </div>

      {/* Filter Bar Section */}
      <section className="bg-white rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-outline-variant/10">
        <div className="flex-1 min-w-[250px] flex items-center gap-3 border-b border-outline-variant/30 py-1 focus-within:border-primary transition-colors">
          <Search size={16} className="text-outline" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-[10px] w-full placeholder:text-outline-variant placeholder:italic" 
            placeholder="Rechercher par projet, client, type..." 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-1.5 bg-surface-container-highest/30 p-1 rounded-lg border border-outline-variant/10">
          {[
            { id: 'all', label: 'Tout' },
            { id: 'en_attente', label: 'En attente' },
            { id: 'en_cours', label: 'En cours' },
            { id: 'termine', label: 'Terminé' }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest transition-all",
                statusFilter === status.id 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-on-secondary-container/50 hover:bg-surface-variant hover:text-on-secondary-container"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Table Section */}
      <section className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="text-[9px] font-bold tracking-[0.15em] text-on-secondary-container/50 uppercase">
            <tr>
              <th className="px-4 pb-1">PROJET</th>
              <th className="px-4 pb-1">CLIENT</th>
              <th className="px-4 pb-1">TYPE</th>
              <th className="px-4 pb-1">RESPONSABLE</th>
              <th className="px-4 pb-1">AVANCEMENT</th>
              <th className="px-4 pb-1">RETOUCHES</th>
              <th className="px-4 pb-1">CA ESTIMÉ</th>
              <th className="px-4 pb-1">STATUT</th>
              <th className="px-4 pb-1 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="bg-white hover:bg-gray-50/50 transition-all cursor-pointer group shadow-[0_5px_15px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden border border-outline-variant/5">
                <td className="px-4 py-2.5 rounded-l-lg">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface group-hover:text-primary transition-colors text-xs">{project.nom_projet}</span>
                    <span className="text-[8px] text-on-secondary-container/60 uppercase tracking-tighter">REF-{project.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-medium text-on-secondary-container text-[10px]">{project.clients?.nom_complet || 'Standard'}</td>
                <td className="px-4 py-2.5">
                  <span className="bg-surface-container text-on-secondary-container text-[7px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">{project.type_projet}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-surface-dim flex items-center justify-center text-primary shadow-inner">
                      <UserIcon size={10} className="opacity-40" />
                    </div>
                    <span className="text-[9px] font-medium">{project.responsables?.nom || "Non assigné"}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="w-16 bg-surface-variant h-1 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={cn("h-full transition-all duration-1000", project.avancement === 100 ? "bg-primary-container" : "bg-primary")} 
                      style={{ width: `${project.avancement}%` }}
                    ></div>
                  </div>
                  <span className="text-[7px] font-bold text-on-secondary-container/70 mt-0.5 block">
                    {project.avancement === 100 ? "Terminé" : `${project.avancement}%`}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[8px] font-bold px-1 py-0.5 rounded-md",
                      (project.retouches?.[0]?.count || 0) > 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                    )}>
                      {project.retouches?.[0]?.count || 0}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-bold text-primary tracking-tight text-[10px]">
                  {new Intl.NumberFormat('fr-FR').format(project.ca_total)} MAD
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap inline-block",
                    project.statut === 'en_cours' ? "bg-amber-100 text-amber-900 border border-amber-200" :
                    project.statut === 'termine' ? "bg-green-100 text-green-900 border border-green-200" :
                    "bg-slate-100 text-slate-800 border border-slate-200 shadow-sm"
                  )}>
                    {project.statut === 'termine' ? 'terminé' : project.statut.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right rounded-r-lg">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="text-on-secondary-container/30 hover:text-primary transition-colors focus:outline-none cursor-pointer p-1">
                        <MoreHorizontal size={18} />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white border border-outline-variant/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 z-[100]">
                      <DropdownMenuItem onClick={() => handleEditMode(project)} className="gap-3 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xl focus:bg-primary/10 hover:bg-primary/5 transition-all text-slate-700">
                        <Pencil size={14} className="text-primary/60" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(project.id, 'en_cours')} className="gap-3 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xl focus:bg-amber-500/10 hover:bg-amber-500/5 transition-all text-slate-700">
                        <TrendingUp size={14} className="text-amber-500/60" />
                        Démarrer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(project.id, 'termine')} className="gap-3 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xl focus:bg-emerald-500/10 hover:bg-emerald-500/5 transition-all text-slate-700">
                        <Eye size={14} className="text-green-500/60" />
                        Clôturer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLogRetouche(project)} className="gap-3 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer rounded-xl focus:bg-purple-500/10 hover:bg-purple-500/5 transition-all text-slate-700">
                        <RefreshCw size={14} className="text-primary/60" />
                        Loguer Retouche
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-100 my-1" />
                      <DropdownMenuItem onClick={() => confirmDelete(project)} className="gap-3 py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer text-red-500 rounded-xl focus:bg-red-500/10 hover:bg-red-500/5 transition-all">
                        <Trash2 size={14} className="text-red-500/60" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {!filteredProjects.length && (
        <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-outline-variant/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-bold tracking-[0.3em] text-outline-variant uppercase">Aucun projet trouvé</p>
        </div>
      )}

      {/* Bottom Pagination Simulation */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/15">
        <span className="text-[8px] font-bold text-on-secondary-container/40 tracking-[0.2em] uppercase antialiased">Affichage de {filteredProjects.length} sur {projects.length} projets</span>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/10 hover:bg-gray-50 transition-all shadow-sm group">
            <ChevronLeft size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white text-[8px] font-bold shadow-md">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/10 hover:bg-gray-50 transition-all shadow-sm group">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[8px] font-bold text-primary tracking-[0.2em] uppercase">
                    {isEditMode ? "Édition Dossier" : "Nouveau Dossier"}
                  </span>
                  <h3 className="font-display text-2xl mt-0.5 italic font-light">
                    {isEditMode ? "Modifier" : "Ajouter"} <span className="not-italic opacity-40">Projet</span>
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 hover:bg-surface-variant rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Nom du Projet</label>
                    <input 
                      required
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant/50"
                      placeholder="Ex: Villa Ghandi"
                      value={newProject.nom_projet}
                      onChange={(e) => setNewProject({...newProject, nom_projet: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Client</label>
                    <select 
                      required
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      value={newProject.client_id}
                      onChange={(e) => setNewProject({...newProject, client_id: e.target.value})}
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.nom_complet}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Type</label>
                    <select 
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      value={newProject.type_projet}
                      onChange={(e) => setNewProject({...newProject, type_projet: e.target.value})}
                    >
                      <option value="residentiel">Résidentiel</option>
                      <option value="commercial">Commercial</option>
                      <option value="professionnel">Professionnel</option>
                      <option value="bureaux">Bureaux</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Ville</label>
                    <input 
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="Casablanca"
                      value={newProject.ville}
                      onChange={(e) => setNewProject({...newProject, ville: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Surface (m²)</label>
                    <input 
                      type="number"
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="120"
                      value={newProject.surface_m2}
                      onChange={(e) => setNewProject({...newProject, surface_m2: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">CA Total (MAD)</label>
                    <input 
                      type="number"
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      placeholder="50000"
                      value={newProject.ca_total}
                      onChange={(e) => setNewProject({...newProject, ca_total: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Responsable</label>
                    <select 
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      value={newProject.responsable_id}
                      onChange={(e) => setNewProject({...newProject, responsable_id: e.target.value})}
                    >
                      <option value="">Attribuer à...</option>
                      {responsables.map(r => (
                        <option key={r.id} value={r.id}>{r.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Statut Initial</label>
                    <select 
                      className="w-full bg-white border border-outline-variant/30 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                      value={newProject.statut}
                      onChange={(e) => setNewProject({...newProject, statut: e.target.value})}
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                    </select>
                  </div>
                  <div className="space-y-4 md:col-span-2 bg-white p-6 rounded-2xl border border-outline-variant/10">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold tracking-[0.1em] text-on-surface/60 uppercase">Avancement du Projet</label>
                      <span className="text-sm font-display italic text-primary">{newProject.avancement}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                      value={newProject.avancement}
                      onChange={(e) => setNewProject({...newProject, avancement: parseInt(e.target.value)})}
                    />
                    <div className="flex justify-between text-[8px] font-bold text-outline-variant uppercase tracking-widest px-1">
                      <span>Début</span>
                      <span>En cours</span>
                      <span>Terminé</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl text-[10px] font-bold tracking-[0.2em] border border-outline-variant/20 hover:bg-surface-variant transition-all uppercase"
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className={cn(
                      "flex-[2] py-4 px-6 rounded-2xl text-[10px] font-bold tracking-[0.2em] bg-primary text-white shadow-xl shadow-primary/20 transition-all uppercase flex items-center justify-center gap-2",
                      isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                    )}
                  >
                    {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                    {isEditMode ? "Mettre à jour" : "Confirmer la Création"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <Trash2 size={24} />
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[8px] font-bold text-error tracking-[0.2em] uppercase antialiased">Action Irréversible</span>
                  <h4 className="font-display text-xl italic font-light">Supprimer ce <span className="not-italic opacity-40">Projet</span> ?</h4>
                  <p className="text-[10px] text-on-secondary-container/60 leading-relaxed px-4">
                    Toutes les données associées à <span className="font-bold text-on-surface">"{projectToDelete?.nom_projet}"</span> seront définitivement supprimées.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    disabled={isDeleting}
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="flex-1 py-3 px-6 rounded-xl text-[9px] font-bold tracking-[0.2em] border border-outline-variant/20 hover:bg-surface-variant transition-all uppercase"
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={isDeleting}
                    onClick={handleDeleteProject}
                    className="flex-1 py-3 px-6 rounded-xl text-[9px] font-bold tracking-[0.2em] bg-[#BC2C1A] text-white shadow-xl shadow-[#BC2C1A]/20 hover:bg-[#A12314] transition-all uppercase flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="animate-spin" size={14} /> : "Supprimer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Retouche Modal */}
      <AnimatePresence>
        {isRetoucheModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRetoucheModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[8px] font-bold text-primary tracking-[0.2em] uppercase">Suivi Qualité</span>
                  <h3 className="font-display text-2xl mt-0.5 italic font-light">Loguer <span className="not-italic opacity-40">Retouche</span></h3>
                  <p className="text-[9px] text-on-secondary-container/60 mt-0.5 uppercase font-bold tracking-tighter">Projet: {selectedProjectForRetouche?.nom_projet}</p>
                </div>
                <button 
                  onClick={() => setIsRetoucheModalOpen(false)}
                  className="p-2 hover:bg-surface-variant rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitRetouche} className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Motif de la Retouche</label>
                    <select 
                      required
                      className="w-full bg-surface-container-low border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20"
                      value={newRetouche.motif}
                      onChange={(e) => setNewRetouche({...newRetouche, motif: e.target.value})}
                    >
                      <option value="changement_client">Changement Client</option>
                      <option value="erreur_design">Erreur Design</option>
                      <option value="contrainte_technique">Contrainte Technique</option>
                      <option value="budget">Budget</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Impact Estimé (Jours)</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      className="w-full bg-surface-container-low border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20"
                      value={newRetouche.impact_jours}
                      onChange={(e) => setNewRetouche({...newRetouche, impact_jours: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold tracking-[0.1em] text-on-surface/60 uppercase ml-1">Description / Notes</label>
                    <textarea 
                      className="w-full bg-surface-container-low border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                      placeholder="Détails sur la retouche demandée..."
                      value={newRetouche.description}
                      onChange={(e) => setNewRetouche({...newRetouche, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsRetoucheModalOpen(false)}
                    className="flex-1 py-3 px-6 rounded-xl text-[9px] font-bold tracking-[0.2em] border border-outline-variant/20 hover:bg-surface-variant transition-all uppercase"
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className={cn(
                      "flex-[2] py-3 px-6 rounded-xl text-[9px] font-bold tracking-[0.2em] bg-primary text-white shadow-xl shadow-primary/20 transition-all uppercase flex items-center justify-center gap-2",
                      isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                    )}
                  >
                    {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                    Enregistrer la Retouche
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
