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

/* Sacred geometry rings behind the card */
function SacredGeometry() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-10%' }}>
      {/* Outer ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
        className="absolute w-[140%] aspect-square rounded-full"
        style={{
          border: '1px solid hsl(289 100% 50% / 0.06)',
        }}
      />
      {/* Middle ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
        className="absolute w-[110%] aspect-square rounded-full"
        style={{
          border: '1px solid hsl(313 74% 54% / 0.08)',
        }}
      />
      {/* Inner ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        className="absolute w-[85%] aspect-square rounded-full"
        style={{
          border: '1px solid hsl(289 100% 50% / 0.1)',
        }}
      />
      {/* Cross lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0"
      >
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: 'linear-gradient(to bottom, transparent 10%, hsl(289 100% 50% / 0.06) 30%, hsl(289 100% 50% / 0.06) 70%, transparent 90%)' }} />
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: 'linear-gradient(to right, transparent 10%, hsl(313 74% 54% / 0.05) 30%, hsl(313 74% 54% / 0.05) 70%, transparent 90%)' }} />
        {/* Diagonal lines */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, transparent 42%, hsl(289 100% 50% / 0.04) 49.5%, hsl(289 100% 50% / 0.04) 50.5%, transparent 58%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(-135deg, transparent 42%, hsl(313 74% 54% / 0.03) 49.5%, hsl(313 74% 54% / 0.03) 50.5%, transparent 58%)' }} />
      </motion.div>
      {/* Small dots at cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <motion.div
          key={deg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + deg / 1000, duration: 0.6 }}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            transform: `rotate(${deg}deg) translateY(-${55}%) rotate(-${deg}deg)`,
            top: '50%',
            left: '50%',
            marginTop: '-2px',
            marginLeft: '-2px',
            transformOrigin: '2px 2px',
          }}
        />
      ))}
    </div>
  );
}

export function LandingSessionView() {
  return (
    <div className="h-[calc(100vh-44px)] flex items-center justify-center bg-starfield relative">
      <div className="max-w-lg w-full px-6 relative z-10">
        {/* Hero — inscription style */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight text-center mb-14 leading-[1.1]"
        >
          <span className="text-foreground">See the prompts</span>
          <br />
          <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent tracking-wide">
            behind the code.
          </span>
        </motion.h1>

        {/* Card with sacred geometry */}
        <div className="relative">
          <SacredGeometry />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="relative z-10"
          >
            <div className="glow-card glow-border rounded-lg breathing-glow">
              <SessionCard session={SESSION_DETAIL} landing />
            </div>
          </motion.div>
        </div>

        {/* Quiet command */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <span className="text-primary">$</span>
            <span className="text-foreground/70">npx tanagram</span>
            <CopyButton text="npx tanagram" />
          </div>
          <p className="text-2xs text-muted-foreground/40 mt-2 tracking-widest uppercase">
            Your sessions are already on your machine
          </p>
        </motion.div>
      </div>
    </div>
  );
}
