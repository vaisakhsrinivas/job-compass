// Position → category mapping by keyword (order matters: first match wins)
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

export function getPositionCategory(position: string): string | null {
  const lower = position.toLowerCase();
  for (const [keyword, category] of POSITION_KEYWORDS) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}
