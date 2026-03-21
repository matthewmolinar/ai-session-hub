import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, LogOut, User, Menu, X } from "lucide-react";
import tanagramLogo from "@/assets/tanagram-logo.svg";
import { SESSIONS } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { useMySessionsState } from "@/contexts/MySessionsContext";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { AuthModal } from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const { signOut, user } = useAuth();
  const { setDemoMode, setActiveSessionId, setSelectedFilePath } = useMySessionsState();
  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "user";
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const results = query.length > 0
    ? SESSIONS.filter((s) => {
        const q = query.toLowerCase();
        const skillMatch = q.match(/^skill:(\S+)$/);
        if (skillMatch) return s.tags.some((t) => t.toLowerCase().includes(skillMatch[1]));
        const modelMatch = q.match(/^model:(\S+)$/);
        if (modelMatch) return s.model.toLowerCase().includes(modelMatch[1]);
        const authorMatch = q.match(/^author:(\S+)$/);
        if (authorMatch) return s.author.username.toLowerCase().includes(authorMatch[1]);
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
      <header className="h-12 flex items-center px-3 sm:px-4 gap-2 sm:gap-6 shrink-0 sticky top-0 z-50" style={{ background: 'hsl(var(--header-bg))', color: 'hsl(var(--header-foreground))' }}>
        <Link
          to="/my-sessions"
          className="flex items-center gap-2 font-semibold text-sm shrink-0"
          onClick={() => {
            setDemoMode(false);
            setActiveSessionId(null);
            setSelectedFilePath(null);
          }}
        >
          
          <span className="hidden sm:inline text-xl font-bold tracking-wide font-display text-primary">LORE</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {FEATURE_FLAGS.EXPLORER_ENABLED && (
            <Link
              to="/my-sessions"
              className={`px-3 py-1.5 rounded-md transition-colors ${location.pathname === "/my-sessions" || location.pathname === "/" ? "bg-white/15 font-medium" : "text-[hsl(var(--header-muted))] hover:text-[hsl(var(--header-foreground))] hover:bg-white/10"}`}
            >
              Explorer
            </Link>
          )}
          <Link
            to="/threads"
            className={`px-3 py-1.5 rounded-md transition-colors ${location.pathname === "/threads" ? "bg-white/15 font-medium" : "text-[hsl(var(--header-muted))] hover:text-[hsl(var(--header-foreground))] hover:bg-white/10"}`}
          >
            Threads
          </Link>
          {FEATURE_FLAGS.FEED_ENABLED && (
            <Link
              to="/explore"
              className={`relative px-3 py-1.5 rounded-md transition-colors ${location.pathname === "/explore" ? "bg-white/15 font-medium" : "text-[hsl(var(--header-muted))] hover:text-[hsl(var(--header-foreground))] hover:bg-white/10"}`}
            >
              Feed
            </Link>
          )}
        </nav>

        {/* Spacer to push right items */}
        <div className="flex-1 hidden sm:block" />

        {/* Mobile: search icon */}
        <div className="flex-1 sm:hidden" />
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden h-8 w-8 flex items-center justify-center rounded-md text-[hsl(var(--header-muted))] hover:text-[hsl(var(--header-foreground))] hover:bg-white/10 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={() => setOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-background rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border w-48"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-2xs bg-card rounded px-1.5 py-0.5 border border-border">/</kbd>
          </button>
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex h-8 w-8 rounded-full bg-primary items-center justify-center text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all cursor-pointer">
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

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setAuthOpen(true)}
                className="h-8 px-3.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started Free
              </button>
              <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
            </>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-border bg-card px-4 py-3 space-y-1 z-40 relative">
          {FEATURE_FLAGS.EXPLORER_ENABLED && (
            <Link
              to="/my-sessions"
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === "/my-sessions" || location.pathname === "/" ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
            >
              Explorer
            </Link>
          )}
          <Link
            to="/threads"
            className={`block px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === "/threads" ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
          >
            Threads
          </Link>
          {FEATURE_FLAGS.FEED_ENABLED && (
            <Link
              to="/explore"
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === "/explore" ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
            >
              Feed
            </Link>
          )}
          {user && (
            <>
              <Link
                to={`/profile/${username}`}
                className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={signOut}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}

      {/* Search overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4" onClick={() => { setOpen(false); setQuery(""); }}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-elevated overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="text-2xs bg-secondary text-muted-foreground rounded px-1.5 py-0.5 border border-border hidden sm:inline">esc</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No threads found
                </div>
              ) : (
                results.map((session) => (
                  <button
                    key={session.id}
                    className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                    onClick={() => {
                      navigate(`/session/${session.id}`, { state: { from: location.pathname } });
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
