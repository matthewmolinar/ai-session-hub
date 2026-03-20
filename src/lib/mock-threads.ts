import type { Turn } from "./mock-data";

export interface Thread {
  id: string;
  title: string;
  author: {
    username: string;
    avatar?: string;
  };
  createdAt: string;
  messageCount: number;
  diffStats: { added: number; removed: number; modified: number };
  repository: string;
  threadType: "github-app" | "slack" | "manual" | "cli";
  stars: number;
  openingPrompt: string;
  transcript?: Turn[];
}

export const THREAD_TYPES = ["All thread types", "github-app", "slack", "manual", "cli"] as const;

export const THREAD_REPOS = [
  "All repositories",
  "tanagram/monorepo:main",
  "tanagram/monorepo:feat/suggested-policy-has-TQL",
  "tanagram/monorepo:suggestions/observability",
] as const;

export const THREAD_USERS = [
  "All users",
  "jondesr",
  "shlok_mundhra",
  "shivansh_jagga",
] as const;

const THREAD_TYPE_LABELS: Record<Thread["threadType"], string> = {
  "github-app": "github-app",
  slack: "slack",
  manual: "manual",
  cli: "cli",
};

export { THREAD_TYPE_LABELS };

export const THREADS: Thread[] = [
  {
    id: "t1",
    title: "WebUI repos page and CLI changes",
    author: { username: "shivansh_jagga" },
    createdAt: "2026-03-20T13:30:00Z",
    messageCount: 1,
    diffStats: { added: 0, removed: 0, modified: 0 },
    repository: "tanagram/monorepo:main",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      'can yout tell me about webui/ changes related to repos page and dynamic webui bar (with the new "cli"), and things related to changes in onboarding within webui/ ever since sunday',
    transcript: [
      {
        id: 1,
        role: "user",
        content:
          'can yout tell me about webui/ changes related to repos page and dynamic webui bar (with the new "cli"), and things related to changes in onboarding within webui/ ever since sunday',
        timestamp: "13:30",
        intentSummary: "Investigate recent webui changes",
        usage: { inputTokens: 52, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2,
        role: "assistant",
        content:
          "I'll look at recent changes in the `webui/` directory since Sunday (March 15, 2026) related to those topics.\n\nHere's what I found across 11 commits:\n\n**CLI Integration Status**\n`Render CLI integration status` (#2263, Mon) — New `CLIIntegrationService` that fetches `/api/integrations/cli/state` with `last_login_at` and `last_eval_at`. IntegrationsBar now shows CLI connection state: green if recently used, yellow (>3 days) or connected but never used, red if not connected. Also removed the old \"Learn from transcripts\" checkbox.\n\n**Onboarding changes**\n`Move \"Reset Onboarding\" button to DebugBar` (#2289, Fri/today) — Removed `StartOnboardingButton` from the integrations/repos page. Added a \"Reset Onboarding\" button to DebugBar (Tanagram-user only) that calls `onboardingService.resetOnboarding()` then re-starts onboarding with all connected repos and reloads.\n\n**Suggestions polling**\n`Implement polling for suggestions` (#2262, Tue) — Overhauled `suggestedPoliciesStore` to support polling; extracted `filterAndMergePolicies` helper; added `stopPolling()` for both policies and suggested-policies stores in the DebugBar toggle.\n\n**WIP commits (yours)**\n- WIP (Mon) — Added `source_file` field to suggested policy model, displayed it in `SuggestedPolicyDetailContent`, and updated `TQLFlowVisualization`.\n- WIP (Thu) — Added `MinePoliciesButton` component on repos page and tweaked `suggestedPoliciesService`.",
        timestamp: "13:31",
        intentSummary: "Summary of webui/ changes since Sunday",
        usage: { inputTokens: 3200, outputTokens: 4800, cost: 0.058 },
      },
    ],
  },
  {
    id: "t2",
    title: "PR#2293 exception handling analysis",
    author: { username: "jondesr" },
    createdAt: "2026-03-20T13:07:00Z",
    messageCount: 3,
    diffStats: { added: 1, removed: 1, modified: 1 },
    repository: "tanagram/monorepo:main",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      "Review PR#2293 that fixes Sentry issue 7330976344. Why was the exception that was created by this issue not failing the entire Ingest ...",
  },
  {
    id: "t3",
    title: "Debug missing GitHub tags in Sentry traces",
    author: { username: "jondesr" },
    createdAt: "2026-03-20T12:57:00Z",
    messageCount: 2,
    diffStats: { added: 24, removed: 13, modified: 0 },
    repository: "tanagram/monorepo:main",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      "Your task is to identify why the github owner and github repository tags are not appearing for traces of inngest process-check-run-orche...",
  },
  {
    id: "t4",
    title: "Resolve regex pattern change in commit",
    author: { username: "shlok_mundhra" },
    createdAt: "2026-03-20T12:57:00Z",
    messageCount: 8,
    diffStats: { added: 25, removed: 9, modified: 9 },
    repository: "tanagram/monorepo:feat/suggested-policy-has-TQL",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      'check what changes were done in commit f28763e96 There was a change from [".*"] to ["."] in normal evaluations which needs to be resolved',
  },
  {
    id: "t5",
    title: "Fix rewritten_intent field type mapping",
    author: { username: "shlok_mundhra" },
    createdAt: "2026-03-20T12:57:00Z",
    messageCount: 7,
    diffStats: { added: 46, removed: 63, modified: 20 },
    repository: "tanagram/monorepo:feat/suggested-policy-has-TQL",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      "We will be fixing some issues in this branch If the issue i give you is false just tell me why or esle fix it github-app/src/database/models/su...",
  },
  {
    id: "t6",
    title: "FastAPI reload breaks Inngest registration",
    author: { username: "jondesr" },
    createdAt: "2026-03-20T12:27:00Z",
    messageCount: 3,
    diffStats: { added: 17, removed: 1, modified: 1 },
    repository: "tanagram/monorepo:main",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      "We have a problem in which FastAPI in dev mode notices code changes and reloads - but the new server fails to register with Inngest",
  },
  {
    id: "t7",
    title: "Verify observability in suggestions block",
    author: { username: "shlok_mundhra" },
    createdAt: "2026-03-20T11:57:00Z",
    messageCount: 1,
    diffStats: { added: 0, removed: 0, modified: 0 },
    repository: "tanagram/monorepo:suggestions/observability",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      "do a git diff main to understand exactly what has been done VErify that complete observality has been added to the suggestions block fo...",
  },
  {
    id: "t8",
    title: "Block FastAPI startup until Inngest connects",
    author: { username: "jondesr" },
    createdAt: "2026-03-20T10:57:00Z",
    messageCount: 2,
    diffStats: { added: 5, removed: 7, modified: 5 },
    repository: "tanagram/monorepo:main",
    threadType: "github-app",
    stars: 0,
    openingPrompt:
      "Update the VSCode launch config for FastAPI to use FastAPI dev mode instead of current uvicorn with reload",
  },
];
