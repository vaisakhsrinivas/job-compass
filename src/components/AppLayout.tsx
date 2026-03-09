import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LayoutDashboard, PlusCircle, List, LogOut, Menu, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add", label: "Add Application", icon: PlusCircle },
  { to: "/applications", label: "Applications", icon: List },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">JobTracker</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2",
                    location.pathname === item.to && "font-medium"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground lg:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="hidden gap-2 md:flex">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="mt-6 flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                      <Button
                        variant={location.pathname === item.to ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  <hr className="my-2" />
                  <p className="truncate px-4 text-sm text-muted-foreground">{user?.email}</p>
                  <Button variant="ghost" onClick={signOut} className="justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
