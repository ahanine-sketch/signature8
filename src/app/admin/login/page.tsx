"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔐 Login Attempt:", { email });
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.session.access_token, response.user);
      toast.success("Authentification réussie");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      toast.error(error.message || "Identifiants invalides");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12110F] flex items-center justify-center p-4 relative overflow-hidden font-body">
      
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            y: [0, -40, 0],
            rotate: [45, 55, 45],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[150px] h-[150px] border border-[#D4AF37]/20 top-[15%] left-[10%]" 
        />
        <motion.div 
          animate={{ 
            y: [0, 50, 0],
            rotate: [-15, -25, -15],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[200px] h-[200px] border border-[#D4AF37]/20 bottom-[10%] right-[5%]" 
        />
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute w-[80px] h-[80px] border border-[#D4AF37]/20 top-[25%] right-[15%] rounded-full" 
        />
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-2xl p-10 lg:p-14 z-10 relative"
      >
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="mb-2">
            <span className="text-2xl font-display font-bold tracking-[0.25em] text-[#D4AF37] uppercase">Signature 8</span>
            <div className="text-[10px] tracking-[0.4em] text-gray-400 mt-2 uppercase font-bold italic">By Sketch Design</div>
          </div>
          {/* Gold Divider */}
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-10 opacity-60"></div>
          <h2 className="font-display text-4xl text-[#12110F] mt-4 font-light tracking-tight">
            Accès <span className="italic">Administration</span>
          </h2>
        </div>

        {/* Login Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] ml-1" htmlFor="email">
              Identifiant Professionnel
            </label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@signature8.com"
              className="w-full bg-[#f8f3ed] border-none text-[#12110F] rounded-2xl px-6 py-4 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all duration-300 font-body placeholder:text-gray-300 antialiased"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] ml-1" htmlFor="password">
              Mot de passe confidentiel
            </label>
            <div className="relative group">
              <input 
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f8f3ed] border-none text-[#12110F] rounded-2xl px-6 py-4 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all duration-300 font-body placeholder:text-gray-300 antialiased"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors p-2"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#12110F] hover:bg-[#D4AF37] text-white font-bold py-5 rounded-2xl transition-all duration-500 transform active:scale-[0.98] shadow-2xl shadow-[#12110F]/20 uppercase tracking-[0.3em] text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "AUTHENTIFICATION..." : "AUTHENTIFICATION"}
          </button>

          <div className="text-center mt-10">
            <a href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#D4AF37] transition-colors tracking-widest uppercase italic">
              Accès restreint aux administrateurs
            </a>
          </div>
        </form>
      </motion.div>

    </div>
  );
}
