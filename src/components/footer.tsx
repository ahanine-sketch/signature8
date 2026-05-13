"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-surface-variant/30 py-24 px-8 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* Logo Area */}
        <div className="text-center md:text-left">
          <Link href="/" className="font-display text-2xl font-semibold text-primary block mb-3">
            SIGNATURE 8
          </Link>
          <p className="editorial-label text-[10px] text-foreground/40 tracking-[0.25em]">
            © 2024 SIGNATURE 8 INTERIOR DESIGN
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-12">
          {["Instagram", "Pinterest", "LinkedIn", "Facebook"].map((social) => (
            <Link 
              key={social} 
              href="#" 
              className="editorial-label text-[0.65rem] text-on-surface hover:text-primary transition-all duration-300 tracking-[0.2em] font-medium"
            >
              {social}
            </Link>
          ))}
        </div>

        {/* Slogan Area */}
        <div className="text-right hidden md:block">
          <p className="editorial-label text-[10px] text-foreground/40 tracking-[0.25em] font-light italic">
            L&apos;EXCELLENCE EST UN DÉTAIL
          </p>
        </div>

      </div>
    </footer>
  );
}
