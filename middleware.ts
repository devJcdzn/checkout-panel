import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currentPath);
  const isAuthRoute = authRoutes.includes(currentPath);

  const cookie = (await cookies()).get("app@session")?.value;

  const session = await decrypt(cookie ?? "");

  if(currentPath === "/") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && session?.id) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
