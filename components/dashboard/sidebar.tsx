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
                "flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
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
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
      <span className="truncate flex-1">{label}</span>
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
                "flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
              )}
            >
              <BookOpen className="h-5 w-5" />
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
          "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/50 text-foreground",
        )}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className="p-0.5 hover:bg-sidebar-accent rounded-sm text-muted-foreground"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <Link 
          href={`/dashboard/campaigns/${campaign.id}`}
          className="flex-1 truncate"
        >
          {campaign.name}
        </Link>
      </div>

      {isOpen && (
        <div className="ml-4 space-y-0.5 border-l border-border/50 pl-2">
           {campaign.npcs.length === 0 ? (
             <div className="px-2 py-1 text-xs text-muted-foreground italic">No NPCs</div>
           ) : (
             campaign.npcs.map((npc) => (
               <Link
                 key={npc.id}
                 href={`/dashboard/campaigns/${campaign.id}/npcs/${npc.id}`} // Assuming this route exists or will exist
                 className={cn(
                   "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                   pathname.includes(npc.id) ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground"
                 )}
               >
                 <Users className="h-3 w-3" />
                 <span className="truncate">{npc.name}</span>
               </Link>
             ))
           )}
           <Link
              href={`/dashboard/campaigns/${campaign.id}`}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
           >
              <Plus className="h-3 w-3" />
              <span>Add NPC</span>
           </Link>
        </div>
      )}
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
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 bg-background/50 h-9 text-sm" 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
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
