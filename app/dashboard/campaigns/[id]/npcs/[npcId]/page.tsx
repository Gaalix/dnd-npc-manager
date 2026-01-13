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
import { MapPin, ScrollText, Sparkles } from "lucide-react";
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

  const tags = [npc.race, npc.class, npc.alignment].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link
          href={`/dashboard/campaigns/${campaignId}`}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          &larr; Back to {campaign.name}
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ScrollText className="h-3.5 w-3.5 text-primary" />
              NPC Reference
            </div>
            <h1 className="mt-2 text-3xl font-serif font-bold">{npc.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5"
                  >
                    <Sparkles aria-hidden="true" className="h-3 w-3 text-primary" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  Add race, class, or alignment for quick reference.
                </span>
              )}
              {npc.location && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2 py-0.5">
                  <MapPin aria-hidden="true" className="h-3 w-3 text-primary" />
                  {npc.location}
                </span>
              )}
            </div>
          </div>
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

      <div className="max-w-3xl">
        <StatBlock npc={npc} />
      </div>
    </div>
  );
}
