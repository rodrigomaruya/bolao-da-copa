import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Área do usuário — precisa estar "logado" (cookie com email)
  if (pathname.startsWith("/palpites")) {
    const userEmail = req.cookies.get("bolaoUserEmail")?.value;
    if (!userEmail) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Área admin — precisa do cookie de senha (exceto a página de login)
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const isAdmin = req.cookies.get("admin")?.value === "true";
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/palpites/:path*", "/admin/:path*"],
};
