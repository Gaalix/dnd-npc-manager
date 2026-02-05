"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme-toggle";
import { useSidebar } from "./sidebar-context";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import {
  Scroll,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
  Search,
  Plus
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import type { Campaign, NPC } from "@/lib/supabase/types";

// Extended type to include nested NPCs
interface CampaignWithNPCs extends Campaign {
  npcs: Pick<NPC, "id" | "name" | "location">[];
}

interface SidebarProps {
  campaigns: CampaignWithNPCs[];
}

const motionBase = "transition-all duration-200 ease-out";
const motionHoverShift = "group-hover:translate-x-0.5";
const motionIconWiggle = "group-hover:rotate-3";
const motionPulseGlow =
  "hover:shadow-[0_0_12px_hsl(var(--primary)/0.35)] hover:animate-[pulse_1.2s_ease-out]";

function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
  collapsed,
  onClick,
}: {
  icon: any;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              onClick={onClick}
              className={cn(
                "group flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                motionBase,
                motionPulseGlow,
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", motionBase, motionIconWiggle)} />
              <span className="sr-only">{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium bg-popover text-popover-foreground">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        motionBase,
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-300 ease-out",
          active ? "opacity-100 scale-y-100" : "opacity-0 scale-y-75"
        )}
        aria-hidden="true"
      />
      <Icon
        className={cn(
          "h-4 w-4 transition-all",
          active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
          motionBase,
          motionIconWiggle
        )}
      />
      <span className={cn("truncate flex-1", motionBase, motionHoverShift)}>{label}</span>
    </Link>
  );
}

function CampaignTreeItem({
  campaign,
  collapsed,
  active,
  pathname,
}: {
  campaign: CampaignWithNPCs;
  collapsed: boolean;
  active: boolean;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = React.useState(active);
  
  // Auto-expand if a child is active
  React.useEffect(() => {
    if (pathname.includes(`/campaigns/${campaign.id}`)) {
      setIsOpen(true);
    }
  }, [pathname, campaign.id]);

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/dashboard/campaigns/${campaign.id}`}
              className={cn(
                "group flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                motionBase,
                motionPulseGlow,
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
              )}
            >
              <BookOpen className={cn("h-5 w-5", motionBase, motionIconWiggle)} />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {campaign.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/50 text-foreground",
          motionBase
        )}
      >
        <span
          className={cn(
            "pointer-events-none absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary transition-all duration-300 ease-out",
            active ? "opacity-100 scale-y-100" : "opacity-0 scale-y-75"
          )}
          aria-hidden="true"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "p-0.5 hover:bg-sidebar-accent rounded-sm text-muted-foreground",
            motionBase,
            "group-hover:text-primary"
          )}
        >
          {isOpen ? (
            <ChevronDown className={cn("h-4 w-4", motionBase, motionIconWiggle)} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", motionBase, motionIconWiggle)} />
          )}
        </button>
        <Link 
          href={`/dashboard/campaigns/${campaign.id}`}
          className={cn("flex-1 truncate", motionBase, motionHoverShift)}
        >
          {campaign.name}
        </Link>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        aria-hidden={!isOpen}
      >
        <div className="ml-4 space-y-0.5 overflow-hidden border-l border-border/50 pl-2">
           {campaign.npcs.length === 0 ? (
             <div className="px-2 py-1 text-xs text-muted-foreground italic">No NPCs</div>
           ) : (
             campaign.npcs.map((npc) => (
               <Link
                 key={npc.id}
                 href={`/dashboard/campaigns/${campaign.id}/npcs/${npc.id}`} // Assuming this route exists or will exist
                 className={cn(
                   "group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                   motionBase,
                   pathname.includes(npc.id) ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground"
                 )}
               >
                 <Users className={cn("h-3 w-3", motionBase, motionIconWiggle)} />
                 <span className={cn("truncate", motionBase, motionHoverShift)}>{npc.name}</span>
               </Link>
             ))
           )}
           <Link
              href={`/dashboard/campaigns/${campaign.id}`}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors",
                motionBase
              )}
           >
              <Plus className={cn("h-3 w-3", motionBase, motionIconWiggle)} />
              <span className={cn(motionBase, motionHoverShift)}>Add NPC</span>
           </Link>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ campaigns }: SidebarProps) {
  const { expanded, toggle } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [filter, setFilter] = React.useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.npcs.some(n => n.name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className={cn("flex h-16 items-center border-b border-sidebar-border/50 px-4 transition-all", expanded ? "justify-between" : "justify-center")}>
        {expanded && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Scroll className="h-6 w-6 text-primary" />
            <span>Folio</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggle} className="text-muted-foreground hover:text-foreground">
          {expanded ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>

      {/* Search (only when expanded) */}
      {expanded && (
        <div className="p-4 pb-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns or NPCs"
              className="pl-9 bg-background/70 h-9 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <CampaignForm
            trigger={
              <Button className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            }
          />
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* Main Nav */}
        <div className={cn("space-y-1", !expanded && "items-center flex flex-col")}>
           <SidebarItem
              icon={BookOpen}
              label="All Campaigns"
              href="/dashboard"
              active={pathname === "/dashboard"}
              collapsed={!expanded}
            />
        </div>

        {!expanded && <Separator className="my-2" />}

        {/* Campaign Tree */}
        <div className={cn("space-y-1", !expanded && "items-center flex flex-col")}>
          {expanded && <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Campaigns</div>}
          
          {filteredCampaigns.map((campaign) => (
            <CampaignTreeItem
              key={campaign.id}
              campaign={campaign}
              collapsed={!expanded}
              active={pathname.includes(`/campaigns/${campaign.id}`)}
              pathname={pathname}
            />
          ))}

          {filteredCampaigns.length === 0 && expanded && (
             <div className="text-sm text-muted-foreground px-2 py-4 text-center">
                {filter ? "No matches found" : "No campaigns"}
             </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/50 bg-sidebar/50">
        <div className={cn("flex items-center gap-2", !expanded && "flex-col justify-center")}>
          <div className={cn("flex-1", !expanded && "hidden")}>
             <ModeToggle />
          </div>
           {/* If collapsed, show theme toggle as icon only */}
           {!expanded && (
               <div className="mb-2">
                    <ModeToggle />
               </div>
           )}

          <TooltipProvider delayDuration={0}>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Sign Out</span>
                 </Button>
               </TooltipTrigger>
               <TooltipContent side="right">Sign Out</TooltipContent>
             </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
