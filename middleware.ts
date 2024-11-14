import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;

  // Redirecionar para o painel administrativo se for `admin.seudominio.com`
  if (hostname === "app.checkseguro.pro" || "checkseguro.pro") {
    return NextResponse.rewrite(new URL("/panel", request.url));
  }

  // Redirecionar para a área pública para `app.seudominio.com`
  if (hostname === "pay.checkseguro.pro") {
    return NextResponse.rewrite(new URL("/checkout", request.url));
  }

  // Redirecionar para a página pública padrão para outros casos
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
