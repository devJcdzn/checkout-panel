"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { createSession, deleteSession } from "@/app/lib/session";
import { prisma } from "@/utils/db";

const loginSchema = z.object({
  user: z.string().nonempty("Nome de usuário é obrigatório."),
  password: z.string().min(6, "A senha deve conter 6 caracteres."),
});

export async function login(previousState: any, formData: FormData) {
  const data = {
    user: formData.get("user"),
    password: formData.get("password"),
  };

  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: {
        user: validatedFields.error.flatten().fieldErrors.user || [],
        password: validatedFields.error.flatten().fieldErrors.password || [],
        authError: [],
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      user: validatedFields.data.user,
    },
  });

  if (!user)
    return {
      error: {
        authError: ["Usuário ou senha inválidos."],
      },
    };

  const isPasswordValid = await bcrypt.compare(
    validatedFields.data.password,
    user.password
  );

  if (!isPasswordValid) {
    return {
      error: {
        authError: ["Usuário ou senha inválidos."],
      },
    };
  }

  // Create session
  await createSession(user.id);
}

export async function logout() {
  await deleteSession();
}