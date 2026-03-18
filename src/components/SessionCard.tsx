import { Link } from "react-router-dom";
import { GitFork, FileCode, MessageSquare } from "lucide-react";
import { ModelBadge } from "./ModelBadge";
import { Sparkline } from "./Sparkline";
import type { Session } from "@/lib/mock-data";

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const timeAgo = getTimeAgo(session.createdAt);

  return (
    <Link
      to={`/session/${session.id}`}
      className="block rounded-lg shadow-card border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      {/* L1: Title */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-1">
          {session.title}
        </h3>
        <ModelBadge model={session.model} />
      </div>

      {/* L2: Opening prompt */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-mono">
        {session.openingPrompt}
      </p>

      {/* Sparkline */}
      <Sparkline data={session.sparkline} className="mb-3" />

      {/* L3: Metadata */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">@{session.author.username}</span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {session.turns}
        </span>
        <span className="flex items-center gap-1">
          <FileCode className="h-3 w-3" />
          {session.filesChanged}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3 w-3" />
          {session.forks}
        </span>
        <span className="ml-auto">{timeAgo}</span>
      </div>
    </Link>
  );
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
