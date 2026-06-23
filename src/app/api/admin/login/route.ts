import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { senha } = await req.json();
  if (senha !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha errada" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", "true", { httpOnly: true, maxAge: 60 * 60 * 4 });
  return res;
}
