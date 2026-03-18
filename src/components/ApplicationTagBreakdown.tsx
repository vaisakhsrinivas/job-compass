import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Application } from "@/hooks/useApplications";
import { getIndustryIcon } from "@/components/industryIcons";
import { getCompanyIcon } from "@/components/companyIcons";
import { COMPANY_DOMAINS } from "@/components/companyDomains";

const VALID_INDUSTRIES = new Set([
  "Search & Cloud", "Social Media", "AI / ML", "E-Commerce & Cloud", "Retail",
  "Enterprise Software", "Hardware & IT", "Consumer Electronics", "Entertainment",
  "Mobility", "Fintech", "Creative Software", "Automotive & Energy",
  "Travel & Hospitality", "Data & Analytics", "Networking & Security",
  "SaaS & IT Service Management", "Other",
]);

import { getPositionCategory as getPositionCategoryShared } from "@/components/positionCategories";

function getCompanyDomainFromApp(app: Application): string {
  const key = app.company.toLowerCase().trim();
  const staticDomain = COMPANY_DOMAINS[key];
  if (staticDomain) return staticDomain;
  if (app.tags) {
    for (const tag of app.tags) {
      if (VALID_INDUSTRIES.has(tag)) return tag;
    }
  }
  return "Other";
}

function getPositionCategory(position: string): string {
  return getPositionCategoryShared(position) ?? "Other";
}

interface TagPillProps {
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
  icon?: string;
}

function TagPill({ label, count, isActive, onClick, icon }: TagPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${
        isActive
          ? "border-accent bg-accent text-accent-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-accent/50 hover:bg-accent/10"
      }`}
    >
      {icon && (
        <img src={icon} alt="" className="h-7 w-7 rounded-sm object-contain drop-shadow-sm" />
      )}
      {label}
      <span
        className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
          isActive
            ? "bg-accent-foreground/20 text-accent-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

interface Props {
  applications: Application[];
}

export function ApplicationTagBreakdown({ applications }: Props) {
  const navigate = useNavigate();

  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  // Group by company domain
  const domainGroups = new Map<string, Application[]>();
  for (const app of applications) {
    const domain = getCompanyDomainFromApp(app);
    if (!domainGroups.has(domain)) domainGroups.set(domain, []);
    domainGroups.get(domain)!.push(app);
  }

  const sortedDomains = [...domainGroups.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );

  // Position categories for selected domain
  const positionGroups = new Map<string, Application[]>();
  if (selectedDomain) {
    const domainApps = domainGroups.get(selectedDomain) ?? [];
    for (const app of domainApps) {
      const cat = getPositionCategory(app.position);
      if (!positionGroups.has(cat)) positionGroups.set(cat, []);
      positionGroups.get(cat)!.push(app);
    }
  }

  const sortedPositions = [...positionGroups.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );

  // Company-level breakdown for selected domain, filtered by position category
  const companyGroups = new Map<string, number>();
  if (selectedDomain) {
    let domainApps = domainGroups.get(selectedDomain) ?? [];
    if (selectedPosition) {
      domainApps = domainApps.filter(
        (app) => getPositionCategory(app.position) === selectedPosition
      );
    }
    for (const app of domainApps) {
      companyGroups.set(app.company, (companyGroups.get(app.company) ?? 0) + 1);
    }
  }

  const sortedCompanies = [...companyGroups.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  // Positions for selected company
  const companyPositions = selectedCompany
    ? applications.filter((a) => a.company === selectedCompany)
    : [];

  const handleBack = () => {
    if (selectedCompany) {
      setSelectedCompany(null);
    } else if (selectedPosition) {
      setSelectedPosition(null);
    } else {
      setSelectedDomain(null);
    }
  };

  const title = selectedCompany
    ? `${selectedCompany} — Positions`
    : selectedPosition
      ? `${selectedDomain} — ${selectedPosition}`
      : selectedDomain
        ? `${selectedDomain} — Breakdown`
        : "Applications by Industry";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        {(selectedDomain || selectedCompany) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {selectedDomain && (
          <img src={getIndustryIcon(selectedDomain)} alt="" className="h-8 w-8 rounded-sm object-contain drop-shadow-sm" />
        )}
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedDomain && !selectedCompany ? (
          <div className="flex flex-wrap gap-2">
            {sortedDomains.map(([domain, apps]) => (
              <TagPill
                key={domain}
                label={domain}
                count={apps.length}
                icon={getIndustryIcon(domain)}
                onClick={() => setSelectedDomain(domain)}
              />
            ))}
          </div>
        ) : selectedCompany ? (
          <div className="space-y-2">
            {companyPositions.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{app.position}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {app.status.replace("_", " ")}
                    </Badge>
                    {app.location && (
                      <span className="text-xs text-muted-foreground">
                        {app.location}
                      </span>
                    )}
                    {app.salary_range && (
                      <span className="text-xs text-muted-foreground">
                        · {app.salary_range}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Companies
              </p>
              <div className="flex flex-wrap gap-2">
                {sortedCompanies.map(([company, count]) => (
                  <TagPill
                    key={company}
                    label={company}
                    count={count}
                    icon={getCompanyIcon(company)}
                    onClick={() => setSelectedCompany(company)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Position Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {sortedPositions.map(([cat, apps]) => (
                  <TagPill
                    key={cat}
                    label={cat}
                    count={apps.length}
                    isActive={selectedPosition === cat}
                    onClick={() => {
                      navigate(`/applications?position_category=${encodeURIComponent(cat)}`);
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
