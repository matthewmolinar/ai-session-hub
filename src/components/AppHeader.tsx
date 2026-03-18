import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GitFork, Search, LogOut } from "lucide-react";
import { SESSIONS } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    ? SESSIONS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.openingPrompt.toLowerCase().includes(query.toLowerCase()) ||
          s.author.username.toLowerCase().includes(query.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : SESSIONS;

  return (
    <>
      <header className="h-11 border-b border-border flex items-center px-4 gap-6 bg-card shrink-0">
        <Link to="/" className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
          <GitFork className="h-4 w-4 text-primary" />
          <span>Tanagram</span>
        </Link>

        <nav className="flex items-center gap-4 text-xs">
          <Link
            to="/"
            className={`transition-colors ${location.pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Feed
          </Link>
          <Link
            to="/profile/danabramov"
            className={`transition-colors ${location.pathname.startsWith("/profile") ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            Profile
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
                placeholder="Search sessions, authors, tags..."
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
    </>
  );
}
