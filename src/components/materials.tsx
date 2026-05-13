"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    id: "01",
    title: "ÉCOUTE DU BESOIN",
    desc: "Analyse de votre projet, de vos attentes, de vos contraintes et de votre budget.",
    image: "/step1_immersion_1778672408926.png"
  },
  {
    id: "02",
    title: "CONCEPT & DESIGN",
    desc: "Premières propositions de volumétries et sélection des planches d&apos;ambiance.",
    image: "/step2_esquisse_1778672431118.png"
  },
  {
    id: "03",
    title: "Développement Technique",
    desc: "Établissement des plans d&apos;exécution et descriptifs par corps d&apos;état.",
    image: "/step3_technique_1778672453617.png"
  },
  {
    id: "04",
    title: "Pilotage de Chantier",
    desc: "Suivi hebdomadaire rigoureux pour le respect des délais et de la qualité.",
    image: "/step4_chantier_1778672476341.png"
  },
  {
    id: "05",
    title: "Stylisme & Livraison",
    desc: "Installation du mobilier, de l&apos;art et remise des clés en main propre.",
    image: "/step5_livraison_1778672504390.png"
  }
];

export function Materials() {
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto border-t border-outline-variant/10">
      <div className="flex flex-col md:flex-row gap-20 lg:gap-32">
        
        {/* Left Side Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:w-1/3"
        >
          <h2 className="editorial-label text-primary mb-6">MÉTHODOLOGIE</h2>
          <h3 className="font-display text-5xl lg:text-6xl mb-8 leading-tight text-on-surface font-light">Un Voyage <br /><span className="italic">en 5 Étapes</span></h3>
          <p className="font-body text-foreground/50 text-base leading-relaxed antialiased font-light">
            Une approche structurée pour garantir la sérénité tout au long de votre projet.
          </p>
        </motion.div>

        {/* Right Side Steps */}
        <div className="md:w-2/3">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-8 lg:gap-12 items-start group"
              >
                <span className="font-display text-4xl lg:text-5xl text-outline-variant/50 group-hover:text-primary transition-colors duration-500">
                  {step.id}
                </span>
                <div className="pt-1.5 flex-1">
                  <h4 className="font-display text-2xl lg:text-3xl mb-3 text-on-surface font-light">{step.title}</h4>
                  <p className="font-body text-foreground/50 text-base leading-relaxed antialiased font-light max-w-md">
                    {step.desc}
                  </p>
                </div>
                {step.image && (
                  <div className="hidden lg:block w-32 h-32 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-4 group-hover:translate-x-0">
                    <Image 
                      src={step.image}
                      alt={step.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
