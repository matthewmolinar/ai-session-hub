import { useState, useMemo, useCallback } from "react";
import { ChevronRight, ChevronDown, Folder, FileText, X, MessageSquare, Clock, User, Zap, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useMySessionsState } from "@/contexts/MySessionsContext";
import { ModelBadge } from "@/components/ModelBadge";
import { TranscriptTurn } from "@/components/TranscriptTurn";
import { LandingSessionView } from "@/components/LandingSessionView";
import { SESSION_DETAIL, SESSIONS, SKILL_TEAMMATE_COUNTS } from "@/lib/mock-data";
import type { Session } from "@/lib/mock-data";
import type { Comment } from "@/components/TurnComment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FileSession {
  sessionId: string;
  sessionTitle: string;
  model: string;
  turns: number;
  createdAt: string;
  author?: string;
  openingPrompt?: string;
}

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  sessions?: FileSession[];
}

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
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z", author: "alexcodes", openingPrompt: "I want to build a collaborative text editor using CRDTs for conflict resolution..." },
              { sessionId: "s4", sessionTitle: "Zero-dependency state machine for form validation", model: "gemini-2.5-pro", turns: 35, createdAt: "2026-03-14T11:20:00Z", author: "formwizard", openingPrompt: "Let's create a finite state machine that handles complex form validation flows..." },
            ],
          },
          {
            name: "Editor.tsx",
            path: "src/editor/Editor.tsx",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z", author: "alexcodes", openingPrompt: "I want to build a collaborative text editor using CRDTs for conflict resolution..." },
            ],
          },
          {
            name: "cursors.tsx",
            path: "src/editor/cursors.tsx",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z", author: "alexcodes", openingPrompt: "I want to build a collaborative text editor using CRDTs for conflict resolution..." },
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
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z", author: "alexcodes", openingPrompt: "I want to build a collaborative text editor using CRDTs for conflict resolution..." },
              { sessionId: "s2", sessionTitle: "Rust async runtime from scratch", model: "gpt-4o", turns: 67, createdAt: "2026-03-16T09:15:00Z", author: "rustacean42", openingPrompt: "I'd like to implement a minimal async runtime in Rust, similar to a simplified tokio..." },
            ],
          },
          {
            name: "awareness.ts",
            path: "src/sync/awareness.ts",
            type: "file",
            sessions: [
              { sessionId: "s1", sessionTitle: "Building a real-time collaborative editor with CRDTs", model: "claude-3.5-sonnet", turns: 42, createdAt: "2026-03-17T14:30:00Z", author: "alexcodes", openingPrompt: "I want to build a collaborative text editor using CRDTs for conflict resolution..." },
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
              { sessionId: "s3", sessionTitle: "Migrating a Next.js app to Astro with view transitions", model: "claude-3.5-sonnet", turns: 28, createdAt: "2026-03-15T18:45:00Z", author: "astrofan", openingPrompt: "I need to migrate my Next.js app to Astro while preserving view transitions..." },
              { sessionId: "s6", sessionTitle: "CSS-only animation library with @property", model: "claude-3.5-sonnet", turns: 19, createdAt: "2026-03-12T16:30:00Z", author: "cssmagic", openingPrompt: "Can we build a pure CSS animation library using @property for spring physics?" },
            ],
          },
          {
            name: "AnimatedLayout.tsx",
            path: "src/components/AnimatedLayout.tsx",
            type: "file",
            sessions: [
              { sessionId: "s3", sessionTitle: "Migrating a Next.js app to Astro with view transitions", model: "claude-3.5-sonnet", turns: 28, createdAt: "2026-03-15T18:45:00Z", author: "astrofan", openingPrompt: "I need to migrate my Next.js app to Astro while preserving view transitions..." },
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
              { sessionId: "s4", sessionTitle: "Zero-dependency state machine for form validation", model: "gemini-2.5-pro", turns: 35, createdAt: "2026-03-14T11:20:00Z", author: "formwizard", openingPrompt: "Let's create a finite state machine that handles complex form validation flows..." },
            ],
          },
          {
            name: "btree.go",
            path: "src/lib/btree.go",
            type: "file",
            sessions: [
              { sessionId: "s5", sessionTitle: "Implementing a B-tree index in Go", model: "gpt-4o", turns: 51, createdAt: "2026-03-13T08:00:00Z", author: "gopherdev", openingPrompt: "I want to implement a B-tree index from scratch in Go for a toy database..." },
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
          { sessionId: "s6", sessionTitle: "CSS-only animation library with @property", model: "claude-3.5-sonnet", turns: 19, createdAt: "2026-03-12T16:30:00Z", author: "cssmagic", openingPrompt: "Can we build a pure CSS animation library using @property for spring physics?" },
          { sessionId: "s3", sessionTitle: "Migrating a Next.js app to Astro with view transitions", model: "claude-3.5-sonnet", turns: 28, createdAt: "2026-03-15T18:45:00Z", author: "astrofan", openingPrompt: "I need to migrate my Next.js app to Astro while preserving view transitions..." },
        ],
      },
      {
        name: "spring.css",
        path: "styles/spring.css",
        type: "file",
        sessions: [
          { sessionId: "s6", sessionTitle: "CSS-only animation library with @property", model: "claude-3.5-sonnet", turns: 19, createdAt: "2026-03-12T16:30:00Z", author: "cssmagic", openingPrompt: "Can we build a pure CSS animation library using @property for spring physics?" },
        ],
      },
    ],
  },
];

function countFiles(node: FileNode): number {
  if (node.type === "file") return 1;
  return node.children?.reduce((sum, c) => sum + countFiles(c), 0) ?? 0;
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

/* ─── Column 1: Simplified File Tree ─── */
function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const { expandedPaths, toggleExpanded, selectedFilePath, setSelectedFilePath, setActiveSessionId } = useMySessionsState();
  const expanded = node.type === "folder" && expandedPaths.has(node.path);
  const isSelected = node.type === "file" && selectedFilePath === node.path;

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => toggleExpanded(node.path)}
          className="w-full flex items-center gap-1.5 py-1 px-2 text-[13px] hover:bg-secondary/50 rounded transition-colors cursor-pointer"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          )}
          <Folder className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{node.name}</span>
        </button>
        {expanded && node.children?.map((child) => (
          <FileTreeNode key={child.path} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setSelectedFilePath(isSelected ? null : node.path);
        if (isSelected) setActiveSessionId(null);
      }}
      className={`w-full flex items-center gap-1.5 py-1 px-2 text-[13px] rounded transition-colors cursor-pointer ${
        isSelected ? "bg-primary/10 text-primary" : "hover:bg-secondary/50 text-foreground/80"
      }`}
      style={{ paddingLeft: `${depth * 14 + 8}px` }}
    >
      <span className="w-3" />
      <FileText className={`h-3 w-3 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/50"}`} />
      <span className="font-mono text-xs truncate">{node.name}</span>
    </button>
  );
}

/* ─── Column 2: Social Feed Sessions ─── */
function SessionFeed({ filePath }: { filePath: string }) {
  const { activeSessionId, setActiveSessionId } = useMySessionsState();
  const fileNode = findFileNode(FILE_TREE, filePath);
  const sessions = fileNode?.sessions ?? [];
  const fileName = filePath.split("/").pop() ?? filePath;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border shrink-0">
        <span className="font-mono text-xs text-muted-foreground">{fileName}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {sessions.map((s) => {
          const isActive = activeSessionId === s.sessionId;
          return (
            <button
              key={s.sessionId}
              onClick={() => setActiveSessionId(isActive ? null : s.sessionId)}
              className={`w-full text-left rounded-lg border transition-all cursor-pointer ${
                isActive
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/20 hover:shadow-sm"
              }`}
            >
              {/* Author row */}
              <div className="flex items-center gap-2.5 px-3.5 pt-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-2xs bg-secondary text-muted-foreground">
                    {(s.author ?? "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-foreground">{s.author ?? "user"}</span>
                <span className="text-2xs text-muted-foreground ml-auto">{getTimeAgo(s.createdAt)}</span>
              </div>

              {/* Title */}
              <div className="px-3.5 pt-2">
                <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{s.sessionTitle}</p>
              </div>

              {/* Opening prompt preview */}
              {s.openingPrompt && (
                <div className="px-3.5 pt-1.5">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{s.openingPrompt}</p>
                </div>
              )}

              {/* Footer meta */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 mt-1">
                <ModelBadge model={s.model} />
                <span className="flex items-center gap-1 text-2xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  {s.turns}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Group turns: user prompt + following assistant/tool turns ─── */
interface TurnGroup {
  userTurn: typeof SESSION_DETAIL.transcript extends (infer T)[] | undefined ? NonNullable<T> : never;
  responseTurns: typeof SESSION_DETAIL.transcript extends (infer T)[] | undefined ? NonNullable<T>[] : never;
}

function groupTurns(transcript: Session["transcript"]): TurnGroup[] {
  if (!transcript) return [];
  const groups: TurnGroup[] = [];
  let current: TurnGroup | null = null;

  for (const turn of transcript) {
    if (turn.role === "user") {
      if (current) groups.push(current);
      current = { userTurn: turn, responseTurns: [] };
    } else if (current) {
      current.responseTurns.push(turn);
    }
  }
  if (current) groups.push(current);
  return groups;
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

  const groups = useMemo(() => groupTurns(session.transcript), [session.transcript]);

  return (
    <div className="flex flex-col h-full">
      {/* Minimal header */}
      <div className="border-b border-border px-4 py-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarFallback className="text-2xs bg-secondary text-muted-foreground">
                {session.author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{session.title}</p>
              <div className="flex items-center gap-2 text-2xs text-muted-foreground mt-0.5">
                <span>@{session.author.username}</span>
                <span>·</span>
                <ModelBadge model={session.model} />
                <span>·</span>
                <span>{session.turns} turns</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grouped transcript — posts with expandable responses */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border/60">
          {groups.map((group) => (
            <div key={group.userTurn.id} className="px-4">
              <TranscriptTurn
                turn={group.userTurn}
                responseTurns={group.responseTurns}
                comments={commentsByTurn[group.userTurn.id] || []}
                onAddComment={handleAddComment}
              />
            </div>
          ))}
          {groups.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No transcript available.
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
  const { activeSessionId, setActiveSessionId, selectedFilePath, demoMode } = useMySessionsState();

  const totalFiles = useMemo(() => FILE_TREE.reduce((sum, n) => sum + countFiles(n), 0), []);

  const activeSession = useMemo(() => {
    if (!activeSessionId) return null;
    if (activeSessionId === "s1") return SESSION_DETAIL;
    const found = SESSIONS.find((s) => s.id === activeSessionId);
    return found ?? null;
  }, [activeSessionId]);


  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Column 1: Sidebar with Files/Skills tabs */}
      <div className="w-[220px] shrink-0 overflow-y-auto border-r border-border bg-background flex flex-col">
        <div className="flex border-b border-border shrink-0">
          <button
            onClick={() => setSidebarTab("files")}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
              sidebarTab === "files"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Files
          </button>
          <button
            onClick={() => setSidebarTab("skills")}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
              sidebarTab === "skills"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Skills
          </button>
        </div>

        {sidebarTab === "files" ? (
          <div className="px-3 py-3 flex-1 overflow-y-auto">
            <div className="py-0.5">
              {FILE_TREE.map((node) => (
                <FileTreeNode key={node.path} node={node} />
              ))}
            </div>
          </div>
        ) : (
          <SkillsSidebar />
        )}
      </div>

      {/* Column 2: Session feed cards */}
      <AnimatePresence mode="wait">
        {selectedFilePath && (
          <motion.div
            key={selectedFilePath}
            className="w-[320px] shrink-0 border-r border-border bg-background overflow-hidden"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          >
            <SessionFeed filePath={selectedFilePath} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Column 3: Session transcript */}
      <AnimatePresence mode="wait">
        {activeSession ? (
          <motion.div
            key={activeSession.id}
            className="flex-1 min-w-0 bg-background overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
                {selectedFilePath ? "Pick a session" : "Select a file to start"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
