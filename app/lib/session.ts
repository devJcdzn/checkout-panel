import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SessionPayload = {
  id: number;
  expires: Date;
};

const key = new TextEncoder().encode(
  process.env.JWT_SECRET || "ajbowindOINOINCOIACCNaincoicNOINOCNvioIVNOINVOIVSN"
);

const cookie = {
  name: "app@session", // change "app" to your app-name
  options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  duration: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

export async function encrypt(payload: { id: number; expires: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as { id: number };
  } catch (err) {
    return null;
  }
}

export async function createSession(userId: number) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ id: userId, expires });

  (await cookies()).set(cookie.name, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires,
  });

  redirect("/dashboard"); // redirect user to you app protected
}

export async function verifySession() {
  const sessionCookie = (await cookies()).get(cookie.name)?.value;
  if (!sessionCookie) {
    return redirect("/login");
  }

  const session = await decrypt(sessionCookie);
  if (!session?.id) {
    return redirect("/login");
  }

  return { userId: session.id };
}

export async function deleteSession() {
  (await cookies()).delete(cookie.name);
  redirect("/login"); // redirect user to login page
}
