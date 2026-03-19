import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ChevronRight, FileCode, MessageSquare, Users, Clock, BarChart3 } from "lucide-react";
import { SESSIONS, SKILL_TEAMMATE_COUNTS } from "@/lib/mock-data";
import { ModelBadge } from "@/components/ModelBadge";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SkillGroup {
  skill: string;
  sessions: typeof SESSIONS;
  totalTurns: number;
  totalFiles: number;
  authors: string[];
  lastUsed: string;
  totalForks: number;
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

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--primary) / 0.5)",
  "hsl(var(--primary) / 0.35)",
];

function SkillCard({ group, rank }: { group: SkillGroup; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/40 transition-colors cursor-pointer"
      >
        <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 relative">
          <Zap className="h-4 w-4 text-primary" />
          {rank <= 3 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-2xs font-bold flex items-center justify-center">
              {rank}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-semibold text-foreground font-mono">{group.skill}</div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {group.sessions.length} session{group.sessions.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {group.authors.length} author{group.authors.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getTimeAgo(group.lastUsed)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-semibold text-foreground font-mono">{group.totalTurns}</span>
            <span className="text-2xs text-muted-foreground">turns</span>
          </div>
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-semibold text-foreground font-mono">{group.totalFiles}</span>
            <span className="text-2xs text-muted-foreground">files</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
        </div>
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
            <div className="border-t border-border">
              {/* Stats row */}
              <div className="px-4 py-3 bg-secondary/20 grid grid-cols-4 gap-3">
                <StatBox label="Sessions" value={group.sessions.length} />
                <StatBox label="Total turns" value={group.totalTurns} />
                <StatBox label="Files changed" value={group.totalFiles} />
                <StatBox label="Forks" value={group.totalForks} />
              </div>

              {/* Authors */}
              <div className="px-4 py-2.5 border-t border-border bg-secondary/10 flex items-center gap-2">
                <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-2xs text-muted-foreground">Authors:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {group.authors.map((author) => (
                    <Link
                      key={author}
                      to={`/profile/${author}`}
                      className="text-2xs font-medium text-foreground bg-secondary rounded-full px-2 py-0.5 hover:bg-border transition-colors"
                    >
                      @{author}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sessions list */}
              <div className="divide-y divide-border">
                {group.sessions.map((session) => (
                  <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    state={{ from: "/skills" }}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold text-foreground font-mono">{value}</div>
      <div className="text-2xs text-muted-foreground">{label}</div>
    </div>
  );
}

function SkillChart({ groups }: { groups: SkillGroup[] }) {
  const data = groups.slice(0, 8).map((g) => ({
    name: g.skill,
    sessions: g.sessions.length,
    turns: g.totalTurns,
  }));

  return (
    <div className="border border-border rounded-lg bg-card p-4 mb-4">
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <BarChart3 className="h-3.5 w-3.5 text-primary" />
        Usage by skill
      </h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              cursor={{ fill: "hsl(var(--secondary) / 0.5)" }}
            />
            <Bar dataKey="sessions" name="Sessions" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
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
        totalForks: sessions.reduce((s, sess) => s + sess.forks, 0),
        authors: [...new Set(sessions.map((s) => s.author.username))],
        lastUsed: sessions
          .map((s) => s.createdAt)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0],
      }))
      .sort((a, b) => b.sessions.length - a.sessions.length);
  }, []);

  const totalSkills = groups.length;
  const totalSessions = new Set(SESSIONS.map((s) => s.id)).size;
  const totalAuthors = new Set(SESSIONS.map((s) => s.author.username)).size;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-foreground">Skills</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {totalSkills} skills · {totalSessions} sessions · {totalAuthors} authors
        </p>
      </div>

      <SkillChart groups={groups} />

      <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 bg-secondary/50 rounded-md px-3 py-2 border border-border">
        <span>💡</span>
        <span>
          Tip: use <kbd className="font-mono bg-background rounded px-1 py-0.5 border border-border text-foreground">skill:typescript</kbd> in search to filter sessions by skill
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {groups.map((group, i) => (
          <SkillCard key={group.skill} group={group} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
