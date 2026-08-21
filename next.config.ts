import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ],
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
    ];
  },
};

export default nextConfig;
