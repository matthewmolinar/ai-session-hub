import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GitFork, Search, LogOut, User, LogIn } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { SESSIONS } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { signOut, user } = useAuth();
  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "user";
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [authOpen, setAuthOpen] = useState(false);

  // "/" shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && !open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = query.length > 0
    ? SESSIONS.filter((s) => {
        const q = query.toLowerCase();
        // skill: operator
        const skillMatch = q.match(/^skill:(\S+)$/);
        if (skillMatch) {
          return s.tags.some((t) => t.toLowerCase().includes(skillMatch[1]));
        }
        // model: operator
        const modelMatch = q.match(/^model:(\S+)$/);
        if (modelMatch) {
          return s.model.toLowerCase().includes(modelMatch[1]);
        }
        // author: operator
        const authorMatch = q.match(/^author:(\S+)$/);
        if (authorMatch) {
          return s.author.username.toLowerCase().includes(authorMatch[1]);
        }
        return (
          s.title.toLowerCase().includes(q) ||
          s.openingPrompt.toLowerCase().includes(q) ||
          s.author.username.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : SESSIONS;

  return (
    <>
      <header className="h-11 border-b border-border flex items-center px-4 gap-6 bg-card shrink-0">
        <Link to="/my-sessions" className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
          <GitFork className="h-4 w-4 text-primary" />
          <span>Tanagram</span>
        </Link>

        <nav className="flex items-center gap-4 text-xs">
          {user && (
            <Link
              to="/my-sessions"
              className={`transition-colors ${location.pathname === "/my-sessions" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              My Sessions
            </Link>
          )}
          {user && (
            <Link
              to="/skills"
              className={`transition-colors ${location.pathname === "/skills" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              Skills
            </Link>
          )}
          <Link
            to="/"
            className={`transition-colors ${location.pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Explore
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 bg-secondary rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Search className="h-3 w-3" />
            <span>Search sessions...</span>
            <kbd className="ml-2 text-2xs bg-background rounded px-1 py-0.5 border border-border">/</kbd>
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground hover:ring-2 hover:ring-ring transition-all cursor-pointer">
                  {username[0].toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${username}`} className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-md px-3 py-1 text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <LogIn className="h-3 w-3" />
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => { setOpen(false); setQuery(""); }}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search... try skill:typescript or model:gpt-4o"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="text-2xs bg-secondary text-muted-foreground rounded px-1.5 py-0.5 border border-border">esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No sessions found
                </div>
              ) : (
                results.map((session) => (
                  <button
                    key={session.id}
                    className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                    onClick={() => {
                      navigate(`/session/${session.id}`);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground line-clamp-1">{session.title}</span>
                      <span className="shrink-0 text-2xs font-mono text-muted-foreground bg-secondary rounded px-1.5 py-0.5">{session.model}</span>
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      @{session.author.username} · {session.turns} turns · {session.filesChanged} files
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
