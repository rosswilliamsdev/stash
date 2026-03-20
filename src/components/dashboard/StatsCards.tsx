import { Folder, Star, FileText, Heart } from "lucide-react";

interface StatsCardsProps {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export function StatsCards({
  totalItems,
  totalCollections,
  favoriteItems,
  favoriteCollections,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Collections",
      value: totalCollections,
      icon: Folder,
      color: "text-purple-500",
    },
    {
      label: "Favorite Items",
      value: favoriteItems,
      icon: Heart,
      color: "text-pink-500",
    },
    {
      label: "Favorite Collections",
      value: favoriteCollections,
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`rounded-full bg-accent p-3 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
