import { useState } from "react";
import { SessionCard } from "@/components/SessionCard";
import { FilterBar } from "@/components/FilterBar";
import { AuthModal } from "@/components/AuthModal";
import { SESSIONS } from "@/lib/mock-data";
import { Circle } from "lucide-react";

const TEAM_MEMBERS = [
  { username: "sarah_edo", role: "Staff Engineer", online: true },
  { username: "danabramov", role: "Frontend Lead", online: true },
  { username: "tkdodo", role: "Senior Engineer", online: false },
  { username: "phil_eaton", role: "Backend Engineer", online: true },
  { username: "jh3yy", role: "Design Engineer", online: false },
  { username: "fasterthanlime", role: "Systems Engineer", online: false },
];

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

  const onlineCount = TEAM_MEMBERS.filter((m) => m.online).length;

  return (
    <div className="max-w-[1100px] mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-6">
      {/* Feed column */}
      <div className="flex-1 min-w-0 max-w-2xl">
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
      </div>

      {/* Right sidebar — sticky, hidden on mobile/tablet */}
      <aside className="hidden lg:block w-[280px] shrink-0">
        <div className="sticky top-[60px] space-y-4 overflow-y-auto max-h-[calc(100vh-72px)] pr-1">
          {/* Your Team */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Your Team</h3>
              <span className="text-xs text-muted-foreground">{onlineCount} online</span>
            </div>
            <div className="space-y-1">
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.username}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary transition-colors text-left cursor-pointer"
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {member.username[0].toUpperCase()}
                    </div>
                    {member.online && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-emerald-500 text-card stroke-[3]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">@{member.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Skills */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Trending Skills</h3>
            <div className="space-y-2">
              {["/commit", "/review", "/tdd", "/test"].map((skill, i) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-sm font-mono text-primary">{skill}</span>
                  <span className="text-xs text-muted-foreground">{[142, 98, 67, 51][i]} uses today</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
