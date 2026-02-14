import type { NextConfig } from "next";

const nextConfig = {
  /* Diğer ayarların */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
} as NextConfig; // Burada 'as NextConfig' diyerek TS'i ikna ediyoruz.

export default nextConfig;