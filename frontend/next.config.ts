import type { NextConfig } from "next";
import os from "os";
import path from "path";

function getLocalDevOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);
  try {
    const nets = os.networkInterfaces();
    for (const ifaceList of Object.values(nets)) {
      if (!ifaceList) continue;
      for (const iface of ifaceList) {
        if (iface.family === "IPv4" && !iface.internal && iface.address) {
          origins.add(iface.address);
        }
      }
    }
  } catch {
    // Fallback safely to localhost
  }
  return Array.from(origins);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalDevOrigins(),
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

