import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Application } from "@/hooks/useApplications";

// Company → domain mapping
const COMPANY_DOMAINS: Record<string, string> = {
  google: "Search & Cloud",
  meta: "Social Media",
  openai: "AI / ML",
  anthropic: "AI / ML",
  amazon: "E-Commerce & Cloud",
  walmart: "Retail",
  oracle: "Enterprise Software",
  dell: "Hardware & IT",
  "dell technologies": "Hardware & IT",
  microsoft: "Enterprise Software",
  apple: "Consumer Electronics",
  netflix: "Entertainment",
  spotify: "Entertainment",
  uber: "Mobility",
  lyft: "Mobility",
  stripe: "Fintech",
  paypal: "Fintech",
  salesforce: "Enterprise Software",
  adobe: "Creative Software",
  ibm: "Enterprise Software",
  intel: "Hardware & IT",
  nvidia: "Hardware & IT",
  tesla: "Automotive & Energy",
  twitter: "Social Media",
  x: "Social Media",
  linkedin: "Social Media",
  snap: "Social Media",
  tiktok: "Social Media",
  bytedance: "Social Media",
  airbnb: "Travel & Hospitality",
  databricks: "AI / ML",
  snowflake: "Data & Analytics",
  palantir: "Data & Analytics",
  coinbase: "Fintech",
  robinhood: "Fintech",
  shopify: "E-Commerce & Cloud",
};

// Position → category mapping by keyword
const POSITION_KEYWORDS: [string, string][] = [
  ["sdet", "Test Engineering"],
  ["software development engineer in test", "Test Engineering"],
  ["quality", "Test Engineering"],
  ["qa", "Test Engineering"],
  ["test", "Test Engineering"],
  ["technical program manager", "Program Management"],
  ["program manager", "Program Management"],
  ["tpm", "Program Management"],
  ["technical product manager", "Product Management"],
  ["product manager", "Product Management"],
  ["data scientist", "Data Science"],
  ["data engineer", "Data Engineering"],
  ["machine learning", "Machine Learning"],
  ["ml engineer", "Machine Learning"],
  ["devops", "DevOps / SRE"],
  ["site reliability", "DevOps / SRE"],
  ["sre", "DevOps / SRE"],
  ["frontend", "Frontend Engineering"],
  ["front-end", "Frontend Engineering"],
  ["backend", "Backend Engineering"],
  ["back-end", "Backend Engineering"],
  ["full stack", "Full Stack Engineering"],
  ["fullstack", "Full Stack Engineering"],
  ["software", "Software Engineering"],
  ["engineer", "Software Engineering"],
  ["developer", "Software Engineering"],
  ["architect", "Architecture"],
  ["designer", "Design"],
  ["ux", "Design"],
  ["ui", "Design"],
];

function getCompanyDomain(company: string): string {
  const key = company.toLowerCase().trim();
  return COMPANY_DOMAINS[key] ?? "Other";
}

function getPositionCategory(position: string): string {
  const lower = position.toLowerCase();
  for (const [keyword, category] of POSITION_KEYWORDS) {
    if (lower.includes(keyword)) return category;
  }
  return "Other";
}

interface TagPillProps {
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

function TagPill({ label, count, isActive, onClick }: TagPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all hover:shadow-sm ${
        isActive
          ? "border-accent bg-accent text-accent-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-accent/50 hover:bg-accent/10"
      }`}
    >
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
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Group by company domain
  const domainGroups = new Map<string, Application[]>();
  for (const app of applications) {
    const domain = getCompanyDomain(app.company);
    if (!domainGroups.has(domain)) domainGroups.set(domain, []);
    domainGroups.get(domain)!.push(app);
  }

  // Sort domains by count descending
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

  // Company-level breakdown for selected domain
  const companyGroups = new Map<string, number>();
  if (selectedDomain) {
    const domainApps = domainGroups.get(selectedDomain) ?? [];
    for (const app of domainApps) {
      companyGroups.set(app.company, (companyGroups.get(app.company) ?? 0) + 1);
    }
  }

  const sortedCompanies = [...companyGroups.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        {selectedDomain && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSelectedDomain(null)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <CardTitle className="text-base">
          {selectedDomain
            ? `${selectedDomain} — Breakdown`
            : "Applications by Industry"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedDomain ? (
          <div className="flex flex-wrap gap-2">
            {sortedDomains.map(([domain, apps]) => (
              <TagPill
                key={domain}
                label={domain}
                count={apps.length}
                onClick={() => setSelectedDomain(domain)}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Companies in this domain */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Companies
              </p>
              <div className="flex flex-wrap gap-2">
                {sortedCompanies.map(([company, count]) => (
                  <Badge key={company} variant="secondary" className="gap-1.5 text-sm">
                    {company}
                    <span className="rounded-full bg-muted-foreground/20 px-1.5 text-xs">
                      {count}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Position categories */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Position Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {sortedPositions.map(([cat, apps]) => (
                  <TagPill key={cat} label={cat} count={apps.length} />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
