import type { NPC } from "@/lib/supabase/types";

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

  return (
    <div className="border-2 border-primary/20 rounded-lg p-4 bg-card">
      <div className="border-b border-primary/20 pb-3 mb-3">
        <div className="flex gap-4">
          {npc.photo_url && (
            <div className="h-20 w-20 rounded overflow-hidden flex-shrink-0">
              <img
                src={npc.photo_url}
                alt={npc.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-primary">{npc.name}</h3>
            <p className="text-sm italic text-muted-foreground">
              {[npc.race, npc.class, npc.alignment].filter(Boolean).join(", ") || "Unknown"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 text-center border-b border-primary/20 pb-3 mb-3">
        {stats.map((stat) => (
          <div key={stat.name}>
            <div className="text-xs font-bold text-primary">{stat.name}</div>
            <div className="text-lg font-medium">{stat.value ?? 10}</div>
            <div className="text-xs text-muted-foreground">
              ({getModifier(stat.value)})
            </div>
          </div>
        ))}
      </div>

      {npc.location && (
        <div className="mb-2">
          <span className="font-semibold">Location:</span>{" "}
          <span className="text-muted-foreground">{npc.location}</span>
        </div>
      )}

      {npc.description && (
        <div className="mb-2">
          <span className="font-semibold">Description:</span>{" "}
          <span className="text-muted-foreground">{npc.description}</span>
        </div>
      )}

      {npc.notes && (
        <div>
          <span className="font-semibold">Notes:</span>{" "}
          <span className="text-muted-foreground whitespace-pre-wrap">{npc.notes}</span>
        </div>
      )}
    </div>
  );
}
