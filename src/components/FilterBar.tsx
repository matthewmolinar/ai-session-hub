import { MODELS, LANGUAGES } from "@/lib/mock-data";

interface FilterBarProps {
  model: string;
  language: string;
  sort: "recent" | "trending";
  onModelChange: (m: string) => void;
  onLanguageChange: (l: string) => void;
  onSortChange: (s: "recent" | "trending") => void;
}

export function FilterBar({ model, language, sort, onModelChange, onLanguageChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-3 mb-4 flex-wrap">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onSortChange("recent")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            sort === "recent" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => onSortChange("trending")}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            sort === "trending" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Trending
        </button>
      </div>

      <div className="h-4 w-px bg-border" />

      <select
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        className="bg-secondary text-foreground text-xs rounded-md px-2 py-1 border-none outline-none cursor-pointer"
      >
        {MODELS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-secondary text-foreground text-xs rounded-md px-2 py-1 border-none outline-none cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </div>
  );
}
