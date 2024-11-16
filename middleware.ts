import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host?.includes("localhost")) {
    return NextResponse.next();
  }

  if (host === "app.checkseguro.pro" || host === "checkseguro.pro") {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (host === "pay.checkseguro.pro") {
    const url = request.nextUrl.clone();
    url.pathname = `/public${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
