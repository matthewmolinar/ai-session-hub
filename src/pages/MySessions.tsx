import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronDown, Folder, FileText, GitFork, Search, Upload, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ModelBadge } from "@/components/ModelBadge";

interface FileSession {
  sessionId: string;
  sessionTitle: string;
  model: string;
  turns: number;
  createdAt: string;
}

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  sessions?: FileSession[];
}

// Mock file tree with sessions that touched each file
const FILE_TREE: FileNode[] = [
  {
    name: "src",
    path: "src",
    type: "folder",
    children: [
      {
        name: "editor",
        path: "src/editor",
        type: "folder",
        children: [
          {
            name: "document.ts",
            path: "src/editor/document.ts",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z" },
              { sessionId: "s4", sessionTitle: "Zero-dependency state machine for form validation", model: "gemini-2.5-pro", turns: 35, createdAt: "2026-03-14T11:20:00Z" },
            ],
          },
          {
            name: "Editor.tsx",
            path: "src/editor/Editor.tsx",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z" },
            ],
          },
          {
            name: "cursors.tsx",
            path: "src/editor/cursors.tsx",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z" },
            ],
          },
        ],
      },
      {
        name: "sync",
        path: "src/sync",
        type: "folder",
        children: [
          {
            name: "ws-provider.ts",
            path: "src/sync/ws-provider.ts",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z" },
              { sessionId: "s2", sessionTitle: "Rust async runtime from scratch", model: "gpt-4o", turns: 67, createdAt: "2026-03-16T09:15:00Z" },
            ],
          },
          {
            name: "awareness.ts",
            path: "src/sync/awareness.ts",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z" },
            ],
          },
        ],
      },
      {
        name: "components",
        path: "src/components",
        type: "folder",
        children: [
          {
            name: "Toolbar.tsx",
            path: "src/components/Toolbar.tsx",
            type: "file",
            sessions: [
              { sessionId: "s3", sessionTitle: "Migrating a Next.js app to Astro with view transitions", model: "claude-3.5-sonnet", turns: 28, createdAt: "2026-03-15T18:45:00Z" },
              { sessionId: "s6", sessionTitle: "CSS-only animation library with @property", model: "claude-3.5-sonnet", turns: 19, createdAt: "2026-03-12T16:30:00Z" },
            ],
          },
          {
            name: "AnimatedLayout.tsx",
            path: "src/components/AnimatedLayout.tsx",
            type: "file",
            sessions: [
              { sessionId: "s3", sessionTitle: "Migrating a Next.js app to Astro with view transitions", model: "claude-3.5-sonnet", turns: 28, createdAt: "2026-03-15T18:45:00Z" },
            ],
          },
        ],
      },
      {
        name: "lib",
        path: "src/lib",
        type: "folder",
        children: [
          {
            name: "state-machine.ts",
            path: "src/lib/state-machine.ts",
            type: "file",
            sessions: [
              { sessionId: "s4", sessionTitle: "Zero-dependency state machine for form validation", model: "gemini-2.5-pro", turns: 35, createdAt: "2026-03-14T11:20:00Z" },
            ],
          },
          {
            name: "btree.go",
            path: "src/lib/btree.go",
            type: "file",
            sessions: [
              { sessionId: "s5", sessionTitle: "Implementing a B-tree index in Go", model: "gpt-4o", turns: 51, createdAt: "2026-03-13T08:00:00Z" },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "styles",
    path: "styles",
    type: "folder",
    children: [
      {
        name: "animations.css",
        path: "styles/animations.css",
        type: "file",
        sessions: [
          { sessionId: "s6", sessionTitle: "CSS-only animation library with @property", model: "claude-3.5-sonnet", turns: 19, createdAt: "2026-03-12T16:30:00Z" },
          { sessionId: "s3", sessionTitle: "Migrating a Next.js app to Astro with view transitions", model: "claude-3.5-sonnet", turns: 28, createdAt: "2026-03-15T18:45:00Z" },
        ],
      },
      {
        name: "spring.css",
        path: "styles/spring.css",
        type: "file",
        sessions: [
          { sessionId: "s6", sessionTitle: "CSS-only animation library with @property", model: "claude-3.5-sonnet", turns: 19, createdAt: "2026-03-12T16:30:00Z" },
        ],
      },
    ],
  },
];

function countFiles(node: FileNode): number {
  if (node.type === "file") return 1;
  return node.children?.reduce((sum, c) => sum + countFiles(c), 0) ?? 0;
}

function countSessions(node: FileNode): number {
  if (node.type === "file") return node.sessions?.length ?? 0;
  return node.children?.reduce((sum, c) => sum + countSessions(c), 0) ?? 0;
}

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [showSessions, setShowSessions] = useState(false);

  if (node.type === "folder") {
    const fileCount = countFiles(node);
    const sessionCount = countSessions(node);

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1.5 py-1.5 px-2 text-sm hover:bg-secondary/60 rounded-md transition-colors group cursor-pointer"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
          <Folder className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="font-medium text-foreground">{node.name}</span>
          <span className="ml-auto text-2xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {fileCount} files · {sessionCount} sessions
          </span>
        </button>
        {expanded && node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  // File node
  const sessionCount = node.sessions?.length ?? 0;

  return (
    <div>
      <button
        onClick={() => setShowSessions(!showSessions)}
        className="w-full flex items-center gap-1.5 py-1.5 px-2 text-sm hover:bg-secondary/60 rounded-md transition-colors group cursor-pointer"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="w-3.5" />
        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-foreground font-mono text-xs">{node.name}</span>
        <span className="ml-auto flex items-center gap-1 text-2xs text-muted-foreground">
          <GitFork className="h-3 w-3" />
          {sessionCount}
        </span>
      </button>
      {showSessions && node.sessions && (
        <div
          className="border-l border-border ml-4 mb-1"
          style={{ marginLeft: `${depth * 16 + 26}px` }}
        >
          {node.sessions.map((s) => (
            <Link
              key={s.sessionId}
              to={`/session/${s.sessionId}`}
              className="flex items-center gap-2 py-2 px-3 text-xs hover:bg-secondary/40 rounded-r-md transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-foreground font-medium line-clamp-1">{s.sessionTitle}</div>
                <div className="text-muted-foreground mt-0.5">
                  {s.turns} turns · {getTimeAgo(s.createdAt)}
                </div>
              </div>
              <ModelBadge model={s.model} />
            </Link>
          ))}
        </div>
      )}
    </div>
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

export default function MySessions() {
  const { user } = useAuth();

  const totalFiles = useMemo(() => FILE_TREE.reduce((sum, n) => sum + countFiles(n), 0), []);
  const totalSessions = useMemo(() => {
    const ids = new Set<string>();
    function collect(node: FileNode) {
      if (node.type === "file") node.sessions?.forEach((s) => ids.add(s.sessionId));
      else node.children?.forEach(collect);
    }
    FILE_TREE.forEach(collect);
    return ids.size;
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground text-sm">Sign in to view your sessions.</p>
      </div>
    );
  }

  const isDemo = true; // TODO: replace with real session count check

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-foreground">My Sessions</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {totalFiles} files across {totalSessions} sessions
        </p>
      </div>

      {/* Value showcase banner */}
      {isDemo && (
        <div className="mb-4 relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-5">
          <div className="absolute top-2 right-2">
            <span className="text-2xs font-mono bg-primary/10 text-primary rounded-full px-2 py-0.5">preview</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground mb-1">
                See every AI session that shaped your code
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Browse your codebase like a file tree — but instead of code, see the AI conversations that created and modified each file. Search across sessions instantly. Share context with your team.
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                  <Search className="h-3 w-3" />
                  Search sessions
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="h-3 w-3" />
                  Track file history
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1.5">
                  <Upload className="h-3 w-3" />
                  Share with team
                </span>
              </div>
              <p className="text-2xs text-muted-foreground/70 italic">
                ↓ Below is a preview with sample data — yours will look like this once you import sessions.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="px-3 py-2 border-b border-border bg-secondary/30 flex items-center gap-2 text-xs text-muted-foreground">
          <Folder className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Project root</span>
          {isDemo && <span className="ml-auto text-2xs text-muted-foreground/50 font-mono">sample data</span>}
        </div>
        <div className="py-1">
          {FILE_TREE.map((node) => (
            <FileTreeNode key={node.path} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
