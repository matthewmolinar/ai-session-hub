import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Terminal } from "lucide-react";
import type { Turn } from "@/lib/mock-data";

interface ToolCallBlockProps {
  turn: Turn;
}

export function ToolCallBlock({ turn }: ToolCallBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const tc = turn.toolCall!;

  return (
    <div className="rounded-md border border-border bg-subtle overflow-hidden my-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
      >
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRight className="h-3 w-3" />
        </motion.div>
        <Terminal className="h-3 w-3" />
        <span>
          call: {tc.name}({tc.args.length > 60 ? tc.args.slice(0, 60) + "…" : tc.args})
        </span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden"
          >
            <pre className="px-3 py-2 text-xs font-mono text-foreground border-t border-border bg-background overflow-x-auto">
              {tc.args}
            </pre>
            {tc.result && (
              <div className="px-3 py-1.5 text-xs text-muted-foreground border-t border-border">
                → {tc.result}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
