"use client";

import { useState, useTransition } from "react";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  updateTaskDetails,
} from "../actions/tasks";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export default function TaskDashboard({
  tasks,
  userId,
}: {
  tasks: Task[];
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      await createTask(formData, userId);
      form.reset();
    });
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    startTransition(async () => {
      await updateTaskDetails(editingTask.id, {
        title,
        description,
        status: editingTask.status,
      });
      setEditingTask(null);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-stone-900 dark:text-stone-100">
          Create New Task
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Task title..."
              required
              className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 dark:text-stone-100"
            />
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 dark:text-stone-100"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Your Tasks ({tasks.length})
        </h2>
        {tasks.length === 0 ? (
          <p className="text-stone-500">No tasks created yet.</p>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm"
              >
                <div className="space-y-1 max-w-md">
                  <h3
                    className={`font-medium ${
                      task.status === "COMPLETED"
                        ? "line-through text-stone-400"
                        : "text-stone-900 dark:text-stone-100"
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as Task["status"];
                      startTransition(async () => {
                        await updateTaskStatus(task.id, newStatus);
                      });
                    }}
                    className="px-3 py-1.5 text-sm bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-medium text-stone-900 dark:text-stone-100"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  <button
                    onClick={() => setEditingTask(task)}
                    className="px-3 py-1.5 text-sm bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 rounded-md transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await deleteTask(task.id);
                      })
                    }
                    className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Edit Task
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-stone-700 dark:text-stone-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingTask.title}
                  required
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-stone-700 dark:text-stone-300">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingTask.description || ""}
                  rows={3}
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-sm bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}