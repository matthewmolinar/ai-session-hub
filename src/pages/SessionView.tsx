import { useState, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Coins, FileCode, GitFork, MessageSquare, Share2, Terminal, Zap } from "lucide-react";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { ModelBadge } from "@/components/ModelBadge";
import { SESSION_DETAIL } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";

export default function SessionView() {
  const { id } = useParams();
  const session = SESSION_DETAIL;

  // Comments state: keyed by turn ID
  const [commentsByTurn, setCommentsByTurn] = useState<Record<number, Comment[]>>(() => {
    // Seed with a couple demo comments
    return {
      1: [
        {
          id: "demo-1",
          author: "techleadmaria",
          content: "This prompt could've been more specific — mention the target framework version and whether you want offline support.",
          timestamp: "15:02",
        },
      ],
      5: [
        {
          id: "demo-2",
          author: "techleadmaria",
          content: "Nice approach here. Using the awareness protocol from the start saves a refactor later.",
          timestamp: "15:10",
        },
      ],
    };
  });

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

  const filesInSession = session.transcript
    ?.flatMap((t) => t.diff?.map((d) => d.filename) ?? [])
    .filter((v, i, a) => a.indexOf(v) === i) ?? [];

  const toolCalls = session.transcript
    ?.filter((t) => t.role === "tool" && t.toolCall)
    .map((t) => t.toolCall!.name)
    .filter((v, i, a) => a.indexOf(v) === i) ?? [];

  const skills = session.tags;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-0 h-[calc(100vh-44px)]">
      {/* Left sidebar: Turn Navigator */}
      <aside className="hidden lg:block border-r border-border p-3 overflow-y-auto sticky top-0 h-[calc(100vh-44px)]">
        <Link to="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-3 w-3" />
          Back to feed
        </Link>
        <h4 className="text-label mb-2">Turns</h4>
        <div className="flex flex-col gap-0.5">
          {session.transcript?.filter(t => t.role !== "tool").map((turn) => {
            const turnCommentCount = (commentsByTurn[turn.id] || []).length;
            return (
              <a
                key={turn.id}
                href={`#turn-${turn.id}`}
                className="flex items-start gap-2 px-2 py-1.5 rounded-sm text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <span className="text-2xs font-mono shrink-0 mt-0.5">{turn.timestamp}</span>
                <span className="line-clamp-1 flex-1">{turn.intentSummary || turn.content.slice(0, 40)}</span>
                {turnCommentCount > 0 && (
                  <span className="shrink-0 flex items-center gap-0.5 text-primary text-2xs">
                    <MessageSquare className="h-2.5 w-2.5" />
                    {turnCommentCount}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </aside>

      {/* Main transcript */}
      <main className="overflow-y-auto h-[calc(100vh-44px)]">
        {/* Session header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-lg font-semibold text-foreground">{session.title}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-secondary text-foreground hover:bg-border transition-colors">
                <Share2 className="h-3 w-3" />
                Share
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {session.forks} forks
            </span>
            {totalComments > 0 && (
              <span className="flex items-center gap-1 text-primary">
                <MessageSquare className="h-3 w-3" />
                {totalComments} comment{totalComments !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="px-6 py-4 divide-y divide-border">
          {session.transcript?.map((turn) => (
            <div key={turn.id} id={`turn-${turn.id}`}>
              <TranscriptTurn
                turn={turn}
                comments={commentsByTurn[turn.id] || []}
                onAddComment={handleAddComment}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Right sidebar: Environment State */}
      <aside className="hidden lg:block border-l border-border p-3 overflow-y-auto sticky top-0 h-[calc(100vh-44px)]">
        <h4 className="text-label mb-2">Files Modified</h4>
        <div className="flex flex-col gap-1">
          {filesInSession.map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <FileCode className="h-3 w-3 shrink-0" />
              <span className="truncate">{f}</span>
            </div>
          ))}
        </div>

        {toolCalls.length > 0 && (
          <>
            <h4 className="text-label mt-5 mb-2">Tool Calls</h4>
            <div className="flex flex-col gap-1">
              {toolCalls.map((name) => (
                <div key={name} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Terminal className="h-3 w-3 shrink-0 text-primary" />
                  <span className="truncate">{name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {skills.length > 0 && (
          <>
            <h4 className="text-label mt-5 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
                  <Zap className="h-2.5 w-2.5 text-primary" />
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        <h4 className="text-label mt-5 mb-2">Branch</h4>
        <div className="text-xs font-mono text-muted-foreground">
          <span className="text-foreground">main</span>
          <span className="mx-1">→</span>
          <span className="text-primary">this session</span>
        </div>
      </aside>
    </div>
  );
}
