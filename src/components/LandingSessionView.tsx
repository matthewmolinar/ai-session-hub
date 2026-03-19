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

/* Sacred geometry diagram — SVG schematic behind the card */
function SacredGeometry() {
  const cx = 400, cy = 350;
  const purple = "hsl(0 0% 100%";
  const pink = "hsl(0 0% 100%";

  // Generate tick marks around a circle
  const ticks = (r: number, count: number, len: number, opacity: number) => {
    const lines = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + Math.cos(angle) * r;
      const y1 = cy + Math.sin(angle) * r;
      const x2 = cx + Math.cos(angle) * (r + len);
      const y2 = cy + Math.sin(angle) * (r + len);
      lines.push(
        <line key={`${r}-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={`${purple} / ${opacity})`} strokeWidth="0.5" />
      );
    }
    return lines;
  };

  // Small labels at angles
  const labels = [
    { angle: -90, r: 285, text: "0x00" },
    { angle: -45, r: 270, text: "ctx" },
    { angle: 0, r: 285, text: "→out" },
    { angle: 45, r: 270, text: "Δt" },
    { angle: 90, r: 285, text: "0xFF" },
    { angle: 135, r: 270, text: "in←" },
    { angle: 180, r: 285, text: "·src" },
    { angle: 225, r: 270, text: "ƒ(x)" },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.svg
        viewBox="0 0 800 700"
        className="absolute w-[280%] max-w-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.5 }}
      >
        {/* Outermost ring — dashed */}
        <circle cx={cx} cy={cy} r={300} fill="none"
          stroke={`${purple} / 0.12)`} strokeWidth="0.75"
          strokeDasharray="2 8" />

        {/* Outer ring with tick marks */}
        <circle cx={cx} cy={cy} r={260} fill="none"
          stroke={`${purple} / 0.18)`} strokeWidth="0.75" />
        {ticks(254, 72, 12, 0.1)}
        {ticks(254, 12, 18, 0.2)}

        {/* Middle ring — thinner dashed */}
        <circle cx={cx} cy={cy} r={220} fill="none"
          stroke={`${pink} / 0.1)`} strokeWidth="0.75"
          strokeDasharray="1 6" />

        {/* Inner ring */}
        <circle cx={cx} cy={cy} r={180} fill="none"
          stroke={`${purple} / 0.14)`} strokeWidth="0.75" />
        {ticks(174, 36, 12, 0.08)}

        {/* Innermost ring — close to card */}
        <circle cx={cx} cy={cy} r={140} fill="none"
          stroke={`${pink} / 0.1)`} strokeWidth="0.75" />

        {/* Axis lines — full cross */}
        {[0, 45, 90, 135].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const r = 300;
          return (
            <line key={deg}
              x1={cx + Math.cos(rad) * r} y1={cy + Math.sin(rad) * r}
              x2={cx - Math.cos(rad) * r} y2={cy - Math.sin(rad) * r}
              stroke={`${deg % 90 === 0 ? purple : pink} / ${deg % 90 === 0 ? 0.1 : 0.06})`}
              strokeWidth="0.5"
              strokeDasharray={deg % 90 === 0 ? "none" : "3 6"}
            />
          );
        })}

        {/* Small diamonds at cardinal intersections on outer ring */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180 - Math.PI / 2;
          const r = 260;
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          return (
            <g key={`d-${deg}`}>
              <rect x={x - 4} y={y - 4} width={8} height={8}
                transform={`rotate(45 ${x} ${y})`}
                fill="none" stroke={`${purple} / 0.25)`} strokeWidth="0.75" />
              <circle cx={x} cy={y} r={2} fill={`${purple} / 0.2)`} />
            </g>
          );
        })}

        {/* Small circles at 45° intersections */}
        {[45, 135, 225, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180 - Math.PI / 2;
          const r = 260;
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          return (
            <circle key={`c-${deg}`} cx={x} cy={y} r={3}
              fill="none" stroke={`${pink} / 0.3)`} strokeWidth="0.75" />
          );
        })}

        {/* Labels — tiny mono text */}
        {labels.map(({ angle, r, text }) => {
          const rad = (angle * Math.PI) / 180;
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          return (
            <text key={text} x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              fill={`${purple} / 0.35)`}
              fontSize="8" fontFamily="'Geist Mono', monospace"
            >
              {text}
            </text>
          );
        })}

        {/* Inner hexagon */}
        {(() => {
          const r = 160;
          const pts = Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
          }).join(' ');
          return <polygon points={pts} fill="none" stroke={`${purple} / 0.1)`} strokeWidth="0.75" />;
        })()}

        {/* Triangle inscribed */}
        {(() => {
          const r = 200;
          const pts = Array.from({ length: 3 }, (_, i) => {
            const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
            return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
          }).join(' ');
          return <polygon points={pts} fill="none" stroke={`${pink} / 0.1)`} strokeWidth="0.75"
            strokeDasharray="4 8" />;
        })()}

        {/* Inverted triangle */}
        {(() => {
          const r = 200;
          const pts = Array.from({ length: 3 }, (_, i) => {
            const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
            return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
          }).join(' ');
          return <polygon points={pts} fill="none" stroke={`${purple} / 0.08)`} strokeWidth="0.75"
            strokeDasharray="4 8" />;
        })()}
      </motion.svg>
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
