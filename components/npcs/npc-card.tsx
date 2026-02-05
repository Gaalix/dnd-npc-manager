"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MapPin, Sparkles, Swords } from "lucide-react";
import type { NPC } from "@/lib/supabase/types";

interface NPCCardProps {
  npc: NPC;
  campaignId: string;
}

export function NPCCard({ npc, campaignId }: NPCCardProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this NPC?")) {
      return;
    }

    const { error } = await supabase.from("npcs").delete().eq("id", npc.id);

    if (error) {
      toast.error("Failed to delete NPC");
      return;
    }

    toast.success("NPC deleted");
    router.refresh();
  };

  const subtitle = [npc.race, npc.class, npc.alignment].filter(Boolean).join(" | ");
  const chips = [
    npc.location && { label: npc.location, icon: MapPin },
    npc.race && { label: npc.race, icon: Sparkles },
    npc.class && { label: npc.class, icon: Swords },
  ].filter((chip): chip is { label: string; icon: typeof MapPin } => Boolean(chip));

  return (
    <Card className="card-interactive group border-muted-foreground/20">
      <Link
        href={`/dashboard/campaigns/${campaignId}/npcs/${npc.id}`}
        className="block h-full focus-visible:outline-none"
      >
        <div className="relative h-36 w-full overflow-hidden">
          {npc.photo_url ? (
            <img
              src={npc.photo_url}
              alt={npc.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-muted/40 via-muted/20 to-transparent" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-transparent" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="truncate text-lg">{npc.name}</CardTitle>
          <CardDescription className="truncate">
            {subtitle || "Details not set"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  <chip.icon aria-hidden="true" className="h-3 w-3 text-primary" />
                  {chip.label}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Add details to help with quick recall.</p>
          )}
          {npc.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {npc.description}
            </p>
          )}
        </CardContent>
      </Link>
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/campaigns/${campaignId}/npcs/${npc.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
