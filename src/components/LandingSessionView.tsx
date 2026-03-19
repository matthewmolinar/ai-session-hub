import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SessionCard } from "@/components/SessionCard";
import { useMySessionsState } from "@/contexts/MySessionsContext";
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
  const navigate = useNavigate();
  const { setSelectedFilePath, setActiveSessionId, setDemoMode } = useMySessionsState();

  const handleCardClick = () => {
    setSelectedFilePath("src/editor/document.ts");
    setActiveSessionId("s1");
    setDemoMode(true);
    navigate("/my-sessions");
  };

  return (
    <div className="h-[calc(100vh-48px)] flex items-center justify-center bg-background relative">
      <div className="max-w-lg w-full px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-center mb-3 leading-[1.15]"
        >
          <span className="text-foreground">See the prompts</span>
          <br />
          <span className="text-primary">
            behind the code.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center text-muted-foreground text-base mb-10 max-w-sm mx-auto"
        >
          Share AI coding sessions with your team. Learn from how others prompt.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative z-10 cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="rounded-xl shadow-elevated border border-border hover:shadow-lg transition-shadow">
            <SessionCard session={SESSION_DETAIL} landing />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground bg-card rounded-lg px-4 py-2 border border-border">
            <span className="text-primary font-semibold">$</span>
            <span className="text-foreground">npx tanagram</span>
            <CopyButton text="npx tanagram" />
          </div>
          <p className="text-xs text-muted-foreground">
            Your sessions are already on your machine
          </p>
        </motion.div>
      </div>
    </div>
  );
}
