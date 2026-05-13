"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  ChevronRight,
  ChevronLeft,
  FileText,
  Download,
  Mail,
  Send,
  CheckCircle,
  Clock,
  FileSearch,
  FilePenLine,
  Trash2,
  RefreshCcw,
  Headphones,
  Eye,
  RotateCcw,
  X,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { devisApi, projectsApi } from "@/lib/api";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("TOUS");

  const [stats, setStats] = useState({
    totalActifs: 0,
    enAttente: 0,
    conversionRate: 0,
    totalMontantAttente: 0
  });

  // Form State
  const [formData, setFormData] = useState({
    projet_id: "",
    numero_devis: "",
    montant_ht: 0,
    montant_ttc: 0,
    statut: "brouillon",
    notes: ""
  });

  const fetchData = useCallback(async () => {
    try {
      const [quotesData, statsData, projectsData] = await Promise.all([
        devisApi.getAll(),
        devisApi.getStats(),
        projectsApi.getAll()
      ]);
      setQuotes(quotesData);
      setStats(statsData);
      setProjects(projectsData);
    } catch (err: any) {
      toast.error("Erreur lors du chargement des devis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtering Logic
  const filteredQuotes = useMemo(() => {
    return quotes.filter(quote => {
      const matchesSearch = 
        quote.numero_devis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.projets?.nom_projet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.projets?.clients?.nom_complet.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeFilter === "TOUS") return matchesSearch;
      if (activeFilter === "BROUILLONS") return matchesSearch && quote.statut === "brouillon";
      if (activeFilter === "EN ATTENTE") return matchesSearch && quote.statut === "envoye";
      if (activeFilter === "ACCEPTÉS") return matchesSearch && quote.statut === "accepte";
      
      return matchesSearch;
    });
  }, [quotes, searchQuery, activeFilter]);

  const handleAddMode = () => {
    setIsEditMode(false);
    setSelectedQuote(null);
    setFormData({
      projet_id: "",
      numero_devis: `DEV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      montant_ht: 0,
      montant_ttc: 0,
      statut: "brouillon",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const handleEditMode = (quote: any) => {
    setIsEditMode(true);
    setSelectedQuote(quote);
    setFormData({
      projet_id: quote.projet_id,
      numero_devis: quote.numero_devis,
      montant_ht: Number(quote.montant_ht),
      montant_ttc: Number(quote.montant_ttc),
      statut: quote.statut,
      notes: quote.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleViewMode = (quote: any) => {
    setSelectedQuote(quote);
    setIsViewModalOpen(true);
  };

  const handleDeleteConfirm = (quote: any) => {
    setSelectedQuote(quote);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!selectedQuote) return;
    setIsSubmitting(true);
    try {
      await devisApi.delete(selectedQuote.id);
      toast.success("Devis supprimé avec succès");
      setIsDeleteConfirmOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projet_id) {
      toast.error("Veuillez sélectionner un projet");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode && selectedQuote) {
        await devisApi.update(selectedQuote.id, formData);
        toast.success("Devis mis à jour");
      } else {
        await devisApi.create(formData);
        toast.success("Devis créé");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Erreur technique lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (quote: any) => {
    try {
      // Dynamic import to solve SSR issues with jsPDF/fflate in Turbopack
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF() as any;
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header Colors
      doc.setFillColor(184, 151, 90); // Signature Gold
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text("SIGNATURE 8", 15, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("SKETCH DESIGN STUDIO", 15, 32);
      
      // Quote Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("DEVIS", pageWidth - 15, 60, { align: 'right' });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`N° : ${quote.numero_devis}`, pageWidth - 15, 68, { align: 'right' });
      doc.text(`Date : ${new Date(quote.date_emission || quote.created_at).toLocaleDateString('fr-FR')}`, pageWidth - 15, 73, { align: 'right' });
      
      // Client & Company Info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("ÉMETTEUR :", 15, 85);
      doc.setFont("helvetica", "normal");
      doc.text("Signature 8", 15, 92);
      doc.text("Casablanca, Maroc", 15, 97);
      doc.text("Contact: +212 600-000000", 15, 102);
      
      doc.setFont("helvetica", "bold");
      doc.text("DESTINATAIRE :", 120, 85);
      doc.setFont("helvetica", "normal");
      doc.text(quote.projets?.clients?.nom_complet || "Client Non Spécifié", 120, 92);
      doc.text(`Projet: ${quote.projets?.nom_projet}`, 120, 97);
      
      // Safe number formatter — avoids locale non-breaking spaces that jsPDF renders as '/'
      const fmt = (n: number) =>
        Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

      // Line items — standalone call required with dynamic imports
      autoTable(doc, {
        startY: 120,
        head: [['Désignation', 'Quantité', 'P.U. HT (MAD)', 'Total HT (MAD)']],
        body: [
          [`Prestation Design — ${quote.projets?.nom_projet ?? 'Projet'}`, '1', `${fmt(Number(quote.montant_ht))} MAD`, `${fmt(Number(quote.montant_ht))} MAD`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [184, 151, 90], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 8 },
        margin: { left: 15, right: 15 }
      });
      
      // Totals
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "normal");
      doc.text("Total HT :", pageWidth - 70, finalY);
      doc.text(`${fmt(Number(quote.montant_ht))} MAD`, pageWidth - 15, finalY, { align: 'right' });
      
      doc.text("TVA (20 %) :", pageWidth - 70, finalY + 7);
      doc.text(`${fmt(Number(quote.montant_ht) * 0.2)} MAD`, pageWidth - 15, finalY + 7, { align: 'right' });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(184, 151, 90);
      doc.text("TOTAL TTC :", pageWidth - 70, finalY + 16);
      doc.text(`${fmt(Number(quote.montant_ttc))} MAD`, pageWidth - 15, finalY + 16, { align: 'right' });
      
      // Footer / Notes
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES :", 15, finalY + 40);
      doc.setFont("helvetica", "italic");
      doc.text(quote.notes || "Aucune clause particulière.", 15, finalY + 47, { maxWidth: 180 });
      
      // Payment Policy
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Conditions de règlement : 50% à la commande, solde à la livraison.", 15, 280);
      doc.text("Validité de l'offre : 30 jours à compter de la date d'émission.", pageWidth - 15, 280, { align: 'right' });
      
      doc.save(`DEVIS_${quote.numero_devis}.pdf`);
      toast.success("Document PDF généré avec succès");
    } catch (err) {
      console.error(err);
      toast.error("Échec du chargement du module PDF");
    }
  };

  const quoteStats = [
    { label: "DEVIS", value: `${stats.totalActifs} Actifs`, sub: "MOIS EN COURS", icon: FileText, variant: "primary" },
    { label: "ENVOYÉS", value: `${stats.enAttente} en attente`, sub: "RELANCES NÉCESSAIRES", icon: Send, variant: "secondary" },
    { label: "ACCEPTÉS", value: `${stats.conversionRate}% Conversion`, sub: "OBJECTIF TRIMESTRE", icon: CheckCircle, variant: "success" },
  ];

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'brouillon': return 'Brouillon';
      case 'envoye': return 'En Attente';
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      case 'expire': return 'Expiré';
      default: return statut;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-on-surface">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-on-surface">
      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6 pb-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[8px] font-bold tracking-[0.2em] text-on-secondary-container">
          <a className="hover:text-primary transition-colors opacity-60 uppercase" href="#">ACCUEIL</a>
          <ChevronRight size={10} className="opacity-30" />
          <span className="text-primary font-bold uppercase tracking-[0.2em]">GESTION DEVIS</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <h3 className="font-display text-2xl text-on-surface tracking-tight italic font-light">Gestion <span className="not-italic opacity-40">des Devis</span></h3>
            <p className="text-on-secondary-container max-w-md font-body text-xs italic opacity-60 leading-relaxed">
              Administrez vos propositions commerciales avec une précision artisanale.
            </p>
          </div>
          <div className="flex justify-end gap-4 pb-1">
            <div className="text-right group cursor-pointer">
              <p className="text-[8px] font-bold tracking-[0.2em] text-on-secondary-container mb-0.5 opacity-50 uppercase">TOTAL EN ATTENTE</p>
              <p className="font-display text-xl text-primary group-hover:scale-105 transition-transform origin-right">{stats.totalMontantAttente.toLocaleString()} <span className="text-[10px] font-body not-italic opacity-30">MAD</span></p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Bento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {quoteStats.map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -2 }}
              className="bg-white p-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-outline-variant/10 group overflow-hidden relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors duration-500",
                  stat.variant === 'primary' ? "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white" :
                  stat.variant === 'secondary' ? "bg-secondary/5 text-secondary group-hover:bg-secondary group-hover:text-white" :
                  "bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                )}>
                  <stat.icon size={18} strokeWidth={1.5} />
                </div>
                <span className={cn(
                  "text-[8px] font-bold px-2 py-0.5 rounded tracking-tighter uppercase font-label",
                  stat.variant === 'primary' ? "bg-primary/10 text-primary" :
                  stat.variant === 'secondary' ? "bg-secondary/10 text-secondary" :
                  "bg-green-100 text-green-700"
                )}>
                  {stat.label}
                </span>
              </div>
              <p className="text-lg font-display italic text-on-surface">{stat.value}</p>
              <p className="text-[8px] font-bold tracking-[0.15em] text-on-secondary-container mt-1.5 opacity-40 uppercase">{stat.sub}</p>
            </motion.div>
          ))}

          <motion.div 
            whileHover={{ y: -2 }}
            onClick={handleAddMode}
            className="bg-primary p-3.5 rounded-xl shadow-lg shadow-primary/10 group cursor-pointer relative overflow-hidden flex flex-col justify-center"
          >
            <div className="relative z-10 space-y-0.5">
              <Plus className="text-white/80 group-hover:rotate-90 transition-transform duration-500 mb-1" size={18} />
              <p className="text-[9px] font-bold tracking-[0.15em] text-white uppercase">NOUVEAU DEVIS</p>
              <p className="text-[8px] text-white/60 font-medium leading-tight opacity-80">Créer une proposition</p>
            </div>
            <div className="absolute -right-8 -bottom-8 bg-white/10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col xl:flex-row gap-3 items-center justify-between border-b border-outline-variant/10 pb-4">
          <div className="relative w-full xl:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-secondary-container/40 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-outline-variant/10 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-secondary-container/30 shadow-[0_5px_15px_rgba(0,0,0,0.01)]" 
              placeholder="Rechercher..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-1.5 w-full xl:w-auto overflow-x-auto no-scrollbar py-0.5">
            {["TOUS", "BROUILLONS", "EN ATTENTE", "ACCEPTÉS"].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3 py-1.5 text-[8px] font-bold tracking-[0.15em] rounded-lg transition-all whitespace-nowrap uppercase antialiased",
                  activeFilter === filter 
                  ? "bg-primary text-white shadow-md shadow-primary/10" 
                  : "bg-white border border-outline-variant/10 text-on-secondary-container/50 hover:text-primary hover:bg-gray-50 shadow-[0_5px_15px_rgba(0,0,0,0.01)]"
                )
              }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-outline-variant/10">
                <tr>
                  <th className="px-5 py-2.5 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container uppercase">N° DEVIS</th>
                  <th className="px-3 py-2.5 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container uppercase font-label">PROJET / CLIENT</th>
                  <th className="px-3 py-2.5 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container uppercase font-label">MONTANT TTC</th>
                  <th className="px-3 py-2.5 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container uppercase font-label">DATE</th>
                  <th className="px-3 py-2.5 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container uppercase text-center font-label">STATUT</th>
                  <th className="px-5 py-2.5 text-[8.5px] font-bold tracking-[0.2em] text-on-secondary-container uppercase text-right font-label">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-on-secondary-container opacity-40 text-[9px] italic tracking-widest uppercase">
                      {searchQuery ? "Aucun résultat." : "Aucun devis."}
                    </td>
                  </tr>
                ) : filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-all duration-300 group cursor-pointer border-b border-outline-variant/5 last:border-0">
                    <td className="px-5 py-2.5 text-[9.5px] font-bold tracking-[0.1em] text-primary">{quote.numero_devis}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-[10.5px] font-bold text-on-surface/80 tracking-tight">{quote.projets?.nom_projet}</span>
                        <span className="text-[8.5px] text-on-secondary-container opacity-50 italic">{quote.projets?.clients?.nom_complet}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-display text-lg tracking-tighter text-on-surface">
                        {Number(quote.montant_ttc).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[9.5px] font-medium text-on-secondary-container opacity-40 italic">
                      {new Date(quote.date_emission || quote.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={cn(
                        "inline-block px-2.5 py-0.5 rounded-full text-[7.5px] font-bold tracking-[0.15em] uppercase antialiased",
                        quote.statut === 'accepte' ? "bg-green-50 text-green-700 border border-green-100" :
                        quote.statut === 'envoye' ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        quote.statut === 'refuse' ? "bg-red-50 text-red-700 border border-red-100" :
                        quote.statut === 'expire' ? "bg-gray-50 text-on-background/40" :
                        "bg-gray-50 text-on-surface-variant font-medium"
                      )}>
                        {getStatusLabel(quote.statut)}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-0.5 opacity-20 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleViewMode(quote)}
                          className="p-1.5 hover:bg-white rounded-lg text-on-secondary-container hover:text-primary transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleEditMode(quote)}
                          className="p-1.5 hover:bg-white rounded-lg text-on-secondary-container hover:text-primary transition-all"
                        >
                          <FilePenLine size={14} />
                        </button>
                        <button 
                          onClick={() => handleDownload(quote)}
                          className="p-1.5 hover:bg-white rounded-lg text-on-secondary-container hover:text-primary transition-all"
                        >
                          <Download size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteConfirm(quote)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-on-secondary-container hover:text-red-600 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-white border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-[8px] font-bold tracking-widest text-on-secondary-container/40 uppercase">
              {filteredQuotes.length} RÉSULTATS
            </p>
          </div>
        </div>

        {/* Contextual Footer Section */}
        <div className="pt-6 border-t border-outline-variant/10 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-white p-4 rounded-xl relative overflow-hidden group cursor-pointer border border-outline-variant/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
          >
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-3">
                <h4 className="font-display text-xl text-primary italic">Automatisation <span className="not-italic opacity-40">des relances</span></h4>
              </div>
              <p className="text-[10px] font-body text-on-surface-variant/70 italic leading-relaxed max-w-sm">
                Configurez des rappels automatiques pour vos devis.
              </p>
            </div>
            <RotateCcw className="absolute -bottom-8 -right-8 text-[100px] text-primary/5 select-none opacity-20 group-hover:rotate-45 transition-transform duration-1000" size={100} />
          </motion.div>

          <div className="flex flex-col justify-center gap-6 pl-4">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white border border-outline-variant/20 flex items-center justify-center shadow-sm group-hover:rotate-3 transition-transform">
                <Headphones className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface uppercase tracking-widest mb-0.5">Besoin d&apos;aide ?</p>
                <p className="text-[10px] text-on-secondary-container opacity-60 font-medium italic">Notre support commercial est disponible de 9h à 18h pour toute proposition complexe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-outline-variant/10"
            >
              <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-display text-xl text-on-surface italic">{isEditMode ? "Modifier" : "Nouveau"} <span className="not-italic opacity-40">Devis</span></h3>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-on-secondary-container opacity-50 uppercase mt-0.5">Configuration commerciale</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-dim transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-on-surface/50 uppercase ml-1">Numéro Devis</label>
                    <input 
                      type="text"
                      readOnly
                      value={formData.numero_devis}
                      className="w-full px-3 py-2 bg-white border border-outline-variant/20 shadow-sm rounded-xl text-[10px] font-bold tracking-widest text-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-on-surface/50 uppercase ml-1">Projet Associé</label>
                    <select 
                      required
                      disabled={isEditMode}
                      value={formData.projet_id}
                      onChange={(e) => setFormData({...formData, projet_id: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-outline-variant/20 shadow-sm rounded-xl text-[10px] font-bold tracking-widest text-on-surface focus:ring-1 focus:ring-primary/20 transition-all appearance-none disabled:opacity-50"
                    >
                      <option value="">Sélectionner un projet</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.nom_projet}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-on-surface/50 uppercase ml-1">Montant HT (MAD)</label>
                    <input 
                      type="number"
                      required
                      value={formData.montant_ht}
                      onChange={(e) => {
                        const ht = Number(e.target.value);
                        setFormData({...formData, montant_ht: ht, montant_ttc: ht * 1.2});
                      }}
                      className="w-full px-3 py-2 bg-white border border-outline-variant/20 shadow-sm rounded-xl text-[10px] font-bold tracking-widest text-on-surface focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-[0.2em] text-on-surface/50 uppercase ml-1">Montant TTC (MAD)</label>
                    <input 
                      type="number"
                      required
                      value={formData.montant_ttc}
                      onChange={(e) => setFormData({...formData, montant_ttc: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-white border border-outline-variant/20 shadow-sm rounded-xl text-[10px] font-bold tracking-widest text-on-surface focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-on-surface/50 uppercase ml-1">Statut Commercial</label>
                  <select 
                    required
                    value={formData.statut}
                    onChange={(e) => setFormData({...formData, statut: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-outline-variant/20 shadow-sm rounded-xl text-[10px] font-bold tracking-widest text-on-surface focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="envoye">En Attente</option>
                    <option value="accepte">Accepté</option>
                    <option value="refuse">Refusé</option>
                    <option value="expire">Expiré</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-[0.2em] text-on-surface/50 uppercase ml-1">Notes Internes</label>
                  <textarea 
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-outline-variant/20 shadow-sm rounded-xl text-[10px] font-medium text-on-surface focus:ring-1 focus:ring-primary/20 transition-all resize-none italic"
                    placeholder="Détails additionnels sur cette offre..."
                  />
                </div>

                <div className="pt-1 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-outline-variant/30 text-on-surface/50 text-[10px] font-bold tracking-[0.2em] hover:bg-gray-50 transition-all uppercase"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-xl bg-primary text-white text-[10px] font-bold tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 transition-all uppercase shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : (isEditMode ? "Mettre à jour" : "Confirmer & Créer")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-on-surface">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-outline-variant/10"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold tracking-[0.3em] text-primary uppercase block mb-1">RÉCAPITULATIF DEVIS</span>
                    <h3 className="font-display text-2xl italic text-on-surface">{selectedQuote.numero_devis}</h3>
                  </div>
                  <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">PROJET</p>
                    <p className="font-bold text-sm">{selectedQuote.projets?.nom_projet}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">CLIENT</p>
                    <p className="font-bold text-sm italic text-gray-700">{selectedQuote.projets?.clients?.nom_complet}</p>
                  </div>
                  <div className="space-y-0.5 text-primary">
                    <p className="text-[8px] font-bold tracking-widest opacity-50 uppercase">MONTANT TTC</p>
                    <p className="font-display text-lg">{Number(selectedQuote.montant_ttc).toLocaleString()} <span className="text-[10px] font-body">MAD</span></p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold tracking-widest text-gray-400 uppercase">STATUT</p>
                    <p className="font-bold text-sm uppercase tracking-widest">{getStatusLabel(selectedQuote.statut)}</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl italic text-xs text-gray-600 border border-outline-variant/20 shadow-sm">
                  {selectedQuote.notes || "Aucune note additionnelle pour ce devis."}
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => { setIsViewModalOpen(false); handleEditMode(selectedQuote); }}
                    className="flex-1 py-2.5 bg-gray-100 text-[9px] font-bold tracking-widest rounded-xl uppercase hover:bg-gray-200 transition-all"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDownload(selectedQuote)}
                    className="flex-1 py-2.5 bg-primary text-white text-[9px] font-bold tracking-widest rounded-xl uppercase shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Télécharger PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && selectedQuote && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-[#12110F]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-8 text-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-outline-variant/10"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={24} />
              </div>
              
              <h4 className="font-headline text-xl mb-3 italic text-on-surface">Supprimer Devis ?</h4>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed font-body">
                Cette action est irréversible. Le devis <span className="font-bold text-black italic">{selectedQuote.numero_devis}</span> sera définitivement retiré des registres.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteExecute}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-red-500 text-white rounded-xl text-[10px] font-bold tracking-[0.2em] hover:bg-red-600 transition-all uppercase flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : "Confirmer la Suppression"}
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-bold tracking-[0.2em] hover:bg-gray-200 transition-all uppercase"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
