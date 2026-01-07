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

  return (
    <Card className="group relative overflow-hidden">
      <Link href={`/dashboard/campaigns/${campaignId}/npcs/${npc.id}`}>
        {npc.photo_url && (
          <div className="h-32 w-full overflow-hidden">
            <img
              src={npc.photo_url}
              alt={npc.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader className={npc.photo_url ? "pt-3" : ""}>
          <CardTitle className="truncate">{npc.name}</CardTitle>
          <CardDescription className="truncate">
            {subtitle || "Unknown"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {npc.location && (
            <p className="text-sm text-muted-foreground truncate">
              Location: {npc.location}
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
