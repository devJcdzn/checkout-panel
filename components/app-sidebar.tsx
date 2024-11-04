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
import { CircleDollarSign, FileBox, Home, Settings } from "lucide-react";
import Link from "next/link";

const data = [
  {
    title: "Checkouts",
    navItems: [
      {
        title: "Analytics",
        url: "/",
        icon: Home,
      },
      {
        title: "Checkouts",
        url: "/checkouts",
        icon: CircleDollarSign,
      },
      {
        title: "Modelos",
        url: "/models",
        icon: FileBox,
      },
    ],
  },
  {
    title: "Outros",
    navItems: [
      {
        title: "Configurações",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
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
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
