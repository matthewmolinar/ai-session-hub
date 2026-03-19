import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, FileCode, Pencil } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { EditProfileModal } from "@/components/EditProfileModal";
import { useProfile } from "@/hooks/useProfile";
import { SESSIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { profile, loading, isOwn, updateProfile } = useProfile(username);
  const [editOpen, setEditOpen] = useState(false);

  // Mock sessions — still using mock data for now
  const allSessions = SESSIONS.filter((s) => s.author.username === username);
  const sessions = allSessions.length > 0 ? allSessions : SESSIONS.slice(0, 3);

  const totalTurns = sessions.reduce((a, s) => a + s.turns, 0);
  const totalFiles = sessions.reduce((a, s) => a + s.filesChanged, 0);

  const modelCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    modelCounts[s.model] = (modelCounts[s.model] || 0) + 1;
  });

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
                {totalTurns} total turns
              </span>
              <span className="flex items-center gap-1">
                <FileCode className="h-3 w-3" />
                {totalFiles} files changed
              </span>
            </div>
          </div>
        </div>

        {/* Preferred models */}
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

      {/* Sessions */}
      <h2 className="text-label mb-3">Sessions</h2>
      <div className="flex flex-col gap-3">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
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
