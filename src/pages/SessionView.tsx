import { useState, useCallback, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Coins, FileCode, GitFork, MessageSquare, Share2, Terminal, Zap, ChevronDown } from "lucide-react";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { ModelBadge } from "@/components/ModelBadge";
import { SESSION_DETAIL, SESSIONS } from "@/lib/mock-data";
import type { Session, Turn } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";

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

export default function SessionView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from as string | undefined;
  const session = useMemo(() => {
    if (id === SESSION_DETAIL.id) return SESSION_DETAIL;
    return SESSIONS.find((s) => s.id === id) ?? SESSION_DETAIL;
  }, [id]);

  const [commentsByTurn, setCommentsByTurn] = useState<Record<number, Comment[]>>(() => ({
    1: [
      { id: "demo-1", author: "techleadmaria", content: "This prompt could've been more specific — mention the target framework version and whether you want offline support.", timestamp: "15:02" },
    ],
    5: [
      { id: "demo-2", author: "techleadmaria", content: "Nice approach here. Using the awareness protocol from the start saves a refactor later.", timestamp: "15:10" },
    ],
  }));

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

  const costData = useMemo(() => {
    const turns = session.transcript ?? [];
    const totalInput = turns.reduce((s, t) => s + (t.usage?.inputTokens ?? 0), 0);
    const totalOutput = turns.reduce((s, t) => s + (t.usage?.outputTokens ?? 0), 0);
    const totalCost = turns.reduce((s, t) => s + (t.usage?.cost ?? 0), 0);
    const mostExpensive = [...turns]
      .filter((t) => t.usage && t.usage.cost > 0 && t.role !== "tool")
      .sort((a, b) => (b.usage?.cost ?? 0) - (a.usage?.cost ?? 0))
      .slice(0, 3);
    return { totalInput, totalOutput, totalCost, mostExpensive };
  }, [session.transcript]);

  const filesInSession = session.transcript
    ?.flatMap((t) => t.diff?.map((d) => d.filename) ?? [])
    .filter((v, i, a) => a.indexOf(v) === i) ?? [];

  const toolCalls = session.transcript
    ?.filter((t) => t.role === "tool" && t.toolCall)
    .map((t) => t.toolCall!.name)
    .filter((v, i, a) => a.indexOf(v) === i) ?? [];

  const skills = session.tags;
  const groups = useMemo(() => groupTurns(session.transcript), [session.transcript]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-0 h-full flex-1">
      {/* Left sidebar: Turn Navigator — hidden on mobile */}
      <aside className="hidden lg:block border-r border-border p-3 overflow-y-auto">
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
      <main className="overflow-y-auto">
        {/* Session header */}
        <div className="border-b border-border px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => from ? navigate(from) : navigate(-1)}
                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{from === "/explore" ? "Feed" : "Back"}</span>
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">{session.title}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_12px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.6)]">
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
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
            {totalComments > 0 && (
              <span className="flex items-center gap-1 text-primary">
                <MessageSquare className="h-3 w-3" />
                {totalComments} comment{totalComments !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Mobile-only: collapsible session info */}
          <button
            onClick={() => setShowMobileInfo(!showMobileInfo)}
            className="lg:hidden flex items-center gap-1 text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors"
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${showMobileInfo ? "rotate-180" : ""}`} />
            Session details
          </button>
          {showMobileInfo && (
            <div className="lg:hidden mt-3 rounded-lg border border-border bg-secondary/30 p-3 space-y-3">
              <div>
                <span className="text-2xs text-muted-foreground uppercase tracking-wider">Cost</span>
                <div className="text-sm font-semibold text-foreground font-mono">${costData.totalCost.toFixed(4)}</div>
                <div className="flex gap-3 text-2xs text-muted-foreground">
                  <span>{costData.totalInput.toLocaleString()} in</span>
                  <span>{costData.totalOutput.toLocaleString()} out</span>
                </div>
              </div>
              {filesInSession.length > 0 && (
                <div>
                  <span className="text-2xs text-muted-foreground uppercase tracking-wider">Files</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {filesInSession.map((f) => (
                      <span key={f} className="text-2xs font-mono text-muted-foreground bg-secondary rounded px-1.5 py-0.5">{f.split("/").pop()}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.length > 0 && (
                <div>
                  <span className="text-2xs text-muted-foreground uppercase tracking-wider">Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skills.map((skill) => (
                      <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
                        <Zap className="h-2.5 w-2.5 text-primary" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transcript */}
        <div className="px-4 sm:px-6 py-4 divide-y divide-border">
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

      {/* Right sidebar: Environment State — hidden on mobile */}
      <aside className="hidden lg:block border-l border-border p-3 overflow-y-auto">
        <h4 className="text-label mb-2 flex items-center gap-1.5">
          <Coins className="h-3 w-3 text-primary" />
          Session Cost
        </h4>
        <div className="rounded-md border border-border bg-secondary/50 p-2.5 mb-1">
          <div className="text-lg font-semibold text-foreground font-mono">
            ${costData.totalCost.toFixed(4)}
          </div>
          <div className="flex gap-3 mt-1.5 text-2xs text-muted-foreground">
            <span>{costData.totalInput.toLocaleString()} in</span>
            <span>{costData.totalOutput.toLocaleString()} out</span>
          </div>
        </div>
        {costData.mostExpensive.length > 0 && (
          <div className="mt-2 mb-4">
            <span className="text-2xs text-muted-foreground">Most expensive turns</span>
            <div className="flex flex-col gap-1 mt-1">
              {costData.mostExpensive.map((t) => (
                <a
                  key={t.id}
                  href={`#turn-${t.id}`}
                  className="flex items-center justify-between gap-1 px-2 py-1 rounded-sm text-2xs hover:bg-secondary transition-colors"
                >
                  <span className="text-muted-foreground truncate">
                    {t.intentSummary || t.content.slice(0, 25)}
                  </span>
                  <span className="font-mono text-foreground shrink-0">
                    ${t.usage!.cost.toFixed(4)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <h4 className="text-label mt-4 mb-2">Files Modified</h4>
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
