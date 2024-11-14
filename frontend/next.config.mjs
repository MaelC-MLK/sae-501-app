/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactive l'auto-prérendu
  devIndicators: {
    autoPrerender: false,
  },

  // Configuration pour le runtime côté serveur
  serverRuntimeConfig: {
    port: process.env.PORT || 5173,
    host: "0.0.0.0",
  },

  // Configuration générale de Next.js
  reactStrictMode: true,
  output: 'standalone',  // Pour permettre l'exécution autonome dans Docker
};

export default nextConfig;
