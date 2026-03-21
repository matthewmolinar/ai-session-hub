import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SESSIONS, SESSION_DETAIL } from "@/lib/mock-data";

interface Crumb {
  label: string;
  to?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  "/my-sessions": "Threads",
  "/": "Threads",
  "/threads": "Threads",
  "/explore": "Shared",
};

function useBreadcrumbs(): Crumb[] {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;
  const from = (location.state as any)?.from as string | undefined;

  if (path === "/" || path === "/my-sessions" || path === "/threads") {
    return [{ label: "Threads" }];
  }

  if (path === "/explore") {
    return [{ label: "Shared" }];
  }


  // Determine parent crumb from navigation origin
  const parentPath = from && ROUTE_LABELS[from] ? from : "/threads";
  const parentLabel = ROUTE_LABELS[parentPath] ?? "Threads";

  if (path.startsWith("/session/")) {
    const sessionId = params.id;
    const session = sessionId === SESSION_DETAIL.id
      ? SESSION_DETAIL
      : SESSIONS.find((s) => s.id === sessionId);
    const title = session?.title ?? `Session`;
    return [
      { label: parentLabel, to: parentPath },
      { label: title },
    ];
  }

  if (path.startsWith("/profile/")) {
    const username = params.username;
    return [
      { label: parentLabel, to: parentPath },
      { label: `@${username}` },
    ];
  }

  return [{ label: "Threads", to: "/threads" }];
}

export function Breadcrumbs() {
  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 sm:px-4 py-2 border-b border-border bg-background overflow-x-auto scrollbar-none">
      <button
        onClick={() => from ? navigate(from) : navigate(-1)}
        className="shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
      </button>
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
