import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hobby free tier: cut transformation variants hard.
    // Event photos are already compressed WebP in Supabase; most UI assets skip optimizer via `unoptimized`.
    formats: ["image/webp"],
    qualities: [55],
    minimumCacheTTL: 2678400, // 31 days
    deviceSizes: [640, 828, 1200],
    imageSizes: [128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pxybrwkbbcghegcezxbn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "turismosassari.it",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "everas.it" }],
        destination: "https://www.everas.it/:path*",
        permanent: true,
      },
      {
        source: "/eventi/spettacoli",
        destination: "/eventi/musica-concerti",
        permanent: true,
      },
      {
        source: "/categorie/spettacoli",
        destination: "/eventi/musica-concerti",
        permanent: true,
      },
      {
        source: "/eventi/:city/spettacoli",
        destination: "/eventi/:city/musica-concerti",
        permanent: true,
      },
      {
        source: "/eventi/festa-del-gusto",
        destination:
          "/eventi/festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
        permanent: true,
      },
      {
        source: "/eventi/festa-del-gusto-santa-teresa-gallura",
        destination:
          "/eventi/festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
        permanent: true,
      },
      {
        source: "/eventi/festa-del-gusto-santa-teresa-gallura-turismo",
        destination:
          "/eventi/festa-del-gusto-santa-teresa-gallura-turismo-mt0en8v5",
        permanent: true,
      },
      {
        source: "/cultura-sarda/pattada",
        destination: "/cultura-sarda/nord-sardegna/pattada",
        permanent: true,
      },
      {
        source: "/cultura-sarda/castelsardo",
        destination: "/cultura-sarda/nord-sardegna/castelsardo",
        permanent: true,
      },
      {
        source: "/cultura-sarda/aggius",
        destination: "/cultura-sarda/nord-sardegna/aggius",
        permanent: true,
      },
      {
        source: "/cultura-sarda/tempio-pausania",
        destination: "/cultura-sarda/nord-sardegna/tempio-pausania",
        permanent: true,
      },
      {
        source: "/cultura-sarda/ozieri",
        destination: "/cultura-sarda/nord-sardegna/ozieri",
        permanent: true,
      },
      {
        source: "/cultura-sarda/stintino",
        destination: "/cultura-sarda/nord-sardegna/stintino",
        permanent: true,
      },
      {
        source: "/cultura/cultura-sarda-feste-e-tradizioni",
        destination: "/cultura",
        permanent: true,
      },
      {
        source: "/calendario-eventi-sardegna-2026",
        destination: "/eventi-sardegna/2026",
        permanent: true,
      },
      {
        source: "/eventi/:slug(.*)-draft2",
        destination: "/eventi/:slug",
        permanent: true,
      },
      {
        source: "/eventi/:slug(.*)-draft",
        destination: "/eventi/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
