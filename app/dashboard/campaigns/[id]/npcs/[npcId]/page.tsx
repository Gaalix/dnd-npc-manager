"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatBlock } from "@/components/npcs/stat-block";
import { NPCForm } from "@/components/npcs/npc-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { NPC, Campaign } from "@/lib/supabase/types";

interface NPCDetailPageProps {
  params: Promise<{ id: string; npcId: string }>;
}

export default function NPCDetailPage({ params }: NPCDetailPageProps) {
  const { id: campaignId, npcId } = use(params);
  const [npc, setNpc] = useState<NPC | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const [npcResult, campaignResult] = await Promise.all([
        supabase.from("npcs").select("*").eq("id", npcId).single(),
        supabase.from("campaigns").select("*").eq("id", campaignId).single(),
      ]);

      if (npcResult.error || !npcResult.data) {
        router.push(`/dashboard/campaigns/${campaignId}`);
        return;
      }

      setNpc(npcResult.data);
      setCampaign(campaignResult.data);
      setLoading(false);
    }

    loadData();
  }, [campaignId, npcId, router, supabase]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this NPC?")) {
      return;
    }

    const { error } = await supabase.from("npcs").delete().eq("id", npcId);

    if (error) {
      toast.error("Failed to delete NPC");
      return;
    }

    toast.success("NPC deleted");
    router.push(`/dashboard/campaigns/${campaignId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!npc || !campaign) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/campaigns/${campaignId}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
        >
          &larr; Back to {campaign.name}
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{npc.name}</h1>
          <div className="flex gap-2">
            <NPCForm
              campaignId={campaignId}
              npc={npc}
              trigger={<Button variant="outline">Edit</Button>}
              onSuccess={() => router.refresh()}
            />
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <StatBlock npc={npc} />
      </div>
    </div>
  );
}
