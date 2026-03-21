import { useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Search, Star, GitBranch, MessageSquare, Circle, FileCode, Coins, Terminal, Zap, Share2, ChevronDown, X } from "lucide-react";
import { THREADS, THREAD_REPOS, THREAD_USERS, THREAD_TYPES, type Thread } from "@/lib/mock-threads";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { ModelBadge } from "@/components/ModelBadge";
import { SESSION_DETAIL, SESSIONS } from "@/lib/mock-data";
import type { Session, Turn } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";

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
  { username: "feifanz", role: "Engineer", online: false },
  { username: "molinar", role: "Engineer", online: false },
];

interface TurnGroup {
  userTurn: Turn;
  responseTurns: Turn[];
}

function groupTurns(transcript: Session["transcript"]): TurnGroup[] {
  if (!transcript) return [];
  const groups: TurnGroup[] = [];
  let current: TurnGroup | null = null;
  for (const turn of transcript) {
    if (turn.role === "user") {
      if (current) groups.push(current);
      current = { userTurn: turn, responseTurns: [] };
    } else if (current) {
      current.responseTurns.push(turn);
    }
  }
  if (current) groups.push(current);
  return groups;
}

function threadToSession(thread: Thread): Session {
  return {
    ...thread,
    model: "claude-3.5-sonnet",
    source: "claude-code" as const,
    author: { ...thread.author },
    turns: thread.messageCount,
    filesChanged: thread.diffStats.added + thread.diffStats.removed + thread.diffStats.modified,
    forks: 0,
    likes: thread.stars,
    tags: [],
    sparkline: [],
    comments: [],
  };
}

/* ── Post row in the left list ── */
function ThreadRow({ thread, isSelected, onClick }: { thread: Thread; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left block border-b border-border last:border-b-0 px-4 py-3 transition-colors cursor-pointer ${
        isSelected ? "bg-secondary" : "hover:bg-secondary/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0 mt-0.5">
          {thread.author.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-0.5 truncate">
            {thread.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{thread.author.username.replace("_", " ")}</span>
            <span>{getTimeAgo(thread.createdAt)}</span>
            <DiffStats stats={thread.diffStats} />
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              {thread.messageCount}
            </span>
            <ThreadTypeBadge type={thread.threadType} />
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Session detail panel (right) ── */
function SessionPanel({ session, onClose }: { session: Session; onClose: () => void }) {
  const [commentsByTurn, setCommentsByTurn] = useState<Record<number, Comment[]>>({});
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const handleAddComment = useCallback((turnId: number, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "you",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setCommentsByTurn((prev) => ({
      ...prev,
      [turnId]: [...(prev[turnId] || []), newComment],
    }));
  }, []);

  const totalComments = Object.values(commentsByTurn).reduce((sum, arr) => sum + arr.length, 0);
  const groups = useMemo(() => groupTurns(session.transcript), [session.transcript]);

  const costData = useMemo(() => {
    const turns = session.transcript ?? [];
    const totalInput = turns.reduce((s, t) => s + (t.usage?.inputTokens ?? 0), 0);
    const totalOutput = turns.reduce((s, t) => s + (t.usage?.outputTokens ?? 0), 0);
    const totalCost = turns.reduce((s, t) => s + (t.usage?.cost ?? 0), 0);
    return { totalInput, totalOutput, totalCost };
  }, [session.transcript]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h1 className="text-sm font-semibold text-foreground truncate">{session.title}</h1>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground">@{session.author.username}</span>
          <ModelBadge model={session.model} />
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {session.turns} turns
          </span>
          <span className="flex items-center gap-1">
            <FileCode className="h-3 w-3" />
            {session.filesChanged} files
          </span>
          {costData.totalCost > 0 && (
            <span className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              ${costData.totalCost.toFixed(4)}
            </span>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-border">
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No transcript available for this post.</p>
        ) : (
          groups.map((group) => (
            <div key={group.userTurn.id} id={`turn-${group.userTurn.id}`}>
              <TranscriptTurn
                turn={group.userTurn}
                responseTurns={group.responseTurns}
                comments={commentsByTurn[group.userTurn.id] || []}
                onAddComment={handleAddComment}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Threads() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<string>(THREAD_USERS[0]);
  const [repo, setRepo] = useState<string>(THREAD_REPOS[0]);
  const [threadType, setThreadType] = useState<string>(THREAD_TYPES[0]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

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

  const selectedSession = useMemo(() => {
    if (!selectedThreadId) return null;
    const thread = THREADS.find((t) => t.id === selectedThreadId);
    if (!thread) return null;
    return threadToSession(thread);
  }, [selectedThreadId]);

  const onlineCount = TEAM_MEMBERS.filter((m) => m.online).length;

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {/* Top bar: Friends + Trending */}
      <div className="border-b border-border px-3 sm:px-4 py-3 shrink-0">
        <div className="max-w-[1400px] mx-auto flex gap-3 overflow-x-auto">
          {/* Friends card */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shrink-0">
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">Your Friends</span>
            <span className="text-2xs text-muted-foreground">{onlineCount} online</span>
            <div className="flex items-center -space-x-1.5">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.username} className="relative" title={`@${member.username}`}>
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-2xs font-semibold text-primary border-2 border-card">
                    {member.username[0].toUpperCase()}
                  </div>
                  {member.online && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 fill-emerald-500 text-card stroke-[3]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trending card */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 shrink-0">
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">Trending</span>
            {["/commit", "/review", "/tdd", "/test"].map((skill, i) => (
              <span key={skill} className="inline-flex items-center gap-1 text-2xs whitespace-nowrap">
                <span className="font-mono text-primary">{skill}</span>
                <span className="text-muted-foreground">{[142, 98, 67, 51][i]}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Two-panel area */}
      <div className="flex flex-1 overflow-hidden max-w-[1400px] mx-auto w-full">
        {/* Left: Post list */}
        <div className={`flex flex-col border-r border-border overflow-hidden shrink-0 transition-all ${
          selectedThreadId ? "w-[380px]" : "w-full max-w-[600px] mx-auto border-r-0"
        }`}>
          {/* Filter bar */}
          <div className="flex items-center gap-2 p-3 flex-wrap shrink-0 border-b border-border">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full bg-card text-sm text-foreground rounded-lg pl-9 pr-3 py-2 border border-border outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-all"
              />
            </div>
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="bg-card text-foreground text-xs rounded-lg px-2 py-2 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors"
            >
              {THREAD_USERS.map((u) => (
                <option key={u} value={u}>{u === "All users" ? "All users" : u.replace("_", " ")}</option>
              ))}
            </select>
            {!selectedThreadId && (
              <>
                <select
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="bg-card text-foreground text-xs rounded-lg px-2 py-2 border border-border outline-none cursor-pointer hover:border-muted-foreground/40 transition-colors hidden sm:block"
                >
                  {THREAD_REPOS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Post list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No posts match your filters.</p>
            ) : (
              filtered.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  thread={thread}
                  isSelected={thread.id === selectedThreadId}
                  onClick={() => setSelectedThreadId(thread.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Session detail */}
        {selectedSession && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <SessionPanel
              key={selectedSession.id}
              session={selectedSession}
              onClose={() => setSelectedThreadId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
