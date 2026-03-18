import { useState } from "react";
import { SessionCard } from "@/components/SessionCard";
import { FilterBar } from "@/components/FilterBar";
import { SESSIONS } from "@/lib/mock-data";

export default function Feed() {
  const [model, setModel] = useState("All Models");
  const [language, setLanguage] = useState("All Languages");
  const [sort, setSort] = useState<"recent" | "trending">("recent");

  const filtered = SESSIONS.filter((s) => {
    if (model !== "All Models" && s.model !== model) return false;
    if (language !== "All Languages" && !s.tags.includes(language)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "trending") return b.forks - a.forks;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <FilterBar
        model={model}
        language={language}
        sort={sort}
        onModelChange={setModel}
        onLanguageChange={setLanguage}
        onSortChange={setSort}
      />
      <div className="flex flex-col gap-3">
        {filtered.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No sessions match your filters.</p>
        )}
      </div>
    </div>
  );
}
