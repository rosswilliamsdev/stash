export default function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-2xl font-bold">Collection</h2>
      <p className="text-muted-foreground mt-2">
        Collection &quot;{params.id}&quot; will be displayed here.
      </p>
    </div>
  );
}
