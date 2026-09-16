export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 animate-pulse">
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="h-7 w-32 bg-stone-200 dark:bg-stone-800 rounded-lg" />
          <div className="flex items-center gap-3">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-stone-200 dark:bg-stone-800 rounded ml-auto" />
              <div className="h-3 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="h-16 bg-white dark:bg-stone-900 rounded-xl mb-6 border border-stone-200 dark:border-stone-800" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              className="bg-stone-100 dark:bg-stone-900/60 rounded-xl p-4 min-h-[500px] border border-stone-200 dark:border-stone-800 flex flex-col gap-3"
            >
              <div className="h-6 w-28 bg-stone-200 dark:bg-stone-800 rounded mb-2" />
              <div className="h-24 bg-white dark:bg-stone-800 rounded-lg shadow-sm" />
              <div className="h-20 bg-white dark:bg-stone-800 rounded-lg shadow-sm" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}