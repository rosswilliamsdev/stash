import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/CollectionsGrid";
import { ItemsList } from "@/components/dashboard/ItemsList";
import { getRecentCollections } from "@/lib/db/collections";
import { prisma } from "@/lib/prisma";
import {
  mockUser,
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
  mockItems,
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

  // Fetch real collections from database
  const collections = await getRecentCollections(demoUser.id, 6);

  // Calculate stats (still using mock data for now)
  const totalItems = mockItems.length;
  const totalCollections = mockCollections.length;
  const favoriteItems = mockItems.filter((item) => item.isFavorite).length;
  const favoriteCollections = mockCollections.filter(
    (col) => col.isFavorite
  ).length;

  // Get pinned items (still using mock data for now)
  const pinnedItems = mockItems.filter((item) => item.isPinned);

  // Get 10 most recent items (still using mock data for now)
  const recentItems = mockItems.slice(0, 10);

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
          totalItems={totalItems}
          totalCollections={totalCollections}
          favoriteItems={favoriteItems}
          favoriteCollections={favoriteCollections}
        />

        {/* Collections - Now using real data! */}
        <CollectionsGrid collections={collections} />

        {/* Pinned Items */}
        {pinnedItems.length > 0 && (
          <ItemsList
            items={pinnedItems}
            itemTypes={mockItemTypes}
            title="Pinned Items"
            showIcon="pin"
            emptyMessage="No pinned items"
          />
        )}

        {/* Recent Items */}
        <ItemsList
          items={recentItems}
          itemTypes={mockItemTypes}
          title="Recent Items"
          showIcon="clock"
          emptyMessage="No recent items"
        />
      </main>
    </>
  );
}
