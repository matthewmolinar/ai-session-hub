import { useState } from "react";
import { ChevronDown, Bot, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiffBlock } from "./DiffBlock";
import { ToolCallBlock } from "./ToolCallBlock";
import { TurnComment, type Comment } from "./TurnComment";
import { Avatar, AvatarFallback } from "./ui/avatar";
import type { Turn } from "@/lib/mock-data";

interface TranscriptTurnProps {
  turn: Turn;
  /** Grouped assistant/tool turns that follow this user turn */
  responseTurns?: Turn[];
  comments: Comment[];
  onAddComment: (turnId: number, content: string) => void;
}

export function TranscriptTurn({ turn, responseTurns, comments, onAddComment }: TranscriptTurnProps) {
  const [showResponse, setShowResponse] = useState(false);

  // For standalone tool/assistant rendering (backwards compat), just render minimal
  if (turn.role === "tool" && turn.toolCall) {
    return <ToolCallBlock turn={turn} />;
  }

  if (turn.role === "assistant") {
    return (
      <div className="pl-4 text-sm text-muted-foreground/70 leading-relaxed">
        {turn.content.split("\n").map((line, i) => (
          <p key={i} className={line === "" ? "h-3" : ""}>{line}</p>
        ))}
        {turn.diff?.map((d, i) => (
          <DiffBlock key={i} diff={d} />
        ))}
      </div>
    );
  }

  // User turn — rendered as a "post"
  const hasResponse = responseTurns && responseTurns.length > 0;
  const assistantTurn = responseTurns?.find(t => t.role === "assistant");
  const assistantPreview = assistantTurn?.content.split("\n")[0]?.slice(0, 100);

  return (
    <div className="group">
      {/* User post */}
      <div className="flex gap-3 py-3">
        <Avatar className="h-7 w-7 mt-0.5 shrink-0">
          <AvatarFallback className="text-2xs bg-primary/10 text-primary font-medium">U</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">You</span>
            <span className="text-2xs text-muted-foreground">{turn.timestamp}</span>
          </div>
          <div className="text-sm leading-relaxed text-foreground">
            {turn.content.split("\n").map((line, i) => (
              <p key={i} className={line === "" ? "h-3" : ""}>{line}</p>
            ))}
          </div>

          {/* Comments on this turn */}
          <TurnComment
            turnId={turn.id}
            comments={comments}
            onAddComment={onAddComment}
          />

          {/* Expand to see assistant response */}
          {hasResponse && (
            <button
              onClick={() => setShowResponse(!showResponse)}
              className="flex items-center gap-2 mt-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/reply"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary/60 hover:bg-secondary transition-colors">
                <Bot className="h-3 w-3" />
                <span className="font-medium">Response</span>
                {responseTurns && responseTurns.filter(t => t.role === "tool").length > 0 && (
                  <span className="text-2xs text-muted-foreground/60">
                    · {responseTurns.filter(t => t.role === "tool").length} tool call{responseTurns.filter(t => t.role === "tool").length !== 1 ? "s" : ""}
                  </span>
                )}
                <ChevronDown className={`h-3 w-3 transition-transform ${showResponse ? "rotate-180" : ""}`} />
              </div>
            </button>
          )}

          {/* Collapsed response area */}
          <AnimatePresence>
            {showResponse && responseTurns && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-2 pl-3 border-l border-border/60 space-y-2">
                  {responseTurns.map((rt) => {
                    if (rt.role === "tool" && rt.toolCall) {
                      return <ToolCallBlock key={rt.id} turn={rt} />;
                    }
                    return (
                      <div key={rt.id}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Bot className="h-3 w-3 text-muted-foreground/50" />
                          <span className="text-2xs text-muted-foreground">{rt.timestamp}</span>
                        </div>
                        <div className="text-sm text-muted-foreground/80 leading-relaxed">
                          {rt.content.split("\n").map((line, i) => (
                            <p key={i} className={line === "" ? "h-3" : ""}>{line}</p>
                          ))}
                        </div>
                        {rt.diff?.map((d, i) => (
                          <DiffBlock key={i} diff={d} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
