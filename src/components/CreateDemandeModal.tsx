"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { requestsApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateDemandeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  isEditMode?: boolean;
}

export default function CreateDemandeModal({ isOpen, onClose, onSuccess, initialData, isEditMode = false }: CreateDemandeModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom_complet: initialData?.nom_complet || "",
    email: initialData?.email || "",
    telephone: initialData?.telephone || "",
    type_projet: initialData?.type_projet || "residentiel",
    source: initialData?.source || "formulaire_site",
    description: initialData?.description || ""
  });

  // Sync state with initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nom_complet: initialData.nom_complet || "",
        email: initialData.email || "",
        telephone: initialData.telephone || "",
        type_projet: initialData.type_projet || "residentiel",
        source: initialData.source || "formulaire_site",
        description: initialData.description || ""
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && initialData?.id) {
        await requestsApi.update(initialData.id, formData);
        toast.success("Demande mise à jour avec succès");
      } else {
        await requestsApi.create(formData);
        toast.success("Demande créée avec succès");
      }
      onSuccess();
      onClose();
      setFormData({
        nom_complet: "",
        email: "",
        telephone: "",
        type_projet: "residentiel",
        source: "formulaire_site",
        description: ""
      });
    } catch (error) {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden"
          >
            <div className="p-12">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="font-display text-4xl italic font-light text-on-surface">
                    {isEditMode ? "Modifier" : "Nouvelle"}{" "}
                    <span className="not-italic opacity-40">Demande</span>
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase mt-3">
                    {isEditMode ? "MISE À JOUR DES INFORMATIONS" : "SAISIE MANUELLE D'UN NOUVEAU LEAD"}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-4 hover:bg-gray-50 rounded-2xl transition-all text-outline-variant border border-outline-variant/5 shadow-sm active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase px-1 italic">Nom Complet</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white border border-outline-variant/10 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:opacity-20 shadow-[0_5px_15px_rgba(0,0,0,0.02)]"
                      placeholder="M. Ahmed Alaoui"
                      value={formData.nom_complet}
                      onChange={(e) => setFormData({...formData, nom_complet: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase px-1 italic">Email</label>
                    <input
                      type="email"
                      className="w-full bg-white border border-outline-variant/10 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:opacity-20 shadow-[0_5px_15px_rgba(0,0,0,0.02)]"
                      placeholder="contact@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase px-1 italic">Téléphone</label>
                    <input
                      type="tel"
                      className="w-full bg-white border border-outline-variant/10 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:opacity-20 shadow-[0_5px_15px_rgba(0,0,0,0.02)]"
                      placeholder="+212 6..."
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase px-1 italic">Type de Projet</label>
                    <div className="relative">
                      <select
                        className="w-full bg-white border border-outline-variant/10 rounded-2xl px-6 py-5 text-[11px] font-bold tracking-[0.1em] uppercase focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all appearance-none shadow-[0_5px_15px_rgba(0,0,0,0.02)]"
                        value={formData.type_projet}
                        onChange={(e) => setFormData({...formData, type_projet: e.target.value})}
                      >
                        <option value="residentiel">RÉSIDENTIEL</option>
                        <option value="commercial">COMMERCIAL</option>
                        <option value="professionnel">PROFESSIONNEL</option>
                        <option value="autre">AUTRE</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                        <Loader2 size={12} className="rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.2em] text-on-secondary-container/40 uppercase px-1 italic">Description du besoin</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white border border-outline-variant/10 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:opacity-20 resize-none shadow-[0_5px_15px_rgba(0,0,0,0.02)]"
                    placeholder="Décrivez les besoins spécifiques du client..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-primary text-white text-[11px] font-bold tracking-[0.4em] rounded-2xl hover:bg-primary/90 transition-all uppercase flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 disabled:opacity-50 mt-4 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {isEditMode ? "METTRE À JOUR LA DEMANDE" : "ENREGISTRER LA DEMANDE"}
                      <Send size={16} className="opacity-60" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
