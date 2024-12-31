"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewUser } from "@/features/users/hooks/use-new-user";
import { PlusCircle } from "lucide-react";
import { MembersTable } from "./_components/members-table";

export default function MembersPage() {
  const newUser = useNewUser();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Membros
        </h2>
        <div
          className="flex flex-col gap-3 md:gap-0 md:flex-row w-full md:w-auto 
          items-center space-x-2"
        >
          <Button
            variant={"outline"}
            className="w-full md:w-auto"
            onClick={newUser.onOpen}
          >
            <PlusCircle />
            Adicionar Membro
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todos os membros</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <MembersTable />
        </CardContent>
      </Card>
    </div>
  );
}
