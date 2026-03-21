import { useState, useMemo, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Star, GitBranch, MessageSquare, FileCode, X, Send } from "lucide-react";
import { THREADS, THREAD_REPOS, THREAD_USERS, type Thread } from "@/lib/mock-threads";
import { getAvatarGradient } from "@/lib/avatar";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { SESSIONS, SESSION_DETAIL } from "@/lib/mock-data";
import type { Session, Turn } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { ModelBadge } from "@/components/ModelBadge";

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
    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-mono font-medium border border-border bg-secondary text-primary">
      <GitBranch className="h-2.5 w-2.5" />
      {type}
    </span>
  );
}

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

function ThreadRow({
  thread,
  isSelected,
  onClick,
}: {
  thread: Thread;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left block border-b border-border last:border-b-0 px-3 sm:px-4 py-4 transition-colors cursor-pointer ${
        isSelected ? "bg-secondary" : "hover:bg-secondary/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0 mt-0.5 ${getAvatarGradient(thread.author.username)}`}>
          {thread.author.username[0].toUpperCase()}
        </div>

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
          </div>

          <div className="rounded-md bg-secondary/60 px-3 py-2 font-mono">
            <p className="text-xs text-muted-foreground line-clamp-1">
              <span className="text-primary/60 mr-1">$</span>{thread.openingPrompt}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function ThreadPreview({ thread, onClose }: { thread: Thread; onClose: () => void }) {
  const session = useMemo(() => threadToSession(thread), [thread]);
  const groups = useMemo(() => groupTurns(session.transcript), [session.transcript]);

  const [commentsByTurn, setCommentsByTurn] = useState<Record<number, Comment[]>>({});

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-start justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">{session.title}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
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
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_12px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]">
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto px-4 py-4 divide-y divide-border">
        {groups.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-12">
            No transcript available for this thread.
          </div>
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

export default function Threads() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<string>(THREAD_USERS[0]);
  const [repo, setRepo] = useState<string>(THREAD_REPOS[0]);

  const selectedThreadId = searchParams.get("id");

  const selectThread = (id: string | null) => {
    setSearchParams(id ? { id } : {}, { replace: true });
  };


  const filtered = THREADS.filter((t) => {
    if (user !== "All users" && t.author.username !== user) return false;
    if (repo !== "All repositories" && t.repository !== repo) return false;
    return true;
  });

  const selectedThread = selectedThreadId ? THREADS.find((t) => t.id === selectedThreadId) ?? null : null;

  return (
    <div className="flex-1 flex overflow-hidden">
      <PanelGroup direction="horizontal" autoSaveId="threads-layout">
        {/* Thread list pane */}
        <Panel defaultSize={35} minSize={25} maxSize={50} className={`${selectedThread ? "hidden lg:flex" : "flex"} flex-col border-r border-border overflow-hidden`}>
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-3 border-b border-border shrink-0">
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="bg-secondary text-foreground text-xs font-mono rounded-md pl-3 pr-8 py-2 border border-border outline-none cursor-pointer hover:border-primary/40 transition-colors min-w-0"
            >
              {THREAD_USERS.map((u) => (
                <option key={u} value={u}>{u === "All users" ? "All users" : u.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="bg-secondary text-foreground text-xs font-mono rounded-md pl-3 pr-8 py-2 border border-border outline-none cursor-pointer hover:border-primary/40 transition-colors min-w-0 truncate"
            >
              {THREAD_REPOS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No threads match your filters.</p>
            ) : (
              filtered.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  thread={thread}
                  isSelected={thread.id === selectedThreadId}
                  onClick={() => selectThread(thread.id)}
                />
              ))
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="hidden lg:flex w-1.5 items-center justify-center hover:bg-secondary transition-colors group">
          <div className="w-0.5 h-8 rounded-full bg-border group-hover:bg-muted-foreground/40 transition-colors" />
        </PanelResizeHandle>

        {/* Preview pane */}
        <Panel defaultSize={65} minSize={40}>
          {selectedThread ? (
            <div className="h-full overflow-hidden">
              <ThreadPreview
                key={selectedThread.id}
                thread={selectedThread}
                onClose={() => selectThread(null)}
              />
            </div>
          ) : (
            <div className="hidden lg:flex h-full flex-col items-center pt-[35%]">
              <div className="text-4xl mb-4 font-mono text-primary/30">_</div>
              <h3 className="text-sm font-mono font-semibold text-foreground mb-1">select a thread</h3>
              <p className="text-xs text-muted-foreground text-center max-w-[240px] font-mono">
                pick a thread from the left to read the conversation
              </p>
            </div>
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
}
