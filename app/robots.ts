import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/admin/",
        "/accedi",
        "/registrati",
        "/auth/",
        "/api/",
        "/supabase-test",
        "/newsletter/",
        "/conferma-email",
        "/pubblica",
      ],
    },
    sitemap: "https://www.everas.it/sitemap.xml",
    host: "https://www.everas.it",
  };
}
