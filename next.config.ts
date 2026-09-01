import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // DeepSight was extracted to its own repo/deployment.
        source: "/deep-sight",
        destination: "https://deepsight-standalone.vercel.app/deep-sight",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
