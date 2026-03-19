import { useState, useMemo, useCallback } from "react";
import { ChevronRight, ChevronDown, Folder, FileText, GitFork, X, FileCode, MessageSquare, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useMySessionsState } from "@/contexts/MySessionsContext";
import { ModelBadge } from "@/components/ModelBadge";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { LandingSessionView } from "@/components/LandingSessionView";
import { SESSION_DETAIL, SESSIONS } from "@/lib/mock-data";
import type { Session } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";

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

function findFileNode(nodes: FileNode[], path: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findFileNode(node.children, path);
      if (found) return found;
    }
  }
  return null;
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

/* ─── Column 1: File Tree ─── */
function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const { expandedPaths, toggleExpanded, selectedFilePath, setSelectedFilePath, setActiveSessionId } = useMySessionsState();
  const expanded = node.type === "folder" && expandedPaths.has(node.path);
  const isSelected = node.type === "file" && selectedFilePath === node.path;

  if (node.type === "folder") {
    const sessionCount = countSessions(node);
    return (
      <div>
        <button
          onClick={() => toggleExpanded(node.path)}
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
            {sessionCount}
          </span>
        </button>
        {expanded && node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  const sessionCount = node.sessions?.length ?? 0;

  return (
    <button
      onClick={() => {
        setSelectedFilePath(isSelected ? null : node.path);
        if (isSelected) setActiveSessionId(null);
      }}
      className={`w-full flex items-center gap-1.5 py-1.5 px-2 text-sm rounded-md transition-colors group cursor-pointer ${
        isSelected ? "bg-primary/10 text-primary" : "hover:bg-secondary/60 text-foreground"
      }`}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      <span className="w-3.5" />
      <FileText className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
      <span className="font-mono text-xs truncate">{node.name}</span>
      <span className="ml-auto flex items-center gap-1 text-2xs text-muted-foreground shrink-0">
        <GitFork className="h-3 w-3" />
        {sessionCount}
      </span>
    </button>
  );
}

/* ─── Column 2: Sessions List ─── */
function SessionsList({ filePath }: { filePath: string }) {
  const { activeSessionId, setActiveSessionId } = useMySessionsState();
  const fileNode = findFileNode(FILE_TREE, filePath);
  const sessions = fileNode?.sessions ?? [];
  const fileName = filePath.split("/").pop() ?? filePath;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <FileCode className="h-3.5 w-3.5" />
          <span className="font-mono">{fileName}</span>
        </div>
        <p className="text-2xs text-muted-foreground">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""} touched this file
        </p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {sessions.map((s) => (
          <button
            key={s.sessionId}
            onClick={() => setActiveSessionId(activeSessionId === s.sessionId ? null : s.sessionId)}
            className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
              activeSessionId === s.sessionId
                ? "bg-primary/10 border-l-2 border-primary"
                : "hover:bg-secondary/40 border-l-2 border-transparent"
            }`}
          >
            <div className="text-sm font-medium text-foreground line-clamp-2 mb-1.5">{s.sessionTitle}</div>
            <div className="flex items-center gap-2 text-2xs text-muted-foreground flex-wrap">
              <ModelBadge model={s.model} />
              <span>{s.turns} turns</span>
              <span>·</span>
              <span>{getTimeAgo(s.createdAt)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Column 3: Session Preview ─── */
function SessionPreview({ session, onClose }: { session: Session; onClose: () => void }) {
  const [commentsByTurn, setCommentsByTurn] = useState<Record<number, Comment[]>>(() => ({
    1: [
      { id: "demo-1", author: "techleadmaria", content: "This prompt could've been more specific — mention the target framework version.", timestamp: "15:02" },
    ],
  }));

  const handleAddComment = useCallback((turnId: number, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: "you",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
    setCommentsByTurn((prev) => ({
      ...prev,
      [turnId]: [...(prev[turnId] || []), newComment],
    }));
  }, []);

  const costData = useMemo(() => {
    const turns = session.transcript ?? [];
    const totalInput = turns.reduce((s, t) => s + (t.usage?.inputTokens ?? 0), 0);
    const totalOutput = turns.reduce((s, t) => s + (t.usage?.outputTokens ?? 0), 0);
    const totalCost = turns.reduce((s, t) => s + (t.usage?.cost ?? 0), 0);
    return { totalInput, totalOutput, totalCost };
  }, [session.transcript]);

  const filesInSession = session.transcript
    ?.flatMap((t) => t.diff?.map((d) => d.filename) ?? [])
    .filter((v, i, a) => a.indexOf(v) === i) ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h2 className="text-sm font-semibold text-foreground line-clamp-2">{session.title}</h2>
          <button
            onClick={onClose}
            className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground">@{session.author.username}</span>
          <ModelBadge model={session.model} />
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {session.turns} turns
          </span>
          <span className="flex items-center gap-1">
            <FileCode className="h-3 w-3" />
            {session.filesChanged} files
          </span>
          {costData.totalCost > 0 && (
            <span className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              ${costData.totalCost.toFixed(4)}
            </span>
          )}
        </div>
        {filesInSession.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filesInSession.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-2xs font-mono text-muted-foreground">
                <FileCode className="h-2.5 w-2.5" />
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3 divide-y divide-border">
          {session.transcript?.map((turn) => (
            <div key={turn.id} id={`preview-turn-${turn.id}`}>
              <TranscriptTurn
                turn={turn}
                comments={commentsByTurn[turn.id] || []}
                onAddComment={handleAddComment}
              />
            </div>
          ))}
          {!session.transcript && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No transcript available for this session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function MySessions() {
  const { user } = useAuth();
  const { activeSessionId, setActiveSessionId, selectedFilePath } = useMySessionsState();

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

  const activeSession = useMemo(() => {
    if (!activeSessionId) return null;
    if (activeSessionId === "s1") return SESSION_DETAIL;
    const found = SESSIONS.find((s) => s.id === activeSessionId);
    return found ?? null;
  }, [activeSessionId]);

  if (!user) {
    return <LandingSessionView />;
  }

  return (
    <div className="h-[calc(100vh-44px)] flex overflow-hidden">
      {/* Column 1: File tree */}
      <div className="w-[260px] shrink-0 overflow-y-auto border-r border-border bg-background">
        <div className="px-4 py-4">
          <div className="mb-3">
            <h1 className="text-sm font-semibold text-foreground">Files</h1>
            <p className="text-2xs text-muted-foreground mt-0.5">
              {totalFiles} files · {totalSessions} sessions
            </p>
          </div>

          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-secondary/30 flex items-center gap-2 text-xs text-muted-foreground">
              <Folder className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">Project root</span>
            </div>
            <div className="py-1">
              {FILE_TREE.map((node) => (
                <FileTreeNode key={node.path} node={node} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Sessions for selected file */}
      <AnimatePresence mode="wait">
        {selectedFilePath && (
          <motion.div
            key={selectedFilePath}
            className="w-[300px] shrink-0 border-r border-border bg-card overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <SessionsList filePath={selectedFilePath} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column 3: Session transcript */}
      <AnimatePresence mode="wait">
        {activeSession ? (
          <motion.div
            key={activeSession.id}
            className="flex-1 min-w-0 bg-background overflow-hidden"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <SessionPreview
              session={activeSession}
              onClose={() => setActiveSessionId(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            className="flex-1 min-w-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {selectedFilePath ? "Select a session to view" : "Select a file to see its sessions"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
