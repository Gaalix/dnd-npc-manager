"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Campaign } from "@/lib/supabase/types";

interface CampaignFormProps {
  campaign?: Campaign;
  trigger?: React.ReactNode;
}

export function CampaignForm({ campaign, trigger }: CampaignFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(campaign?.name || "");
  const [description, setDescription] = useState(campaign?.description || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isEditing = !!campaign;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      if (isEditing) {
        const { error } = await supabase
          .from("campaigns")
          .update({ name, description })
          .eq("id", campaign.id);

        if (error) throw error;
        toast.success("Campaign updated");
      } else {
        const { error } = await supabase.from("campaigns").insert({
          name,
          description,
          user_id: user.id,
        });

        if (error) throw error;
        toast.success("Campaign created");
      }

      setOpen(false);
      setName("");
      setDescription("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>New Campaign</Button>}
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-background/95 backdrop-blur">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Campaign" : "Create Campaign"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your campaign details."
                : "Create a new campaign to organize your NPCs."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lost Mines of Phandelver"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A classic adventure for new players..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
