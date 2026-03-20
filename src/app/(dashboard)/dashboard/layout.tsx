import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarMobile } from "@/components/layout/Sidebar";
import {
  mockUser,
  mockItemTypes,
  mockItemTypeCounts,
  mockCollections,
} from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center gap-4 px-6">
          {/* Mobile Sidebar Trigger */}
          <SidebarMobile
            itemTypes={mockItemTypes}
            itemTypeCounts={mockItemTypeCounts}
            collections={mockCollections}
            user={mockUser}
          />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              S
            </div>
            <h1 className="text-xl font-semibold">Stash</h1>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items, collections, tags..."
              className="pl-9 bg-background"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* New Item Button */}
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Item
          </Button>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
