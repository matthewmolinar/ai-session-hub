import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { SessionCard } from "@/components/SessionCard";
import { SESSION_DETAIL } from "@/lib/mock-data";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

export function LandingSessionView() {
  return (
    <div className="h-[calc(100vh-44px)] flex items-center justify-center bg-starfield relative">
      <div className="max-w-lg w-full px-6 relative z-10">
        {/* Hero — large, cosmic */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight text-center mb-12 leading-[1.1]"
        >
          <span className="text-foreground">See the prompts</span>
          <br />
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            behind the code.
          </span>
        </motion.h1>

        {/* One card — the artifact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="glow-radial"
        >
          <div className="glow-card glow-border rounded-lg">
            <SessionCard session={SESSION_DETAIL} landing />
          </div>
        </motion.div>

        {/* Quiet command — not a card, just text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <span className="text-primary">$</span>
            <span className="text-foreground/70">npx tanagram</span>
            <CopyButton text="npx tanagram" />
          </div>
          <p className="text-2xs text-muted-foreground/50 mt-2">
            Your sessions are already on your machine.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
