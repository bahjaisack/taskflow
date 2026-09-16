import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, userId } = body;

  if (!title || !userId) {
    return NextResponse.json({ error: "Title and userId required" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: { title, description, userId },
  });

  return NextResponse.json(task, { status: 201 });
}