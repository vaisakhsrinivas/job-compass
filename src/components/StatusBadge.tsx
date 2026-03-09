import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/hooks/useApplications";

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: {
    label: "Applied",
    className: "bg-[hsl(var(--status-applied))] text-white border-transparent",
  },
  interview_scheduled: {
    label: "Interview",
    className: "bg-[hsl(var(--status-interview))] text-white border-transparent",
  },
  offer: {
    label: "Offer",
    className: "bg-[hsl(var(--status-offer))] text-white border-transparent",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[hsl(var(--status-rejected))] text-white border-transparent",
  },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status];
  return (
    <Badge className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
