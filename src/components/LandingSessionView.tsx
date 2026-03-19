import { useState } from "react";
import { Terminal, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { SessionCard } from "@/components/SessionCard";
import { SESSION_DETAIL } from "@/lib/mock-data";

export function LandingSessionView() {
  return (
    <div className="h-[calc(100vh-44px)] flex items-center justify-center bg-halftone overflow-hidden relative">
      <div className="max-w-lg w-full px-6 relative z-10">
        {/* One sentence */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold tracking-tight text-center mb-10 leading-tight"
        >
          <span className="text-foreground">See the prompts</span>
          <br />
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            behind the code.
          </span>
        </motion.h1>

        {/* One card — with glow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="glow-radial"
        >
          <div className="glow-card glow-border rounded-lg">
            <SessionCard session={SESSION_DETAIL} landing />
          </div>
        </motion.div>

        {/* One command */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 max-w-xs mx-auto"
        >
          <div className="rounded-lg border border-border bg-card overflow-hidden glow-card">
            <div className="px-4 py-2 bg-secondary/40 border-b border-border flex items-center gap-2">
              <Terminal className="h-3 w-3 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground font-mono">Terminal</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono text-sm">$</span>
                <code className="text-sm font-mono text-foreground font-medium">npx tanagram</code>
              </div>
              <CopyButton text="npx tanagram" />
              <p className="text-2xs text-muted-foreground mt-2">
                Your sessions are already on your machine.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
