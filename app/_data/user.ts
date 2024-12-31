import { prisma } from "@/utils/db";
import { verifySession } from "../lib/session";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();

  // Add Fetch user data
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
  });

  const filteredUser = userDTO(user);

  return filteredUser;
});

function userDTO(user: any) {
  return {
    name: user.name,
    user: user.user,
    photoUrl: user.photoUrl,
    role: user?.role,
  };
}
