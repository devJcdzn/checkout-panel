import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get("panel@sessionToken");

  console.log(session);
  console.log(pathname);

  if (
    !pathname.includes("/checkout") ||
    !pathname.includes("/payment-checkout")
  ) {
    try {
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      // Logic to handle user here
      const user = jwt.verify(String(session), SECRET_KEY);
      request.headers.set("user", JSON.stringify(user));
      return NextResponse.next();
    } catch (err) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
