import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Star, GitBranch, MessageSquare, Circle } from "lucide-react";
import { THREADS, THREAD_REPOS, THREAD_USERS, THREAD_TYPES, type Thread } from "@/lib/mock-threads";

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function DiffStats({ stats }: { stats: Thread["diffStats"] }) {
  const { added, removed, modified } = stats;
  if (added === 0 && removed === 0 && modified === 0) return null;
  return (
    <span className="text-xs font-mono">
      {added > 0 && <span className="text-[hsl(142,60%,30%)]">+{added}</span>}
      {removed > 0 && <span className="text-destructive">{removed > 0 ? `−${removed}` : ""}</span>}
      {modified > 0 && <span className="text-[hsl(38,80%,45%)]">~{modified}</span>}
    </span>
  );
}

function ThreadTypeBadge({ type }: { type: Thread["threadType"] }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-medium border border-border bg-secondary text-secondary-foreground">
      <GitBranch className="h-2.5 w-2.5" />
      {type}
    </span>
  );
}

const TEAM_MEMBERS = [
  { username: "jondesr", role: "Backend Engineer", online: true },
  { username: "shlok_mundhra", role: "Senior Engineer", online: true },
  { username: "shivansh_jagga", role: "Frontend Engineer", online: true },
];

function ThreadRow({ thread }: { thread: Thread }) {
  const location = useLocation();

  return (
    <Link
      to={`/session/${thread.id}`}
      state={{ from: location.pathname }}
      className="block border-b border-border last:border-b-0 px-4 sm:px-6 py-4 hover:bg-secondary/30 transition-colors"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0 mt-0.5">
          {thread.author.username[0].toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">
            {thread.title}
          </h3>

          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mb-2">
            <span className="font-medium text-foreground/80">{thread.author.username.replace("_", " ")}</span>
            <span>{getTimeAgo(thread.createdAt)}</span>
            <span className="text-muted-foreground/40">—</span>
            <DiffStats stats={thread.diffStats} />
            {(thread.diffStats.added > 0 || thread.diffStats.removed > 0 || thread.diffStats.modified > 0) && (
              <span className="text-muted-foreground/30">·</span>
            )}
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              {thread.messageCount} message{thread.messageCount !== 1 ? "s" : ""}
            </span>
            <ThreadTypeBadge type={thread.threadType} />
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3" />
              {thread.stars}
            </span>
          </div>

          <div className="rounded-lg bg-secondary/50 border-l-2 border-border px-3 py-2">
            <p className="text-xs text-muted-foreground line-clamp-1">
              {thread.openingPrompt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Threads() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<string>(THREAD_USERS[0]);
  const [repo, setRepo] = useState<string>(THREAD_REPOS[0]);
  const [threadType, setThreadType] = useState<string>(THREAD_TYPES[0]);

  const filtered = THREADS.filter((t) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !t.openingPrompt.toLowerCase().includes(q) &&
        !t.author.username.toLowerCase().includes(q)
      )
        return false;
    }
    if (user !== "All users" && t.author.username !== user) return false;
    if (repo !== "All repositories" && t.repository !== repo) return false;
    if (threadType !== "All thread types" && t.threadType !== threadType) return false;
    return true;
  });

  const onlineCount = TEAM_MEMBERS.filter((m) => m.online).length;

  return (
    <div className="max-w-[1100px] mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-6">
      {/* Main column */}
      <div className="flex-1 min-w-0">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search threads..."
              className="w-full bg-card text-sm text-foreground rounded-lg pl-9 pr-3 py-2 border border-border outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-all"
            />
          </div>

          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="bg-card text-foreground text-xs rounded-lg px-3 py-2 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors"
          >
            {THREAD_USERS.map((u) => (
              <option key={u} value={u}>{u === "All users" ? "All users" : u.replace("_", " ")}</option>
            ))}
          </select>

          <select
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="bg-card text-foreground text-xs rounded-lg px-3 py-2 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors hidden sm:block"
          >
            {THREAD_REPOS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={threadType}
            onChange={(e) => setThreadType(e.target.value)}
            className="bg-card text-foreground text-xs rounded-lg px-3 py-2 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors hidden sm:block"
          >
            {THREAD_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Thread list */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No threads match your filters.</p>
          ) : (
            filtered.map((thread) => <ThreadRow key={thread.id} thread={thread} />)
          )}
        </div>
      </div>

      {/* Right sidebar */}
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
    </div>
  );
}
