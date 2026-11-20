# EVERAS: Cloudflare Workers preview

This branch is for a Cloudflare Workers preview, **not Cloudflare Pages static export**. Preserve the existing homepage appearance, layout, and CSS.

## Current changes
- Vercel scheduled cron jobs removed on this branch.
- Newsletter popup removed from the homepage without rearranging its sections.
- Worker and OpenNext configuration added. **Deployment has not been verified.**

## Before deployment
1. Install `@opennextjs/cloudflare` and `wrangler` using a compatible lockfile update.
2. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and other required production build/runtime variables from the existing project. Do not commit secrets.
3. Build with `npx opennextjs-cloudflare build`, then preview/test using `npx opennextjs-cloudflare preview`.
4. Verify homepage, catalog search, event pages, images, and redirects, and measure Workers CPU/request limits.
5. Deploy to a `workers.dev` preview hostname first. Do not point everas.it to Cloudflare until smoke tests pass.

Cloudflare Pages' `Save and Deploy` form is **not suitable** for this Next.js application without a separate full static-export refactor. Use Workers Builds instead.
