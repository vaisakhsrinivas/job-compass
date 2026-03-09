import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useApplications, useDeleteApplication, useUpdateApplication, type Application, type ApplicationStatus } from "@/hooks/useApplications";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Pencil, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { user } = useAuth();

  const { data: applications, isLoading } = useApplications(statusFilter);
  const deleteApp = useDeleteApplication();
  const updateApp = useUpdateApplication();

  const filtered = (applications ?? []).filter(
    (a) =>
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteApp.mutateAsync(deleteId);
      toast({ title: "Application deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setDeleteId(null);
  };

  const [editStatus, setEditStatus] = useState<ApplicationStatus>("applied");

  const openEdit = (app: Application) => {
    setEditApp(app);
    setEditStatus(app.status);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editApp) return;
    const fd = new FormData(e.currentTarget);
    try {
      await updateApp.mutateAsync({
        id: editApp.id,
        company: (fd.get("company") as string).trim(),
        position: (fd.get("position") as string).trim(),
        status: editStatus,
        notes: (fd.get("notes") as string) || null,
        location: (fd.get("location") as string) || null,
        salary_range: (fd.get("salary_range") as string) || null,
        job_url: (fd.get("job_url") as string) || null,
        tags: (fd.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
      });
      toast({ title: "Application updated" });
      setEditApp(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search company or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {search || statusFilter !== "all" ? "No matching applications found." : "No applications yet. Add your first one!"}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((app) => (
              <Card key={app.id} className="transition-colors hover:bg-accent/30">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{app.company}</p>
                      {app.job_url && (
                        <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{app.position}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <StatusBadge status={app.status} />
                      <span className="text-xs text-muted-foreground">
                        Applied {format(new Date(app.date_applied), "MMM d, yyyy")}
                      </span>
                      {app.location && (
                        <span className="text-xs text-muted-foreground">· {app.location}</span>
                      )}
                    </div>
                    {app.notes && (
                      <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{app.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditApp(app)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(app.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editApp} onOpenChange={(o) => !o && setEditApp(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {editApp && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input name="company" defaultValue={editApp.company} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input name="position" defaultValue={editApp.position} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={editApp.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" defaultValue={editApp.location ?? ""} maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Salary Range</Label>
                <Input name="salary_range" defaultValue={editApp.salary_range ?? ""} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>Job URL</Label>
                <Input name="job_url" defaultValue={editApp.job_url ?? ""} maxLength={2000} />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input name="tags" defaultValue={editApp.tags?.join(", ") ?? ""} maxLength={500} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" defaultValue={editApp.notes ?? ""} rows={3} maxLength={5000} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updateApp.isPending}>
                  {updateApp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
