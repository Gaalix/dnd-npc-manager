import { createClient } from "@/lib/supabase/server";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { BookOpen } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("updated_at", { ascending: false });

  // Get NPC counts for each campaign
  const { data: npcCounts } = await supabase
    .from("npcs")
    .select("campaign_id");

  const countMap = new Map<string, number>();
  npcCounts?.forEach((npc) => {
    countMap.set(npc.campaign_id, (countMap.get(npc.campaign_id) || 0) + 1);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Campaigns</h1>
        <CampaignForm />
      </div>

      {campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              npcCount={countMap.get(campaign.id) || 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-muted rounded-xl bg-muted/20">
          <div className="bg-background p-3 rounded-full mb-3 shadow-sm">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-serif font-semibold">No campaigns yet</h3>
          <div className="mt-4">
            <CampaignForm />
          </div>
        </div>
      )}
    </div>
  );
}
