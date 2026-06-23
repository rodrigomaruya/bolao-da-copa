import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  const jogos = await prisma.jogo.findMany({ orderBy: { dataJogo: "asc" } });
  return NextResponse.json(jogos);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { timeCasa, timeFora, dataJogo, premioUrl } = await req.json();

  const jogo = await prisma.jogo.create({
    data: { timeCasa, timeFora, dataJogo: new Date(dataJogo), premioUrl },
  });

  return NextResponse.json(jogo);
}
