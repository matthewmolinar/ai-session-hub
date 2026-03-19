import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Coins, FileCode, MessageSquare, Terminal, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { ModelBadge } from "@/components/ModelBadge";
import { SESSION_DETAIL } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";

export function LandingSessionView() {
  const session = SESSION_DETAIL;

  const [commentsByTurn, setCommentsByTurn] = useState<Record<number, Comment[]>>(() => ({
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
  }));

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-0 h-[calc(100vh-44px)]">
      {/* Left sidebar: Turn Navigator */}
      <aside className="hidden lg:block border-r border-border p-3 overflow-y-auto sticky top-0 h-[calc(100vh-44px)]">
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
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to={`/profile/${session.author.username}`} className="font-medium text-foreground hover:text-primary transition-colors">
              @{session.author.username}
            </Link>
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

        {/* CTA — after they've read the whole session */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="border-t border-border px-6 py-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">
            This was built in one Claude Code session.
          </p>
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-6">
            See yours.
          </h2>

          <div className="max-w-xs mx-auto">
            <div className="rounded-lg border border-border bg-card overflow-hidden text-left">
              <div className="px-4 py-2.5 bg-secondary/30 border-b border-border flex items-center gap-2">
                <Terminal className="h-3 w-3 text-muted-foreground" />
                <span className="text-2xs text-muted-foreground font-mono">Terminal</span>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">$</span>
                  <code className="text-sm font-mono text-foreground font-medium">npx tanagram</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                  Your sessions are already on your machine.<br />
                  <span className="text-foreground/50">Nothing leaves your machine.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground max-w-xs mx-auto">
            <div className="flex-1 h-px bg-border" />
            <span>or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button className="mt-4 max-w-xs mx-auto w-full text-left group cursor-pointer">
            <div className="rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 hover:bg-primary/[0.02] transition-colors">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                Join a team instance →
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your tech lead sent you a link? Connect to your team's Tanagram.
              </p>
            </div>
          </button>
        </motion.div>
      </main>

      {/* Right sidebar: Environment State */}
      <aside className="hidden lg:block border-l border-border p-3 overflow-y-auto sticky top-0 h-[calc(100vh-44px)]">
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
      </aside>
    </div>
  );
}
