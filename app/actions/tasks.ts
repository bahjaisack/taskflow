"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTasks(userId: string) {
  try {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export async function createTask(formData: FormData, userId: string) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !userId) return { error: "Title and User ID are required" };

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task" };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return { error: "Failed to update task status" };
  }
}

export async function updateTaskDetails(
  taskId: string,
  data: {
    title: string;
    description?: string | null;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  }
) {
  if (!taskId || !data.title) {
    return { error: "Task ID and Title are required" };
  }

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        ...(data.status && { status: data.status }),
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update task details:", error);
    return { error: "Failed to update task details" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { error: "Failed to delete task" };
  }
}