"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
  return (
    <header className="pt-40 pb-24 px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-end gap-16 lg:gap-24 relative">
        
        {/* Left Content Column */}
        <div className="lg:w-1/2 space-y-8 pb-12 z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-on-surface"
          >
            L&apos;innovation au service du <br />
            <span className="italic text-primary">design sur mesure</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-lg text-secondary max-w-md leading-relaxed antialiased font-light"
          >
            Signature 8 by Sketch Design redéfinit l&apos;excellence architecturale en fusionnant l&apos;artisanat traditionnel et les technologies de pointe.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-4"
          >
            <button className="border-b-2 border-primary pb-1 editorial-label text-primary hover:text-on-primary-container transition-colors">
              DÉCOUVRIR NOS RÉALISATIONS
            </button>
          </motion.div>
        </div>

        {/* Right Image Column */}
        <div className="lg:w-1/2 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative bg-surface-low"
          >
            <Image 
              src="/image.png"
              alt="Interieur minimaliste et luxueux"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Floating Detail Card */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-8 -left-12 bg-white p-8 rounded-full shadow-2xl hidden md:block max-w-[240px] z-20 border border-primary/5"
          >
            <p className="editorial-label text-primary mb-2">PROJET 2024</p>
            <p className="font-display text-xl leading-snug text-on-surface">Résidence Privée, Paris XVI</p>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
