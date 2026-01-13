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
import { Clock, Map, MoreVertical, Sparkles, Users } from "lucide-react";
import type { Campaign } from "@/lib/supabase/types";

interface CampaignCardProps {
  campaign: Campaign;
  npcCount?: number;
}

export function CampaignCard({ campaign, npcCount = 0 }: CampaignCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(campaign.updated_at));

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this campaign? All NPCs in this campaign will also be deleted.")) {
      return;
    }

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", campaign.id);

    if (error) {
      toast.error("Failed to delete campaign");
      return;
    }

    toast.success("Campaign deleted");
    router.refresh();
  };

  return (
    <Card className="group relative overflow-hidden border-muted-foreground/20 bg-card/70 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary/10 to-transparent opacity-60" />
      <Link href={`/dashboard/campaigns/${campaign.id}`} className="block h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between gap-2 pr-8">
            <div className="flex items-center gap-2 truncate text-xl font-serif tracking-tight">
              <Map className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="truncate">{campaign.name}</span>
            </div>
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
            {campaign.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5">
              <Users className="h-3 w-3 text-primary" />
              {npcCount} NPC{npcCount !== 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5">
              <Clock className="h-3 w-3 text-primary" />
              Updated {formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Quick glance at your campaign status.
          </div>
        </CardContent>
      </Link>
      <div className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/80">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleDelete}
            >
              Delete Campaign
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
