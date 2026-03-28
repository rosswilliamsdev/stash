"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Settings,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link: LinkIcon,
  File,
  Image,
};

interface ItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
}

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantTypeColor?: string;
  typeIcons?: Array<{ icon: string; color: string }>;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  isPro: boolean;
  image: string | null;
}

interface SidebarProps {
  itemTypes: ItemType[];
  itemTypeCounts: Record<string, number>;
  collections: Collection[];
  user: User;
  className?: string;
}

function SidebarContent({
  itemTypes,
  itemTypeCounts,
  collections,
  user,
  onLinkClick,
}: SidebarProps & { onLinkClick?: () => void }) {
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections
    .filter((c) => !c.isFavorite)
    .slice(0, 3);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon || File;
  };

  return (
    <div className="flex h-full flex-col">
      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        className="flex-1 overflow-y-auto px-3 sidebar-scroll"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Types Section */}
        <div className="py-4">
          <button
            onClick={() => setTypesExpanded(!typesExpanded)}
            className="flex w-full items-center gap-2 px-2 py-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {typesExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Types
          </button>

          {typesExpanded && (
            <div className="mt-2 space-y-1">
              {itemTypes.map((type) => {
                const Icon = getIcon(type.icon);
                const count = itemTypeCounts[type.id] || 0;
                const isPro = type.name === "Files" || type.name === "Images";
                const typeSlug = type.name.toLowerCase();

                return (
                  <Link
                    key={type.id}
                    href={`/items/${typeSlug}`}
                    onClick={onLinkClick}
                    className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className="h-4 w-4"
                        style={{ color: type.color }}
                      />
                      <span className="group-hover:text-foreground transition-colors">
                        {type.name}
                      </span>
                      {isPro && !user.isPro && (
                        <span className="text-xs text-yellow-500">👑</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Collections Section */}
        <div className="py-4 border-t border-border">
          <button
            onClick={() => setCollectionsExpanded(!collectionsExpanded)}
            className="flex w-full items-center gap-2 px-2 py-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {collectionsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Collections
          </button>

          {collectionsExpanded && (
            <div className="mt-2 space-y-3">
              {/* Favorite Collections */}
              {favoriteCollections.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span>Favorites</span>
                  </div>
                  <div className="space-y-1">
                    {favoriteCollections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.id}`}
                        onClick={onLinkClick}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors group"
                      >
                        <span className="truncate group-hover:text-foreground transition-colors">
                          {collection.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {collection.itemCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Collections */}
              {recentCollections.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Recent</span>
                  </div>
                  <div className="space-y-1">
                    {recentCollections.map((collection) => (
                      <Link
                        key={collection.id}
                        href={`/collections/${collection.id}`}
                        onClick={onLinkClick}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                collection.dominantTypeColor || "#6b7280",
                            }}
                          />
                          <span className="truncate group-hover:text-foreground transition-colors">
                            {collection.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {collection.itemCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* View All Collections Link */}
              <div className="mt-3 px-2">
                <Link
                  href="/collections"
                  onClick={onLinkClick}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>View all collections</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback className="text-xs">
              {user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : user.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user.name || "User"}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.isPro ? "Pro Plan" : "Free Plan"}
            </div>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  itemTypes,
  itemTypeCounts,
  collections,
  user,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden lg:flex w-64 h-full border-r border-border bg-card",
        className
      )}
    >
      <SidebarContent
        itemTypes={itemTypes}
        itemTypeCounts={itemTypeCounts}
        collections={collections}
        user={user}
      />
    </aside>
  );
}

export function SidebarMobile({
  itemTypes,
  itemTypeCounts,
  collections,
  user,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" />
        }
      >
        <PanelLeft className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <SidebarContent
          itemTypes={itemTypes}
          itemTypeCounts={itemTypeCounts}
          collections={collections}
          user={user}
          onLinkClick={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
