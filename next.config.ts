import type { NextConfig } from "next";
import path from "node:path";

const apiOrigin = process.env.API_ORIGIN ?? "";
const useExternalApi =
  Boolean(apiOrigin) &&
  !apiOrigin.includes("127.0.0.1") &&
  !apiOrigin.includes("localhost");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    // Sur Vercel, les routes app/api/* gèrent le formulaire.
    // Les rewrites externes ne s’appliquent que si API_ORIGIN pointe vers une vraie API.
    if (!useExternalApi) return [];
    return [
      { source: "/api/:path*", destination: `${apiOrigin}/api/:path*` },
      { source: "/health", destination: `${apiOrigin}/health` },
    ];
  },
};

export default nextConfig;
