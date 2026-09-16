"use client";

import { useState, useTransition } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  createTask,
  updateTaskStatus,
  updateTaskDetails,
  deleteTask,
} from "@/app/actions/tasks";
import TaskModal from "./TaskModal";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

const COLUMNS: { id: Task["status"]; title: string; color: string }[] = [
  { id: "PENDING", title: "Pending ", color: "border-amber-500" },
  { id: "IN_PROGRESS", title: "In Progress ", color: "border-blue-500" },
  { id: "COMPLETED", title: "Completed ", color: "border-emerald-500" },
];

export default function KanbanBoard({
  initialTasks,
  userId,
}: {
  initialTasks: Task[];
  userId: string;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [, startTransition] = useTransition();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task["status"];

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    startTransition(async () => {
      const res = await updateTaskStatus(draggableId, newStatus);
      if (res?.error) {
        setTasks(initialTasks);
      }
    });
  };

  const handleSaveTask = (data: {
    title: string;
    description: string;
    status: Task["status"];
  }) => {
    if (editingTask) {
     setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t))
      );

      startTransition(async () => {
        await updateTaskDetails(editingTask.id, {
          title: data.title,
          description: data.description,
          status: data.status,
        });
      });
    } else {
      const tempId = Date.now().toString();
      const tempTask: Task = {
        id: tempId,
        title: data.title,
        description: data.description,
        status: data.status,
      };

      setTasks((prev) => [tempTask, ...prev]);

      startTransition(async () => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);

        const res = await createTask(formData, userId);

        if (res?.success && data.status !== "PENDING") {
        }
      });
    }
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    startTransition(async () => {
      const res = await deleteTask(taskId);
      if (res?.error) {
        setTasks(initialTasks);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="font-bold text-stone-900 dark:text-stone-100">
            Kanban Board
          </h2>
          <p className="text-xs text-stone-500">
            Manage and organize your current tasks
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition shadow flex items-center gap-2"
        >
          <span>+</span> Add New Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = tasks.filter((t) => t.status === column.id);

            return (
              <div
                key={column.id}
                className={`bg-stone-100 dark:bg-stone-900/60 rounded-xl p-4 border-t-4 ${column.color} shadow-sm flex flex-col min-h-[500px]`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-stone-800 dark:text-stone-200">
                    {column.title}
                  </h3>
                  <span className="text-xs font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2.5 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 transition-colors rounded-lg p-1 ${
                        snapshot.isDraggingOver
                          ? "bg-stone-200/50 dark:bg-stone-800/50"
                          : ""
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 mb-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm transition-all ${
                                snapshot.isDragging
                                  ? "shadow-lg ring-2 ring-indigo-500 rotate-1"
                                  : "hover:border-stone-300 dark:hover:border-stone-600"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingTask(task);
                                      setIsModalOpen(true);
                                    }}
                                    className="p-1 text-stone-400 hover:text-indigo-500 transition"
                                    title="Edit Task"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDelete(task.id)}
                                    className="p-1 text-stone-400 hover:text-red-500 transition"
                                    title="Delete Task"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              {task.description && (
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
      />
    </div>
  );
}