# Copilot Instructions for latin-academy-main

## Project Architecture
- Uses Next.js 15 App Router (`/src/app`) with a clear separation of server and client components.
- All reusable UI is under `/src/components` (subfolders: `ui`, `layout`, `interface`, `table`, `dashboard`). Resource-specific components live in `(components)` subfolders inside each resource directory under `/src/app/[locale]/...`.
- Utility logic, hooks, and schemas are in `/src/lib` (with subfolders for `hooks`, `schema`, `const`).
- All resource schemas are organized in `/src/lib/schema` and types are inferred from Zod schemas.

## Key Patterns & Conventions
- Use TypeScript everywhere. Prefer interfaces for object shapes, infer types from Zod schemas, and avoid `any`.
- Use functional React components and hooks. Prefer React Server Components (RSC) where possible; minimize `use client`.
- Use React Hook Form + Zod for forms. Use SWR for data fetching. Use axios (with interceptors) for HTTP requests.
- Use Tailwind CSS for all styling. Use Shadcn UI (Radix-based) for UI primitives. No inline styles.
- Use `next-intl` for i18n (English/Arabic, Arabic default). All labels/messages via translation hooks.
- Use cookie-based auth (token/refreshToken), axios interceptors for auth headers, and redirect to login on 401.
- RESTful API endpoints, CRUD via async server actions, typed return values, and custom hooks for data fetching.
- Use middleware-based locale routing. All pages/components must be responsive and accessible.

## Developer Workflows
- Start dev server: `npm run dev` (uses Turbopack by default).
- Lint: `npm run lint`. Format: `npm run format`.
- Build: `npm run build`. Start prod: `npm start`.
- Main entry: `src/app/page.tsx`. Edit here to see live reload.
- Use `.env.local` for environment variables (see `.env.example`).
- For new resources: create a folder under `src/app/[locale]/<resource>`, add `(components)` for UI, and `*.action.ts` for server actions.

## Project-Specific Rules
- Always export components/interfaces via a single `index.ts` per folder.
- Use lowercase-dash for directories, PascalCase for components.
- Use Suspense for async ops, error boundaries for error handling.
- Use code splitting, lazy loading, and Next.js caching where possible.
- All forms and tables must support both English and Arabic.
- Use `class-variance-authority` and `tailwind-merge` for conditional class names.

## Examples
- See `src/app/[locale]/students/(components)/student-form.tsx` for a full-featured form with Zod, React Hook Form, translations, and dynamic UI.
- See `src/lib/axiosInstance.ts` for axios setup with auth and error handling.
- See `.cursor/rules/latin-academy-project-rules.mdc` for more conventions.

---

For more details, review:
- `.cursor/rules/latin-academy-project-rules.mdc`
- `.cursor/rules/next-js-15-component-architecture-rules.mdc`
- `.cursor/rules/next-js-15-async-request-api-rules.mdc`
- `.cursor/rules/ui-and-styling-rule.mdc`
- `.cursor/rules/typescript-usage-rule.mdc`
- `.cursor/rules/next-js-15-state-management-rules.mdc`
- `.cursor/rules/tailwind-css-styling-rules.mdc`

If a pattern is unclear, check the above files or ask for clarification.
