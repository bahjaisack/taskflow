import { auth, signOut } from "@/auth"; 
import { redirect } from "next/navigation";
import { getTasks } from "@/app/actions/tasks";
import KanbanBoard from "../components/KanbanBoard";

export default async function DashboardPage() {
  const session = await auth();

  // Guard both session and user.id to satisfy TypeScript
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Extracted user ID with a guaranteed string type
  const userId = session.user.id;
  const userTasks = await getTasks(userId);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {session.user.email}
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center shadow-sm">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="h-6 w-px bg-stone-200 dark:bg-stone-800" />

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg border border-stone-200 dark:border-stone-800 transition"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="py-6">
        <KanbanBoard initialTasks={userTasks} userId={userId} />
      </main>
    </div>
  );
}