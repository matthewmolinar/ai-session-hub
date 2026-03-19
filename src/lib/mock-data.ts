export type SourceTool = "claude-code" | "cursor" | "codex" | "amp" | "windsurf";

export interface SessionComment {
  id: string;
  author: string;
  content: string;
  timeAgo: string;
}

export interface Session {
  id: string;
  title: string;
  openingPrompt: string;
  model: string;
  source: SourceTool;
  author: {
    username: string;
    avatar?: string;
    role?: string;
    team?: string;
  };
  turns: number;
  filesChanged: number;
  forks: number;
  likes: number;
  createdAt: string;
  tags: string[];
  sparkline: number[]; // activity density per segment
  comments: SessionComment[];
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
    source: "claude-code",
    author: { username: "danabramov", role: "Staff Engineer", team: "Frontend Platform" },
    turns: 42,
    filesChanged: 12,
    forks: 7,
    likes: 24,
    createdAt: "2026-03-17T14:30:00Z",
    tags: ["/commit", "/review", "/test"],
    sparkline: [3, 5, 8, 6, 9, 4, 7, 8, 5, 3, 6, 8, 9, 7, 4, 2],
    comments: [
      { id: "c1", author: "techleadmaria", content: "The CRDT approach here is clean — we should adopt this for the shared notes feature.", timeAgo: "2h" },
      { id: "c2", author: "sarah_edo", content: "Nice prompt structure. Bookmarking this for reference.", timeAgo: "5h" },
    ],
  },
  {
    id: "s2",
    title: "Rust async runtime from scratch",
    openingPrompt: "Let's build a minimal async runtime in Rust. I want to understand how tokio works under the hood, starting with a simple executor...",
    model: "gpt-4o",
    source: "codex",
    author: { username: "fasterthanlime", role: "Systems Engineer", team: "Infrastructure" },
    turns: 67,
    likes: 31,
    comments: [
      { id: "c3", author: "phil_eaton", content: "This is exactly how I'd teach async runtimes. The waker explanation is 🔥", timeAgo: "1d" },
    ],
    filesChanged: 8,
    forks: 23,
    createdAt: "2026-03-16T09:15:00Z",
    tags: ["/commit", "/tdd", "/deploy"],
    sparkline: [2, 4, 6, 8, 9, 9, 7, 8, 9, 6, 5, 7, 8, 9, 8, 6, 4, 3, 5, 7],
    transcript: [
      {
        id: 1, role: "user",
        content: "Let's build a minimal async runtime in Rust. I want to understand how tokio works under the hood, starting with a simple executor.",
        timestamp: "09:15", intentSummary: "Project kickoff",
        usage: { inputTokens: 48, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2, role: "assistant",
        content: "Great idea! I'll start by building the core components:\n\n1. `src/executor.rs` — a single-threaded task executor\n2. `src/task.rs` — a `Task` wrapper around a pinned future\n3. `src/waker.rs` — a custom `Waker` implementation\n\nThe executor will use a simple VecDeque as a task queue. Let's start with the task abstraction:",
        timestamp: "09:15", intentSummary: "Core executor scaffold",
        usage: { inputTokens: 1480, outputTokens: 4200, cost: 0.0412 },
        diff: [
          {
            filename: "src/task.rs",
            lines: [
              { type: "add", content: "use std::future::Future;" },
              { type: "add", content: "use std::pin::Pin;" },
              { type: "add", content: "use std::task::{Context, Poll};" },
              { type: "add", content: "" },
              { type: "add", content: "pub struct Task {" },
              { type: "add", content: "    future: Pin<Box<dyn Future<Output = ()> + Send>>," },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 3, role: "tool", content: "", timestamp: "09:16",
        usage: { inputTokens: 0, outputTokens: 0, cost: 0.0 },
        toolCall: { name: "filesystem_write", args: JSON.stringify({ path: "src/task.rs" }, null, 2), result: "File written successfully" },
      },
      {
        id: 4, role: "user",
        content: "Now implement the Waker. I want to understand how the wake mechanism actually triggers re-polling.",
        timestamp: "09:20", intentSummary: "Waker implementation",
        usage: { inputTokens: 42, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 5, role: "assistant",
        content: "The `Waker` is the key piece — it's how a future signals \"I'm ready to make progress.\" Our custom waker will push the task ID back onto the executor's queue:\n\n- We store a `Sender<TaskId>` inside the waker's raw pointer\n- When `wake()` is called, it sends the task ID through the channel\n- The executor loop picks it up and re-polls the future",
        timestamp: "09:21", intentSummary: "Custom Waker with channel",
        usage: { inputTokens: 3200, outputTokens: 4800, cost: 0.0580 },
        diff: [
          {
            filename: "src/waker.rs",
            lines: [
              { type: "add", content: "use std::task::{RawWaker, RawWakerVTable, Waker};" },
              { type: "add", content: "use std::sync::mpsc::Sender;" },
              { type: "add", content: "" },
              { type: "add", content: "pub fn create_waker(task_id: usize, sender: Sender<usize>) -> Waker {" },
              { type: "add", content: "    let data = Box::into_raw(Box::new((task_id, sender)));" },
              { type: "add", content: "    unsafe { Waker::from_raw(raw_waker(data as *const ())) }" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 6, role: "user",
        content: "The executor panics when a task completes — it tries to re-poll a finished future. Add proper completion tracking.",
        timestamp: "09:30", intentSummary: "Fix completed task panic",
        usage: { inputTokens: 38, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 7, role: "assistant",
        content: "The bug is that completed tasks aren't being removed from the task slab. When the waker fires for a completed task, we try to poll a dropped future. Fix:\n\n- Track task state: `Pending`, `Running`, `Completed`\n- Remove from slab on `Poll::Ready`\n- Skip wake notifications for completed tasks",
        timestamp: "09:31", intentSummary: "Task lifecycle tracking",
        usage: { inputTokens: 5600, outputTokens: 3900, cost: 0.0620 },
        diff: [
          {
            filename: "src/executor.rs",
            lines: [
              { type: "add", content: "#[derive(Debug, PartialEq)]" },
              { type: "add", content: "enum TaskState { Pending, Running, Completed }" },
              { type: "add", content: "" },
              { type: "context", content: "pub fn poll_task(&mut self, id: usize) {" },
              { type: "remove", content: "    let task = &mut self.tasks[id];" },
              { type: "add", content: "    if self.states[id] == TaskState::Completed { return; }" },
              { type: "add", content: "    self.states[id] = TaskState::Running;" },
              { type: "add", content: "    let task = &mut self.tasks[id];" },
            ],
          },
        ],
      },
    ],
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
    tags: ["/fix-issue", "/commit", "/docs"],
    sparkline: [5, 7, 9, 8, 6, 4, 3, 5, 7, 8, 6, 4],
    transcript: [
      {
        id: 1, role: "user",
        content: "I have a Next.js 14 app with app router. Help me migrate it to Astro 4 with view transitions API. Start with the routing layer.",
        timestamp: "18:45", intentSummary: "Migration kickoff",
        usage: { inputTokens: 52, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2, role: "assistant",
        content: "Let's start by mapping your Next.js routes to Astro's file-based routing. Key differences:\n\n- `app/page.tsx` → `src/pages/index.astro`\n- `app/blog/[slug]/page.tsx` → `src/pages/blog/[slug].astro`\n- Layouts become Astro layouts with `<slot />`\n\nI'll create the base layout with view transitions enabled:",
        timestamp: "18:46", intentSummary: "Route mapping + base layout",
        usage: { inputTokens: 2100, outputTokens: 3600, cost: 0.0380 },
        diff: [
          {
            filename: "src/layouts/BaseLayout.astro",
            lines: [
              { type: "add", content: "---" },
              { type: "add", content: "import { ViewTransitions } from 'astro:transitions';" },
              { type: "add", content: "const { title } = Astro.props;" },
              { type: "add", content: "---" },
              { type: "add", content: "<html lang=\"en\">" },
              { type: "add", content: "  <head>" },
              { type: "add", content: "    <ViewTransitions />" },
              { type: "add", content: "  </head>" },
              { type: "add", content: "  <body><slot /></body>" },
              { type: "add", content: "</html>" },
            ],
          },
        ],
      },
      {
        id: 3, role: "user",
        content: "My blog pages use `generateStaticParams`. How do I handle that in Astro?",
        timestamp: "18:50", intentSummary: "Static params migration",
        usage: { inputTokens: 35, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 4, role: "assistant",
        content: "In Astro, `generateStaticParams` becomes `getStaticPaths()`. The shape is slightly different — you return an array of `{ params, props }` objects instead of just params:\n\n```astro\nexport async function getStaticPaths() {\n  const posts = await getPosts();\n  return posts.map(post => ({\n    params: { slug: post.slug },\n    props: { post },\n  }));\n}\n```\n\nThe big win: props are passed directly, no need to re-fetch in the component.",
        timestamp: "18:51", intentSummary: "getStaticPaths pattern",
        usage: { inputTokens: 3800, outputTokens: 4100, cost: 0.0520 },
        diff: [
          {
            filename: "src/pages/blog/[slug].astro",
            lines: [
              { type: "add", content: "---" },
              { type: "add", content: "import { getPosts } from '../../lib/posts';" },
              { type: "add", content: "export async function getStaticPaths() {" },
              { type: "add", content: "  const posts = await getPosts();" },
              { type: "add", content: "  return posts.map(p => ({ params: { slug: p.slug }, props: { post: p } }));" },
              { type: "add", content: "}" },
              { type: "add", content: "const { post } = Astro.props;" },
              { type: "add", content: "---" },
            ],
          },
        ],
      },
      {
        id: 5, role: "user",
        content: "The view transitions are janky on the blog list → post navigation. Can we add a crossfade with a morph on the title?",
        timestamp: "18:58", intentSummary: "Polish view transitions",
        usage: { inputTokens: 40, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 6, role: "assistant",
        content: "For smooth transitions, we use `transition:name` to create shared element morphs and `transition:animate` for the crossfade. The title will morph between list and detail views using a matching `transition:name`:",
        timestamp: "18:59", intentSummary: "Named view transitions",
        usage: { inputTokens: 4200, outputTokens: 3400, cost: 0.0490 },
        diff: [
          {
            filename: "src/pages/blog/[slug].astro",
            lines: [
              { type: "context", content: "const { post } = Astro.props;" },
              { type: "add", content: "" },
              { type: "add", content: "<h1 transition:name={`title-${post.slug}`}" },
              { type: "add", content: "    transition:animate=\"initial\">" },
              { type: "add", content: "  {post.title}" },
              { type: "add", content: "</h1>" },
            ],
          },
          {
            filename: "src/components/PostCard.astro",
            lines: [
              { type: "remove", content: "<h2>{post.title}</h2>" },
              { type: "add", content: "<h2 transition:name={`title-${post.slug}`}>" },
              { type: "add", content: "  {post.title}" },
              { type: "add", content: "</h2>" },
            ],
          },
        ],
      },
    ],
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
    tags: ["/tdd", "/refactor", "/review"],
    sparkline: [4, 6, 8, 7, 5, 8, 9, 7, 6, 4, 5, 7, 8, 6],
    transcript: [
      {
        id: 1, role: "user",
        content: "Design a typesafe state machine library in TypeScript for complex form validation workflows. No external deps. I want the transitions to be fully type-checked.",
        timestamp: "11:20", intentSummary: "Project scope",
        usage: { inputTokens: 55, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2, role: "assistant",
        content: "I'll design the core type system first. The key insight is using mapped types to constrain transitions at the type level:\n\n- `State` — union of string literal states\n- `Event` — union of string literal events\n- `TransitionMap` — `Record<State, Partial<Record<Event, State>>>`\n\nThis gives us compile-time errors for invalid transitions:",
        timestamp: "11:21", intentSummary: "Core type design",
        usage: { inputTokens: 1800, outputTokens: 5200, cost: 0.0560 },
        diff: [
          {
            filename: "src/machine.ts",
            lines: [
              { type: "add", content: "type TransitionMap<S extends string, E extends string> =" },
              { type: "add", content: "  Record<S, Partial<Record<E, S>>>;" },
              { type: "add", content: "" },
              { type: "add", content: "interface MachineConfig<S extends string, E extends string> {" },
              { type: "add", content: "  initial: S;" },
              { type: "add", content: "  transitions: TransitionMap<S, E>;" },
              { type: "add", content: "  onEnter?: Partial<Record<S, () => void>>;" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 3, role: "user",
        content: "Add guard conditions to transitions. A guard should be a function that returns boolean — if false, the transition is rejected.",
        timestamp: "11:28", intentSummary: "Transition guards",
        usage: { inputTokens: 40, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 4, role: "assistant",
        content: "I'll extend the transition definition to support guards. Instead of `Event → State`, a transition becomes `Event → { target: State, guard?: () => boolean }`. The `send()` method checks the guard before transitioning:",
        timestamp: "11:29", intentSummary: "Guard implementation",
        usage: { inputTokens: 4600, outputTokens: 4800, cost: 0.0680 },
        diff: [
          {
            filename: "src/machine.ts",
            lines: [
              { type: "add", content: "interface Transition<S extends string> {" },
              { type: "add", content: "  target: S;" },
              { type: "add", content: "  guard?: (context: any) => boolean;" },
              { type: "add", content: "}" },
              { type: "add", content: "" },
              { type: "context", content: "  send(event: E): S {" },
              { type: "add", content: "    const transition = this.config.transitions[this.state][event];" },
              { type: "add", content: "    if (!transition) throw new Error(`No transition for ${event} in ${this.state}`);" },
              { type: "add", content: "    if (transition.guard && !transition.guard(this.context)) return this.state;" },
              { type: "add", content: "    this.state = transition.target;" },
              { type: "add", content: "    return this.state;" },
            ],
          },
        ],
      },
      {
        id: 5, role: "user",
        content: "Now wire it up to a real form. Show me a multi-step checkout form using the machine.",
        timestamp: "11:40", intentSummary: "Checkout form example",
        usage: { inputTokens: 35, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 6, role: "assistant",
        content: "Here's a 4-step checkout flow: `shipping → billing → review → confirmed`. The machine enforces that you can't skip steps and validates each step before allowing `NEXT`:",
        timestamp: "11:41", intentSummary: "Checkout state machine",
        usage: { inputTokens: 6200, outputTokens: 5100, cost: 0.0780 },
        diff: [
          {
            filename: "src/examples/checkout.ts",
            lines: [
              { type: "add", content: "import { createMachine } from '../machine';" },
              { type: "add", content: "" },
              { type: "add", content: "type CheckoutState = 'shipping' | 'billing' | 'review' | 'confirmed';" },
              { type: "add", content: "type CheckoutEvent = 'NEXT' | 'BACK' | 'SUBMIT';" },
              { type: "add", content: "" },
              { type: "add", content: "const checkoutMachine = createMachine<CheckoutState, CheckoutEvent>({" },
              { type: "add", content: "  initial: 'shipping'," },
              { type: "add", content: "  transitions: {" },
              { type: "add", content: "    shipping: { NEXT: { target: 'billing', guard: validateShipping } }," },
              { type: "add", content: "    billing: { NEXT: { target: 'review' }, BACK: { target: 'shipping' } }," },
              { type: "add", content: "    review: { SUBMIT: { target: 'confirmed' }, BACK: { target: 'billing' } }," },
              { type: "add", content: "    confirmed: {}," },
              { type: "add", content: "  }," },
              { type: "add", content: "});" },
            ],
          },
        ],
      },
    ],
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
    tags: ["/test", "/commit", "/security-scan"],
    sparkline: [3, 5, 7, 9, 8, 7, 6, 8, 9, 7, 5, 4, 6, 8, 7, 5, 3],
    transcript: [
      {
        id: 1, role: "user",
        content: "Walk me through implementing a B-tree for a toy database engine in Go. Start with the node structure and insertion.",
        timestamp: "08:00", intentSummary: "B-tree kickoff",
        usage: { inputTokens: 44, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2, role: "assistant",
        content: "A B-tree of order `m` has these properties:\n- Each node has at most `m` children\n- Each internal node has at least `⌈m/2⌉` children\n- Keys are sorted within each node\n\nI'll start with a B-tree of order 4 (2-3-4 tree). Here's the node structure:",
        timestamp: "08:01", intentSummary: "Node structure",
        usage: { inputTokens: 1600, outputTokens: 3800, cost: 0.0380 },
        diff: [
          {
            filename: "btree/node.go",
            lines: [
              { type: "add", content: "package btree" },
              { type: "add", content: "" },
              { type: "add", content: "const MaxKeys = 3 // order 4" },
              { type: "add", content: "" },
              { type: "add", content: "type Node struct {" },
              { type: "add", content: "    keys     []int" },
              { type: "add", content: "    children []*Node" },
              { type: "add", content: "    leaf     bool" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 3, role: "tool", content: "", timestamp: "08:02",
        usage: { inputTokens: 0, outputTokens: 0, cost: 0.0 },
        toolCall: { name: "filesystem_write", args: JSON.stringify({ path: "btree/node.go" }, null, 2), result: "File written successfully" },
      },
      {
        id: 4, role: "user",
        content: "Implement insertion with node splitting when a node is full.",
        timestamp: "08:08", intentSummary: "Insert + split",
        usage: { inputTokens: 30, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 5, role: "assistant",
        content: "Insertion follows the standard algorithm:\n1. Find the correct leaf node\n2. Insert the key in sorted order\n3. If the node overflows (> MaxKeys), split it:\n   - Median key moves up to the parent\n   - Node splits into two halves\n   - Recurse upward if parent also overflows",
        timestamp: "08:09", intentSummary: "Split algorithm",
        usage: { inputTokens: 4800, outputTokens: 6200, cost: 0.0720 },
        diff: [
          {
            filename: "btree/insert.go",
            lines: [
              { type: "add", content: "func (t *BTree) Insert(key int) {" },
              { type: "add", content: "    if t.root == nil {" },
              { type: "add", content: "        t.root = &Node{keys: []int{key}, leaf: true}" },
              { type: "add", content: "        return" },
              { type: "add", content: "    }" },
              { type: "add", content: "    if len(t.root.keys) == MaxKeys {" },
              { type: "add", content: "        newRoot := &Node{children: []*Node{t.root}}" },
              { type: "add", content: "        splitChild(newRoot, 0)" },
              { type: "add", content: "        t.root = newRoot" },
              { type: "add", content: "    }" },
              { type: "add", content: "    insertNonFull(t.root, key)" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 6, role: "user",
        content: "Add a search method and then let's write some tests.",
        timestamp: "08:18", intentSummary: "Search + tests",
        usage: { inputTokens: 28, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 7, role: "assistant",
        content: "Search is straightforward — binary search within each node, then recurse into the appropriate child. Here's the implementation along with table-driven tests:",
        timestamp: "08:19", intentSummary: "Search + test suite",
        usage: { inputTokens: 5200, outputTokens: 5800, cost: 0.0740 },
        diff: [
          {
            filename: "btree/search.go",
            lines: [
              { type: "add", content: "func (t *BTree) Search(key int) bool {" },
              { type: "add", content: "    return search(t.root, key)" },
              { type: "add", content: "}" },
              { type: "add", content: "" },
              { type: "add", content: "func search(n *Node, key int) bool {" },
              { type: "add", content: "    i := sort.SearchInts(n.keys, key)" },
              { type: "add", content: "    if i < len(n.keys) && n.keys[i] == key { return true }" },
              { type: "add", content: "    if n.leaf { return false }" },
              { type: "add", content: "    return search(n.children[i], key)" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
    ],
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
    tags: ["/pr-review", "/refactor", "/docs"],
    sparkline: [6, 8, 9, 7, 5, 8, 9, 6, 4],
    transcript: [
      {
        id: 1, role: "user",
        content: "Let's create a modern CSS animation library using @property for type-safe custom properties and complex spring animations. Pure CSS, no JS runtime.",
        timestamp: "16:30", intentSummary: "Library concept",
        usage: { inputTokens: 50, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2, role: "assistant",
        content: "Love this idea! `@property` lets us define typed CSS custom properties that can be animated. The key trick: properties registered as `<number>` can interpolate, while unregistered custom properties can't.\n\nI'll set up the core spring keyframes using `@property` for animatable values:",
        timestamp: "16:31", intentSummary: "@property foundations",
        usage: { inputTokens: 1400, outputTokens: 3200, cost: 0.0320 },
        diff: [
          {
            filename: "src/spring.css",
            lines: [
              { type: "add", content: "@property --spring-x {" },
              { type: "add", content: "  syntax: '<number>';" },
              { type: "add", content: "  inherits: false;" },
              { type: "add", content: "  initial-value: 0;" },
              { type: "add", content: "}" },
              { type: "add", content: "" },
              { type: "add", content: "@keyframes spring-in {" },
              { type: "add", content: "  0% { --spring-x: 0; transform: translateX(calc(var(--spring-x) * 1px)); }" },
              { type: "add", content: "  40% { --spring-x: 120; }" },
              { type: "add", content: "  70% { --spring-x: 95; }" },
              { type: "add", content: "  100% { --spring-x: 100; transform: translateX(calc(var(--spring-x) * 1px)); }" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 3, role: "user",
        content: "Add a bounce effect and a wobble. I want utility classes like `.animate-spring-bounce` that just work.",
        timestamp: "16:38", intentSummary: "Bounce + wobble utils",
        usage: { inputTokens: 38, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 4, role: "assistant",
        content: "I'll create utility classes that compose the `@property` approach with preset spring curves. Each animation uses over-shoot keyframes to simulate spring physics:\n\n- `.animate-spring-bounce` — vertical bounce with overshoot\n- `.animate-spring-wobble` — rotational wobble with decay",
        timestamp: "16:39", intentSummary: "Utility classes",
        usage: { inputTokens: 3600, outputTokens: 4400, cost: 0.0540 },
        diff: [
          {
            filename: "src/utilities.css",
            lines: [
              { type: "add", content: "@property --bounce-y { syntax: '<number>'; inherits: false; initial-value: 0; }" },
              { type: "add", content: "@property --wobble-r { syntax: '<number>'; inherits: false; initial-value: 0; }" },
              { type: "add", content: "" },
              { type: "add", content: ".animate-spring-bounce {" },
              { type: "add", content: "  animation: spring-bounce 600ms cubic-bezier(0.34, 1.56, 0.64, 1);" },
              { type: "add", content: "}" },
              { type: "add", content: "" },
              { type: "add", content: ".animate-spring-wobble {" },
              { type: "add", content: "  animation: spring-wobble 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);" },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
      {
        id: 5, role: "user",
        content: "Can we generate spring keyframes mathematically? I want to input stiffness, damping, and mass and get the right curve.",
        timestamp: "16:45", intentSummary: "Spring physics generator",
        usage: { inputTokens: 42, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 6, role: "assistant",
        content: "Yes! We can pre-compute spring positions using the damped harmonic oscillator equation and generate `@keyframes` at build time. The formula:\n\n`x(t) = e^(-ζωt) × cos(ωd × t)`\n\nwhere `ζ = damping / (2√(stiffness × mass))` and `ωd = √(ω² - ζ²)`\n\nI'll create a build-time script that outputs CSS:",
        timestamp: "16:46", intentSummary: "Physics-based generator",
        usage: { inputTokens: 5800, outputTokens: 6400, cost: 0.0840 },
        diff: [
          {
            filename: "scripts/generate-springs.ts",
            lines: [
              { type: "add", content: "interface SpringConfig { stiffness: number; damping: number; mass: number; }" },
              { type: "add", content: "" },
              { type: "add", content: "function generateKeyframes(config: SpringConfig, steps = 60): string {" },
              { type: "add", content: "  const { stiffness, damping, mass } = config;" },
              { type: "add", content: "  const omega = Math.sqrt(stiffness / mass);" },
              { type: "add", content: "  const zeta = damping / (2 * Math.sqrt(stiffness * mass));" },
              { type: "add", content: "  const omegaD = omega * Math.sqrt(1 - zeta ** 2);" },
              { type: "add", content: "  // Generate keyframe percentages..." },
              { type: "add", content: "}" },
            ],
          },
        ],
      },
    ],
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
      usage: { inputTokens: 42, outputTokens: 0, cost: 0.0001 },
    },
    {
      id: 2,
      role: "assistant",
      content: "I'll set up the project structure with a Yjs document model and WebSocket provider. Let me create the core files:\n\n1. `src/editor/document.ts` — Y.Doc wrapper with text type\n2. `src/sync/ws-provider.ts` — WebSocket connection manager\n3. `src/editor/Editor.tsx` — React component binding\n\nStarting with the document model:",
      timestamp: "14:30",
      intentSummary: "Project scaffold",
      usage: { inputTokens: 1240, outputTokens: 3820, cost: 0.0327 },
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
      usage: { inputTokens: 0, outputTokens: 0, cost: 0.0 },
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
      usage: { inputTokens: 38, outputTokens: 0, cost: 0.0001 },
    },
    {
      id: 5,
      role: "assistant",
      content: "I'll integrate the Yjs awareness protocol for cursor sharing. Each connected client will broadcast their cursor position and selection range.\n\nThe awareness state includes:\n- `cursor` — current position\n- `selection` — anchor + head for range selections\n- `user` — name and color for rendering",
      timestamp: "14:33",
      intentSummary: "Cursor awareness impl",
      usage: { inputTokens: 4280, outputTokens: 5640, cost: 0.0812 },
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
      usage: { inputTokens: 36, outputTokens: 0, cost: 0.0001 },
    },
    {
      id: 7,
      role: "assistant",
      content: "The issue is that the default WebSocket provider doesn't handle reconnection gracefully. I'll add exponential backoff with jitter:\n\n- Base delay: 1s\n- Max delay: 30s\n- Jitter: ±500ms\n- Max retries: 10",
      timestamp: "14:39",
      intentSummary: "Exponential backoff",
      usage: { inputTokens: 8960, outputTokens: 4210, cost: 0.0694 },
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

// Mock: teammates who explored similar sessions (by shared tags)
export const TEAMMATE_ACTIVITY: Record<string, { username: string; avatar?: string }[]> = {
  s1: [{ username: "sarah_edo" }, { username: "tkdodo" }],
  s2: [{ username: "danabramov" }, { username: "phil_eaton" }, { username: "jh3yy" }],
  s3: [{ username: "fasterthanlime" }],
  s4: [{ username: "danabramov" }, { username: "sarah_edo" }, { username: "jh3yy" }],
  s5: [{ username: "tkdodo" }, { username: "fasterthanlime" }],
  s6: [{ username: "sarah_edo" }, { username: "danabramov" }, { username: "tkdodo" }, { username: "phil_eaton" }],
};

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  installs: number;
  category: "workflow" | "quality" | "devops";
}

export const SKILLS_CATALOG: SkillDefinition[] = [
  { id: "/commit",        name: "/commit",        description: "Auto-generates conventional commit messages",                    installs: 12_400, category: "workflow" },
  { id: "/review",        name: "/review",        description: "Multi-angle code review — security, perf, quality",             installs: 9_800,  category: "quality" },
  { id: "/fix-issue",     name: "/fix-issue",     description: "Takes a GitHub/Linear issue number, implements the fix",        installs: 8_200,  category: "workflow" },
  { id: "/tdd",           name: "/tdd",           description: "Red-green-refactor cycle orchestration",                        installs: 6_500,  category: "quality" },
  { id: "/pr-review",     name: "/pr-review",     description: "Fetches PR diff, writes structured review comments",           installs: 5_900,  category: "quality" },
  { id: "/deploy",        name: "/deploy",        description: "Runs tests, builds, pushes to prod",                            installs: 5_100,  category: "devops" },
  { id: "/test",          name: "/test",          description: "Generates test suites for specified code",                      installs: 7_300,  category: "quality" },
  { id: "/docs",          name: "/docs",          description: "Generates API docs from code (OpenAPI, JSDoc)",                 installs: 4_200,  category: "workflow" },
  { id: "/security-scan", name: "/security-scan", description: "OWASP-style vulnerability scan",                               installs: 3_800,  category: "devops" },
  { id: "/refactor",      name: "/refactor",      description: "Dead code removal, pattern cleanup",                            installs: 4_600,  category: "quality" },
];

export const MODELS = ["All Models", "claude-3.5-sonnet", "gpt-4o", "gemini-2.5-pro"] as const;
export const SKILLS_FILTERS = ["All Skills", "/commit", "/review", "/fix-issue", "/tdd", "/test", "/deploy", "/pr-review", "/docs", "/security-scan", "/refactor"] as const;
export const LANGUAGES = SKILLS_FILTERS;
export const AUTHORS = ["All Authors", ...Array.from(new Set(SESSIONS.map(s => s.author.username)))] as const;
