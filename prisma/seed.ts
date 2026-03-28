import "dotenv/config";
import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data
  console.log("🗑️  Cleaning existing data...");
  await prisma.itemTag.deleteMany();
  await prisma.itemCollection.deleteMany();
  await prisma.item.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.itemType.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  console.log("👤 Creating demo user...");
  const hashedPassword = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.create({
    data: {
      email: "demo@stash.io",
      name: "Demo User",
      emailVerified: new Date(),
      isPro: false,
    },
  });

  // Create system item types in the desired order
  // Order: Snippets, Prompts, Commands, Files, Notes, Links, Images
  console.log("📦 Creating system item types...");
  const snippetType = await prisma.itemType.create({
    data: {
      name: "Snippets",
      icon: "Code",
      color: "#3b82f6",
      isSystem: true,
    },
  });

  const promptType = await prisma.itemType.create({
    data: {
      name: "Prompts",
      icon: "Sparkles",
      color: "#8b5cf6",
      isSystem: true,
    },
  });

  const commandType = await prisma.itemType.create({
    data: {
      name: "Commands",
      icon: "Terminal",
      color: "#f97316",
      isSystem: true,
    },
  });

  const fileType = await prisma.itemType.create({
    data: {
      name: "Files",
      icon: "File",
      color: "#6b7280",
      isSystem: true,
    },
  });

  const noteType = await prisma.itemType.create({
    data: {
      name: "Notes",
      icon: "StickyNote",
      color: "#fde047",
      isSystem: true,
    },
  });

  const linkType = await prisma.itemType.create({
    data: {
      name: "Links",
      icon: "Link",
      color: "#10b981",
      isSystem: true,
    },
  });

  const imageType = await prisma.itemType.create({
    data: {
      name: "Images",
      icon: "Image",
      color: "#ec4899",
      isSystem: true,
    },
  });

  // Create tags
  console.log("🏷️  Creating tags...");
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "react" } }),
    prisma.tag.create({ data: { name: "typescript" } }),
    prisma.tag.create({ data: { name: "hooks" } }),
    prisma.tag.create({ data: { name: "ai" } }),
    prisma.tag.create({ data: { name: "devops" } }),
    prisma.tag.create({ data: { name: "docker" } }),
    prisma.tag.create({ data: { name: "git" } }),
    prisma.tag.create({ data: { name: "css" } }),
    prisma.tag.create({ data: { name: "design" } }),
  ]);

  // Collection 1: React Patterns
  console.log("📚 Creating 'React Patterns' collection...");
  const reactCollection = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
      isFavorite: true,
      defaultTypeId: snippetType.id,
    },
  });

  const reactSnippet1 = await prisma.item.create({
    data: {
      title: "useDebounce Hook",
      contentType: "text",
      content: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
      language: "typescript",
      description: "Debounce hook for delaying state updates, perfect for search inputs",
      userId: user.id,
      itemTypeId: snippetType.id,
      isPinned: true,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // react
          { tag: { connect: { id: tags[1].id } } }, // typescript
          { tag: { connect: { id: tags[2].id } } }, // hooks
        ],
      },
    },
  });

  const reactSnippet2 = await prisma.item.create({
    data: {
      title: "useLocalStorage Hook",
      contentType: "text",
      content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue] as const;
}`,
      language: "typescript",
      description: "Sync state with localStorage with SSR support",
      userId: user.id,
      itemTypeId: snippetType.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // react
          { tag: { connect: { id: tags[1].id } } }, // typescript
          { tag: { connect: { id: tags[2].id } } }, // hooks
        ],
      },
    },
  });

  const reactSnippet3 = await prisma.item.create({
    data: {
      title: "Compound Component Pattern",
      contentType: "text",
      content: `import { createContext, useContext, useState, ReactNode } from 'react';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list">{children}</div>;
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;

  return (
    <button
      className={\`tab \${activeTab === value ? 'active' : ''}\`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  const { activeTab } = context;

  return activeTab === value ? <div className="tab-panel">{children}</div> : null;
}`,
      language: "typescript",
      description: "Flexible compound component pattern for building tab interfaces",
      userId: user.id,
      itemTypeId: snippetType.id,
      isFavorite: true,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // react
          { tag: { connect: { id: tags[1].id } } }, // typescript
        ],
      },
    },
  });

  await Promise.all([
    prisma.itemCollection.create({
      data: { itemId: reactSnippet1.id, collectionId: reactCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: reactSnippet2.id, collectionId: reactCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: reactSnippet3.id, collectionId: reactCollection.id },
    }),
  ]);

  // Collection 2: AI Workflows
  console.log("🤖 Creating 'AI Workflows' collection...");
  const aiCollection = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
      defaultTypeId: promptType.id,
    },
  });

  const aiPrompt1 = await prisma.item.create({
    data: {
      title: "Code Review Assistant",
      contentType: "text",
      content: `You are a senior software engineer conducting a thorough code review. Please review the following code with these criteria:

1. **Code Quality**: Check for readability, maintainability, and adherence to best practices
2. **Performance**: Identify any performance bottlenecks or optimization opportunities
3. **Security**: Look for potential security vulnerabilities or data exposure risks
4. **Testing**: Suggest areas that need test coverage
5. **Documentation**: Note where documentation or comments would be helpful

Provide your feedback in this format:
- ✅ Strengths
- ⚠️ Issues (with severity: high/medium/low)
- 💡 Suggestions for improvement
- 🧪 Testing recommendations

Code to review:
[PASTE CODE HERE]`,
      description: "Structured prompt for AI-assisted code reviews",
      userId: user.id,
      itemTypeId: promptType.id,
      isPinned: true,
      tags: {
        create: [{ tag: { connect: { id: tags[3].id } } }], // ai
      },
    },
  });

  const aiPrompt2 = await prisma.item.create({
    data: {
      title: "Documentation Generator",
      contentType: "text",
      content: `Generate comprehensive documentation for the following code. Include:

1. **Overview**: Brief description of what the code does
2. **Parameters**: Detailed explanation of each parameter (type, purpose, constraints)
3. **Return Value**: What the function/component returns and when
4. **Usage Examples**: 2-3 practical examples showing different use cases
5. **Edge Cases**: Document any important edge cases or limitations
6. **Dependencies**: Note any external dependencies or requirements

Format the documentation in JSDoc style for functions or Markdown for components.

Code:
[PASTE CODE HERE]`,
      description: "Generate detailed documentation from code snippets",
      userId: user.id,
      itemTypeId: promptType.id,
      tags: {
        create: [{ tag: { connect: { id: tags[3].id } } }], // ai
      },
    },
  });

  const aiPrompt3 = await prisma.item.create({
    data: {
      title: "Refactoring Assistant",
      contentType: "text",
      content: `I need help refactoring the following code. Please:

1. **Analyze** the current implementation and identify code smells
2. **Suggest** specific refactoring techniques (extract method, rename variable, etc.)
3. **Provide** refactored version with explanations
4. **Highlight** the improvements (readability, performance, maintainability)
5. **Ensure** the refactored code maintains the same functionality

Focus on:
- Reducing complexity
- Improving naming
- Eliminating duplication
- Following SOLID principles
- Enhancing testability

Current code:
[PASTE CODE HERE]`,
      description: "AI-powered code refactoring guidance",
      userId: user.id,
      itemTypeId: promptType.id,
      isFavorite: true,
      tags: {
        create: [{ tag: { connect: { id: tags[3].id } } }], // ai
      },
    },
  });

  await Promise.all([
    prisma.itemCollection.create({
      data: { itemId: aiPrompt1.id, collectionId: aiCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: aiPrompt2.id, collectionId: aiCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: aiPrompt3.id, collectionId: aiCollection.id },
    }),
  ]);

  // Collection 3: DevOps
  console.log("🚀 Creating 'DevOps' collection...");
  const devopsCollection = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
      isFavorite: true,
    },
  });

  const devopsSnippet = await prisma.item.create({
    data: {
      title: "Next.js Dockerfile (Multi-stage)",
      contentType: "text",
      content: `FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]`,
      language: "dockerfile",
      description: "Optimized multi-stage Dockerfile for Next.js production deployments",
      userId: user.id,
      itemTypeId: snippetType.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[4].id } } }, // devops
          { tag: { connect: { id: tags[5].id } } }, // docker
        ],
      },
    },
  });

  const devopsCommand = await prisma.item.create({
    data: {
      title: "Deploy to Production",
      contentType: "text",
      content: `docker build -t myapp:latest . && \
docker tag myapp:latest registry.example.com/myapp:latest && \
docker push registry.example.com/myapp:latest && \
kubectl set image deployment/myapp myapp=registry.example.com/myapp:latest && \
kubectl rollout status deployment/myapp`,
      description: "Complete deployment pipeline: build, tag, push, and deploy to Kubernetes",
      userId: user.id,
      itemTypeId: commandType.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[4].id } } }, // devops
          { tag: { connect: { id: tags[5].id } } }, // docker
        ],
      },
    },
  });

  const devopsLink1 = await prisma.item.create({
    data: {
      title: "Docker Documentation",
      contentType: "text",
      url: "https://docs.docker.com/",
      description: "Official Docker documentation and best practices",
      userId: user.id,
      itemTypeId: linkType.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[4].id } } }, // devops
          { tag: { connect: { id: tags[5].id } } }, // docker
        ],
      },
    },
  });

  const devopsLink2 = await prisma.item.create({
    data: {
      title: "Kubernetes Patterns",
      contentType: "text",
      url: "https://kubernetes.io/docs/concepts/",
      description: "Kubernetes core concepts and design patterns",
      userId: user.id,
      itemTypeId: linkType.id,
      tags: {
        create: [{ tag: { connect: { id: tags[4].id } } }], // devops
      },
    },
  });

  await Promise.all([
    prisma.itemCollection.create({
      data: { itemId: devopsSnippet.id, collectionId: devopsCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: devopsCommand.id, collectionId: devopsCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: devopsLink1.id, collectionId: devopsCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: devopsLink2.id, collectionId: devopsCollection.id },
    }),
  ]);

  // Collection 4: Terminal Commands
  console.log("💻 Creating 'Terminal Commands' collection...");
  const terminalCollection = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
      defaultTypeId: commandType.id,
    },
  });

  const termCmd1 = await prisma.item.create({
    data: {
      title: "Interactive Git Rebase",
      contentType: "text",
      content: `git rebase -i HEAD~5`,
      description: "Interactively rebase the last 5 commits (squash, reword, edit)",
      userId: user.id,
      itemTypeId: commandType.id,
      tags: {
        create: [{ tag: { connect: { id: tags[6].id } } }], // git
      },
    },
  });

  const termCmd2 = await prisma.item.create({
    data: {
      title: "Docker System Cleanup",
      contentType: "text",
      content: `docker system prune -a --volumes`,
      description: "Remove all unused containers, networks, images, and volumes",
      userId: user.id,
      itemTypeId: commandType.id,
      tags: {
        create: [{ tag: { connect: { id: tags[5].id } } }], // docker
      },
    },
  });

  const termCmd3 = await prisma.item.create({
    data: {
      title: "Find and Kill Process by Port",
      contentType: "text",
      content: `lsof -ti:3000 | xargs kill -9`,
      description: "Kill the process running on port 3000 (macOS/Linux)",
      userId: user.id,
      itemTypeId: commandType.id,
      isPinned: true,
    },
  });

  const termCmd4 = await prisma.item.create({
    data: {
      title: "NPM Dedupe and Audit",
      contentType: "text",
      content: `npm dedupe && npm audit fix`,
      description: "Deduplicate dependencies and fix security vulnerabilities",
      userId: user.id,
      itemTypeId: commandType.id,
    },
  });

  await Promise.all([
    prisma.itemCollection.create({
      data: { itemId: termCmd1.id, collectionId: terminalCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: termCmd2.id, collectionId: terminalCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: termCmd3.id, collectionId: terminalCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: termCmd4.id, collectionId: terminalCollection.id },
    }),
  ]);

  // Collection 5: Design Resources
  console.log("🎨 Creating 'Design Resources' collection...");
  const designCollection = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
      defaultTypeId: linkType.id,
    },
  });

  const designLink1 = await prisma.item.create({
    data: {
      title: "Tailwind CSS Documentation",
      contentType: "text",
      url: "https://tailwindcss.com/docs",
      description: "Official Tailwind CSS documentation with searchable utilities",
      userId: user.id,
      itemTypeId: linkType.id,
      isFavorite: true,
      tags: {
        create: [{ tag: { connect: { id: tags[7].id } } }], // css
      },
    },
  });

  const designLink2 = await prisma.item.create({
    data: {
      title: "shadcn/ui Components",
      contentType: "text",
      url: "https://ui.shadcn.com/",
      description: "Beautifully designed, accessible components built with Radix UI and Tailwind",
      userId: user.id,
      itemTypeId: linkType.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // react
          { tag: { connect: { id: tags[8].id } } }, // design
        ],
      },
    },
  });

  const designLink3 = await prisma.item.create({
    data: {
      title: "Radix UI Primitives",
      contentType: "text",
      url: "https://www.radix-ui.com/primitives",
      description: "Unstyled, accessible components for building high-quality design systems",
      userId: user.id,
      itemTypeId: linkType.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } }, // react
          { tag: { connect: { id: tags[8].id } } }, // design
        ],
      },
    },
  });

  const designLink4 = await prisma.item.create({
    data: {
      title: "Lucide Icons",
      contentType: "text",
      url: "https://lucide.dev/",
      description: "Beautiful & consistent icon toolkit with 1000+ icons",
      userId: user.id,
      itemTypeId: linkType.id,
      tags: {
        create: [{ tag: { connect: { id: tags[8].id } } }], // design
      },
    },
  });

  await Promise.all([
    prisma.itemCollection.create({
      data: { itemId: designLink1.id, collectionId: designCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: designLink2.id, collectionId: designCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: designLink3.id, collectionId: designCollection.id },
    }),
    prisma.itemCollection.create({
      data: { itemId: designLink4.id, collectionId: designCollection.id },
    }),
  ]);

  console.log("✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   • 1 user created (demo@stash.io)`);
  console.log(`   • 7 system item types created`);
  console.log(`   • 5 collections created`);
  console.log(`   • 20 items created`);
  console.log(`   • 9 tags created`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
