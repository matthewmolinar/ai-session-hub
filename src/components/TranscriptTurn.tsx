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
