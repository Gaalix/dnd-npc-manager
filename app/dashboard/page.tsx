import { createClient } from "@/lib/supabase/server";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { BookOpen, CalendarClock, MapPin, ScrollText, Users } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("updated_at", { ascending: false });

  // Get NPC counts for each campaign
  const { data: npcRecords } = await supabase
    .from("npcs")
    .select("campaign_id, location");

  const countMap = new Map<string, number>();
  const locations = new Set<string>();
  let totalNpcs = 0;
  npcRecords?.forEach((npc) => {
    countMap.set(npc.campaign_id, (countMap.get(npc.campaign_id) || 0) + 1);
    totalNpcs += 1;
    if (npc.location) {
      locations.add(npc.location);
    }
  });

  const lastUpdatedCampaign = campaigns?.[0];
  const formatDate = (value?: string) => {
    if (!value) return "No updates yet";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <ScrollText className="h-3.5 w-3.5 text-primary" />
            Campaign Command Center
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Keep your NPCs, locations, and session notes organized in one place.
          </p>
        </div>
        <CampaignForm />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Campaigns",
            value: campaigns?.length ?? 0,
            icon: BookOpen,
          },
          {
            label: "NPCs Tracked",
            value: totalNpcs,
            icon: Users,
          },
          {
            label: "Locations Logged",
            value: locations.size,
            icon: MapPin,
          },
          {
            label: "Last Updated",
            value: formatDate(lastUpdatedCampaign?.updated_at),
            icon: CalendarClock,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-foreground">
              {item.value}
            </div>
          </div>
        ))}
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
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/20">
          <div className="bg-background p-3 rounded-full mb-1 shadow-sm">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-serif font-semibold">No campaigns yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start a campaign to track NPCs, locations, and session updates for your party.
          </p>
          <div className="mt-4">
            <CampaignForm />
          </div>
        </div>
      )}
    </div>
  );
}
