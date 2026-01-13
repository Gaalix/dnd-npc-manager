import type { NPC } from "@/lib/supabase/types";
import { MapPin, Sparkles, Swords, Shield } from "lucide-react";

interface StatBlockProps {
  npc: NPC;
}

function getModifier(stat: number | null): string {
  if (stat === null) stat = 10;
  const mod = Math.floor((stat - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function StatBlock({ npc }: StatBlockProps) {
  const stats = [
    { name: "STR", value: npc.strength },
    { name: "DEX", value: npc.dexterity },
    { name: "CON", value: npc.constitution },
    { name: "INT", value: npc.intelligence },
    { name: "WIS", value: npc.wisdom },
    { name: "CHA", value: npc.charisma },
  ];
  const metaChips = [
    npc.race && { label: npc.race, icon: Sparkles },
    npc.class && { label: npc.class, icon: Swords },
    npc.alignment && { label: npc.alignment, icon: Shield },
    npc.location && { label: npc.location, icon: MapPin },
  ].filter(Boolean) as { label: string; icon: typeof MapPin }[];

  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-4">
        <div className="flex gap-4">
          {npc.photo_url && (
            <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 border border-border/60">
              <img
                src={npc.photo_url}
                alt={npc.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{npc.name}</h3>
              <p className="text-sm text-muted-foreground">
                {[npc.race, npc.class].filter(Boolean).join(" · ") || "Details not set"}
              </p>
            </div>
            {metaChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {metaChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    <chip.icon className="h-3 w-3 text-primary" />
                    {chip.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-b border-border/60 py-4 text-center sm:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl bg-muted/40 px-2 py-3">
            <div className="text-xs font-bold text-primary">{stat.name}</div>
            <div className="text-lg font-semibold">{stat.value ?? 10}</div>
            <div className="text-xs text-muted-foreground">
              ({getModifier(stat.value)})
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        {npc.description && (
          <div>
            <div className="text-sm font-semibold text-foreground">Description</div>
            <p className="text-sm text-muted-foreground">{npc.description}</p>
          </div>
        )}

        {npc.notes && (
          <div>
            <div className="text-sm font-semibold text-foreground">DM Notes</div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{npc.notes}</p>
          </div>
        )}

        {!npc.description && !npc.notes && (
          <p className="text-sm text-muted-foreground">
            Add description or notes to keep session reminders handy.
          </p>
        )}
      </div>
    </div>
  );
}
