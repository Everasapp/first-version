import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/admin",
        "/auth/",
        "/supabase-test",
      ],
    },
    sitemap: "https://www.everas.it/sitemap.xml",
    host: "https://www.everas.it",
  };
}
