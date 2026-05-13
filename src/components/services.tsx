"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Service {
  id: string;
  titre: string;
  description: string;
  image_url: string;
  ordre: number;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "s1",
    titre: "Conception Architecturale",
    description: "Nous créons des espaces qui allient esthétique et fonctionnalité, en respectant l'âme de chaque lieu.",
    image_url: "/step1_immersion_1778672408926.png",
    ordre: 1
  },
  {
    id: "s2",
    titre: "Design d'Intérieur",
    description: "Une curation méticuleuse des matériaux, des couleurs et du mobilier pour une atmosphère unique.",
    image_url: "/step2_esquisse_1778672431118.png",
    ordre: 2
  },
  {
    id: "s3",
    titre: "Suivi de Chantier",
    description: "Nous orchestrons chaque étape de la réalisation pour garantir une exécution parfaite et sans stress.",
    image_url: "/step3_technique_1778672453617.png",
    ordre: 3
  }
];

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await api.get("/public/services");
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) return null; 

  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <section className="py-32 px-8 max-w-7xl mx-auto">
      
      {/* Centered Header */}
      <div className="text-center mb-24">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="editorial-label text-primary mb-4"
        >
          NOS SERVICES
        </motion.h2>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl lg:text-5xl lg:text-6xl text-on-surface font-light"
        >
          L&apos;Art de <span className="italic">Concevoir</span>
        </motion.h3>
      </div>

      <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
        {displayServices.map((service, index) => (
          <motion.div
            key={service.titre}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={cn("group flex flex-col", index === 1 ? "md:mt-24" : "")}
          >
            {/* Image Container */}
            <div className="aspect-square bg-surface-low rounded-2xl overflow-hidden mb-10 shadow-lg relative">
              <Image 
                src={service.image_url}
                alt={service.titre}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>

            {/* Content Area */}
            <div className="space-y-4">
               <p className="editorial-label text-primary text-[0.65rem] tracking-[0.2em]">ÉTAPE 0{index + 1}</p>
               <h4 className="font-display text-3xl lg:text-4xl text-on-surface font-light group-hover:text-primary transition-colors duration-500">{service.titre}</h4>
               <p className="font-body text-foreground/50 text-base leading-relaxed antialiased font-light max-w-sm">
                  {service.description}
               </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
