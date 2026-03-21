import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, FileCode, Pencil, Star, GitBranch } from "lucide-react";
import { EditProfileModal } from "@/components/EditProfileModal";
import { useProfile } from "@/hooks/useProfile";
import { THREADS, type Thread } from "@/lib/mock-threads";
import { Button } from "@/components/ui/button";

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ProfileThreadRow({ thread }: { thread: Thread }) {
  return (
    <a
      href={`/threads?id=${thread.id}`}
      className="block border-b border-border last:border-b-0 px-4 py-4 hover:bg-secondary/30 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0 mt-0.5">
          {thread.author.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">{thread.title}</h3>
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mb-2">
            <span className="font-medium text-foreground/80">{thread.author.username.replace("_", " ")}</span>
            <span>{getTimeAgo(thread.createdAt)}</span>
            <span className="flex items-center gap-0.5">
              <MessageSquare className="h-3 w-3" />
              {thread.messageCount}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-medium border border-border bg-secondary text-secondary-foreground">
              <GitBranch className="h-2.5 w-2.5" />
              {thread.threadType}
            </span>
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3" />
              {thread.stars}
            </span>
          </div>
          <div className="rounded-lg bg-secondary/50 border-l-2 border-border px-3 py-2">
            <p className="text-xs text-muted-foreground line-clamp-1">{thread.openingPrompt}</p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { profile, loading, isOwn, updateProfile } = useProfile(username);
  const [editOpen, setEditOpen] = useState(false);

  const allThreads = THREADS.filter((t) => t.author.username === username);
  const threads = allThreads.length > 0 ? allThreads : THREADS.slice(0, 3);

  const totalMessages = threads.reduce((a, t) => a + t.messageCount, 0);
  const totalFiles = threads.reduce((a, t) => a + t.diffStats.added + t.diffStats.removed + t.diffStats.modified, 0);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.display_name || username || "User";
  const displayUsername = profile?.username || username;
  const bio = profile?.bio || "No bio yet";

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Profile header */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-secondary flex items-center justify-center text-base sm:text-lg font-semibold text-foreground">
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">@{displayUsername}</h1>
              {isOwn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                  className="h-7 px-2 text-xs text-muted-foreground"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{bio}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {totalMessages} total messages
              </span>
              <span className="flex items-center gap-1">
                <FileCode className="h-3 w-3" />
                {totalFiles} files changed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Threads */}
      <h2 className="text-label mb-3">Threads</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {threads.map((thread) => (
          <ProfileThreadRow key={thread.id} thread={thread} />
        ))}
      </div>

      {/* Edit modal */}
      {profile && (
        <EditProfileModal
          open={editOpen}
          onOpenChange={setEditOpen}
          profile={profile}
          onSave={async (updates) => {
            const result = await updateProfile(updates);
            if (!result.error && updates.username !== profile.username) {
              navigate(`/profile/${updates.username}`, { replace: true });
            }
            return { error: result.error || undefined };
          }}
        />
      )}
    </div>
  );
}
