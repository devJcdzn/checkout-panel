import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CircleDollarSign, FileBox, Home, Settings, User2 } from "lucide-react";
import Link from "next/link";

const data = [
  {
    title: "Checkouts",
    navItems: [
      {
        title: "Analytics",
        url: "/dashboard",
        icon: Home,
        roles: ["admin", "member"],
      },
      {
        title: "Checkouts",
        url: "/dashboard/checkouts",
        icon: CircleDollarSign,
        roles: ["admin", "member"],
      },
      {
        title: "Modelos",
        url: "/dashboard/models",
        icon: FileBox,
        roles: [],
      },
    ],
  },
  {
    title: "Outros",
    navItems: [
      {
        title: "Configurações",
        url: "/dashboard/settings",
        icon: Settings,
        roles: ["admin", "member"],
      },
      {
        title: "Membros",
        url: "/dashboard/members",
        icon: User2,
        roles: ["admin"],
      },
    ],
  },
];

export function AppSidebar({ role = "member" }: { role?: string }) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {data.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.navItems.map((item) => (
                  <>
                    {item.roles.includes(role) && (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
