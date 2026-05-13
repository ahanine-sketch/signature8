"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Project {
  id: string;
  titre: string;
  description: string;
  image_url: string;
  type: string;
  is_avant_apres: boolean;
  image_avant_url?: string;
  image_apres_url?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "f1",
    titre: "Penthouse Haussmannien",
    description: "Rénovation complète d'un appartement de 250m² avec conservation des moulures d'époque et intégration de domotique invisible.",
    image_url: "/hero_luxury_interior_1778672376658.png",
    type: "Résidentiel",
    is_avant_apres: false
  },
  {
    id: "f2",
    titre: "Transformation Loft",
    description: "Ancien atelier d'artiste transformé en espace de vie contemporain. Focus sur la lumière naturelle et les matériaux bruts.",
    image_url: "/image.png",
    type: "Résidentiel",
    is_avant_apres: true,
    image_avant_url: "/step1_immersion_1778672408926.png",
    image_apres_url: "/step2_esquisse_1778672431118.png"
  },
  {
    id: "f3",
    titre: "Boutique Concept",
    description: "Design d'une boutique de luxe. Minimalisme et élégance pour mettre en valeur des pièces d'exception.",
    image_url: "/step3_technique_1778672453617.png",
    type: "Commercial",
    is_avant_apres: false
  },
  {
    id: "f4",
    titre: "Villa Contemporaine",
    description: "Architecture d'intérieur pour une villa neuve. Fluidité des espaces et dialogue avec l'extérieur.",
    image_url: "/step4_chantier_1778672476341.png",
    type: "Résidentiel",
    is_avant_apres: false
  }
];

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await api.get("/public/portfolio");
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return null;

  const displayProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;
  
  // Separate the featured before/after project if it exists
  const beforeAfterProject = displayProjects.find(p => p.is_avant_apres);
  const otherProjects = displayProjects.filter(p => !p.is_avant_apres);

  return (
    <section className="bg-surface-container py-32 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="editorial-label text-primary mb-4">PORTFOLIO</h2>
            <h3 className="font-display text-4xl lg:text-5xl text-on-surface font-light">Réalisations <span className="italic">Récentes</span></h3>
          </motion.div>
          <motion.a 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="editorial-label text-[0.65rem] text-on-surface border-b border-on-surface pb-1 hidden md:block hover:text-primary hover:border-primary transition-all" 
            href="/portfolio"
          >
            VOIR TOUS LES PROJETS
          </motion.a>
        </div>

        {/* Asymmetrical 12-Column Grid with Horizontal Scroll on Mobile */}
        <div className="relative">
          <motion.div 
            drag="x"
            dragConstraints={{ right: 0, left: -200 }} // Will adjust based on content if needed, for now using CSS scroll
            className="flex md:grid md:grid-cols-12 gap-8 lg:gap-12 overflow-x-auto pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory touch-pan-x"
          >
            
            {/* Main Large Feature */}
            {otherProjects[0] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="min-w-[85vw] md:min-w-0 md:col-span-7 aspect-[16/10] bg-surface-dim rounded-2xl overflow-hidden relative group snap-center"
              >
                <Image 
                  src={otherProjects[0].image_url}
                  alt={otherProjects[0].titre}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 px-8 py-3.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                    <span className="editorial-label text-[0.65rem] text-on-surface tracking-[0.2em] font-bold">{(otherProjects[0].titre || "Projet").toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Focus: Before/After Card */}
            {beforeAfterProject && (
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="min-w-[85vw] md:min-w-0 md:col-span-5 flex flex-col justify-center snap-center"
              >
                <div className="bg-white p-10 lg:p-12 rounded-3xl shadow-ambient border border-primary/5 h-full">
                  <p className="editorial-label text-primary mb-8 tracking-[0.25em]">FOCUS : AVANT / APRÈS</p>
                  <div className="flex gap-4 mb-8">
                    <div className="w-1/2 aspect-square rounded-2xl overflow-hidden grayscale brightness-75 transition-all duration-700 hover:grayscale-0 hover:brightness-100">
                      <Image 
                        src={beforeAfterProject.image_avant_url || ""}
                        alt="Avant"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-1/2 aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-primary/10">
                      <Image 
                        src={beforeAfterProject.image_apres_url || ""}
                        alt="Après"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h4 className="font-display text-2xl lg:text-3xl mb-4 leading-snug">{beforeAfterProject.titre}</h4>
                  <p className="font-body text-foreground/50 text-sm antialiased font-light leading-relaxed">
                     {beforeAfterProject.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Square Grid Item */}
            {otherProjects[1] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="min-w-[85vw] md:min-w-0 md:col-span-4 aspect-square bg-surface-dim rounded-2xl overflow-hidden relative group snap-center"
              >
                <Image 
                  src={otherProjects[1].image_url}
                  alt={otherProjects[1].titre}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 px-8 py-3.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                    <span className="editorial-label text-[0.65rem] text-on-surface tracking-[0.2em] font-bold">{(otherProjects[1].titre || "Projet").toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wide Grid Item (21:9) */}
            {otherProjects[2] && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="min-w-[85vw] md:min-w-0 md:col-span-8 aspect-[21/9] bg-surface-dim rounded-2xl overflow-hidden relative group snap-center"
              >
                <Image 
                  src={otherProjects[2].image_url}
                  alt={otherProjects[2].titre}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                />
                <div className="absolute inset-0 bg-on-surface/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/90 px-8 py-3.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                    <span className="editorial-label text-[0.65rem] text-on-surface tracking-[0.2em] font-bold">{(otherProjects[2].titre || "Projet").toUpperCase()}</span>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
          
          {/* Visual indicator for "Glisse" on mobile */}
          <div className="flex md:hidden justify-center gap-2 mt-4">
            <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: 1 }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="w-full h-full bg-primary origin-left"
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
