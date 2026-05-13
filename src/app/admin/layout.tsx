"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BarChart2, 
  TrendingUp, 
  Lightbulb, 
  Folder, 
  Users, 
  Inbox, 
  FileText, 
  BadgeCheck, 
  BarChart3,
  LogOut,

  Search,
  Plus,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/context/AuthContext";

const sidebarLinks = [
  { label: "VUE D'ENSEMBLE", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "KPIs opérationnelle", href: "/admin/kpis/operational", icon: BarChart2 },
  { label: "KPIs commerciaux", href: "/admin/kpis/commercial", icon: TrendingUp },
  { label: "KPIs stratégique", href: "/admin/kpis/strategic", icon: Lightbulb },
  { label: "Projets", href: "/admin/projects", icon: Folder },
  { label: "Clients", href: "/admin/clients", icon: Users },
  { label: "Demandes", href: "/admin/requests", icon: Inbox },
  { label: "Devis", href: "/admin/quotes", icon: FileText },
  { label: "Équipe", href: "/admin/team", icon: BadgeCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background text-on-surface font-body overflow-hidden">
        
        {/* SideNavBar - Exact Stitch Sidebar Style */}
        <aside className="bg-[#12110F] w-64 flex-shrink-0 h-screen flex flex-col text-white/70 overflow-y-auto no-scrollbar z-40 shadow-2xl">
          <div className="p-8 pb-10">
            <div className="flex flex-col gap-1">
              <span className="text-white text-xl font-bold tracking-[0.2em] uppercase">SIGNATURE 8</span>
              <span className="text-white/40 text-[10px] tracking-[0.3em] font-medium uppercase">SKETCH DESIGN</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all group",
                    isActive 
                      ? "bg-primary text-white shadow-lg" 
                      : "hover:bg-white/5"
                  )}
                >
                  <link.icon 
                    size={18} 
                    strokeWidth={isActive ? 2 : 1.5} 
                    className={cn(isActive ? "text-white" : "text-white/30 group-hover:text-white transition-colors")} 
                  />
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-8 border-t border-white/5 mt-auto">
            <Link href="/admin/login" className="flex items-center gap-4 px-2 py-2 text-white/40 hover:text-white transition-colors group mb-6">
              <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Déconnexion</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
                <User size={20} className="text-white/20" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white tracking-[0.15em] uppercase truncate max-w-[140px]">
                  {user?.email?.split('@')[0] || "Administrateur"}
                </p>
                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Administrateur</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* TopNavBar - Exact Stitch Glass Nav */}
          <header className="h-16 bg-white/80 backdrop-blur-3xl border-b border-outline-variant/15 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-8">
              <h1 className="font-display text-2xl text-primary leading-none italic font-light tracking-tight">Tableau de bord</h1>
            </div>
            
            <div className="flex items-center gap-6">

              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center ring-1 ring-outline/10">
                <User size={20} className="text-on-secondary-container/20" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto relative no-scrollbar">
            {children}
          </div>
        </main>

      </div>
    </AdminGuard>
  );
}
