import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SESSIONS, SESSION_DETAIL } from "@/lib/mock-data";

interface Crumb {
  label: string;
  to?: string;
}

function useBreadcrumbs(): Crumb[] {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;

  if (path === "/" || path === "/my-sessions") {
    return [{ label: "My Sessions" }];
  }

  if (path === "/explore") {
    return [{ label: "My Sessions", to: "/my-sessions" }, { label: "Team" }];
  }

  if (path === "/skills") {
    return [{ label: "My Sessions", to: "/my-sessions" }, { label: "Skills" }];
  }

  if (path.startsWith("/session/")) {
    const sessionId = params.id;
    const session = sessionId === "s1"
      ? SESSION_DETAIL
      : SESSIONS.find((s) => s.id === sessionId);
    const title = session?.title ?? `Session ${sessionId}`;
    return [
      { label: "My Sessions", to: "/my-sessions" },
      { label: title },
    ];
  }

  if (path.startsWith("/profile/")) {
    const username = params.username;
    return [
      { label: "My Sessions", to: "/my-sessions" },
      { label: `@${username}` },
    ];
  }

  return [{ label: "My Sessions", to: "/my-sessions" }];
}

export function Breadcrumbs() {
  const crumbs = useBreadcrumbs();

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground px-4 py-2 border-b border-border bg-background">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 text-border" />}
          {crumb.to ? (
            <Link
              to={crumb.to}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-[300px]">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
