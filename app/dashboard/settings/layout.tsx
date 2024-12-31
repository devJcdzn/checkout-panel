import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import { SidebarNav } from "./_components/sidebar-nav";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Configurações do meu painel.",
};

const sidebarNavItems = [
  {
    title: "Perfil",
    href: "/dashboard/settings",
  },
  {
    title: "Aparência",
    href: "/dashboard/settings/appearance",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Configure tudo sobre seu painel.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
