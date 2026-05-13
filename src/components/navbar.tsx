"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "ACCUEIL", href: "/" },
  { label: "SERVICES", href: "#services" },
  { label: "PORTFOLIO", href: "#portfolio" },
  { label: "À PROPOS", href: "#philosophy" },
  { label: "CONTACT", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-white/80 backdrop-blur-3xl shadow-sm border-b border-outline-variant/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">
            SIGNATURE <span className="text-primary/70">8</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-12 items-center">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="editorial-label text-[0.65rem] text-on-surface hover:text-primary transition-all duration-300 tracking-[0.2em] font-bold"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl editorial-label text-[0.65rem] hover:bg-primary/90 hover:scale-[1.02] shadow-sm transition-all duration-300 font-bold tracking-[0.2em]">
          DEMANDER UN DEVIS
        </button>

      </div>
    </nav>
  );
}
