import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "genshin.jmp.blue",
      },
      {
        protocol: "https",
        hostname: "enka.network",
      },
      {
        protocol: "https",
        hostname: "upload-os-bbs.mihoyo.com",
      },
      {
        protocol: "https",
        hostname: "fastly.jsdelivr.net",
      },
    ],
  },
};

export default nextConfig;
