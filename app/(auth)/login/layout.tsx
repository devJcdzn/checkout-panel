import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Sunize-Checkout",
  description: "Autenticação para membros.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
