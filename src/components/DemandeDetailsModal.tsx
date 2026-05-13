"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Phone, 
  Tag, 
  Calendar, 
  Info,
  CreditCard,
  MessageSquare,
  Globe,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DemandeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (demande: any) => void;
  onDelete: (demande: any) => void;
  demande: any | null;
}

const statusMap: Record<string, { label: string; color: string }> = {
  nouveau: { label: "NOUVELLE", color: "text-primary bg-primary/10" },
  contacte: { label: "CONTACTÉ", color: "text-blue-600 bg-blue-50" },
  qualifie: { label: "QUALIFIÉ", color: "text-amber-700 bg-amber-50" },
  converti: { label: "CONVERTI", color: "text-emerald-700 bg-emerald-50" },
};

export default function DemandeDetailsModal({ isOpen, onClose, onEdit, onDelete, demande }: DemandeDetailsModalProps) {
  if (!demande) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden font-body"
          >
            {/* Header Area */}
            <div className="p-12 pb-6 flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-4 py-1.5 text-[9px] font-black tracking-[0.25em] rounded-full uppercase antialiased shadow-sm",
                    statusMap[demande.statut]?.color || "bg-gray-100 text-gray-500"
                  )}>
                    {statusMap[demande.statut]?.label || demande.statut}
                  </span>
                  <span className="text-[10px] text-outline/30 font-bold tracking-[0.2em] uppercase italic">
                    ID: {demande.id.slice(0, 8)}
                  </span>
                </div>
                <h2 className="font-display text-5xl italic font-light text-on-surface tracking-tight leading-tight">
                  {demande.nom_complet}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-4 hover:bg-gray-50 rounded-2xl transition-all text-outline-variant border border-outline-variant/5 shadow-sm active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-12 pb-12 pt-6 grid grid-cols-2 gap-12">
              {/* Left Column: Contact & Core Info */}
              <div className="space-y-10">
                <section className="space-y-6">
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase italic opacity-60">CONTACT DETAILS</h3>
                  <div className="space-y-5">
                    <div className="flex items-center gap-5 text-sm text-on-surface/70 group">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-primary/5 transition-all border border-outline-variant/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
                        <Mail size={18} className="text-primary/60" />
                      </div>
                      <span className="font-medium tracking-tight">{demande.email}</span>
                    </div>
                    {demande.telephone && (
                      <div className="flex items-center gap-5 text-sm text-on-surface/70 group">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-primary/5 transition-all border border-outline-variant/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
                          <Phone size={18} className="text-primary/60" />
                        </div>
                        <span className="font-medium tracking-tight">{demande.telephone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-5 text-sm text-on-surface/70 group">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-primary/5 transition-all border border-outline-variant/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
                        <Calendar size={18} className="text-primary/60" />
                      </div>
                      <span className="font-medium tracking-tight italic opacity-60">Soumis le {new Date(demande.cree_le).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase italic opacity-60">PROJECT CONFIGURATION</h3>
                  <div className="space-y-5">
                    <div className="flex items-center gap-5 text-sm text-on-surface/70 group">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-primary/5 transition-all border border-outline-variant/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
                        <Tag size={18} className="text-primary/60" />
                      </div>
                      <span className="font-bold tracking-widest uppercase text-[11px] antialiased">{demande.type_projet}</span>
                    </div>
                    {demande.budget_estime && (
                      <div className="flex items-center gap-5 text-sm text-on-surface/70 group">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-primary/5 transition-all border border-outline-variant/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
                          <CreditCard size={18} className="text-primary/60" />
                        </div>
                        <span className="font-bold text-primary tracking-widest text-[11px] antialiased">
                          {demande.budget_estime.toLocaleString('fr-FR')} MAD
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-5 text-sm text-on-surface/70 group">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-primary/5 transition-all border border-outline-variant/10 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
                        <Globe size={18} className="text-primary/60" />
                      </div>
                      <span className="font-bold uppercase tracking-[0.2em] text-[9px] opacity-40">Provenance: {demande.source}</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Description */}
              <div className="relative flex flex-col">
                <div className="absolute inset-0 bg-gray-50/50 rounded-[2.5rem] pointer-events-none border border-outline-variant/5 shadow-inner" />
                <div className="relative p-10 h-full flex flex-col gap-8">
                  <h3 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase flex items-center gap-4 italic opacity-60">
                    <MessageSquare size={16} />
                    MESSAGE & NOTES
                  </h3>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <p className="text-base leading-relaxed text-on-surface/60 font-medium italic">
                      &ldquo;{demande.description || "Aucune description fournie par le client."}&rdquo;
                    </p>
                  </div>
                  
                  {demande.statut === 'converti' && (
                    <div className="mt-auto pt-8">
                      <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 text-emerald-800 text-[10px] font-black tracking-[0.2em] uppercase antialiased shadow-sm">
                        <Info size={18} />
                        Demande archivée en projet
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-12 py-10 bg-white border-t border-outline-variant/10 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => onDelete(demande)}
                className="flex items-center gap-3 px-8 py-5 text-[10px] font-bold tracking-[0.3em] text-error hover:bg-error/5 rounded-2xl transition-all uppercase antialiased"
              >
                <Trash2 size={16} className="opacity-60" />
                Supprimer
              </button>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={onClose}
                  className="px-8 py-5 text-[11px] font-bold tracking-[0.3em] text-outline/40 uppercase hover:text-on-surface transition-all active:scale-95 italic"
                >
                  FERMER
                </button>
                {demande.statut !== 'converti' && (
                  <button 
                    onClick={() => onEdit(demande)}
                    className="px-12 py-5 bg-primary text-white text-[11px] font-black tracking-[0.3em] rounded-2xl hover:bg-primary/90 transition-all shadow-[0_15px_35px_rgba(117,90,35,0.25)] uppercase antialiased active:scale-[0.98]"
                  >
                    ÉDITER LA FICHE
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
