import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();

  const updatedTask = await prisma.task.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Task deleted successfully" });
}