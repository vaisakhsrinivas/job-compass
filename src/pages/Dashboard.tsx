import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationStats, useRecentApplications } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, Calendar, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

function SegmentedProgress({ stats }: { stats: { applied: number; interviews: number; offers: number; rejected: number; total: number } }) {
  if (stats.total === 0) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full" />
        </div>
        <p className="text-sm text-muted-foreground">No applications yet</p>
      </div>
    );
  }

  const segments = [
    { key: "applied", pct: (stats.applied / stats.total) * 100, color: "bg-[hsl(var(--status-applied))]", label: "Applied" },
    { key: "interview", pct: (stats.interviews / stats.total) * 100, color: "bg-[hsl(var(--status-interview))]", label: "Interview" },
    { key: "offer", pct: (stats.offers / stats.total) * 100, color: "bg-[hsl(var(--status-offer))]", label: "Offer" },
    { key: "rejected", pct: (stats.rejected / stats.total) * 100, color: "bg-[hsl(var(--status-rejected))]", label: "Rejected" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) =>
          s.pct > 0 ? (
            <div key={s.key} className={`${s.color} h-full transition-all`} style={{ width: `${s.pct}%` }} />
          ) : null
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.color}`} />
            <span className="text-muted-foreground">
              {s.label}: {Math.round(s.pct)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useApplicationStats();
  const { data: recent, isLoading: recentLoading } = useRecentApplications();

  if (statsLoading || recentLoading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  const s = stats ?? { total: 0, applied: 0, interviews: 0, offers: 0, rejected: 0 };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.interviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Responses</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.applied}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SegmentedProgress stats={s} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {!recent || recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet. Add your first one!</p>
            ) : (
              <div className="space-y-3">
                {recent.map((app) => (
                  <div key={app.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{app.company}</p>
                      <p className="truncate text-sm text-muted-foreground">{app.position}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {format(new Date(app.updated_at), "MMM d")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
