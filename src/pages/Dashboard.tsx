import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationStats, useRecentApplications } from "@/hooks/useApplications";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, Calendar, Clock, Loader2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function SegmentedProgress({ stats }: { stats: { applied: number; interviews: number; offers: number; rejected: number; total: number } }) {
  if (stats.total === 0) {
    return (
      <div className="space-y-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted" />
        <p className="text-sm text-muted-foreground">No applications yet</p>
      </div>
    );
  }

  const segments = [
    { key: "applied", pct: (stats.applied / stats.total) * 100, color: "bg-[hsl(var(--status-applied))]", label: "Applied", count: stats.applied },
    { key: "interview", pct: (stats.interviews / stats.total) * 100, color: "bg-[hsl(var(--status-interview))]", label: "Interview", count: stats.interviews },
    { key: "offer", pct: (stats.offers / stats.total) * 100, color: "bg-[hsl(var(--status-offer))]", label: "Offer", count: stats.offers },
    { key: "rejected", pct: (stats.rejected / stats.total) * 100, color: "bg-[hsl(var(--status-rejected))]", label: "Rejected", count: stats.rejected },
  ];

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {segments.map((s) =>
          s.pct > 0 ? (
            <div key={s.key} className={`${s.color} h-full transition-all`} style={{ width: `${s.pct}%` }} />
          ) : null
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-2 rounded-lg border bg-card p-2.5">
            <span className={`inline-block h-3 w-3 rounded-full ${s.color}`} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold">{s.count} <span className="text-xs font-normal text-muted-foreground">({Math.round(s.pct)}%)</span></p>
            </div>
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

  const metricCards = [
    { title: "Total Applications", value: s.total, icon: FileText, accent: "text-[hsl(var(--status-applied))]" },
    { title: "Interviews Scheduled", value: s.interviews, icon: Calendar, accent: "text-[hsl(var(--status-interview))]" },
    { title: "Pending Responses", value: s.applied, icon: Clock, accent: "text-accent" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Link to="/add">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <TrendingUp className="h-4 w-4" />
              New Application
            </span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metricCards.map((m) => (
            <Card key={m.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
                <m.icon className={`h-5 w-5 ${m.accent}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{m.value}</p>
              </CardContent>
            </Card>
          ))}
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            {recent && recent.length > 0 && (
              <Link to="/applications" className="text-sm text-accent hover:underline">View all</Link>
            )}
          </CardHeader>
          <CardContent>
            {!recent || recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet. Add your first one!</p>
            ) : (
              <div className="space-y-2">
                {recent.map((app) => (
                  <div key={app.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
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
