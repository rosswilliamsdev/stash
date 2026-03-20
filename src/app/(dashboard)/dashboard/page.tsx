import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/CollectionsGrid";
import { ItemsList } from "@/components/dashboard/ItemsList";
import {
  mockUser,
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
  mockItems,
} from "@/lib/mock-data";

export default function DashboardPage() {
  // Calculate stats
  const totalItems = mockItems.length;
  const totalCollections = mockCollections.length;
  const favoriteItems = mockItems.filter((item) => item.isFavorite).length;
  const favoriteCollections = mockCollections.filter(
    (col) => col.isFavorite
  ).length;

  // Get pinned items
  const pinnedItems = mockItems.filter((item) => item.isPinned);

  // Get 10 most recent items (mock data doesn't have timestamps, so just take first 10)
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

        {/* Collections */}
        <CollectionsGrid collections={mockCollections} />

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
