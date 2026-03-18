export interface Session {
  id: string;
  title: string;
  openingPrompt: string;
  model: string;
  author: {
    username: string;
    avatar?: string;
  };
  turns: number;
  filesChanged: number;
  forks: number;
  createdAt: string;
  tags: string[];
  sparkline: number[]; // activity density per segment
  transcript?: Turn[];
}

export interface TurnUsage {
  inputTokens: number;
  outputTokens: number;
  cost: number; // USD
}

export interface Turn {
  id: number;
  role: "user" | "assistant" | "tool";
  content: string;
  timestamp: string;
  intentSummary?: string;
  usage?: TurnUsage;
  toolCall?: {
    name: string;
    args: string;
    result?: string;
  };
  diff?: DiffBlock[];
}

export interface DiffBlock {
  filename: string;
  lines: { type: "add" | "remove" | "context"; content: string }[];
}

export const SESSIONS: Session[] = [
  {
    id: "s1",
    title: "Building a real-time collaborative editor with CRDTs",
    openingPrompt: "I want to build a collaborative text editor using Yjs CRDTs. Start with a basic document model and WebSocket sync...",
    model: "claude-3.5-sonnet",
    author: { username: "danabramov" },
    turns: 42,
    filesChanged: 12,
    forks: 7,
    createdAt: "2026-03-17T14:30:00Z",
    tags: ["typescript", "collaboration", "crdt"],
    sparkline: [3, 5, 8, 6, 9, 4, 7, 8, 5, 3, 6, 8, 9, 7, 4, 2],
  },
  {
    id: "s2",
    title: "Rust async runtime from scratch",
    openingPrompt: "Let's build a minimal async runtime in Rust. I want to understand how tokio works under the hood, starting with a simple executor...",
    model: "gpt-4o",
    author: { username: "fasterthanlime" },
    turns: 67,
    filesChanged: 8,
    forks: 23,
    createdAt: "2026-03-16T09:15:00Z",
    tags: ["rust", "async", "systems"],
    sparkline: [2, 4, 6, 8, 9, 9, 7, 8, 9, 6, 5, 7, 8, 9, 8, 6, 4, 3, 5, 7],
  },
  {
    id: "s3",
    title: "Migrating a Next.js app to Astro with view transitions",
    openingPrompt: "I have a Next.js 14 app with app router. Help me migrate it to Astro 4 with view transitions API...",
    model: "claude-3.5-sonnet",
    author: { username: "sarah_edo" },
    turns: 28,
    filesChanged: 15,
    forks: 4,
    createdAt: "2026-03-15T18:45:00Z",
    tags: ["astro", "migration", "nextjs"],
    sparkline: [5, 7, 9, 8, 6, 4, 3, 5, 7, 8, 6, 4],
  },
  {
    id: "s4",
    title: "Zero-dependency state machine for form validation",
    openingPrompt: "Design a typesafe state machine library in TypeScript for complex form validation workflows. No external deps...",
    model: "gemini-2.5-pro",
    author: { username: "tkdodo" },
    turns: 35,
    filesChanged: 6,
    forks: 11,
    createdAt: "2026-03-14T11:20:00Z",
    tags: ["typescript", "state-machine", "forms"],
    sparkline: [4, 6, 8, 7, 5, 8, 9, 7, 6, 4, 5, 7, 8, 6],
  },
  {
    id: "s5",
    title: "Implementing a B-tree index in Go",
    openingPrompt: "Walk me through implementing a B-tree for a toy database engine in Go. Start with the node structure and insertion...",
    model: "gpt-4o",
    author: { username: "phil_eaton" },
    turns: 51,
    filesChanged: 4,
    forks: 16,
    createdAt: "2026-03-13T08:00:00Z",
    tags: ["go", "database", "data-structures"],
    sparkline: [3, 5, 7, 9, 8, 7, 6, 8, 9, 7, 5, 4, 6, 8, 7, 5, 3],
  },
  {
    id: "s6",
    title: "CSS-only animation library with @property",
    openingPrompt: "Let's create a modern CSS animation library using @property for type-safe custom properties and complex spring animations...",
    model: "claude-3.5-sonnet",
    author: { username: "jh3yy" },
    turns: 19,
    filesChanged: 3,
    forks: 8,
    createdAt: "2026-03-12T16:30:00Z",
    tags: ["css", "animation", "library"],
    sparkline: [6, 8, 9, 7, 5, 8, 9, 6, 4],
  },
];

export const SESSION_DETAIL: Session = {
  ...SESSIONS[0],
  transcript: [
    {
      id: 1,
      role: "user",
      content: "I want to build a collaborative text editor using Yjs CRDTs. Start with a basic document model and WebSocket sync. Use TypeScript throughout.",
      timestamp: "14:30",
      intentSummary: "Initial setup",
    },
    {
      id: 2,
      role: "assistant",
      content: "I'll set up the project structure with a Yjs document model and WebSocket provider. Let me create the core files:\n\n1. `src/editor/document.ts` — Y.Doc wrapper with text type\n2. `src/sync/ws-provider.ts` — WebSocket connection manager\n3. `src/editor/Editor.tsx` — React component binding\n\nStarting with the document model:",
      timestamp: "14:30",
      intentSummary: "Project scaffold",
      diff: [
        {
          filename: "src/editor/document.ts",
          lines: [
            { type: "add", content: "import * as Y from 'yjs'" },
            { type: "add", content: "import { WebsocketProvider } from 'y-websocket'" },
            { type: "add", content: "" },
            { type: "add", content: "export function createDocument(roomId: string) {" },
            { type: "add", content: "  const doc = new Y.Doc()" },
            { type: "add", content: "  const text = doc.getText('content')" },
            { type: "add", content: "  return { doc, text }" },
            { type: "add", content: "}" },
          ],
        },
      ],
    },
    {
      id: 3,
      role: "tool",
      content: "",
      timestamp: "14:31",
      toolCall: {
        name: "filesystem_write",
        args: JSON.stringify({ path: "src/editor/document.ts", content: "..." }, null, 2),
        result: "File written successfully",
      },
    },
    {
      id: 4,
      role: "user",
      content: "Good. Now add cursor awareness so users can see each other's selections. Use the Yjs awareness protocol.",
      timestamp: "14:32",
      intentSummary: "Add cursor awareness",
    },
    {
      id: 5,
      role: "assistant",
      content: "I'll integrate the Yjs awareness protocol for cursor sharing. Each connected client will broadcast their cursor position and selection range.\n\nThe awareness state includes:\n- `cursor` — current position\n- `selection` — anchor + head for range selections\n- `user` — name and color for rendering",
      timestamp: "14:33",
      intentSummary: "Cursor awareness impl",
      diff: [
        {
          filename: "src/sync/awareness.ts",
          lines: [
            { type: "add", content: "import { Awareness } from 'y-protocols/awareness'" },
            { type: "add", content: "" },
            { type: "add", content: "export interface CursorState {" },
            { type: "add", content: "  cursor: number | null" },
            { type: "add", content: "  selection: { anchor: number; head: number } | null" },
            { type: "add", content: "  user: { name: string; color: string }" },
            { type: "add", content: "}" },
          ],
        },
        {
          filename: "src/editor/document.ts",
          lines: [
            { type: "context", content: "import * as Y from 'yjs'" },
            { type: "remove", content: "import { WebsocketProvider } from 'y-websocket'" },
            { type: "add", content: "import { WebsocketProvider } from 'y-websocket'" },
            { type: "add", content: "import { setupAwareness } from '../sync/awareness'" },
          ],
        },
      ],
    },
    {
      id: 6,
      role: "user",
      content: "The WebSocket connection keeps dropping after ~30 seconds. Add reconnection logic with exponential backoff.",
      timestamp: "14:38",
      intentSummary: "Fix WS reconnection",
    },
    {
      id: 7,
      role: "assistant",
      content: "The issue is that the default WebSocket provider doesn't handle reconnection gracefully. I'll add exponential backoff with jitter:\n\n- Base delay: 1s\n- Max delay: 30s\n- Jitter: ±500ms\n- Max retries: 10",
      timestamp: "14:39",
      intentSummary: "Exponential backoff",
      diff: [
        {
          filename: "src/sync/ws-provider.ts",
          lines: [
            { type: "add", content: "const BASE_DELAY = 1000" },
            { type: "add", content: "const MAX_DELAY = 30000" },
            { type: "add", content: "const MAX_RETRIES = 10" },
            { type: "add", content: "" },
            { type: "add", content: "function getBackoffDelay(attempt: number): number {" },
            { type: "add", content: "  const delay = Math.min(BASE_DELAY * 2 ** attempt, MAX_DELAY)" },
            { type: "add", content: "  const jitter = Math.random() * 1000 - 500" },
            { type: "add", content: "  return delay + jitter" },
            { type: "add", content: "}" },
          ],
        },
      ],
    },
  ],
};

export const MODELS = ["All Models", "claude-3.5-sonnet", "gpt-4o", "gemini-2.5-pro"] as const;
export const LANGUAGES = ["All Languages", "typescript", "rust", "go", "python", "css"] as const;
