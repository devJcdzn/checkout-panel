"use server";

import { z } from "zod";
import { prisma } from "@/utils/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

const signUpSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório."),
  user: z.string().min(3, "Email é obrigatório"),
  password: z.string().min(6, "A senha deve conter 6 caracteres."),
  role: z.string(),
});

export async function signUp(previousState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    user: formData.get("user"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  const validatedFields = signUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: {
        name: validatedFields.error.flatten().fieldErrors.name || [],
        user: validatedFields.error.flatten().fieldErrors.user || [],
        password: validatedFields.error.flatten().fieldErrors.password || [],
        role: validatedFields.error.flatten().fieldErrors.role || [],
        authError: [],
      },
    };
  }

  try {
    const { name, user, password, role } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        user,
        password: hashedPassword,
        role,
      },
    });

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: {
        authError: ["Ocorreu um erro ao tentar cadastrar o usuário."],
      },
    };
  }
}
