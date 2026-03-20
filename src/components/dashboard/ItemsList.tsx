import Link from "next/link";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link as LinkIcon,
  File,
  Image,
  Pin,
  Clock,
} from "lucide-react";

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
}

interface Item {
  id: string;
  title: string;
  contentType: string;
  content?: string;
  url?: string;
  isPinned: boolean;
  itemTypeId: string;
}

interface ItemsListProps {
  items: Item[];
  itemTypes: ItemType[];
  title: string;
  showIcon?: "pin" | "clock";
  emptyMessage?: string;
}

export function ItemsList({
  items,
  itemTypes,
  title,
  showIcon = "clock",
  emptyMessage = "No items to display",
}: ItemsListProps) {
  const getItemType = (itemTypeId: string) => {
    return itemTypes.find((type) => type.id === itemTypeId);
  };

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon || File;
  };

  const HeaderIcon = showIcon === "pin" ? Pin : Clock;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <HeaderIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const itemType = getItemType(item.itemTypeId);
            if (!itemType) return null;

            const Icon = getIcon(itemType.icon);
            const typeSlug = itemType.name.toLowerCase();

            return (
              <Link
                key={item.id}
                href={`/items/${typeSlug}/${item.id}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:bg-accent/50 hover:shadow-sm"
              >
                <div
                  className="rounded-md p-2 flex-shrink-0"
                  style={{ backgroundColor: `${itemType.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: itemType.color }} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate group-hover:text-foreground transition-colors">
                      {item.title}
                    </h3>
                    {item.isPinned && showIcon === "clock" && (
                      <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  {item.content && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {item.content}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <span
                    className="text-xs px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: `${itemType.color}15`,
                      color: itemType.color,
                    }}
                  >
                    {itemType.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
