# doresume

A modern TypeScript stack that combines Next.js, Self, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Husky** - Git hooks for code quality
- **Oxlint** - Oxlint + Oxfmt (linting & formatting)
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

## Storage

Object storage lives in `@doresume/storage` and uses [Files SDK](https://files-sdk.dev/) with the [Cloudflare R2 adapter](https://files-sdk.dev/docs/adapters/r2). Set `R2_BUCKET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` in `apps/web/.env`. Access keys are auto-loaded by the adapter.

## Email

Transactional email lives in `@doresume/email` and uses [Email SDK](https://email-sdk.dev/) with the [Resend adapter](https://email-sdk.dev/docs/adapters/resend). Set `RESEND_API_KEY` in `apps/web/.env`.

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application, or [http://localhost:3000](http://localhost:3000) for the marketing site. Use the Expo Go app to run the mobile application.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@doresume/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Git Hooks and Formatting

- Initialize hooks: `bun run prepare`
- Run checks: `bun run check`

## Project Structure

```
doresume/
├── agents/
│   ├── apply-agent/   # Durable AI agent (eve)
│   └── crawler-agent/ # Durable AI agent (eve)
├── apps/
│   ├── web/         # Fullstack application (Next.js)
│   ├── marketing/   # Marketing site (Next.js)
│   ├── docs/        # Documentation site (Blume)
│   ├── native/      # Mobile application (React Native, Expo)
│   └── extension/   # Browser extension (WXT)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   ├── db/          # Database schema & queries
│   ├── email/       # Transactional email (Email SDK)
│   └── storage/     # Object storage (Files SDK)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:marketing`: Start only the marketing site
- `bun run dev:docs`: Start only the documentation site (http://localhost:3002)
- `bun run dev:apply-agent`: Start the apply-agent (REPL + HTTP)
- `bun run dev:crawler-agent`: Start the crawler-agent (REPL + HTTP)
- `bun run check-types`: Check TypeScript types across all apps
- `bun run dev:native`: Start the React Native/Expo development server
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run check`: Run Oxlint and Oxfmt
