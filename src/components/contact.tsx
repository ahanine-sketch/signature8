"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function Contact() {
  const [formData, setFormData] = useState({
    nom_complet: "",
    email: "",
    telephone: "",
    type_projet: "Résidentiel Privé",
    budget_estime: "50k - 100k MAD",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/public/contact", formData);
      toast.success("Demande envoyée avec succès. Notre équipe vous contactera sous peu.");
      setFormData({
        nom_complet: "",
        email: "",
        telephone: "",
        type_projet: "Résidentiel Privé",
        budget_estime: "50k - 100k MAD",
        message: ""
      });
    } catch (error) {
      console.error("Failed to send contact demand", error);
      toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <section className="py-32 px-8 max-w-7xl mx-auto" id="contact">
      <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-sm border border-outline-variant/10">
        
        {/* Left: Info Panel */}
        <div className="lg:w-1/2 p-12 lg:p-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero.png')] opacity-10 mix-blend-overlay grayscale" />
          <div className="relative z-10">
            <h2 className="editorial-label text-white/60 mb-8 tracking-[0.3em]">NOUS CONTACTER</h2>
            <h3 className="font-display text-5xl lg:text-6xl mb-12 leading-tight font-light">Commençons votre <span className="italic">projet</span> aujourd&apos;hui</h3>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="editorial-label text-sm tracking-[0.2em]">+212 5 61 81 52 99</p>
              </div>
              
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="editorial-label text-sm tracking-[0.2em]">contact@signature8.design</p>
              </div>
              
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <MapPin size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="editorial-label text-sm tracking-[0.2em]">Lisasfa , Casablanca, Maroc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="lg:w-1/2 p-12 lg:p-20 bg-background/50">
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="space-y-3">
                <label className="editorial-label text-[0.65rem] text-foreground/40 tracking-[0.25em]">NOM COMPLET</label>
                <input 
                  id="nom_complet"
                  value={formData.nom_complet}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 transition-all duration-500 font-body placeholder:text-foreground/20" 
                  placeholder="Jean Dupont" 
                  type="text"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="editorial-label text-[0.65rem] text-foreground/40 tracking-[0.25em]">EMAIL</label>
                <input 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 transition-all duration-500 font-body placeholder:text-foreground/20" 
                  placeholder="jean@exemple.fr" 
                  type="email"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="editorial-label text-[0.65rem] text-foreground/40 tracking-[0.25em]">TÉLÉPHONE</label>
                <input 
                  id="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 transition-all duration-500 font-body placeholder:text-foreground/20" 
                  placeholder="+212 600 000 000" 
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="editorial-label text-[0.65rem] text-foreground/40 tracking-[0.25em]">TYPE DE PROJET</label>
                <select 
                  id="type_projet"
                  value={formData.type_projet}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 transition-all duration-500 font-body appearance-none cursor-pointer"
                >
                  <option>Résidentiel Privé</option>
                  <option>Espace Commercial</option>
                  <option>Hôtellerie</option>
                  <option>Bureaux</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="editorial-label text-[0.65rem] text-foreground/40 tracking-[0.25em]">BUDGET ESTIMÉ</label>
                <select 
                  id="budget_estime"
                  value={formData.budget_estime}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-2 transition-all duration-500 font-body appearance-none cursor-pointer"
                >
                  <option>50k - 100k MAD</option>
                  <option>100k - 250k MAD</option>
                  <option>250k - 500k MAD</option>
                  <option>500k MAD +</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="editorial-label text-[0.65rem] text-foreground/40 tracking-[0.25em]">MESSAGE</label>
              <textarea 
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-outline-variant focus:border-primary outline-none py-3 transition-all duration-500 font-body placeholder:text-foreground/20 resize-none h-32" 
                placeholder="Parlez-nous de vos envies..." 
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-6 rounded-2xl editorial-label tracking-[0.3em] hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {isSubmitting ? "ENVOI EN COURS..." : "ENVOYER LA DEMANDE"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
