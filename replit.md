# Maa Gayatri Public School

Premium, parent-friendly school website for Maa Gayatri Public School in Muzaffarpur.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mgps-school` — the deployable responsive school website.
- `artifacts/mgps-school/src/siteData.ts` — centralized school identity, contact details, navigation, trust indicators, and replaceable gallery content.
- `artifacts/mgps-school/src/App.tsx` — the single-page site sections, navigation, enquiry form, contact CTAs, and not-found route.
- `artifacts/mgps-school/src/index.css` — site theme, responsive layout, motion, and accessibility states.
- `artifacts/mgps-school/public` — favicon, `robots.txt`, and `sitemap.xml`.

## Architecture decisions

- The site is presentation-first and does not claim that the admission enquiry form is connected to a backend.
- School facts are centralized in `siteData.ts` so approved copy, photos, contacts, and future content can be swapped without rewriting page sections.
- Unverified details such as board affiliation, official establishment date, school hours, and location coordinates are deliberately presented with qualifying language or omitted.
- The gallery uses clearly labeled replacement slots until approved school photographs are supplied.

## Product

- Parents can learn about the school, academics, values, and secondary-level education.
- Parents can call, email, message on WhatsApp, open a directions search, and start an admission enquiry.
- The site is responsive, keyboard-accessible, SEO-ready, and designed for future CMS/backend connections.

## User preferences

- Keep all school information factual and avoid inventing affiliations, staff, facilities, statistics, testimonials, or photographs.

## Gotchas

- Use the managed web workflow for the preview; Vite expects `PORT` and `BASE_PATH` from the workflow.
- Update `src/siteData.ts` when approved school content, images, or developer attribution becomes available.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
