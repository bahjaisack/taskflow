import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updatedTask = await prisma.task.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Task deleted successfully" });
}