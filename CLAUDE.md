# Stash

A developer knowledge hub for code snippets, commands, prompts, notes, files, images, links, and custom types.

## Context Files

Read the following for full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/current-feature.md
- @context/ai-interaction.md

## Project Overview

Next.js 16 application using the App Router architecture with React 19, TypeScript, and Tailwind CSS v4.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### App Router Structure

- Uses Next.js App Router (`src/app/` directory)
- File-based routing with colocation of components, styles, and tests
- Server Components by default (use `"use client"` directive when needed)

### Key Configuration

- **React Compiler**: Enabled in [next.config.ts](next.config.ts) - automatic memoization and optimization
- **TypeScript**: Strict mode with path aliases (`@/*` maps to `src/*`)
- **Styling**: Tailwind CSS v4 with PostCSS architecture
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`

### TypeScript Paths

Import from `src/` using the `@/` alias:

```typescript
import { Component } from "@/components/MyComponent";
```

## React 19 Considerations

- Uses React 19.2.3 with new features and breaking changes
- React Compiler is enabled, which automatically optimizes components
- Avoid manual memoization (useMemo, useCallback) unless needed - the compiler handles this
