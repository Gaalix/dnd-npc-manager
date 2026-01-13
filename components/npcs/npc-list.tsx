"use client";

import { useState, useMemo } from "react";
import { NPCCard } from "./npc-card";
import { NPCForm } from "./npc-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import type { NPC } from "@/lib/supabase/types";

interface NPCListProps {
  npcs: NPC[];
  campaignId: string;
}

export function NPCList({ npcs, campaignId }: NPCListProps) {
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    const matchesLocation = (npc: NPC) => {
      if (locationFilter === "all") return true;
      if (locationFilter === "none") return !npc.location;
      return npc.location === locationFilter;
    };

    const matchesSearch = (npc: NPC) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        npc.name.toLowerCase().includes(query) ||
        npc.race?.toLowerCase().includes(query) ||
        npc.class?.toLowerCase().includes(query) ||
        npc.location?.toLowerCase().includes(query)
      );
    };

    return npcs.filter((npc) => matchesLocation(npc) && matchesSearch(npc));
  }, [npcs, locationFilter, searchQuery]);

  if (npcs.length === 0) {
    return (
      <div className="text-center py-12 rounded-2xl border border-dashed bg-muted/20">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-background p-3 shadow-sm">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No NPCs yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start tracking the party's allies, rivals, and key quest givers for this campaign.
          </p>
          <div className="mt-4">
            <NPCForm campaignId={campaignId} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search NPCs by name, race, class, or location"
            className="pl-9"
          />
        </div>
        {locations.length > 0 && (
          <div className="flex items-center gap-2">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48 h-9">
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
                className="h-9 px-3 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        )}
        <span className="text-sm text-muted-foreground lg:ml-auto">
          {filteredNPCs.length} NPC{filteredNPCs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* NPC grid */}
      {filteredNPCs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNPCs.map((npc) => (
            <NPCCard key={npc.id} npc={npc} campaignId={campaignId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground rounded-xl border border-dashed">
          No NPCs match this filter
        </div>
      )}
    </div>
  );
}
