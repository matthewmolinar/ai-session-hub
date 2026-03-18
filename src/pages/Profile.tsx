import { useParams } from "react-router-dom";
import { GitFork, MessageSquare, FileCode, ExternalLink } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { SESSIONS } from "@/lib/mock-data";

export default function Profile() {
  const { username } = useParams();
  const userSessions = SESSIONS.filter((s) => s.author.username === username);
  const allSessions = userSessions.length > 0 ? userSessions : SESSIONS.slice(0, 3);

  const totalTurns = allSessions.reduce((a, s) => a + s.turns, 0);
  const totalForks = allSessions.reduce((a, s) => a + s.forks, 0);
  const totalFiles = allSessions.reduce((a, s) => a + s.filesChanged, 0);

  // Most used models
  const modelCounts: Record<string, number> = {};
  allSessions.forEach((s) => {
    modelCounts[s.model] = (modelCounts[s.model] || 0) + 1;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-lg font-semibold text-foreground">
            {(username || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">@{username}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Prompt engineer · Open-source contributor</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {totalTurns} total turns
              </span>
              <span className="flex items-center gap-1">
                <FileCode className="h-3 w-3" />
                {totalFiles} files changed
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {totalForks} forks received
              </span>
            </div>
          </div>
        </div>

        {/* Style / preferred models */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xs text-muted-foreground uppercase tracking-wider font-medium">Preferred models:</span>
          {Object.entries(modelCounts).map(([model, count]) => (
            <span key={model} className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
              {model}
              <span className="text-foreground font-medium">×{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Session history */}
      <h2 className="text-label mb-3">Sessions</h2>
      <div className="flex flex-col gap-3">
        {allSessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
