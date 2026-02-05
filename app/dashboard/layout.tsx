import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RouteTransition } from "@/components/dashboard/route-transition";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch campaigns with their NPCs (minimal data for sidebar)
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select(`
      *,
      npcs (
        id,
        name,
        location
      )
    `)
    .order("name");

  return (
    <SidebarProvider>
      <DashboardShell 
        sidebar={<Sidebar campaigns={campaigns || []} />}
      >
        <RouteTransition>{children}</RouteTransition>
      </DashboardShell>
    </SidebarProvider>
  );
}
