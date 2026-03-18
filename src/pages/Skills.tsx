import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ChevronRight, FileCode, MessageSquare } from "lucide-react";
import { SESSIONS } from "@/lib/mock-data";
import { ModelBadge } from "@/components/ModelBadge";
import { motion, AnimatePresence } from "framer-motion";

interface SkillGroup {
  skill: string;
  sessions: typeof SESSIONS;
  totalTurns: number;
  totalFiles: number;
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function SkillCard({ group }: { group: SkillGroup }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors cursor-pointer"
      >
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-semibold text-foreground font-mono">{group.skill}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {group.sessions.length} session{group.sessions.length !== 1 ? "s" : ""} · {group.totalTurns} turns · {group.totalFiles} files
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border divide-y divide-border">
              {group.sessions.map((session) => (
                <Link
                  key={session.id}
                  to={`/session/${session.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground line-clamp-1">{session.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>@{session.author.username}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {session.turns} turns
                      </span>
                      <span className="flex items-center gap-1">
                        <FileCode className="h-3 w-3" />
                        {session.filesChanged} files
                      </span>
                      <span>{getTimeAgo(session.createdAt)}</span>
                    </div>
                  </div>
                  <ModelBadge model={session.model} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Skills() {
  const groups = useMemo<SkillGroup[]>(() => {
    const map = new Map<string, typeof SESSIONS>();
    for (const session of SESSIONS) {
      for (const tag of session.tags) {
        const existing = map.get(tag) || [];
        existing.push(session);
        map.set(tag, existing);
      }
    }
    return Array.from(map.entries())
      .map(([skill, sessions]) => ({
        skill,
        sessions,
        totalTurns: sessions.reduce((s, sess) => s + sess.turns, 0),
        totalFiles: sessions.reduce((s, sess) => s + sess.filesChanged, 0),
      }))
      .sort((a, b) => b.sessions.length - a.sessions.length);
  }, []);

  const totalSkills = groups.length;
  const totalSessions = new Set(SESSIONS.map((s) => s.id)).size;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-foreground">Skills</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {totalSkills} skills across {totalSessions} sessions
        </p>
      </div>

      <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 bg-secondary/50 rounded-md px-3 py-2 border border-border">
        <span>💡</span>
        <span>
          Tip: use <kbd className="font-mono bg-background rounded px-1 py-0.5 border border-border text-foreground">skill:typescript</kbd> in search to filter sessions by skill
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {groups.map((group) => (
          <SkillCard key={group.skill} group={group} />
        ))}
      </div>
    </div>
  );
}
