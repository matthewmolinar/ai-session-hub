import { Link, useLocation } from "react-router-dom";
import { FileCode, MessageSquare, Lock } from "lucide-react";
import { ModelBadge } from "./ModelBadge";
import { Sparkline } from "./Sparkline";
import { useAuth } from "@/contexts/AuthContext";
import type { Session } from "@/lib/mock-data";

interface SessionCardProps {
  session: Session;
  onSignInClick?: () => void;
  landing?: boolean;
}

export function SessionCard({ session, onSignInClick, landing }: SessionCardProps) {
  const timeAgo = getTimeAgo(session.createdAt);
  const location = useLocation();
  const blurred = false;

  const content = (
    <div
      className="relative rounded-lg border border-border bg-card p-4 overflow-hidden glow-card glow-border"
      onClick={blurred && onSignInClick ? () => onSignInClick() : undefined}
      role={blurred ? "button" : undefined}
      style={blurred ? { cursor: "pointer" } : undefined}
    >
      {blurred && (
        <>
          <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-card/30 rounded-lg" style={{ top: '3.5rem' }} />
          <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ top: '3.5rem' }}>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-card/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 shadow-sm">
              <Lock className="h-3 w-3" />
              Sign in to view
            </span>
          </div>
        </>
      )}

      {/* L1: Title + author (always visible) */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-medium text-xs text-muted-foreground">@{session.author.username}</span>
        <span className="text-border">·</span>
        <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-1 flex-1">
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
        <span className="ml-auto">{timeAgo}</span>
      </div>
    </div>
  );

  if (blurred || landing) return content;

  return (
    <Link to={`/session/${session.id}`} state={{ from: location.pathname }} className="block">
      {content}
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
