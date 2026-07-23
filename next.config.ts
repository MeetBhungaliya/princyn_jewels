import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.55"],
  serverExternalPackages: ["@electric-sql/pglite"],
  output: "standalone",
};

export default nextConfig;
