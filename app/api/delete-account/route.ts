import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. delete user from DB
  await prisma.user.delete({
    where: { id: session.user.id },
  });

  // 2. IMPORTANT: clear auth cookies (this fixes your issue)
  const cookieStore = await cookies();

  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  return NextResponse.json({ success: true });
}
