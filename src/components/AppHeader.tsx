import { Link, useLocation } from "react-router-dom";
import { GitFork, Search } from "lucide-react";

export function AppHeader() {
  const location = useLocation();

  return (
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
        <div className="flex items-center gap-1.5 bg-secondary rounded-md px-2.5 py-1 text-xs text-muted-foreground">
          <Search className="h-3 w-3" />
          <span>Search sessions...</span>
          <kbd className="ml-2 text-2xs bg-background rounded px-1 py-0.5 border border-border">/</kbd>
        </div>
      </div>
    </header>
  );
}
