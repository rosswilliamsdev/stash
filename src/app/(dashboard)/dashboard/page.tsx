import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/CollectionsGrid";
import { ItemsList } from "@/components/dashboard/ItemsList";
import { getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems, getItemStats } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";
import {
  mockUser,
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
} from "@/lib/mock-data";

export default async function DashboardPage() {
  // TODO: Get real user ID from auth session
  // For now, looking up demo user from seed data
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@stash.io" },
  });

  if (!demoUser) {
    return <div>User not found. Please run: npm run db:seed</div>;
  }

  // Fetch real data from database
  const collections = await getRecentCollections(demoUser.id, 6);
  const pinnedItems = await getPinnedItems(demoUser.id, 5);
  const recentItems = await getRecentItems(demoUser.id, 10);
  const itemStats = await getItemStats(demoUser.id);

  // Calculate collection stats
  const collectionCount = await prisma.collection.count({
    where: { userId: demoUser.id },
  });

  const favoriteCollectionCount = await prisma.collection.count({
    where: {
      userId: demoUser.id,
      isFavorite: true,
    },
  });

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        itemTypes={mockItemTypes}
        itemTypeCounts={mockItemTypeCounts}
        collections={mockCollections}
        user={mockUser}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Stats Cards */}
        <StatsCards
          totalItems={itemStats.total}
          totalCollections={collectionCount}
          favoriteItems={itemStats.favorites}
          favoriteCollections={favoriteCollectionCount}
        />

        {/* Collections - Now using real data! */}
        <CollectionsGrid collections={collections} />

        {/* Pinned Items */}
        {pinnedItems.length > 0 && (
          <ItemsList
            items={pinnedItems}
            title="Pinned Items"
            showIcon="pin"
            emptyMessage="No pinned items"
          />
        )}

        {/* Recent Items */}
        <ItemsList
          items={recentItems}
          title="Recent Items"
          showIcon="clock"
          emptyMessage="No recent items"
        />
      </main>
    </>
  );
}
