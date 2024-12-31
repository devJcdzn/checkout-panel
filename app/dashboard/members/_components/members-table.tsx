"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMembers } from "@/features/users/api/use-get-members";
import { formatCurrency } from "@/lib/utils";
import { deleteUser } from "../actions";

export function MembersTable() {
  const membersQuery = useGetMembers();
  const members = membersQuery?.data || [];

  return (
    <div className="space-y-8">
      {membersQuery.isLoading && <p>Carregando</p>}
      {members &&
        members.map((member) => (
          <div className="flex items-center" key={member.id}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={member.photoUrl || ""}
                      alt={`member-${member.name}`}
                    />
                    <AvatarFallback>
                      {member?.name![0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">
                      {member.user}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => deleteUser(member.id)}
                  >
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none capitalize">
                {member.name}
              </p>
              <p className="text-sm text-muted-foreground">{member.user}</p>
            </div>
            <div className="ml-auto font-medium">
              {formatCurrency(member.totalSales, { addPrefix: true })}
            </div>
          </div>
        ))}
    </div>
  );
}
