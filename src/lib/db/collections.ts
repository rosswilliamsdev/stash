import { prisma } from "@/lib/prisma";

export interface CollectionWithStats {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantTypeColor: string;
  typeIcons: Array<{ icon: string; color: string }>;
}

/**
 * Fetches collections for a user with computed stats
 * - Item count per collection
 * - Dominant item type (most common) for border color
 * - All unique item types for icon display
 */
export async function getCollectionsWithStats(
  userId: string
): Promise<CollectionWithStats[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return collections.map((collection) => {
    const items = collection.items.map((ic) => ic.item);
    const itemCount = items.length;

    // Count occurrences of each item type
    const typeCounts = new Map<string, { count: number; type: { icon: string; color: string } }>();

    items.forEach((item) => {
      const typeId = item.itemType.id;
      const existing = typeCounts.get(typeId);
      if (existing) {
        existing.count++;
      } else {
        typeCounts.set(typeId, {
          count: 1,
          type: {
            icon: item.itemType.icon,
            color: item.itemType.color,
          },
        });
      }
    });

    // Find dominant type (most common)
    let dominantTypeColor = "#6b7280"; // default gray if no items
    if (typeCounts.size > 0) {
      const dominant = Array.from(typeCounts.values()).reduce((max, current) =>
        current.count > max.count ? current : max
      );
      dominantTypeColor = dominant.type.color;
    }

    // Get unique type icons for display
    const typeIcons = Array.from(typeCounts.values()).map((tc) => tc.type);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount,
      dominantTypeColor,
      typeIcons,
    };
  });
}

/**
 * Fetches recent collections (limit 6 for dashboard)
 */
export async function getRecentCollections(
  userId: string,
  limit = 6
): Promise<CollectionWithStats[]> {
  const allCollections = await getCollectionsWithStats(userId);
  return allCollections.slice(0, limit);
}

/**
 * Fetches all collections for sidebar display
 * Used by sidebar to show favorites + recent collections
 */
export async function getAllCollectionsForSidebar(
  userId: string
): Promise<CollectionWithStats[]> {
  return getCollectionsWithStats(userId);
}
