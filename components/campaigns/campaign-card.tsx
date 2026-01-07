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
import { MoreVertical, Map, Users } from "lucide-react";
import type { Campaign } from "@/lib/supabase/types";

interface CampaignCardProps {
  campaign: Campaign;
  npcCount?: number;
}

export function CampaignCard({ campaign, npcCount = 0 }: CampaignCardProps) {
  const router = useRouter();
  const supabase = createClient();

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
    <Card className="group relative hover:shadow-md transition-all duration-300 border-muted-foreground/20 hover:border-primary/50 overflow-hidden bg-card/50">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
      <Link href={`/dashboard/campaigns/${campaign.id}`} className="block h-full pl-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2 truncate text-xl font-serif tracking-tight">
              <Map className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="truncate">{campaign.name}</span>
            </div>
          </CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
            {campaign.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md w-fit">
            <Users className="h-4 w-4" />
            <span className="font-medium">{npcCount}</span>
            <span>NPC{npcCount !== 1 ? "s" : ""}</span>
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
