import { prisma } from "@/lib/prisma";

/**
 * Item type information
 */
export interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

/**
 * Extended Item type with ItemType relation for dashboard display
 */
export interface ItemWithType {
  id: string;
  title: string;
  contentType: string;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  url: string | null;
  description: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  itemTypeId: string;
  itemType: {
    id: string;
    name: string;
    icon: string;
    color: string;
    isSystem: boolean;
  };
}

/**
 * Fetch pinned items for a user, ordered by most recently updated
 * @param userId - The user's ID
 * @param limit - Maximum number of items to return (default: 5)
 * @returns Array of pinned items with their types
 */
export async function getPinnedItems(
  userId: string,
  limit: number = 5,
): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: {
      userId,
      isPinned: true,
    },
    include: {
      itemType: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          isSystem: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });

  return items;
}

/**
 * Fetch recent items for a user, ordered by most recently created
 * @param userId - The user's ID
 * @param limit - Maximum number of items to return (default: 10)
 * @returns Array of recent items with their types
 */
export async function getRecentItems(
  userId: string,
  limit: number = 10,
): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: {
      userId,
    },
    include: {
      itemType: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          isSystem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return items;
}

/**
 * Get item counts by type for a user
 * Used for dashboard stats
 * @param userId - The user's ID
 * @returns Object with total count and counts by type
 */
export async function getItemStats(userId: string) {
  // Get total count
  const totalItems = await prisma.item.count({
    where: { userId },
  });

  // Get counts by type
  const itemsByType = await prisma.item.groupBy({
    by: ["itemTypeId"],
    where: { userId },
    _count: {
      id: true,
    },
  });

  // Get pinned count
  const pinnedCount = await prisma.item.count({
    where: {
      userId,
      isPinned: true,
    },
  });

  // Get favorite count
  const favoriteCount = await prisma.item.count({
    where: {
      userId,
      isFavorite: true,
    },
  });

  return {
    total: totalItems,
    pinned: pinnedCount,
    favorites: favoriteCount,
    byType: itemsByType.map((item) => ({
      itemTypeId: item.itemTypeId,
      count: item._count.id,
    })),
  };
}

/**
 * Get all system item types in specific order
 * Order: Snippets, Prompts, Commands, Notes, Links, Images, Files
 * @returns Array of system item types
 */
export async function getSystemItemTypes(): Promise<ItemType[]> {
  const types = await prisma.itemType.findMany({
    where: {
      isSystem: true,
    },
  });

  // Sort in desired order
  const order = [
    "Snippets",
    "Prompts",
    "Commands",
    "Notes",
    "Links",
    "Files",
    "Images",
  ];
  return types.sort((a, b) => {
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    return aIndex - bIndex;
  });
}

/**
 * Get item counts by type ID for a user
 * Returns a Record mapping type ID to count
 * @param userId - The user's ID
 * @returns Record of type ID to count
 */
export async function getItemTypeCounts(
  userId: string,
): Promise<Record<string, number>> {
  const stats = await getItemStats(userId);

  const counts: Record<string, number> = {};
  stats.byType.forEach((item) => {
    counts[item.itemTypeId] = item.count;
  });

  return counts;
}
