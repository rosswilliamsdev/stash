export default function ItemTypePage({
  params,
}: {
  params: { type: string };
}) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-2xl font-bold capitalize">{params.type}</h2>
      <p className="text-muted-foreground mt-2">
        Items of type &quot;{params.type}&quot; will be displayed here.
      </p>
    </div>
  );
}
