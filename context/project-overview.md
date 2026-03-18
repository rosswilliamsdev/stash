# Stash — Project Overview

> **One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.**

Developers keep their essentials scattered — snippets in VS Code, prompts buried in AI chats, commands lost in bash history, links across bookmark bars, docs in random folders. Stash eliminates the context switching by consolidating everything into a single, organized workspace.

---

## Table of Contents

- [Target Users](#target-users)
- [Tech Stack](#tech-stack)
- [Data Models](#data-models)
- [Item Types](#item-types)
- [Features](#features)
- [AI Features (Pro)](#ai-features-pro)
- [Monetization](#monetization)
- [UI / UX](#ui--ux)
- [Architecture Notes](#architecture-notes)

---

## Target Users

| Persona                        | Primary Use Case                                         |
| ------------------------------ | -------------------------------------------------------- |
| **Everyday Developer**         | Quick access to snippets, prompts, commands, links       |
| **AI-First Developer**         | Saves prompts, context files, system messages, workflows |
| **Content Creator / Educator** | Stores code blocks, explanations, course notes           |
| **Full-Stack Builder**         | Collects patterns, boilerplates, API examples            |

---

## Tech Stack

| Layer            | Technology                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **Framework**    | [Next.js 16](https://nextjs.org/) / [React 19](https://react.dev/) (App Router, SSR + dynamic components) |
| **Language**     | [TypeScript](https://www.typescriptlang.org/)                                                             |
| **Database**     | [Neon](https://neon.tech/) (Serverless PostgreSQL)                                                        |
| **ORM**          | [Prisma 7](https://www.prisma.io/)                                                                        |
| **Auth**         | [NextAuth v5](https://authjs.dev/) (Email/password + GitHub OAuth)                                        |
| **AI**           | [OpenAI](https://platform.openai.com/) — `gpt-5-nano`                                                     |
| **File Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)                                        |
| **Styling**      | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)                         |
| **Deployment**   | [Vercel](https://vercel.com/)                                                                             |
| **Caching**      | Redis (potential — for hot data paths)                                                                    |

> **Migration Policy:** Never use `db push` or directly modify DB structure. All schema changes go through Prisma migrations — run in dev first, then production.

---

## Data Models

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │   ItemType   │       │     Tag      │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ email        │       │ name         │       │ name         │
│ isPro        │──┐    │ icon         │       └──────┬───────┘
│ stripeId     │  │    │ color        │              │
│ stripeSub    │  │    │ isSystem     │              │ n:m
└──────┬───────┘  │    │ userId?      │              │
       │          │    └──────┬───────┘       ┌──────┴───────┐
       │ 1:n      │           │ 1:n           │   ItemTag    │
       │          │           │               │  (join table) │
┌──────┴───────┐  │    ┌──────┴───────┐       └──────┬───────┘
│  Collection  │  │    │     Item     │──────────────┘
├──────────────┤  │    ├──────────────┤
│ id           │  └───▶│ id           │
│ name         │       │ title        │
│ description? │       │ contentType  │ ◀── text | file
│ isFavorite   │       │ content?     │     (text content)
│ defaultTypeId│       │ fileUrl?     │     (R2 URL)
│ userId       │       │ fileName?    │
│ createdAt    │       │ fileSize?    │
│ updatedAt    │       │ url?         │     (for link types)
└──────┬───────┘       │ description? │
       │               │ language?    │     (for code)
       │ n:m           │ isFavorite   │
       │               │ isPinned     │
┌──────┴───────┐       │ userId       │
│ItemCollection│       │ itemTypeId   │
│ (join table) │       │ createdAt    │
├──────────────┤       │ updatedAt    │
│ itemId       │───────┤              │
│ collectionId │       └──────────────┘
│ addedAt      │
└──────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── User ──────────────────────────────────────────────

model User {
  id                  String       @id @default(cuid())
  name                String?
  email               String?      @unique
  emailVerified       DateTime?
  image               String?
  isPro               Boolean      @default(false)
  stripeCustomerId    String?      @unique
  stripeSubscriptionId String?     @unique
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  accounts            Account[]
  sessions            Session[]
  items               Item[]
  collections         Collection[]
  itemTypes           ItemType[]   // custom types only
}

// ─── NextAuth Models ───────────────────────────────────

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── Core Models ───────────────────────────────────────

model ItemType {
  id       String  @id @default(cuid())
  name     String
  icon     String
  color    String
  isSystem Boolean @default(false)

  userId   String?
  user     User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items    Item[]

  @@unique([name, userId]) // system types have null userId
}

model Item {
  id          String   @id @default(cuid())
  title       String
  contentType String   // "text" | "file"
  content     String?  // text content (null if file)
  fileUrl     String?  // R2 URL (null if text)
  fileName    String?
  fileSize    Int?
  url         String?  // for link types
  description String?
  language    String?  // programming language (for code)
  isFavorite  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId String
  itemType   ItemType @relation(fields: [itemTypeId], references: [id])

  tags        ItemTag[]
  collections ItemCollection[]

  @@index([userId, itemTypeId])
  @@index([userId, isFavorite])
  @@index([userId, isPinned])
  @@index([userId, createdAt])
}

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)
  defaultTypeId String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemCollection[]

  @@index([userId])
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  items ItemTag[]
}

model ItemTag {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

---

## Item Types

Items are the core unit in Stash. Each item has a **type** that determines its behavior and appearance. System types are built-in and immutable. Users on Pro can create custom types (future feature).

| Type        | Color        | Icon         | Content Model | Route             |
| ----------- | ------------ | ------------ | ------------- | ----------------- |
| **Snippet** | `#3b82f6` 🔵 | `Code`       | text          | `/items/snippets` |
| **Prompt**  | `#8b5cf6` 🟣 | `Sparkles`   | text          | `/items/prompts`  |
| **Command** | `#f97316` 🟠 | `Terminal`   | text          | `/items/commands` |
| **Note**    | `#fde047` 🟡 | `StickyNote` | text          | `/items/notes`    |
| **Link**    | `#10b981` 🟢 | `Link`       | url           | `/items/links`    |
| **File**    | `#6b7280` ⚪ | `File`       | file (R2)     | `/items/files`    |
| **Image**   | `#ec4899` 🩷 | `Image`      | file (R2)     | `/items/images`   |

> File and Image types are **Pro only**.

Content model categories:

- **text** — Snippet, Prompt, Command, Note. Content stored in `content` column. Supports markdown editing.
- **url** — Link. URL stored in `url` column.
- **file** — File, Image. Uploaded to Cloudflare R2. `fileUrl`, `fileName`, `fileSize` populated.

---

## Features

### Core

- **Items CRUD** — Create, read, update, delete items. Quick-create via a slide-out drawer for fast access.
- **Collections** — Group items of any type. An item can belong to multiple collections (e.g., a React snippet in both "React Patterns" and "Interview Prep").
- **Search** — Full-text search across content, titles, tags, and types.
- **Favorites & Pinning** — Favorite collections and items. Pin items to the top of lists.
- **Recently Used** — Track and surface recently accessed items.
- **Markdown Editor** — Rich editing for text-based types (snippet, prompt, note, command).
- **Syntax Highlighting** — Language-aware code rendering in items.
- **File Upload** — Upload files and images to Cloudflare R2 (Pro only).
- **Import from File** — Import code content directly from uploaded files.
- **Export** — Export data as JSON or ZIP (Pro only).
- **Multi-Collection Management** — Add/remove items to/from multiple collections. View which collections an item belongs to.
- **Dark Mode** — Default theme. Light mode available as a toggle.

### Authentication

- Email / password registration and login
- GitHub OAuth sign-in
- Powered by NextAuth v5

---

## AI Features (Pro)

| Feature                  | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| **Auto-Tag Suggestions** | AI analyzes item content and suggests relevant tags    |
| **AI Summaries**         | Generate concise summaries of longer notes or code     |
| **Explain This Code**    | AI explains what a code snippet does in plain language |
| **Prompt Optimizer**     | Rewrites and improves AI prompts for better results    |

All AI features use the OpenAI `gpt-5-nano` model via Next.js API routes.

---

## Monetization

### Free Tier

- 50 items total
- 3 collections
- All system types **except** File and Image
- Basic search
- No file/image uploads
- No AI features

### Pro — $8/month or $72/year

- Unlimited items and collections
- File & Image uploads (Cloudflare R2)
- Custom types (future)
- AI auto-tagging, code explanation, prompt optimizer
- Data export (JSON/ZIP)
- Priority support

> **Dev Note:** During development, all users have full access. Pro gating will be enforced via `user.isPro` checks and Stripe integration (`stripeCustomerId`, `stripeSubscriptionId`).

---

## UI / UX

### Design Principles

- Modern, minimal, developer-focused aesthetic
- Dark mode default, light mode optional
- Clean typography with generous whitespace
- Subtle borders and shadows

### Design references

- Notion (https://notion.so)
  - Clean organization
- Linear (https://linear.app)
  - Modern dev aesthetic
- Raycast (https://raycast.com)
  - Quick access patterns

### Screenshots

Refer to the screenshots below as a base for the dashboard UI. It does not have to be exact.Use it as a reference:

- @context/screenshots/dashboard-ui.png
- @context/screenshots/dashboard-ui-drawer.png

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Stash                                    [Search] [+]  │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  TYPES     │  Collections                               │
│  Snippets  │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│  Prompts   │  │ React   │ │ Python  │ │ Context │     │
│  Commands  │  │ Patterns│ │ Scripts │ │ Files   │     │
│  Notes     │  └─────────┘ └─────────┘ └─────────┘     │
│  Links     │                                            │
│  Files  ⭐ │  Items                                     │
│  Images ⭐ │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │
│            │  │ useDebou│ │ Git     │ │ System  │     │
│  COLLECTIONS│  │ nce.ts  │ │ Rebase  │ │ Prompt  │     │
│  React Pat.│  │ 🔵      │ │ 🟠      │ │ 🟣      │     │
│  Python..  │  └─────────┘ └─────────┘ └─────────┘     │
│            │                                            │
│            │            ┌──────────────────┐            │
│            │            │   Item Drawer    │            │
│            │            │   (slide-out)    │            │
│            │            │   Quick view &   │            │
│            │            │   edit           │            │
│            │            └──────────────────┘            │
└────────────┴────────────────────────────────────────────┘
```

- **Sidebar:** Item types (with counts), latest collections. Collapses to drawer on mobile.
- **Main area:** Collection cards (color-coded by dominant item type) and item cards (color-coded borders by type).
- **Item drawer:** Slide-out panel for quick view/create/edit without leaving the current page.

### Responsive Behavior

- Desktop-first, mobile-usable
- Sidebar collapses to a hamburger-triggered drawer on smaller screens

### Micro-Interactions

- Smooth transitions on navigation and drawer open/close
- Hover states on cards (subtle lift/border change)
- Toast notifications for CRUD actions
- Loading skeletons during data fetching

---

## Architecture Notes

### Project Structure (Suggested)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── items/
│   │   │   └── [type]/          # /items/snippets, /items/prompts, etc.
│   │   ├── collections/
│   │   │   └── [id]/
│   │   └── layout.tsx           # sidebar + main layout
│   └── api/
│       ├── items/
│       ├── collections/
│       ├── tags/
│       ├── ai/
│       └── webhooks/stripe/
├── components/
│   ├── ui/                      # shadcn components
│   ├── items/
│   ├── collections/
│   ├── layout/
│   └── shared/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts                  # NextAuth config
│   ├── r2.ts                    # Cloudflare R2 client
│   ├── openai.ts
│   └── stripe.ts
├── types/
└── prisma/
    ├── schema.prisma
    └── migrations/
```

### Key Architectural Decisions

- **Monolithic Next.js** — Single codebase for frontend + API routes. Reduces overhead for a solo/small-team project.
- **SSR pages with dynamic components** — Server-render the shell, hydrate interactive parts (drawers, search, editors) client-side.
- **Prisma migrations only** — No `db push`. All schema changes through versioned migrations for safe production deploys.
- **R2 for file storage** — Cost-effective S3-compatible storage. Presigned URLs for direct uploads from the client.
- **Stripe for billing** — Webhook-driven subscription management. `isPro` flag on the user model gates feature access.

### API Route Patterns

```
GET    /api/items              # List items (filterable by type, search, tags)
POST   /api/items              # Create item
GET    /api/items/[id]         # Get single item
PATCH  /api/items/[id]         # Update item
DELETE /api/items/[id]         # Delete item

GET    /api/collections        # List collections
POST   /api/collections        # Create collection
PATCH  /api/collections/[id]   # Update collection
DELETE /api/collections/[id]   # Delete collection

POST   /api/collections/[id]/items    # Add item to collection
DELETE /api/collections/[id]/items    # Remove item from collection

POST   /api/ai/tags            # AI tag suggestions
POST   /api/ai/summarize       # AI summary
POST   /api/ai/explain         # AI code explanation
POST   /api/ai/optimize-prompt # AI prompt optimizer

POST   /api/webhooks/stripe    # Stripe webhook handler
```
