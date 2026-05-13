"use client";

import { motion } from "framer-motion";
import { 
  FileText,
  FileSpreadsheet,
  FileJson,
  Download,
  ExternalLink,
  Presentation,
  History,
  ShieldCheck,
  FileDown,
  ChevronRight,
  LayoutGrid,
  Search,
  BookOpen,
  ArrowRight,
  Eye,
  Trash2,
  FileArchive,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const exportCards = [
  { 
    title: "Données Projets", 
    desc: "Export complet des étapes, budgets et intervenants par projet.", 
    icon: LayoutGrid, 
    formats: ["CSV", "EXCEL"] 
  },
  { 
    title: "Annuaire Clients", 
    desc: "Extraction des contacts, historiques de facturation et préférences.", 
    icon: Search, 
    formats: ["CSV"] 
  },
];

const history = [
  { name: "Rapport_Mensuel_Signature8_Avril.pdf", size: "4.2 MB", user: "Jean-Marc S.", date: "24 MAI 2024", type: "pdf" },
  { name: "Export_Projets_Q2_Final.xlsx", size: "1.8 MB", user: "Système (Auto)", date: "20 MAI 2024", type: "excel" },
  { name: "Base_Clients_S8_Design.csv", size: "856 KB", user: "Amélie L.", date: "12 MAI 2024", type: "csv" },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      
      {/* Top Navigation / Breadcrumbs */}
      <div className="px-12 py-8 flex flex-col gap-1 border-b border-outline-variant/10 bg-white/50 backdrop-blur-xl sticky top-0 z-40">
        <nav className="flex items-center gap-2 mb-1">
          <span className="text-[10px] tracking-[0.2em] font-medium text-on-secondary-container uppercase opacity-60">ACCUEIL</span>
          <span className="text-[10px] text-outline-variant opacity-40">/</span>
          <span className="text-[10px] tracking-[0.2em] font-bold text-on-surface uppercase">RAPPORTS & EXPORTS</span>
        </nav>
        <h2 className="font-headline text-3xl italic text-primary">Centre d&apos;Archives</h2>
      </div>

      <div className="p-12 space-y-16 max-w-7xl mx-auto w-full pb-32">
        
        {/* Header Hero */}
        <header className="flex justify-between items-end gap-12 pt-4">
          <div className="space-y-4">
            <h3 className="font-headline text-6xl tracking-tight leading-none text-on-surface">
              Archives & <br/>
              <span className="italic text-primary opacity-80 font-light">Reporting</span>
            </h3>
            <p className="text-on-secondary-container text-lg italic leading-relaxed opacity-60 font-body max-w-xl">
              Compilez l&apos;ensemble de vos performances et accédez à vos historiques d&apos;export avec une précision chirurgicale.
            </p>
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-xl text-[10px] font-bold tracking-[0.25em] flex items-center gap-3 hover:bg-surface-tint transition-all shadow-xl shadow-primary/20 uppercase">
            <FileDown size={18} />
            EXPORTER PDF
          </button>
        </header>

        {/* Bento Grid Layout */}
        <section className="grid grid-cols-12 gap-8">
          
          {/* Main Activity Report Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl p-10 shadow-2xl shadow-on-surface/[0.03] border border-outline-variant/10 flex flex-col md:flex-row gap-12 group overflow-hidden relative"
          >
            <div className="flex-1 space-y-10 relative z-10">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase block italic">Publication Mensuelle</span>
                <h3 className="text-5xl font-headline leading-tight text-on-surface italic font-light">Générer le <span className="not-italic opacity-40">Rapport d&apos;Activité</span></h3>
                <p className="text-on-secondary-container text-sm font-body leading-relaxed max-w-md opacity-60">
                  Compilez l&apos;ensemble des performances opérationnelles et financières. Le document inclut les analyses graphiques et les prévisions.
                </p>
              </div>
              
              <div className="flex flex-col gap-5">
                <label className="text-[10px] font-bold tracking-[0.25em] text-on-secondary-container opacity-40 uppercase">Période de Reporting</label>
                <div className="flex gap-4 p-2 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                  <input 
                    className="bg-transparent border-none px-4 py-3 outline-none flex-grow font-body text-sm font-bold tracking-widest text-on-surface uppercase" 
                    type="month" 
                    defaultValue="2024-05"
                  />
                  <button className="bg-on-surface text-white px-6 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] hover:bg-primary transition-all uppercase antialiased">
                    Visualiser
                  </button>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-72 h-80 rounded-2xl overflow-hidden relative group/img shadow-2xl flex-shrink-0 lg:mt-6">
              <img 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg30d0pXLvln2w9_jY-rwMYntWHm8Kl1aqM0INkx3MduZFFFDSX61K37QY2CN43N2bdgvefTeBijX_3v5buLyH2jcH4s39SK-0PL89YTnS6UQDky7Em1J2mfNip0SQKHYkWgBk93u7_7HZ8EUgdOqmXZoKngZSDqOni3IszkN9lcVI3-m1adJttJoF7OokSwcl9mfYt_E8joI5Uligac_b2OhQfLmwPniKtHTe8M-VF4_bZvruDSXgiDvdRKplmbTqc8pnGQk3qVU" 
                alt="Report Layout Preview"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                <span className="text-white text-[9px] font-bold tracking-[0.3em] uppercase opacity-70">Aperçu v2.4 Editorial</span>
              </div>
            </div>
          </motion.div>

          {/* Google Slides Integration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
          >
            <Presentation className="absolute -top-12 -right-12 text-[240px] opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" size={240} />
            <div className="space-y-6 relative z-10">
              <span className="text-[10px] font-bold tracking-[0.3em] opacity-60 uppercase">Présentation Client</span>
              <h3 className="text-4xl font-headline italic font-light leading-tight">Support <br/>Google Slides</h3>
              <p className="text-sm opacity-80 leading-relaxed font-body italic">Accédez au support de présentation dynamique pour les revues trimestrielles stratégiques.</p>
            </div>
            <div className="pt-10 relative z-10">
              <a className="inline-flex items-center gap-4 text-[11px] font-bold tracking-[0.25em] border-b border-white/40 pb-2 uppercase hover:gap-6 hover:border-white transition-all duration-500" href="#">
                OUVRIR LA PRÉSENTATION
                <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

          {/* Small Export Cards */}
          {exportCards.map((card, i) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest p-8 rounded-3xl shadow-lg border border-outline-variant/10 space-y-8 group hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <card.icon size={26} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-headline text-on-surface italic">{card.title}</h4>
                <p className="text-sm text-on-secondary-container opacity-60 leading-relaxed italic">{card.desc}</p>
              </div>
              <div className="flex gap-4 pt-4">
                {card.formats.map((format) => (
                  <button key={format} className="flex-1 py-3 border border-outline-variant/30 text-[10px] font-bold tracking-[0.2em] rounded-xl hover:bg-surface-container-low hover:border-primary/20 transition-all uppercase antialiased">
                    {format}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* KPI Pack ZIP Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.5 }}
             className="col-span-12 lg:col-span-4 bg-surface-dim p-8 rounded-3xl flex flex-col justify-between border border-outline-variant/20 shadow-inner group relative overflow-hidden"
          >
            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-3">
                <Star className="text-primary fill-primary/20" size={18} />
                <span className="text-[9px] font-bold tracking-[0.3em] text-primary uppercase">Outil d&apos;Analyse</span>
              </div>
              <h4 className="text-2xl font-headline text-on-surface italic">Rapport KPIs Complet</h4>
              <p className="text-sm text-on-surface-variant/70 italic leading-relaxed">Un document exhaustif regroupant les KPIs opérationnels de Marrakech et commerciaux de Casablanca.</p>
            </div>
            <div className="pt-10 relative z-10">
              <button className="w-full bg-white text-on-surface py-5 rounded-2xl text-[10px] font-bold tracking-[0.25em] shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 uppercase group/btn">
                <FileArchive size={18} className="group-hover/btn:-translate-y-1 transition-transform" />
                DÉCHARGER LE PACK (.ZIP)
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        </section>

        {/* Recent Activity List */}
        <section className="space-y-12 pt-8">
          <div className="flex items-end justify-between border-b border-outline-variant/10 pb-6">
            <div className="space-y-1">
              <h3 className="text-3xl font-headline italic tracking-tight text-on-surface">Historique <span className="not-italic opacity-40">des Exports</span></h3>
              <p className="text-[10px] font-bold tracking-[0.3em] text-on-secondary-container/40 uppercase">Journal des extractions récentes</p>
            </div>
            <button className="text-[10px] font-bold tracking-[0.25em] text-primary underline underline-offset-[12px] decoration-primary/20 hover:decoration-primary transition-all uppercase">
              VOIR TOUT L&apos;HISTORIQUE
            </button>
          </div>

          <div className="space-y-2">
            {history.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="flex items-center justify-between group p-6 rounded-2xl hover:bg-surface-container-low transition-all duration-500 cursor-pointer border border-transparent hover:border-outline-variant/10"
              >
                <div className="flex items-center gap-10">
                  <span className="text-on-secondary-container/30 font-bold text-[10px] tracking-widest w-24">{item.date}</span>
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                      item.type === 'pdf' ? "bg-red-50 text-red-600" :
                      item.type === 'excel' ? "bg-green-50 text-green-600" :
                      "bg-blue-50 text-primary"
                    )}>
                      {item.type === 'pdf' ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-[11px] text-on-secondary-container/40 mt-1 italic font-medium">Généré par {item.user} • {item.size}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  <button className="p-3 text-on-secondary-container/30 hover:text-primary hover:bg-white rounded-xl transition-all"><Eye size={18} /></button>
                  <button className="p-3 text-on-secondary-container/30 hover:text-primary hover:bg-white rounded-xl transition-all"><Download size={18} /></button>
                  <button className="p-3 text-on-secondary-container/30 hover:text-red-500 hover:bg-white rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Decorative Archive Footer */}
        <footer className="pt-24 flex flex-col items-center gap-8 opacity-40">
           <div className="w-16 h-1 bg-primary/20 rounded-full" />
           <div className="text-center space-y-6 max-w-xs">
              <BookOpen className="mx-auto text-primary opacity-60" size={32} strokeWidth={1} />
              <p className="text-[9px] font-bold tracking-[0.3em] text-on-secondary-container uppercase leading-relaxed text-center px-4">
                Toutes les archives sont conservées pour une durée de 5 ans conformément à la politique de confidentialité de Signature 8 Studio.
              </p>
           </div>
        </footer>
      </div>
    </div>
  );
}
