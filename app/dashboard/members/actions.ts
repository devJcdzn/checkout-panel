"use server";
import { verifySession, deleteSession } from "@/app/lib/session";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function getMembersAction() {
  const session = await verifySession();

  if (!session.userId) {
    return { data: null, error: "Unauthorized" };
  }

  const members = await prisma.user.findMany({
    include: {
      payments: {
        where: {
          status: "APPROVED", // Filtra apenas pagamentos com status APPROVED
        },
        select: {
          amount: true, // Inclui apenas o campo necessário
        },
      },
    },
  });

  // Adiciona o total de vendas ao resultado
  const membersWithTotalSales = members.map((member) => {
    const totalSales = member.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    return {
      ...member,
      totalSales,
    };
  });

  return {
    data: membersWithTotalSales,
    error: null,
  };
}

export async function deleteUser(memberId: number) {
  const session = await verifySession();

  if (!session.userId) {
    return { data: null, error: "Unauthorized" };
  }

  if(session.userId === memberId) {
    await deleteSession();
  }

  try {
    await prisma.user.delete({
      where: {
        id: memberId,
      },
    });

    revalidatePath("/");
  } catch (err) {
    console.log("Erro ao deletar usuário", (err as Error).message);
  }
}
