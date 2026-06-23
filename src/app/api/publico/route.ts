import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const jogos = await prisma.jogo.findMany({
    include: {
      palpites: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { dataJogo: "asc" },
  });

  const ranking = await prisma.user.findMany({
    select: { name: true, pontos: true },
    orderBy: { pontos: "desc" },
  });

  return NextResponse.json({ jogos, ranking });
}
