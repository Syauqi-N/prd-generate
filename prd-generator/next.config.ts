import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  allowedDevOrigins: ["100.90.253.13", "10.11.0.4"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3002", "100.90.253.13", "10.11.0.4"],
    },
  },
  serverExternalPackages: ["puppeteer", "puppeteer-core"],
};

export default nextConfig;
