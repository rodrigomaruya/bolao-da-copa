import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email },
  });

  const res = NextResponse.json(user);
  res.cookies.set("bolaoUserEmail", user.email, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    sameSite: "lax",
  });
  res.cookies.set("bolaoUserId", user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return res;
}
