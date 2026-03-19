import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileCode, MessageSquare, Lock, Heart, Bookmark, Share2, Terminal } from "lucide-react";
import { ModelBadge } from "./ModelBadge";
import { Sparkline } from "./Sparkline";
import type { Session, SourceTool } from "@/lib/mock-data";

interface SessionCardProps {
  session: Session;
  onSignInClick?: () => void;
  landing?: boolean;
}

const SOURCE_LABELS: Record<SourceTool, string> = {
  "claude-code": "Claude Code",
  "cursor": "Cursor",
  "codex": "Codex",
  "amp": "Amp",
  "windsurf": "Windsurf",
};

const SOURCE_COLORS: Record<SourceTool, string> = {
  "claude-code": "bg-orange-100 text-orange-700 border-orange-200",
  "cursor": "bg-blue-100 text-blue-700 border-blue-200",
  "codex": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "amp": "bg-violet-100 text-violet-700 border-violet-200",
  "windsurf": "bg-cyan-100 text-cyan-700 border-cyan-200",
};

export function SessionCard({ session, onSignInClick, landing }: SessionCardProps) {
  const timeAgo = getTimeAgo(session.createdAt);
  const location = useLocation();
  const blurred = false;
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(session.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const content = (
    <div
      className="relative rounded-xl border border-border bg-card overflow-hidden hover:shadow-elevated transition-shadow"
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

      <div className="p-4 pb-0">
        {/* Author row */}
        <div className="flex items-start gap-2.5 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            {session.author.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">@{session.author.username}</span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            {(session.author.role || session.author.team) && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {session.author.role}{session.author.role && session.author.team ? " · " : ""}{session.author.team}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-medium border ${SOURCE_COLORS[session.source]}`}>
              <Terminal className="h-2.5 w-2.5" />
              {SOURCE_LABELS[session.source]}
            </span>
            <ModelBadge model={session.model} />
          </div>
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
          <div className="flex items-center gap-1.5 mb-3">
            {session.tags.map((tag) => (
              <span key={tag} className="text-2xs font-mono text-primary bg-primary/8 rounded-md px-2 py-0.5 border border-primary/15">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Engagement bar */}
      <div className="flex items-center px-4 py-1.5 border-t border-border">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
            liked ? "text-red-500" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${liked ? "fill-red-500" : ""}`} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{session.comments.length}</span>
        </button>
        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
            bookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-primary" : ""}`} />
        </button>
        <button
          onClick={handleShare}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
      </div>

      {/* Comments section */}
      <div className="border-t border-border">
        {session.comments.length > 0 && (
          <div className="px-4 pt-2.5 pb-1 space-y-2">
            {session.comments.slice(0, 2).map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-2xs font-semibold text-muted-foreground shrink-0 mt-0.5">
                  {comment.author[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">@{comment.author}</span>
                    <span className="text-foreground ml-1.5">{comment.content}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-2xs text-muted-foreground">{comment.timeAgo}</span>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="text-2xs text-muted-foreground hover:text-foreground font-medium cursor-pointer">Like</button>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="text-2xs text-muted-foreground hover:text-foreground font-medium cursor-pointer">Reply</button>
                  </div>
                </div>
              </div>
            ))}
            {session.comments.length > 2 && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer pl-8"
              >
                View {session.comments.length - 2} more comment{session.comments.length - 2 !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Compose comment */}
        <div className="flex items-center gap-2 px-4 py-2.5">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-2xs font-semibold text-primary shrink-0">
            Y
          </div>
          <input
            type="text"
            placeholder="Write a comment..."
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="flex-1 text-xs bg-secondary/50 rounded-full px-3 py-1.5 border border-border placeholder:text-muted-foreground text-foreground outline-none focus:border-primary/30 focus:bg-card transition-colors"
          />
        </div>
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
