import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, MapPin, ScrollText, Wand2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Built for dungeon masters who prep fast.
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Folio brings your NPCs, encounters, and notes into one modern command
            center.
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Track campaigns, surface quick stats, and keep session-ready details
            for every NPC so you can improvise with confidence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
          {[
            {
              title: "Session-ready NPCs",
              icon: ScrollText,
              copy: "Store appearance, hooks, and relationships with fast notes.",
            },
            {
              title: "Location intelligence",
              icon: MapPin,
              copy: "Filter NPCs by tavern, city, or region before every scene.",
            },
            {
              title: "Campaign snapshots",
              icon: BookOpen,
              copy: "See high-level stats and recent updates at a glance.",
            },
            {
              title: "Modern stat blocks",
              icon: Wand2,
              copy: "Reference ability scores and core details with minimal friction.",
            },
            {
              title: "Designed for speed",
              icon: Sparkles,
              copy: "Optimized layouts keep everything readable mid-session.",
            },
            {
              title: "Always organized",
              icon: BookOpen,
              copy: "Keep multiple campaigns separated and searchable.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border bg-card/70 p-5 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-sm font-semibold">
                <feature.icon className="h-4 w-4 text-primary" />
                {feature.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{feature.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
