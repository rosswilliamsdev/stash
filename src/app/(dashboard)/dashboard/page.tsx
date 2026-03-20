import { Sidebar } from "@/components/layout/Sidebar";
import {
  mockUser,
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
} from "@/lib/mock-data";

export default function DashboardPage() {
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
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-semibold">Main</h2>
      </main>
    </>
  );
}
