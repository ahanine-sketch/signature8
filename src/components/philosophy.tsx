"use client";

import { motion } from "framer-motion";

const expertiseTags = [
  "ARCHITECTURES D&apos;INTÉRIEUR",
  "MOBILIER CUSTOM",
  "CURATION D&apos;ART",
  "LIGHTING DESIGN"
];

export function Philosophy() {
  return (
    <section className="bg-[#EDE8E0] py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20 lg:gap-32">
          
          {/* Left: Title Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/3"
          >
            <h2 className="editorial-label text-primary mb-6">NOTRE VISION</h2>
            <h3 className="font-display text-4xl lg:text-5xl lg:text-6xl leading-tight text-on-surface font-light">
              L&apos;équilibre parfait entre <span className="italic">esthétique</span> et fonctionnalité.
            </h3>
          </motion.div>

          {/* Right: Body Area */}
          <div className="md:w-2/3 space-y-12">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl lg:text-3xl leading-relaxed text-on-surface-variant font-light italic antialiased"
            >
              &ldquo;Nous croyons que chaque espace raconte une histoire unique. Notre mission est de traduire vos aspirations en environnements tangibles, où chaque détail est pensé pour élever votre quotidien.&rdquo;
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {expertiseTags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-6 py-2.5 rounded-full border border-outline-variant/30 editorial-label text-[0.65rem] bg-surface-container-lowest/50 backdrop-blur-sm text-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
