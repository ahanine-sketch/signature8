"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Testimonial {
  id: string;
  auteur: string;
  projet: string;
  annee: number;
  message: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    auteur: "Sarah Montgomery",
    projet: "Appartement Saint-Germain",
    annee: 2023,
    message: "Un sens du détail inégalé. L'équipe a su transformer notre vision en une réalité dépassant toutes nos attentes."
  },
  {
    id: "t2",
    auteur: "Marc Lefebvre",
    projet: "Villa Horizon",
    annee: 2024,
    message: "Une gestion de projet impeccable du début à la fin. La fluidité des espaces créés est tout simplement remarquable."
  }
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const data = await api.get("/public/testimonials");
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  // Simple auto-rotate every 10s if multiple
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (loading) return null;

  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const current = displayTestimonials[currentIndex % displayTestimonials.length];

  return (
    <section className="bg-surface-dim/20 py-32 px-8 overflow-hidden min-h-[500px] flex items-center">
      <div className="max-w-7xl mx-auto relative w-full">
        <AnimatePresence mode="wait">
          <motion.div 
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <Quote 
              size={64} 
              className="text-primary/40 mb-10 fill-primary/10" 
              strokeWidth={1}
            />
            <p className="font-display text-3xl md:text-4xl lg:text-5xl max-w-4xl mb-12 italic leading-relaxed text-on-surface font-light antialiased">
              &ldquo;{current.message}&rdquo;
            </p>
            <div className="space-y-1">
              <p className="editorial-label text-on-surface tracking-[0.25em]">{(current.auteur || "Client Signature 8").toUpperCase()}</p>
              <p className="font-body text-[10px] text-foreground/40 uppercase tracking-[0.2em] mt-1 font-bold">
                {(current.projet || "Projet").toUpperCase()}, {current.annee || new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
