export default function AdminLoading() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-white border-r border-(--color-border) p-4">
        <div className="h-6 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}
