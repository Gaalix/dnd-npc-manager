"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

export function DashboardShell({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const { expanded } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out",
          expanded ? "w-64" : "w-[70px]"
        )}
      >
        {sidebar}
      </div>
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          expanded ? "pl-64" : "pl-[70px]"
        )}
      >
        <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
