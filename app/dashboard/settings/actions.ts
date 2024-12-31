"use server";

import { verifySession } from "@/app/lib/session";
import { z } from "zod";

import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";

const updateUserSchema = z.object({
  name: z.string().optional(),
  prevPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function updateUser(previousState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    prevPassword: formData.get("prevPassword"),
    newPassword: formData.get("newPassword"),
  };

  if (data.prevPassword && !data.newPassword) {
    return {
      error: {
        newPassword: ["A nova senha é obrigatória."],
      },
    };
  }

  if (!data.prevPassword && data.newPassword) {
    return {
      error: {
        prevPassword: ["A senha anterior é obrigatória."],
      },
    };
  }

  const validatedFields = updateUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: {
        name: validatedFields.error.flatten().fieldErrors.name || [],
        prevPassword:
          validatedFields.error.flatten().fieldErrors.prevPassword || [],
        newPassword:
          validatedFields.error.flatten().fieldErrors.newPassword || [],
        authError: [],
      },
    };
  }

  try {
    const { userId } = await verifySession();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        error: {
          authError: ["Usuário não encontrado."],
        },
      };
    }

    if (
      validatedFields.data.prevPassword &&
      !(await bcrypt.compare(validatedFields.data.prevPassword, user.password))
    ) {
      return {
        error: {
          prevPassword: ["Senha antiga inválida."],
        },
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: validatedFields.data.name || user.name,
        password: validatedFields.data.newPassword
          ? await bcrypt.hash(validatedFields.data.newPassword, 10)
          : user.password,
      },
    });

    revalidatePath("/dashboard/settings");
  } catch (err) {}
}
