import { Coins } from "lucide-react";
import { DiffBlock } from "./DiffBlock";
import { ToolCallBlock } from "./ToolCallBlock";
import { TurnComment, type Comment } from "./TurnComment";
import type { Turn } from "@/lib/mock-data";

interface TranscriptTurnProps {
  turn: Turn;
  comments: Comment[];
  onAddComment: (turnId: number, content: string) => void;
}

export function TranscriptTurn({ turn, comments, onAddComment }: TranscriptTurnProps) {
  if (turn.role === "tool" && turn.toolCall) {
    return <ToolCallBlock turn={turn} />;
  }

  const isUser = turn.role === "user";

  return (
    <div className="relative group">
      <div className={`py-3 ${isUser ? "border-l-2 border-primary pl-4" : "pl-4"}`}>
        {/* Role label */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-2xs font-semibold uppercase tracking-wider ${isUser ? "text-primary" : "text-muted-foreground/50"}`}>
            {turn.role}
          </span>
          <span className="text-2xs text-muted-foreground">{turn.timestamp}</span>
          {turn.usage && turn.usage.cost > 0.001 && (
            <span className="flex items-center gap-0.5 text-2xs font-mono text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <Coins className="h-2.5 w-2.5" />
              ${turn.usage.cost.toFixed(4)}
              <span className="text-muted-foreground/60 ml-1">
                {((turn.usage.inputTokens + turn.usage.outputTokens) / 1000).toFixed(1)}k tok
              </span>
            </span>
          )}
        </div>

        {/* Content */}
        {isUser ? (
          <div className="text-sm leading-relaxed font-mono text-foreground">
            {turn.content.split("\n").map((line, i) => (
              <p key={i} className={line === "" ? "h-3" : ""}>{line}</p>
            ))}
          </div>
        ) : (
          <details className="group/details">
            <summary className="text-sm text-muted-foreground/70 leading-relaxed cursor-pointer select-none list-none flex items-start gap-2">
              <span className="text-2xs text-muted-foreground/40 mt-0.5 shrink-0 group-open/details:rotate-90 transition-transform">▸</span>
              <span className="line-clamp-2">{turn.content.split("\n")[0]}</span>
            </summary>
            <div className="text-sm text-muted-foreground/70 leading-relaxed mt-1 pl-4">
              {turn.content.split("\n").slice(1).map((line, i) => (
                <p key={i} className={line === "" ? "h-3" : ""}>{line}</p>
              ))}
            </div>

            {/* Inline diffs — inside collapsible */}
            {turn.diff?.map((d, i) => (
              <DiffBlock key={i} diff={d} />
            ))}
          </details>
        )}

        {/* Inline comments */}
        <TurnComment
          turnId={turn.id}
          comments={comments}
          onAddComment={onAddComment}
        />
      </div>
    </div>
  );
}
