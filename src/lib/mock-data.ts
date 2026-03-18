// Mock data for dashboard UI development
// Based on Prisma schema from project-overview.md

export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  isPro: false,
  image: null,
};

export const mockItemTypes = [
  {
    id: "type_snippet",
    name: "Snippets",
    icon: "Code",
    color: "#3b82f6",
    isSystem: true,
  },
  {
    id: "type_prompt",
    name: "Prompts",
    icon: "Sparkles",
    color: "#8b5cf6",
    isSystem: true,
  },
  {
    id: "type_command",
    name: "Commands",
    icon: "Terminal",
    color: "#f97316",
    isSystem: true,
  },
  {
    id: "type_note",
    name: "Notes",
    icon: "StickyNote",
    color: "#fde047",
    isSystem: true,
  },
  {
    id: "type_link",
    name: "Links",
    icon: "Link",
    color: "#10b981",
    isSystem: true,
  },
  {
    id: "type_file",
    name: "Files",
    icon: "File",
    color: "#6b7280",
    isSystem: true,
  },
  {
    id: "type_image",
    name: "Images",
    icon: "Image",
    color: "#ec4899",
    isSystem: true,
  },
];

export const mockCollections = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Common React patterns and best practices",
    isFavorite: true,
    itemCount: 12,
    userId: mockUser.id,
  },
  {
    id: "col_2",
    name: "Python Scripts",
    description: "Useful Python automation scripts",
    isFavorite: false,
    itemCount: 8,
    userId: mockUser.id,
  },
  {
    id: "col_3",
    name: "AI Prompts",
    description: "Curated prompts for better AI responses",
    isFavorite: false,
    itemCount: 15,
    userId: mockUser.id,
  },
  {
    id: "col_4",
    name: "Interview Prep",
    description: "Technical interview resources",
    isFavorite: false,
    itemCount: 6,
    userId: mockUser.id,
  },
  {
    id: "col_5",
    name: "DevOps Commands",
    description: "Essential DevOps CLI commands",
    isFavorite: true,
    itemCount: 9,
    userId: mockUser.id,
  },
  {
    id: "col_6",
    name: "API References",
    description: "Useful API documentation links",
    isFavorite: false,
    itemCount: 11,
    userId: mockUser.id,
  },
];

export const mockItems = [
  // Snippets
  {
    id: "item_1",
    title: "useDebounce Hook",
    contentType: "text",
    content: "const useDebounce = (value, delay) => { ... }",
    itemTypeId: "type_snippet",
    userId: mockUser.id,
    isFavorite: false,
    isPinned: true,
  },
  {
    id: "item_2",
    title: "Custom Error Boundary",
    contentType: "text",
    content: "class ErrorBoundary extends React.Component { ... }",
    itemTypeId: "type_snippet",
    userId: mockUser.id,
    isFavorite: true,
    isPinned: false,
  },

  // Prompts
  {
    id: "item_3",
    title: "Code Review Prompt",
    contentType: "text",
    content: "Review this code for best practices and potential bugs...",
    itemTypeId: "type_prompt",
    userId: mockUser.id,
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_4",
    title: "System Design Prompt",
    contentType: "text",
    content: "Design a scalable system for...",
    itemTypeId: "type_prompt",
    userId: mockUser.id,
    isFavorite: false,
    isPinned: true,
  },

  // Commands
  {
    id: "item_5",
    title: "Git Rebase Interactive",
    contentType: "text",
    content: "git rebase -i HEAD~3",
    itemTypeId: "type_command",
    userId: mockUser.id,
    isFavorite: true,
    isPinned: false,
  },
  {
    id: "item_6",
    title: "Docker Cleanup",
    contentType: "text",
    content: "docker system prune -a --volumes",
    itemTypeId: "type_command",
    userId: mockUser.id,
    isFavorite: false,
    isPinned: false,
  },

  // Notes
  {
    id: "item_7",
    title: "Meeting Notes - Q1 Planning",
    contentType: "text",
    content: "## Q1 Goals\n- Launch new feature\n- Improve performance",
    itemTypeId: "type_note",
    userId: mockUser.id,
    isFavorite: false,
    isPinned: false,
  },

  // Links
  {
    id: "item_8",
    title: "React Docs",
    contentType: "text",
    url: "https://react.dev",
    itemTypeId: "type_link",
    userId: mockUser.id,
    isFavorite: false,
    isPinned: false,
  },
  {
    id: "item_9",
    title: "TypeScript Handbook",
    contentType: "text",
    url: "https://www.typescriptlang.org/docs/handbook/",
    itemTypeId: "type_link",
    userId: mockUser.id,
    isFavorite: true,
    isPinned: false,
  },
];

// Item type counts (derived from mockItems)
export const mockItemTypeCounts = {
  type_snippet: 24,
  type_prompt: 12,
  type_command: 8,
  type_note: 15,
  type_link: 31,
  type_file: 0,
  type_image: 0,
};
