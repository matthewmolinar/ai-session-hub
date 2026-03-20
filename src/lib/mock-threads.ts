import type { Turn, SessionComment } from "./mock-data";

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
  likes: number;
  comments: SessionComment[];
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
    likes: 3,
    comments: [
      { id: "tc1", author: "jondesr", content: "Great summary — the CLI status change is exactly what I was looking for.", timeAgo: "1h" },
    ],
    openingPrompt:
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
    likes: 5,
    comments: [
      { id: "tc2", author: "shlok_mundhra", content: "Good catch on the return_exceptions=True pattern. We should audit other orchestrators for the same issue.", timeAgo: "30m" },
      { id: "tc3", author: "shivansh_jagga", content: "The PR looks clean. +1 on merging.", timeAgo: "20m" },
    ],
    openingPrompt:
    transcript: [
      {
        id: 1,
        role: "user",
        content:
          "Review PR#2293 that fixes Sentry issue 7330976344. Why was the exception that was created by this issue not failing the entire Inngest function for check run orchestrator?",
        timestamp: "13:07",
        intentSummary: "Investigate exception handling in check-run orchestrator",
        usage: { inputTokens: 48, outputTokens: 0, cost: 0.0002 },
      },
      {
        id: 2,
        role: "assistant",
        content:
          "I inspected PR #2293 and traced the check-run orchestrator flow. Here's what I found:\n\n**Why the exception didn't fail the Inngest function:**\n\n`process_check_run_orchestrator` runs PR processing with `asyncio.gather(..., return_exceptions=True)`, then logs exceptions instead of re-raising. After logging, the orchestrator unconditionally completes the check run as success, so Inngest sees the function as successful and does not trigger `on_failure`.\n\nSentry confirms the error was handled (`handled: yes`, mechanism: `logging`), matching the `logger.error(..., exc_info=...)` path.\n\n**Root cause of this specific issue:**\n\n1. Suggested policy violations carried IDs like `sup_...`\n2. Comment upsert called prior-count lookup in `process_pr.py`, which called `PolicyExecution.get_total_violations_count_by_policy_ids`\n3. That method parses every ID as a regular Policy external ID, which failed on `sup_...`, raising `InvalidExternalIDError`\n4. The exception bubbled out of `_process_single_pr`, but was absorbed by `gather(..., return_exceptions=True)`\n\n**PR #2293 fix:** Excludes suggested-policy violations from prior-count lookup via `_should_include_in_prior_count_lookup`, preventing `sup_...` IDs from reaching `Policy.parse_id_to_uuid`. Also fixes regex from `\".\"` to `\".*\"` for matching all changed lines.",
        timestamp: "13:09",
        intentSummary: "Exception swallowed by gather(return_exceptions=True)",
        usage: { inputTokens: 8200, outputTokens: 5400, cost: 0.082 },
        diff: [
          {
            filename: "github-app/src/inngest/functions/check_run/process_pr.py",
            lines: [
              { type: "add", content: "SUGGESTED_POLICY_SOURCE_TYPE = \"suggested_policy\"" },
              { type: "add", content: "" },
              { type: "context", content: "def _policy_ids_for_prior_count_lookup(" },
              { type: "context", content: "  violations_with_policy_ids: list[ViolationWithPolicyId]," },
              { type: "context", content: ") -> list[str]:" },
              { type: "remove", content: "  return sorted({result.policy_id for result in violations_with_policy_ids if result.policy_id})" },
              { type: "add", content: "  policy_ids: set[str] = set()" },
              { type: "add", content: "  for violation_with_policy_id in violations_with_policy_ids:" },
              { type: "add", content: "    if _should_include_in_prior_count_lookup(violation_with_policy_id):" },
              { type: "add", content: "      policy_ids.add(violation_with_policy_id.policy_id)" },
              { type: "add", content: "  return sorted(policy_ids)" },
            ],
          },
        ],
      },
      {
        id: 3,
        role: "user",
        content: "I changed the code. Will exceptions bubble up now?",
        timestamp: "13:15",
        intentSummary: "Verify exception propagation after edit",
        usage: { inputTokens: 22, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 4,
        role: "assistant",
        content:
          "Yes. With your current change, exceptions from `_process_single_pr` will now bubble up to `process_check_run_orchestrator`.\n\nYou removed `return_exceptions=True` from `gather`, so `asyncio.gather` uses default behavior: the first raised exception propagates to the caller. You also removed the post-processing block that logged and swallowed per-PR exceptions, so there is no longer a catch-and-continue path.\n\n**Net effect:** a PR-processing exception should fail the orchestrator run and allow Inngest failure handling (`on_failure`) to run.",
        timestamp: "13:16",
        intentSummary: "Confirmed exceptions now propagate",
        usage: { inputTokens: 4800, outputTokens: 2200, cost: 0.042 },
        diff: [
          {
            filename: "github-app/src/inngest/functions/check_run/orchestrator.py",
            lines: [
              { type: "context", content: "    pr_results_list = await gather(*[" },
              { type: "context", content: "      _process_single_pr(" },
              { type: "context", content: "        pull_request=pr," },
              { type: "remove", content: "      ]," },
              { type: "remove", content: "      return_exceptions=True," },
              { type: "add", content: "      ]" },
              { type: "context", content: "    )" },
              { type: "remove", content: "    # Filter out exceptions and flatten results from all PRs" },
              { type: "remove", content: "    # Log exceptions but don't fail the entire batch if one PR fails" },
              { type: "remove", content: "    results = []" },
              { type: "remove", content: "    for i, pr_result in enumerate(pr_results_list):" },
              { type: "remove", content: "      if isinstance(pr_result, Exception):" },
              { type: "remove", content: "        pr_number = webhook.check_run.pull_requests[i].number" },
              { type: "remove", content: "        logger.error(f\"Failed to process PR #{pr_number}: {pr_result}\", exc_info=pr_result)" },
              { type: "remove", content: "      elif isinstance(pr_result, list):" },
              { type: "remove", content: "        results.extend(pr_result)" },
            ],
          },
        ],
      },
      {
        id: 5,
        role: "user",
        content: "Create a PR",
        timestamp: "13:20",
        intentSummary: "Create GitHub PR",
        usage: { inputTokens: 8, outputTokens: 0, cost: 0.0001 },
      },
      {
        id: 6,
        role: "assistant",
        content:
          "PR created: [#2295 — Bubble check-run PR processing exceptions](https://github.com/tanagram/monorepo/pull/2295)\n\nIncluded in the PR:\n\n`src/inngest/functions/check_run/orchestrator.py` now lets `_process_single_pr` exceptions propagate by removing `return_exceptions=True` handling and the swallow/log-only block.\n\nValidation:\n- `ruff format` ✓\n- `ruff check` ✓\n- `pytest tests/inngest/test_parallel_pr_processing.py` — 5 passed",
        timestamp: "13:22",
        intentSummary: "PR #2295 created",
        usage: { inputTokens: 3200, outputTokens: 1800, cost: 0.032 },
      },
    ],
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
    likes: 2,
    comments: [],
    openingPrompt:
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
    likes: 1,
    comments: [
      { id: "tc4", author: "jondesr", content: "The regex fix from \".\" to \".*\" should also be applied in test_policy_builder.", timeAgo: "2h" },
    ],
    openingPrompt:
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
    likes: 0,
    comments: [],
    openingPrompt:
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
    likes: 4,
    comments: [
      { id: "tc5", author: "feifanz", content: "Is this related to the health check timeout we saw yesterday?", timeAgo: "3h" },
    ],
    openingPrompt:
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
    likes: 0,
    comments: [],
    openingPrompt:
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
