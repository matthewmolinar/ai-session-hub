import { useState } from "react";
import { Plus } from "lucide-react";
import { DiffBlock } from "./DiffBlock";
import { ToolCallBlock } from "./ToolCallBlock";
import type { Turn } from "@/lib/mock-data";

interface TranscriptTurnProps {
  turn: Turn;
}

export function TranscriptTurn({ turn }: TranscriptTurnProps) {
  const [showFork, setShowFork] = useState(false);

  if (turn.role === "tool" && turn.toolCall) {
    return <ToolCallBlock turn={turn} />;
  }

  const isUser = turn.role === "user";

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowFork(true)}
      onMouseLeave={() => setShowFork(false)}
    >
      {/* Fork line */}
      {showFork && (
        <button
          className="absolute -left-6 top-0 bottom-0 w-5 flex items-start pt-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title={`Fork from turn #${turn.id}`}
        >
          <Plus className="h-3.5 w-3.5 text-primary" />
        </button>
      )}

      <div className={`py-3 ${isUser ? "border-l-2 border-primary pl-4" : "pl-4"}`}>
        {/* Role label */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-2xs font-semibold uppercase tracking-wider ${isUser ? "text-primary" : "text-muted-foreground"}`}>
            {turn.role}
          </span>
          <span className="text-2xs text-muted-foreground">{turn.timestamp}</span>
        </div>

        {/* Content */}
        <div className={`text-sm leading-relaxed ${isUser ? "font-mono" : ""}`}>
          {turn.content.split("\n").map((line, i) => (
            <p key={i} className={line === "" ? "h-3" : ""}>
              {line}
            </p>
          ))}
        </div>

        {/* Inline diffs */}
        {turn.diff?.map((d, i) => (
          <DiffBlock key={i} diff={d} />
        ))}
      </div>
    </div>
  );
}
