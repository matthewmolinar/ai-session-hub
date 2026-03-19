import { useState } from "react";
import { SessionCard } from "@/components/SessionCard";
import { FilterBar } from "@/components/FilterBar";
import { AuthModal } from "@/components/AuthModal";
import { SESSIONS } from "@/lib/mock-data";

export default function Feed() {
  const [model, setModel] = useState("All Models");
  const [skill, setSkill] = useState("All Skills");
  const [author, setAuthor] = useState("All Authors");
  const [sort, setSort] = useState<"recent" | "trending">("recent");
  const [authOpen, setAuthOpen] = useState(false);

  const filtered = SESSIONS.filter((s) => {
    if (model !== "All Models" && s.model !== model) return false;
    if (skill !== "All Skills" && !s.tags.includes(skill)) return false;
    if (author !== "All Authors" && s.author.username !== author) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "trending") return b.forks - a.forks;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <FilterBar
        model={model}
        skill={skill}
        author={author}
        sort={sort}
        onModelChange={setModel}
        onSkillChange={setSkill}
        onAuthorChange={setAuthor}
        onSortChange={setSort}
      />
      <div className="flex flex-col gap-3">
        {filtered.map((session) => (
          <SessionCard key={session.id} session={session} onSignInClick={() => setAuthOpen(true)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">No sessions match your filters.</p>
        )}
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
