import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const { golsCasa, golsFora } = await req.json();

  const jogo = await prisma.jogo.update({
    where: { id: id },
    data: { golsCasa, golsFora, finalizado: true },
  });

  const palpites = await prisma.palpite.findMany({
    where: { jogoId: id },
  });

  for (const palpite of palpites) {
    const acertou =
      palpite.golsCasa === golsCasa && palpite.golsFora === golsFora;

    await prisma.palpite.update({
      where: { id: palpite.id },
      data: { acertou },
    });

    if (acertou) {
      await prisma.user.update({
        where: { id: palpite.userId },
        data: { pontos: { increment: 1 } },
      });
    }
  }

  const vencedores = await prisma.palpite.findMany({
    where: { jogoId: id, acertou: true },
    include: { user: true },
  });
  if (jogo.premioUrl) {
    for (const v of vencedores) {
      await resend.emails.send({
        from: "Bolao<premio@achadinhojp.shop>",
        to: v.user.email,
        subject: "🌽 Você ganhou UM MILHÃO no bolão!",
        html: `
          <div style="font-family: sans-serif; text-align: center; padding: 24px;">
            <h1>🏆 VOCÊ CRAVOU O PLACAR!</h1>
            <p style="font-size: 18px;">Parabéns <strong>${v.user.name}</strong>!</p>
            <p style="font-size: 16px;">
                Você acertou o placar exato e ganhou o prêmio máximo do bolão...
            </p>
            <p style="font-size: 28px; font-weight: bold;">UM MILHÃO! 🌽</p>
            <img src="${jogo.premioUrl}" width="300" style="border-radius: 12px; margin: 16px 0;" />
            <p style="font-size: 13px; color: #888;">
               * O milhão pode ou não ser comestível. Não nos responsabilizamos.
            </p>
          </div>`,
      });
    }
  }

  return NextResponse.json({ jogo, vencedores: vencedores.length });
}
