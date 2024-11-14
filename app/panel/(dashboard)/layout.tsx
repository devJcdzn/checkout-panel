import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel | Sunize-Checkout",
  description: "Painel de geração de checkouts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-[100vh]">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="flex gap-1 items-center">
              <SidebarTrigger />
              <Badge variant={"secondary"}>Ctrl+b</Badge>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <h2 className="text-lg font-semibold">Painel de Checkouts</h2>
            </div>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
