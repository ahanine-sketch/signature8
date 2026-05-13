"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "2", label: "Années d&apos;Expertise" },
  { value: "15", label: "Projets Livrés" },
  { value: "12", label: "Distinctions Design" },
  { value: "100%", label: "Sur-Mesure" },
];

export function Stats() {
  return (
    <section className="bg-background py-16 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-outline-variant/20 pt-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <p className="font-display text-4xl lg:text-5xl text-primary font-light mb-2">
              {stat.value}
            </p>
            <p className="editorial-label text-secondary text-[0.65rem] tracking-[0.2em]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
