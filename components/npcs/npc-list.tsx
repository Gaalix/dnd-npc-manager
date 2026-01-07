"use client";

import { useState, useMemo } from "react";
import { NPCCard } from "./npc-card";
import { NPCForm } from "./npc-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import type { NPC } from "@/lib/supabase/types";

interface NPCListProps {
  npcs: NPC[];
  campaignId: string;
}

export function NPCList({ npcs, campaignId }: NPCListProps) {
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Get unique locations from NPCs
  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    npcs.forEach((npc) => {
      if (npc.location) {
        uniqueLocations.add(npc.location);
      }
    });
    return Array.from(uniqueLocations).sort();
  }, [npcs]);

  // Filter NPCs by location
  const filteredNPCs = useMemo(() => {
    if (locationFilter === "all") return npcs;
    if (locationFilter === "none") return npcs.filter((npc) => !npc.location);
    return npcs.filter((npc) => npc.location === locationFilter);
  }, [npcs, locationFilter]);

  if (npcs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No NPCs yet</h3>
        <div className="mt-4">
          <NPCForm campaignId={campaignId} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      {locations.length > 0 && (
        <div className="flex items-center gap-2">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="none">No location</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {locationFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocationFilter("all")}
              className="h-8 px-2 text-xs"
            >
              Clear
            </Button>
          )}
          <span className="text-sm text-muted-foreground ml-auto">
            {filteredNPCs.length} NPC{filteredNPCs.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* NPC grid */}
      {filteredNPCs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNPCs.map((npc) => (
            <NPCCard key={npc.id} npc={npc} campaignId={campaignId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No NPCs in this location
        </div>
      )}
    </div>
  );
}
