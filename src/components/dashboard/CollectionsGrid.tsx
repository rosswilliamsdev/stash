import Link from "next/link";
import { Folder, Star } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  description?: string;
  isFavorite: boolean;
  itemCount: number;
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
              className="group relative rounded-lg border border-border bg-card p-4 transition-all hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/20"
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
                    <p className="text-xs text-muted-foreground mt-2">
                      {collection.itemCount} item{collection.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {collection.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
