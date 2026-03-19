import { MODELS, SKILLS_FILTERS, AUTHORS } from "@/lib/mock-data";

interface FilterBarProps {
  model: string;
  skill: string;
  author: string;
  sort: "recent" | "trending";
  onModelChange: (m: string) => void;
  onSkillChange: (s: string) => void;
  onAuthorChange: (a: string) => void;
  onSortChange: (s: "recent" | "trending") => void;
}

export function FilterBar({ model, skill, author, sort, onModelChange, onSkillChange, onAuthorChange, onSortChange }: FilterBarProps) {
  const activeFilterCount = [model !== "All Models", skill !== "All Skills", author !== "All Authors"].filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 border-b border-border pb-3 mb-4 overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onSortChange("recent")}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            sort === "recent" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => onSortChange("trending")}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
            sort === "trending" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          Trending
        </button>
      </div>

      <div className="h-4 w-px bg-border shrink-0" />

      <select
        value={author}
        onChange={(e) => onAuthorChange(e.target.value)}
        className="bg-card text-foreground text-xs rounded-md px-2.5 py-1.5 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors shrink-0"
      >
        {AUTHORS.map((a) => (
          <option key={a} value={a}>{a === "All Authors" ? "All Authors" : `@${a}`}</option>
        ))}
      </select>

      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        className="bg-card text-foreground text-xs rounded-md px-2.5 py-1.5 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors shrink-0"
      >
        {MODELS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        value={skill}
        onChange={(e) => onSkillChange(e.target.value)}
        className="bg-card text-foreground text-xs rounded-md px-2.5 py-1.5 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors shrink-0"
      >
        {SKILLS_FILTERS.map((s) => (
          <option key={s} value={s}>{s === "All Skills" ? "All Skills" : s}</option>
        ))}
      </select>

      {activeFilterCount > 0 && (
        <button
          onClick={() => { onModelChange("All Models"); onSkillChange("All Skills"); onAuthorChange("All Authors"); }}
          className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer ml-1 shrink-0 whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
