"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#12110F] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin" />
        <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-bold italic animate-pulse">
          Signature 8 — Authentification en cours
        </p>
      </div>
    );
  }

  // If not logged in and not on login page, don't show children while redirecting
  if (!user && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
