export default function DashboardPage() {
  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Sidebar</h2>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-semibold">Main</h2>
      </main>
    </>
  );
}
