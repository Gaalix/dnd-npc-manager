"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Upload, X } from "lucide-react";
import type { NPC } from "@/lib/supabase/types";

const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

const RACES = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Tiefling",
  "Dragonborn",
  "Other",
];

const CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
  "Commoner",
  "Noble",
  "Other",
];

interface NPCFormProps {
  campaignId: string;
  npc?: NPC;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function NPCForm({ campaignId, npc, trigger, onSuccess }: NPCFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(npc?.photo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: npc?.name || "",
    race: npc?.race || "",
    class: npc?.class || "",
    alignment: npc?.alignment || "",
    description: npc?.description || "",
    location: npc?.location || "",
    notes: npc?.notes || "",
    photo_url: npc?.photo_url || "",
    strength: npc?.strength ?? 10,
    dexterity: npc?.dexterity ?? 10,
    constitution: npc?.constitution ?? 10,
    intelligence: npc?.intelligence ?? 10,
    wisdom: npc?.wisdom ?? 10,
    charisma: npc?.charisma ?? 10,
  });

  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!npc;

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, photo_url: "" }));
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, photo_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPhoto = async (userId: string): Promise<string | null> => {
    if (!photoFile) return formData.photo_url || null;

    setUploadingPhoto(true);
    try {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("npc-photos")
        .upload(fileName, photoFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("npc-photos")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploadingPhoto(false);
    }
  };

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

      // Upload photo if a file was selected
      const photoUrl = await uploadPhoto(user.id);
      const submitData = { ...formData, photo_url: photoUrl };

      if (isEditing) {
        const { error } = await supabase
          .from("npcs")
          .update(submitData)
          .eq("id", npc.id);

        if (error) throw error;
        toast.success("NPC updated");
      } else {
        const { error } = await supabase.from("npcs").insert({
          ...submitData,
          campaign_id: campaignId,
          user_id: user.id,
        });

        if (error) throw error;
        toast.success("NPC created");
      }

      setOpen(false);
      onSuccess?.();
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
        {trigger || <Button>New NPC</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border/60 bg-background/95 backdrop-blur">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit NPC" : "Create NPC"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your NPC details."
                : "Add a new NPC to your campaign."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Gundren Rockseeker"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Phandalin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex gap-4 items-start">
                {/* Photo preview */}
                <div className="relative h-24 w-24 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                  {photoPreview ? (
                    <>
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <Upload className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {/* Upload controls */}
                <div className="flex-1 space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload from PC
                  </Button>
                  <div className="text-xs text-muted-foreground">or paste URL:</div>
                  <Input
                    id="photo_url"
                    value={formData.photo_url}
                    onChange={(e) => {
                      handleChange("photo_url", e.target.value);
                      if (e.target.value) {
                        setPhotoFile(null);
                        setPhotoPreview(e.target.value);
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="h-8 text-sm"
                    disabled={!!photoFile}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="race">Race</Label>
                <Select
                  value={formData.race}
                  onValueChange={(value) => handleChange("race", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACES.map((race) => (
                      <SelectItem key={race} value={race}>
                        {race}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => handleChange("class", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alignment">Alignment</Label>
                <Select
                  value={formData.alignment}
                  onValueChange={(value) => handleChange("alignment", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALIGNMENTS.map((alignment) => (
                      <SelectItem key={alignment} value={alignment}>
                        {alignment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ability Scores</Label>
              <div className="grid grid-cols-6 gap-2">
                {(["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as const).map(
                  (stat) => (
                    <div key={stat} className="space-y-1">
                      <Label htmlFor={stat} className="text-xs uppercase">
                        {stat.slice(0, 3)}
                      </Label>
                      <Input
                        id={stat}
                        type="number"
                        min={1}
                        max={30}
                        value={formData[stat]}
                        onChange={(e) =>
                          handleChange(stat, parseInt(e.target.value) || 10)
                        }
                        className="text-center"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="A gruff dwarf with a braided beard..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Quest hooks, secrets, relationships..."
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
