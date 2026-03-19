import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { SessionCard } from "@/components/SessionCard";
import { SESSION_DETAIL } from "@/lib/mock-data";

export function LandingSessionView() {
  return (
    <div className="h-[calc(100vh-44px)] flex items-center justify-center">
      <div className="max-w-lg w-full px-6">
        {/* One sentence */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-foreground tracking-tight text-center mb-8"
        >
          See the prompts behind the code.
        </motion.h1>

        {/* One card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <SessionCard session={SESSION_DETAIL} landing />
        </motion.div>

        {/* One command */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-8"
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden max-w-xs mx-auto">
            <div className="px-4 py-2.5 bg-secondary/30 border-b border-border flex items-center gap-2">
              <Terminal className="h-3 w-3 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground font-mono">Terminal</span>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono text-sm">$</span>
                <code className="text-sm font-mono text-foreground font-medium">npx tanagram</code>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Your sessions are already on your machine.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
