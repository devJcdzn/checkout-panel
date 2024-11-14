import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  console.log("Middleware active. Host:", host);

  if (host === "app.checkseguro.pro") {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

  if (host === "checkseguro.pro") {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

  if (host === "pay.checkseguro.pro") {
    return NextResponse.rewrite(new URL("/public", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
