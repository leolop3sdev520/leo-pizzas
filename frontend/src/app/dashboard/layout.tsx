export const instant = false;

import { requiredAuth } from "@/lib/auth"; // ✅ Alterado de requiredAdmin para requiredAuth
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Agora valida apenas se está logado, independente do cargo
  const user = await requiredAuth();

  return (
    <div className="flex h-screen overflow-hidden text-white">
      {/* Sidebar DESKTOP */}
      <Sidebar userName={user.name} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER MOBILE */}
        <MobileSidebar userName={user.name} />

        {/* CONTEÚDO DAS PÁGINAS */}
        <main className="flex-1 overflow-y-auto bg-app-background">
          <div className="container max-w-full px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
