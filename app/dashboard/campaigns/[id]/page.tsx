import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NPCList } from "@/components/npcs/npc-list";
import { NPCForm } from "@/components/npcs/npc-form";

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

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
        >
          &larr; Back to Campaigns
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-muted-foreground mt-1">{campaign.description}</p>
            )}
          </div>
          <NPCForm campaignId={id} />
        </div>
      </div>

      <NPCList npcs={npcs || []} campaignId={id} />
    </div>
  );
}
