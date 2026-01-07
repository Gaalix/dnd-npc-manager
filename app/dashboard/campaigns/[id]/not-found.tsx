import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CampaignNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold">Campaign Not Found</h2>
      <p className="text-muted-foreground mt-2">
        The campaign you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <div className="mt-4">
        <Button asChild>
          <Link href="/dashboard">Back to Campaigns</Link>
        </Button>
      </div>
    </div>
  );
}
