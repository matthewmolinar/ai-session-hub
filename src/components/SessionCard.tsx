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
      className="relative rounded-xl border border-border bg-card p-4 overflow-hidden hover:shadow-elevated transition-shadow"
      onClick={blurred && onSignInClick ? () => onSignInClick() : undefined}
      role={blurred ? "button" : undefined}
      style={blurred ? { cursor: "pointer" } : undefined}
    >
      {blurred && (
        <>
          <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-card/30 rounded-xl" style={{ top: '3.5rem' }} />
          <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ top: '3.5rem' }}>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-card/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 shadow-sm">
              <Lock className="h-3 w-3" />
              Sign in to view
            </span>
          </div>
        </>
      )}

      {/* Author + title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
          {session.author.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground">@{session.author.username}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>
        <ModelBadge model={session.model} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1.5">
        {session.title}
      </h3>

      {/* Opening prompt */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {session.openingPrompt}
      </p>

      {/* Sparkline */}
      <Sparkline data={session.sparkline} className="mb-3" />

      {/* Skill tags */}
      {session.tags.length > 0 && (
        <div className="flex items-center gap-1.5 mb-2">
          {session.tags.map((tag) => (
            <span key={tag} className="text-2xs font-mono text-primary bg-primary/8 rounded-md px-2 py-0.5 border border-primary/15">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {session.turns}
        </span>
        <span className="flex items-center gap-1">
          <FileCode className="h-3 w-3" />
          {session.filesChanged}
        </span>
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
