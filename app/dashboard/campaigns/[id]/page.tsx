import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NPCList } from "@/components/npcs/npc-list";
import { NPCForm } from "@/components/npcs/npc-form";
import { MapPin, Users, UserX, ScrollText } from "lucide-react";

interface CampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  const { data: npcs } = await supabase
    .from("npcs")
    .select("*")
    .eq("campaign_id", id)
    .order("name");

  const npcList = npcs || [];
  const uniqueLocations = new Set(
    npcList.map((npc) => npc.location).filter(Boolean) as string[]
  );
  const missingLocations = npcList.filter((npc) => !npc.location).length;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          &larr; Back to Campaigns
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ScrollText className="h-3.5 w-3.5 text-primary" />
              Campaign Overview
            </div>
            <h1 className="mt-2 text-3xl font-serif font-bold">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-muted-foreground mt-1 max-w-2xl">{campaign.description}</p>
            )}
          </div>
          <NPCForm campaignId={id} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "NPCs Tracked", value: npcList.length, icon: Users },
          { label: "Locations Logged", value: uniqueLocations.size, icon: MapPin },
          { label: "Missing Locations", value: missingLocations, icon: UserX },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{item.value}</div>
          </div>
        ))}
      </div>

      <NPCList npcs={npcList} campaignId={id} />
    </div>
  );
}
