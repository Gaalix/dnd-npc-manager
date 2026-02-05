"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type RouteTransitionProps = {
  children: ReactNode;
  className?: string;
};

export function RouteTransition({ children, className }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 motion-reduce:animate-none motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
