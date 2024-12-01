"use server";

import { prisma } from "@/utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key";
export async function Login({
  user,
  password,
}: {
  user: string;
  password: string;
}) {
  try {
    if (!user || !password) throw new Error("Campos faltando");

    const member = await prisma.member.findUnique({
      where: {
        user,
      },
    });

    if (!member) {
      throw new Error("Usuário não encontrado");
    }

    const passwordMatch = await bcrypt.compare(password, member.password);
    if (!passwordMatch) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign(
      {
        id: member.id,
        role: member.role, // Adicione a role para controle de acesso
      },
      SECRET_KEY
    );

    const response = NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
    });

    response.cookies.set("panel@sessionToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
    });

    console.log(response);

    return response;
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: (err as Error).message || "Erro ao realizar login",
    });
  }
}
