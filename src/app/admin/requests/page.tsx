"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  ChevronRight,
  Phone,
  Calendar,
  History,
  CheckCircle,
  MoreHorizontal,
  Loader2,
  Trash2,
  Edit2
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { requestsApi, clientsApi, projectsApi } from "@/lib/api";
import { toast } from "sonner";
import CreateDemandeModal from "@/components/CreateDemandeModal";
import DemandeDetailsModal from "@/components/DemandeDetailsModal";

const columnsList = [
  { id: "nouveau", title: "NOUVEAU" },
  { id: "contacte", title: "CONTACTÉ" },
  { id: "qualifie", title: "QUALIFIÉ" },
  { id: "converti", title: "CONVERTI" },
];

const emptyKanbanData: Record<string, any[]> = {
  nouveau: [],
  contacte: [],
  qualifie: [],
  converti: [],
};

export default function RequestsPage() {
  const [data, setData] = useState(emptyKanbanData);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<any>(null);

  const fetchDemandes = useCallback(async () => {
    try {
      setLoading(true);
      const demandes = await requestsApi.getAll();
      
      const mappedData: Record<string, any[]> = {
        nouveau: [],
        contacte: [],
        qualifie: [],
        converti: [],
      };

      demandes.forEach((d: any) => {
        if (mappedData[d.statut]) {
          mappedData[d.statut].push({
            ...d,
            sourceColor: d.source === 'instagram' ? "bg-[#E1F5FE] text-[#0288D1]" : 
                         d.source === 'whatsapp' ? "bg-[#E8F5E9] text-[#2E7D32]" : 
                         (d.source === 'site_web' || d.source === 'formulaire_site') ? "bg-gray-100 text-secondary" :
                         "bg-gray-50 text-outline"
          });
        }
      });

      setData(mappedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Échec du chargement des demandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemandes();
  }, [fetchDemandes]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic Update
    const sourceColumn = [...data[source.droppableId]];
    const destColumn = destination.droppableId === source.droppableId 
      ? sourceColumn 
      : [...data[destination.droppableId]];
    
    const [movedItem] = sourceColumn.splice(source.index, 1);
    
    if (destination.droppableId === source.droppableId) {
      sourceColumn.splice(destination.index, 0, movedItem);
      setData({ ...data, [source.droppableId]: sourceColumn });
    } else {
      destColumn.splice(destination.index, 0, movedItem);
      setData({ ...data, [source.droppableId]: sourceColumn, [destination.droppableId]: destColumn });
      
      try {
        await requestsApi.updateStatus(draggableId, destination.droppableId);
        toast.success(`Statut mis à jour : ${destination.droppableId}`);
      } catch (error) {
        toast.error("Erreur de synchronisation");
        fetchDemandes(); // Rollback
      }
    }
  };

  const handleCardClick = (demande: any) => {
    setSelectedDemande(demande);
    setIsDetailsOpen(true);
  };

  const handleEditDemande = (demande: any) => {
    setSelectedDemande(demande);
    setIsEditMode(true);
    setIsModalOpen(true);
    setIsDetailsOpen(false);
  };

  const confirmDelete = (request: any) => {
    setRequestToDelete(request);
    setIsDetailsOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      await requestsApi.delete(requestToDelete.id);
      toast.success("Demande supprimée avec succès");
      setIsDeleteConfirmOpen(false);
      setRequestToDelete(null);
      fetchDemandes();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertirEnProjet = async (demande: any) => {
    if (isConverting) return;
    try {
      setIsConverting(true);
      
      // 1. Create client
      const client = await clientsApi.create({
        nom_complet: demande.nom_complet,
        email: demande.email,
        telephone: demande.telephone,
        source_lead: demande.source === 'formulaire_site' ? 'site_web' : (demande.source || 'autre'),
        ville: '---'
      });

      // 2. Create project
      await projectsApi.create({
        nom_projet: `Projet ${demande.nom_complet}`,
        client_id: client.id,
        type_projet: demande.type_projet || 'residentiel',
        statut: 'en_cours',
        ca_total: demande.budget_estime || 0
      });

      // 3. Update demande status
      await requestsApi.updateStatus(demande.id, 'converti');
      
      toast.success("Demande convertie en projet avec succès !");
      fetchDemandes();
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Erreur lors de la conversion en projet");
    } finally {
      setIsConverting(false);
    }
  };

  if (loading && !Object.values(data).some(col => col.length > 0)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-[10px] font-bold tracking-[0.3em] text-outline uppercase">Chargement de Signature 8...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden font-body antialiased">
      
      {/* Breadcrumbs */}
      <nav className="px-8 py-4">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-on-secondary-container opacity-60">
          <span>Accueil</span>
          <ChevronRight size={14} className="opacity-40" />
          <span className="text-primary opacity-100 italic">Vue d&apos;ensemble</span>
        </div>
      </nav>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto p-8 pt-0 flex gap-6 no-scrollbar">
          
          {columnsList.map((column) => (
            <div key={column.id} className="min-w-[300px] flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[11px] font-bold tracking-[0.25em] text-on-surface flex items-center gap-3 uppercase italic">
                  {column.title}
                  <span className="w-6 h-6 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center text-[10px] text-on-secondary-container font-black shadow-inner">
                    {data[column.id]?.length || 0}
                  </span>
                </h3>
                {column.id === "nouveau" && (
                  <button 
                    onClick={() => {
                      setSelectedDemande(null);
                      setIsEditMode(false);
                      setIsModalOpen(true);
                    }}
                    className="text-outline-variant hover:text-primary transition-all hover:rotate-90"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 flex flex-col gap-3 min-h-[500px] transition-all duration-500 rounded-[1.5rem] p-4 bg-white border border-outline-variant/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]",
                      snapshot.isDraggingOver && "bg-gray-50/80 border-primary/20"
                    )}
                  >
                    <AnimatePresence mode="popLayout">
                      {data[column.id]?.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "mb-3 outline-none",
                                snapshot.isDragging && "z-50"
                              )}
                            >
                              <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onMouseDown={(e) => {
                                  (e.currentTarget as any)._clickStartX = e.clientX;
                                  (e.currentTarget as any)._clickStartY = e.clientY;
                                }}
                                onMouseUp={(e) => {
                                  // Stop if clicked on a button or menu
                                  const target = e.target as HTMLElement;
                                  if (
                                    target.closest('button') || 
                                    target.closest('a') || 
                                    target.closest('[role="menuitem"]') ||
                                    target.closest('[data-radix-collection-item]')
                                  ) {
                                    return;
                                  }

                                  const startX = (e.currentTarget as any)._clickStartX;
                                  const startY = (e.currentTarget as any)._clickStartY;
                                  const diff = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
                                  if (diff < 5) {
                                    handleCardClick(card);
                                  }
                                }}
                                  className={cn(
                                    "p-5 bg-white rounded-2xl group relative overflow-hidden transition-all duration-500 border border-outline-variant/10",
                                    snapshot.isDragging ? "shadow-2xl ring-2 ring-primary/20 scale-105 cursor-grabbing" : "shadow-[0_10px_30px_rgba(0,0,0,0.03)] cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 active:scale-[0.98]",
                                  card.is_premium && "border-l-4 border-primary",
                                  column.id === "converti" && "grayscale opacity-80"
                                )}
                              >
                                {snapshot.isDragging && (
                                  <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10" />
                                )}

                                <div className="flex justify-between items-start mb-6">
                                  {column.id === "converti" ? (
                                    <div className="flex items-center gap-2">
                                      <CheckCircle size={14} className="text-primary" fill="currentColor" />
                                      <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">DEMANDE CONVERTIE</span>
                                    </div>
                                  ) : (
                                    <span className={cn("px-2.5 py-1 text-[9px] font-bold tracking-widest rounded-lg uppercase antialiased shadow-sm", card.sourceColor)}>
                                      {card.source}
                                    </span>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger
                                      className="text-primary/20 hover:text-primary transition-all p-2 rounded-xl group-hover:bg-primary/5 focus:outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/20"
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onMouseUp={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal size={20} className="transition-transform group-hover:scale-110" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-outline-variant/10">
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditDemande(card);
                                        }}
                                        className="flex items-center gap-3 p-4 rounded-xl text-[11px] font-bold tracking-widest text-on-surface hover:bg-gray-50 transition-colors cursor-pointer uppercase"
                                      >
                                        <Edit2 size={16} className="text-primary opacity-60" />
                                        Modifier la demande
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          confirmDelete(card);
                                        }}
                                        className="flex items-center gap-3 p-4 rounded-xl text-[11px] font-bold tracking-widest text-error hover:bg-error/5 transition-colors cursor-pointer uppercase"
                                      >
                                        <Trash2 size={16} />
                                        Supprimer définitivement
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <h4 className="font-display text-lg mb-1 text-on-surface italic font-light tracking-tight">{card.nom_complet}</h4>
                                <p className="text-[9px] text-on-secondary-container/50 mb-4 font-bold tracking-widest uppercase">{card.type_projet}</p>
                                
                                <div className="space-y-3">
                                  {card.telephone && (
                                    <div className="flex items-center gap-3 text-[11px] text-outline font-medium tracking-tight">
                                      <Phone size={14} className="opacity-40" />
                                      {card.telephone}
                                    </div>
                                  )}
                                  {card.cree_le && (
                                    <div className="flex items-center gap-2 text-[10px] text-outline font-medium tracking-tight">
                                      <Calendar size={12} className="opacity-40" />
                                      {new Date(card.cree_le).toLocaleDateString('fr-FR')}
                                    </div>
                                  )}
                                  {card.description && (
                                    <div className="flex items-center gap-2 text-[9px] text-primary font-bold tracking-[0.1em] bg-white p-2 rounded-xl border border-primary/20 uppercase shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
                                      <History size={14} className="opacity-60" />
                                      Détails dispos
                                    </div>
                                  )}
                                </div>
                                
                                {column.id === "qualifie" && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConvertirEnProjet(card);
                                    }}
                                    disabled={isConverting}
                                    className="w-full mt-4 py-3 bg-[#745B23] text-white text-[9px] font-bold tracking-[0.2em] rounded-xl hover:opacity-90 transition-all uppercase antialiased shadow-lg shadow-[#745B23]/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                  >
                                    {isConverting ? (
                                      <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                      "CONVERTIR EN PROJET"
                                    )}
                                  </button>
                                )}
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1, translateY: -4 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setSelectedDemande(null);
          setIsEditMode(false);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-[0_15px_40px_rgba(117,90,35,0.3)] flex items-center justify-center group z-50 overflow-hidden"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-700" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.button>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-outline-variant/10 overflow-hidden"
            >
              <div className="p-10 text-center space-y-8">
                <div className="w-20 h-20 bg-error/5 text-error rounded-full flex items-center justify-center mx-auto animate-pulse shadow-inner">
                  <Trash2 size={36} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-error tracking-[0.3em] uppercase antialiased">Action Irréversible</span>
                  <h4 className="font-display text-3xl italic font-light">Supprimer cette <span className="not-italic opacity-40">Demande</span> ?</h4>
                  <p className="text-xs text-on-secondary-container/60 leading-relaxed px-6">
                    L&apos;intégralité des informations de <span className="font-bold text-on-surface">"{requestToDelete?.nom_complet}"</span> sera définitivement effacée.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    disabled={isDeleting}
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="flex-1 py-4 border border-outline-variant/20 text-on-surface/60 text-[10px] font-bold tracking-[0.2em] hover:bg-gray-50 rounded-2xl uppercase transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    disabled={isDeleting}
                    onClick={handleDeleteRequest}
                    className="flex-1 py-5 px-6 rounded-2xl text-[10px] font-bold tracking-[0.2em] bg-[#BC2C1A] text-white shadow-2xl shadow-[#BC2C1A]/30 hover:bg-[#A12314] transition-all uppercase flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="animate-spin" size={14} /> : "Confirmer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CreateDemandeModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedDemande(null);
        }}
        onSuccess={fetchDemandes}
        initialData={selectedDemande}
        isEditMode={isEditMode}
      />

      <DemandeDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleEditDemande}
        onDelete={confirmDelete}
        demande={selectedDemande}
      />
    </div>
  );
}
