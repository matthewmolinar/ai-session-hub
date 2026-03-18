import { useState } from "react";
import { MessageSquarePlus, Send, X } from "lucide-react";

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface TurnCommentProps {
  turnId: number;
  comments: Comment[];
  onAddComment: (turnId: number, content: string) => void;
}

export function TurnComment({ turnId, comments, onAddComment }: TurnCommentProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const handleSubmit = () => {
    if (!draft.trim()) return;
    onAddComment(turnId, draft.trim());
    setDraft("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setDraft("");
    }
  };

  return (
    <div className="mt-2">
      {/* Existing comments */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 mb-1.5 text-xs"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-foreground">@{comment.author}</span>
              <span className="text-muted-foreground">{comment.timestamp}</span>
            </div>
            <p className="text-foreground/80 leading-relaxed">{comment.content}</p>
          </div>
        </div>
      ))}

      {/* Add comment */}
      {isAdding ? (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-2 mt-1">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Leave a review comment…"
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[48px]"
            rows={2}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-2xs text-muted-foreground">⌘ Enter to submit</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => { setIsAdding(false); setDraft(""); }}
                className="flex items-center gap-1 px-2 py-1 rounded text-2xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!draft.trim()}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary text-primary-foreground text-2xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Send className="h-3 w-3" />
                Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-2xs text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all mt-1"
        >
          <MessageSquarePlus className="h-3 w-3" />
          Add comment
        </button>
      )}
    </div>
  );
}

