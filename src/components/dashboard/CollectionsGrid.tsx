import Link from "next/link";
import { Folder, Star } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantTypeColor: string;
  typeIcons: Array<{ icon: string; color: string }>;
}

interface CollectionsGridProps {
  collections: Collection[];
  title?: string;
  showCount?: boolean;
}

export function CollectionsGrid({
  collections,
  title = "Collections",
  showCount = true,
}: CollectionsGridProps) {
  // Helper to render lucide icon by name
  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="h-3 w-3" style={{ color }} />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showCount && (
          <span className="text-sm text-muted-foreground">
            {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => {
          return (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group relative rounded-lg border bg-card p-4 transition-all hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/20"
              style={{ borderColor: collection.dominantTypeColor }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="rounded-md bg-accent p-2 text-muted-foreground">
                    <Folder className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate group-hover:text-foreground transition-colors">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-muted-foreground">
                        {collection.itemCount} item{collection.itemCount !== 1 ? "s" : ""}
                      </p>
                      {collection.typeIcons.length > 0 && (
                        <div className="flex items-center gap-1">
                          {collection.typeIcons.slice(0, 3).map((typeIcon, idx) => (
                            <div key={idx} className="flex items-center">
                              {renderIcon(typeIcon.icon, typeIcon.color)}
                            </div>
                          ))}
                          {collection.typeIcons.length > 3 && (
                            <span className="text-xs text-muted-foreground ml-0.5">
                              +{collection.typeIcons.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {collection.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 shrink-0" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
