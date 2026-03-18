// Position → category mapping by keyword (order matters: first match wins)
// Each entry: [pattern, category, exact?]
// If exact is true, match as a whole word (word-boundary); otherwise substring match.
const POSITION_KEYWORDS: [string, string, boolean?][] = [
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
  ["sre", "DevOps / SRE", true],
  ["frontend", "Frontend Engineering"],
  ["front-end", "Frontend Engineering"],
  ["backend", "Backend Engineering"],
  ["back-end", "Backend Engineering"],
  ["full stack", "Full Stack Engineering"],
  ["fullstack", "Full Stack Engineering"],
  ["software", "Software Engineering"],
  ["sse", "Software Engineering", true],
  ["senior se", "Software Engineering"],
  ["engineer", "Software Engineering"],
  ["developer", "Software Engineering"],
  ["se", "Software Engineering", true],
  ["architect", "Architecture"],
  ["designer", "Design"],
  ["ux", "Design"],
  ["ui", "Design"],
];

export function getPositionCategory(position: string): string | null {
  const lower = position.toLowerCase();
  for (const [keyword, category, exact] of POSITION_KEYWORDS) {
    if (exact) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      if (regex.test(lower)) return category;
    } else {
      if (lower.includes(keyword)) return category;
    }
  }
  return null;
}
