import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const palpites = await prisma.palpite.findMany({
    include: { user: true, jogo: true },
    orderBy: { jogo: { dataJogo: "asc" } },
  });

  return NextResponse.json(palpites);
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("bolaoUserId")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { jogoId, golsCasa, golsFora } = await req.json();

  // Bloqueia palpite duplicado
  const jaExiste = await prisma.palpite.findUnique({
    where: { userId_jogoId: { userId, jogoId } },
  });

  if (jaExiste) {
    return NextResponse.json(
      { error: "Você já deu seu palpite nesse jogo." },
      { status: 409 },
    );
  }

  const palpite = await prisma.palpite.create({
    data: { userId, jogoId, golsCasa, golsFora },
  });

  return NextResponse.json(
    { success: "Palpite envidado com sucesso!", ok: true },
    { status: 200 },
  );
}
