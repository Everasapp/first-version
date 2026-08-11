import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/accedi",
        "/registrati",
        "/auth/",
        "/api/",
        "/supabase-test",
        "/newsletter/",
        "/conferma-email",
      ],
    },
    sitemap: "https://www.everas.it/sitemap.xml",
    host: "https://www.everas.it",
  };
}
