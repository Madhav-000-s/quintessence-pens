import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      type: "asset/resource", // tells webpack to copy the file to /_next/static/media
    });

    return config;
  },
};

export default nextConfig;
