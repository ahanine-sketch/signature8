import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude browser-only PDF libraries from server-side bundling.
  // This is the root fix for the fflate/jspdf Worker error with Turbopack.
  serverExternalPackages: ["jspdf", "jspdf-autotable", "fflate"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
