import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const host = request.headers.get("host");

    if (host === "dashboard.pixseguro.pro" || host === "pixseguro.pro") {
      const url = request.nextUrl.clone();
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    if (host === "pay.pixseguro.pro") {
      const url = request.nextUrl.clone();
      url.pathname = `/public${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
