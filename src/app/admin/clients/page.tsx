"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  MoreHorizontal, 
  Download, 
  Group, 
  TrendingUp, 
  LayoutGrid, 
  Users, 
  Loader2,
  X,
  Pencil,
  Trash2,
  ChevronDown
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { api, clientsApi } from "@/lib/api";
import { toast } from "sonner";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const [newClient, setNewClient] = useState({
    nom_complet: "",
    email: "",
    telephone: "",
    whatsapp: "",
    ville: "",
    source_lead: "autre"
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [clientsData, projectsData] = await Promise.all([
        clientsApi.getAll(),
        api.get('/admin/projects')
      ]);
      setClients(clientsData);
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

  const filteredClients = clients.filter(c => 
    (c.nom_complet?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (c.telephone || "").includes(searchTerm) ||
    (c.ville?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (isEditMode && editingClientId) {
        await clientsApi.update(editingClientId, newClient);
        toast.success("Client mis à jour avec succès");
      } else {
        await clientsApi.create(newClient);
        toast.success("Client ajouté avec succès");
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      await clientsApi.delete(clientToDelete.id);
      toast.success("Client supprimé avec succès");
      setIsDeleteConfirmOpen(false);
      setClientToDelete(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditMode = (client: any) => {
    setEditingClientId(client.id);
    setIsEditMode(true);
    setNewClient({
      nom_complet: client.nom_complet,
      email: client.email || "",
      telephone: client.telephone || "",
      whatsapp: client.whatsapp || "",
      ville: client.ville || "",
      source_lead: client.source_lead || "autre"
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditingClientId(null);
    setNewClient({
      nom_complet: "",
      email: "",
      telephone: "",
      whatsapp: "",
      ville: "",
      source_lead: "autre"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Breadcrumbs & Mini Stats */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/5">
        <div className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-bold text-on-secondary-container">
          <span className="opacity-40 hover:text-primary transition-colors cursor-pointer">Accueil</span>
          <ChevronRight size={12} className="opacity-20" />
          <span className="text-primary italic">Portefeuille Clients</span>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-outline-variant/10 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div className="w-5 h-5 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
            <Users size={10} />
          </div>
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-30">Total Clients</span>
          <span className="text-xs font-display italic font-medium">{clients.length} <span className="not-italic text-[9px] opacity-20 ml-1">Contacts</span></span>
        </div>
      </nav>

      {/* Hero Content Area */}
      <section className="px-6 pt-10 pb-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary block mb-3 antialiased">Signature Portfolio</span>
            <h3 className="font-display text-4xl mb-4 italic font-light tracking-tight leading-[0.9]">Gestion <br/><span className="not-italic opacity-40">de la Clientèle</span></h3>
            <p className="text-on-secondary-container font-body text-lg leading-relaxed opacity-60 italic max-w-xl">Administrez vos relations privilégiées et suivez l&apos;évolution de vos projets d&apos;exception avec une précision artisanale.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-secondary-container/40" size={16} />
              <input 
                className="pl-10 pr-4 py-3 bg-white border border-outline-variant/10 focus:ring-1 focus:ring-primary text-[10px] font-bold tracking-[0.15em] uppercase w-full md:w-72 rounded-xl placeholder:text-on-secondary-container/30" 
                placeholder="RECHERCHER UN CLIENT..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-[#745B23] px-6 py-3 rounded-xl text-white flex items-center gap-2 hover:opacity-90 transition-all group shadow-xl shadow-[#745B23]/20 uppercase text-[10px] font-bold tracking-[0.15em]"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              <span>NOUVEAU CLIENT</span>
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-outline-variant/5">
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold">CLIENT</th>
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold">SOURCE</th>
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold">PROJETS</th>
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold">TÉLÉPHONE</th>
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold">VILLE</th>
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold">DATE AJOUT</th>
                  <th className="py-4 px-6 text-[9px] tracking-[0.2em] uppercase text-on-secondary-container font-bold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-gray-50/50 transition-all cursor-pointer border-b border-outline-variant/5 last:border-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-inner group-hover:scale-110 transition-transform duration-500">
                          {client.nom_complet.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{client.nom_complet}</p>
                          <p className="text-[10px] text-on-secondary-container/50 font-medium tracking-tight">{client.email || 'Pas d\'email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 bg-surface-container rounded-full text-secondary font-bold">
                        {client.source_lead || 'INCONNU'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold text-primary italic">
                        {projects.filter(p => p.client_id === client.id).length} Projets
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] text-on-secondary-container font-medium">{client.telephone || '---'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] text-on-secondary-container font-bold uppercase tracking-wider">{client.ville || '---'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] text-on-secondary-container font-medium italic opacity-60">
                        {client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : '---'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="text-on-secondary-container/30 hover:text-primary hover:bg-primary/5 rounded-xl transition-all focus:outline-none cursor-pointer p-3">
                            <MoreHorizontal size={18} />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white border-outline-variant/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 z-[100]">
                          <DropdownMenuItem 
                            onClick={() => handleEditMode(client)}
                            className="flex items-center gap-3 py-3 px-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer focus:bg-surface-container rounded-lg outline-none"
                          >
                            <Pencil size={14} className="text-primary" />
                            Modifier
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-outline-variant/10 my-1" />
                          
                          <DropdownMenuItem 
                            onClick={() => {
                              setClientToDelete(client);
                              setIsDeleteConfirmOpen(true);
                            }}
                            className="flex items-center gap-3 py-3 px-4 text-[10px] font-bold uppercase tracking-widest cursor-pointer text-[#BC2C1A] focus:bg-[#BC2C1A]/5 focus:text-[#BC2C1A] rounded-lg outline-none"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!filteredClients.length && (
            <div className="p-20 text-center">
              <p className="text-[10px] font-bold tracking-[0.3em] text-outline-variant uppercase">Aucun client trouvé</p>
            </div>
          )}

          {/* Pagination Simulation */}
          <div className="p-6 border-t border-outline-variant/10 flex items-center justify-between bg-white">
            <span className="text-[9px] tracking-[0.2em] uppercase text-on-secondary-container/40 font-bold">
              AFFICHAGE DE {filteredClients.length} SUR {clients.length} CLIENTS
            </span>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/10 hover:bg-gray-50 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.02)] group disabled:opacity-20" disabled>
                <ChevronLeft size={16} className="opacity-40 group-hover:opacity-100" />
              </button>
              <span className="text-[10px] font-bold tracking-[0.1em]">PAGE 01 / 01</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant/10 hover:bg-gray-50 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.02)] group disabled:opacity-20" disabled>
                <ChevronRight size={16} className="opacity-40 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Client Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-[#12110F]/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden"
          >
            <div className="p-12">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase block mb-2">Signature 8</span>
                  <h2 className="text-4xl font-display italic font-light italic">
                    {isEditMode ? "Modifier" : "Nouveau"} <span className="not-italic opacity-40">Client</span>
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-surface-variant rounded-2xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-secondary-container/30 ml-1">Nom Complet</label>
                    <input 
                      required
                      value={newClient.nom_complet}
                      onChange={(e) => setNewClient({...newClient, nom_complet: e.target.value})}
                      className="w-full bg-white border border-outline-variant/20 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-primary transition-all font-medium text-sm placeholder:opacity-20"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-secondary-container/30 ml-1">Email</label>
                    <input 
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      className="w-full bg-white border border-outline-variant/20 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-primary transition-all font-medium text-sm placeholder:opacity-20"
                      placeholder="jean@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-secondary-container/30 ml-1">Téléphone</label>
                    <input 
                      value={newClient.telephone}
                      onChange={(e) => setNewClient({...newClient, telephone: e.target.value})}
                      className="w-full bg-white border border-outline-variant/20 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-primary transition-all font-medium text-sm placeholder:opacity-20"
                      placeholder="+212 6..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-secondary-container/30 ml-1">Whatsapp</label>
                    <input 
                      value={newClient.whatsapp}
                      onChange={(e) => setNewClient({...newClient, whatsapp: e.target.value})}
                      className="w-full bg-white border border-outline-variant/20 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-primary transition-all font-medium text-sm placeholder:opacity-20"
                      placeholder="+212 6..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-secondary-container/30 ml-1">Ville</label>
                    <input 
                      value={newClient.ville}
                      onChange={(e) => setNewClient({...newClient, ville: e.target.value})}
                      className="w-full bg-white border border-outline-variant/20 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-primary transition-all font-medium text-sm placeholder:opacity-20"
                      placeholder="Marrakech"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-on-secondary-container/30 ml-1">Source Lead</label>
                    <select 
                      value={newClient.source_lead}
                      onChange={(e) => setNewClient({...newClient, source_lead: e.target.value})}
                      className="w-full bg-white border border-outline-variant/20 rounded-2xl px-6 py-5 focus:ring-1 focus:ring-primary transition-all font-bold text-[10px] tracking-widest uppercase appearance-none"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="site_web">Site Web</option>
                      <option value="facebook">Facebook</option>
                      <option value="youtube">YouTube</option>
                      <option value="bouche_a_oreille">Bouche à oreille</option>
                      <option value="reference">Référence</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 rounded-2xl text-[10px] font-bold tracking-[0.2em] border border-outline-variant/10 text-on-surface/40 hover:bg-gray-50 transition-all uppercase"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-5 rounded-2xl text-[10px] font-bold tracking-[0.2em] bg-[#745B23] text-white hover:opacity-90 transition-all uppercase shadow-xl shadow-[#745B23]/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (isEditMode ? "Mettre à jour" : "Créer le Client")}
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
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#BC2C1A]/10 text-[#BC2C1A] rounded-3xl flex items-center justify-center mx-auto mb-8">
              <X size={40} />
            </div>
            <h3 className="text-2xl font-display mb-4 italic">Supprimer <span className="not-italic font-bold">le Client ?</span></h3>
            <p className="text-on-secondary-container/60 mb-10 text-sm leading-relaxed">
              Cette action est irréversible. Toutes les données associées à <span className="font-bold text-on-surface">{clientToDelete?.nom_complet}</span> seront définitivement perdues.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-4 px-6 rounded-xl text-[10px] font-bold tracking-[0.2em] bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all uppercase"
              >
                Garder
              </button>
              <button 
                disabled={isDeleting}
                onClick={handleDeleteClient}
                className="flex-1 py-4 px-6 rounded-xl text-[10px] font-bold tracking-[0.2em] bg-[#BC2C1A] text-white shadow-xl shadow-[#BC2C1A]/20 hover:bg-[#A12314] transition-all uppercase flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={14} /> : "Supprimer"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
