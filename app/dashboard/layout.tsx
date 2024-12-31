import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { getUser } from "../_data/user";
import { UserNav } from "@/components/user-nav";

export const metadata: Metadata = {
  title: "Painel | Sunize-Checkout",
  description: "Painel de geração de checkouts.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name, role, user, photoUrl } = await getUser();

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <main className="w-full min-h-[100vh]">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex gap-1 items-center">
              <SidebarTrigger />
              <Badge variant={"secondary"}>Ctrl+b</Badge>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <h2 className="text-lg font-semibold">
                Bem vindo de volta, {name}
              </h2>
              <UserNav user={{ name, role, user, photoUrl }} />
            </div>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
