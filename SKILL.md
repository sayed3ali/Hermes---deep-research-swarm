---
name: deep-research-swarm
type: standard
description: >
  Multi-agent deep research mainly designed for Academic research. Use this skill
  whenever comprehensive, multi-dimensional, evidence-backed investigation is
  required: competitive intelligence, market analysis, controversy investigation,
  policy evaluation, academic landscape review, risk assessment, file-based
  analysis, or any task demanding cross-verified, multi-source findings. Covers
  wide search, focused search, file-only research, and file-augmented research.
  Do NOT use for simple factual lookup or single-source Q&A.
version: 1.1.2
author: Sayed Ali
license: MIT
metadata:
  hermes:
    tags: [research, multi-agent, deep-research, swarm, orchestration]
    related_skills: [arxiv, blogwatcher, llm-wiki]
    references:
      - references/testing-and-validation.md
      - references/quality-gate.md
      - references/subagent-pitfalls.md
      - references/free-academic-sources.md
      - references/academic-narrative-structure.md
      - references/cite-them-right-harvard.md
      - templates/pptx-pure-minimal.js
      - templates/docx-academic-template.py
---

# Deep Research

Orchestrate multi-agent epistemic triangulation: diverge across research dimensions, detect overlaps and contradictions, verify deeply, then converge into a validated synthesis. Swarm parallelism serves epistemic robustness — not merely speed.

**Adaptive routing** ensures the pipeline fits the task: wide-search topics get a two-stage parallel swarm (breadth then depth); file-based tasks skip or augment external search; focused queries go straight to dimension decomposition.

Connected Hermes skills used in this workflow are documented in the `references/` folder of this skill directory. After editing this skill, run `scripts/verify-skill-structure.py` to catch common structural regressions before running an expensive end-to-end swarm test.

## Report Structure Flexibility (User Override)

The default report structure is the academic narrative (Executive Summary → Knowledge Development → Comprehensive Analysis → Practical Implications → References). However, **the user may request a different structure** — and when they do, their instructions take precedence over the default.

**Rule**: If the user explicitly provides a report structure (e.g., "Use these sections...", "Follow this outline...", "I want the report organized as..."), honor their structure exactly. Load their structure into the sub-agent context and generate the report accordingly. Only fall back to the default academic narrative structure when the user does not specify a structure.

**Implementation**:
1. Check the user's request for explicit structure instructions
2. If found, extract the structure and pass it to the DOCX sub-agent in the `context` field
3. If not found, use the default academic narrative structure from `references/academic-narrative-structure.md`

**Examples of user override**:
- "Use an executive summary, SWOT analysis, and recommendations"
- "Follow this outline: 1. Background, 2. Methodology, 3. Results, 4. Discussion"
- "I need a policy brief format: Problem, Options, Recommendation, Implementation"

**The sub-agent MUST**:
- Use the user-specified section headings
- Maintain narrative paragraph style (3-8 sentences, transitions, integrated evidence)
- Apply the academic template styling (fonts, colors, margins)
- Use Cite Them Right Harvard references

---

## Output Directory — MANDATORY

**All deep research output files MUST be saved under:**

```
{workspace}/research/
```

`{workspace}` defaults to `C:\Users\User\hermes\` (create sub-folders there as needed). All research artifacts — dimension files, cross-verification, insights, and final reports — must be saved under this directory or its subdirectories. Never use the system temp directory or arbitrary paths. On Windows, the file tool accepts both `C:\Users\...` and `/c/Users/...` forms; use whichever is native to the tool you are calling. Sub-agent file paths MUST use the exact absolute path you pass to them.

This is non-negotiable. Every file produced in any phase MUST use this directory as the base path. Do NOT save any research artifact to `{workspace}/` directly — always use the `{workspace}/research/` subdirectory.

Before writing any file, ensure the directory exists (create it if not).

## Concurrency Policy

Respect the runtime's concurrency limit — typically only a handful of sub-agents
run at once (Hermes defaults to 3, set by `delegation.max_concurrent_children`).
The per-facet / per-dimension counts in this skill (e.g.
"one sub-agent per dimension") are **coverage targets, not simultaneity
requirements**. When a phase calls for more sub-agents than the limit, **dispatch
them in rounds**: fill the limit, wait for that batch to finish, then dispatch
the next. Do not assume unlimited parallelism, and do not inflate the search
budget beyond what the rounds can realistically complete.

### Streaming Dispatch (v1.1.0+)

To minimize idle time, use **smaller batch sizes** (1-2 agents instead of maxing at 3):

- **Batch size = 2**: When 1 agent completes, the next pending agent starts immediately. The slowest agent in a batch of 2 blocks less total time than the slowest in a batch of 3.
- **Batch size = 1**: Sequential dispatch with zero idle time. Use when dimensions have highly variable completion times (some take 2 min, others 8 min).
- **Batch size = 3**: Maximum parallelism. Use only when all dimensions have similar scope and expected completion times.

**Priority ordering**: Dispatch foundational dimensions first (those other dimensions depend on), then broad-scope dimensions (likely to take longest), then narrow/focused dimensions last.

**Trade-off matrix**:

| Batch Size | Parallelism | Idle Time | Best For |
|---|---|---|---|
| 1 | Low | None | Variable completion times, <5 dimensions |
| 2 | Medium | Low | Mixed scopes, 5-10 dimensions |
| 3 | High | High | Similar scopes, 10+ dimensions |

The orchestrator should adapt batch size based on observed completion times from the first 1-2 batches.

## Hermes Subagent Dispatch

Hermes spawns child agents with the built-in `delegate_task` tool. Each child runs
in an isolated context with its own terminal session and a restricted toolset.

- **Role**: pass `role="leaf"` (the default) for every research worker — wide
  exploration, dimension deep dives, file analysis, and targeted validation. Leaf
  agents are focused workers that cannot delegate further. Use
  `role="orchestrator"` only when you deliberately want a child that can spawn its
  own sub-workers (rarely needed — the main agent already orchestrates). Note:
  Hermes roles control delegation depth, not task semantics. There is no "explore"
  vs "plan" agent type, so each child's job is defined entirely by its `goal` and
  `context`.
- **Prompt**: put the self-contained mission in `goal`, and the supporting
  background — route, relevant excerpts, allowed/disallowed sources, output format,
  and the exact output file path — in `context`. Children start with **zero
  knowledge of the parent's conversation** and inherit no context, so every file
  path, excerpt, and instruction the child needs MUST be passed explicitly in
  `goal` / `context`. For file-only routes, include the actual excerpts the
  dimension requires.
- **Toolsets**: grant `toolsets=["web", "file"]` for search-based routes — the
  child needs `web` to search and `file` to write its output under
  `{workspace}/research/`. For **Route C (file-only)**, grant `toolsets=["file"]`
  and omit `web`; this enforces the no-external-search rule at the tool level. Add
  `terminal` only if the child must run commands.
- **Parallelism via batch mode**: dispatch multiple dimensions in a single call
  using the `tasks` array — each element is a task object with its own `goal`,
  `context`, `toolsets`, and `role`. Hermes runs up to `max_concurrent_children`
  (default 3) tasks in parallel; a batch larger than the limit returns a tool error
  rather than truncating, so size each batch to the limit.
- **Execution is synchronous**: `delegate_task` blocks the parent turn until all
  children finish — there is no background mode. "Dispatch in rounds" therefore
  means successive `delegate_task` batch calls: send one batch (within the
  concurrency limit), wait for it to return, then send the next. Do not
  fire-and-forget.

Single-task example:

```python
delegate_task(
    goal="Research dimension 03 (regulatory landscape): cover current state, key evidence, and counter-arguments with inline [^id] citations, then save findings to C:\\Users\\User\\hermes\
esearch\\{topic}_dim03.md.",
    context="Route B focused search. Phase 1 landscape summary: <...>. Allowed sources: government sites, academic journals (prioritize free OA: CORE, OpenAlex, arXiv, PubMed Central, DOAJ), official filings, major media. Output format: evidence template (Claim / Source / URL / Date / Excerpt / Context / Confidence).",
    toolsets=["web", "file"],
    role="leaf",
)
```

Batch (parallel) example — one round, sized to the concurrency limit:

```python
delegate_task(tasks=[
    {"goal": "Research dimension 01 ... save to C:\\Users\\User\\hermes\
esearch\\{topic}_dim01.md", "context": "<...>", "toolsets": ["web", "file"], "role": "leaf"},
    {"goal": "Research dimension 02 ... save to C:\\Users\\User\\hermes\
esearch\\{topic}_dim02.md", "context": "<...>", "toolsets": ["web", "file"], "role": "leaf"},
    {"goal": "Research dimension 03 ... save to C:\\Users\\User\\hermes\
esearch\\{topic}_dim03.md", "context": "<...>", "toolsets": ["web", "file"], "role": "leaf"},
])
```

## Workflow Overview

```
User Query
  │
  ▼
Phase 0: Intent & Input Router
  │
  ├─ Route A: Wide Search (broad/exploratory, no clear dimensions)
  │   → Phase 1 (Quick Landscape)
  │     → Phase 1W (Multi-Agent Wide Exploration) ★ NEW
  │       → Phase 2 (Decompose, informed by rich landscape)
  │         → Phase 3 (Parallel Deep Dive)
  │           → Phase 4 (Cross-Verify) → Phase 5 (if conflicts)
  │             → Phase 6 (Insight Extraction) → Phase 7 (Report via writing skill)
  │
  ├─ Route B: Focused Search (specific question, clear dimensions)
  │   → Phase 1 (Landscape) → Phase 2 (Decompose)
  │     → Phase 3 (Parallel Deep Dive) → Phase 4 (Cross-Verify)
  │       → Phase 5 (if conflicts) → Phase 6 (Insight Extraction) → Phase 7 (Report)
  │
  ├─ Route C: File-Only Research (user explicitly restricts to file content)
  │   → Phase F (File Intake & Deep Analysis) ★ NEW
  │     → Phase 2 (Decompose from file themes)
  │       → Phase 3-F (Multi-Agent File Deep Dive, NO external search)
  │         → Phase 4 (Cross-Verify across file analyses)
  │           → Phase 6 (Insight Extraction) → Phase 7 (Report via writing skill)
  │
  └─ Route D: File-Augmented Research (files as primary reference + external supplement)
      → Phase F (File Intake & Deep Analysis) ★ NEW
        → Phase 1 (Targeted Landscape, informed by file gaps)
          → Phase 2 (Decompose, merging file themes + external landscape)
            → Phase 3 (Parallel Deep Dive, each agent has file context + search)
              → Phase 4 (Cross-Verify) → Phase 5 (if conflicts)
                → Phase 6 (Insight Extraction) → Phase 7 (Report via writing skill)
```

## Phase 0: Intent & Input Router

**Goal**: Classify the user's request into the correct route before any research begins.

**Process**:

1. Check for uploaded files:
   - Files present + explicit "only based on files" language → **Route C**
   - Files present + no restriction / "refer to" / "combine with" / "help me complete" → **Route D**
   - No files → continue to step 2

2. Assess topic breadth:
   - Broad, open-ended, landscape-level query (e.g., "current state of XX industry", "research XX field for me", "XX vs YY vs ZZ comprehensive comparison") → **Route A**
   - Specific, bounded question with identifiable dimensions → **Route B**

3. When ambiguous, default to:
   - **Route A** if the topic is clearly multi-faceted and no clear angle is given
   - **Route D** over Route C if file intent is unclear (prefer richer output)

**Output**: State the selected route and rationale in one sentence, then proceed to the first phase of that route.

**Classification signals summary**:

| Signal | Route |
|--------|-------|
| Files + "based on files only" / "only from uploaded" / "no search" | C |
| Files + "refer to" / "combine with" / "help me complete" / no restriction | D |
| No files + broad/exploratory topic | A |
| No files + specific/bounded question | B |

## Epistemic Reset Rule

Before any analysis or narrative generation, the system MUST:
- Assume internal knowledge may be outdated or incomplete. Always retrieve the current date and time using the `terminal` tool (e.g., `date`) before any analysis or external search.
- **Time-awareness**: When the user's query has time-sensitivity requirements (e.g., "2026 Q1", "recent 6 months", "latest", "current"), treat the specified or implied time range as a hard constraint — search queries must target that window, and findings outside it should be flagged.
- Perform external wide search to establish the evidence landscape (except Route C)
- Avoid generating any factual claims before search/file-analysis outputs
- **Search language rule**: All search queries MUST be in the same language as the user's message. If the user writes in Chinese, search in Chinese; if in English, search in English. This ensures results are relevant to the user's locale and context.
- All outputs MUST cite original sources with standard Markdown footnotes: a `[^id]` marker in the text and a `[^id]: Title. Date. URL` definition at the end of the file. Build each footnote from the search result's Title / URL / Date; pick a short stable `id` and reuse it for the same URL.

---

## Phase F: File Intake & Deep Analysis (Route C & D Only)

**Goal**: Extract structured knowledge from all uploaded files, build an evidence map, and identify themes, claims, contradictions, and gaps across the file corpus.

**Trigger**: Route C or Route D (any request with user-uploaded files).

**Process**:

1. **File Inventory**: List all uploaded files with type, size, and a one-line content summary.

2. **Per-File Extraction** — for each file, extract:
   - Core themes and topics
   - Key claims, arguments, and conclusions
   - Data points, statistics, and figures (with page/section references)
   - Methodology (if applicable)
   - Limitations, caveats, or biases noted by the author

3. **Cross-File Mapping**:
   - Identify overlapping themes across files
   - Detect contradictions or conflicting data between files
   - Map complementary information (File A provides context that File B lacks)
   - Identify **gaps** — important aspects of the topic that no file covers

4. **Theme Consolidation**: Produce a consolidated theme list that will feed into Phase 2 dimension decomposition.

**Route-specific behavior**:
- **Route C**: The gap analysis is informational only (noted in output, but no external search will fill gaps). The consolidated themes become the sole basis for Phase 2.
- **Route D**: The gap analysis directly informs Phase 1's search strategy — Phase 1 targets these gaps with external search.

**Output**: Save to **`{workspace}/research/{topic}_file_analysis.md`** containing:
- File inventory table
- Per-file extraction summaries
- Cross-file mapping (overlaps, contradictions, complementarities)
- Gap analysis
- Consolidated theme list

---

## Phase 1: Landscape Scan (Route A, B, D)

**Goal**: Establish an evidence-grounded global narrative landscape through coarse-to-fine exploration before committing to dimension decomposition.

This phase operates under External-Evidence-First Mode. No analytical narrative may be generated before search outputs are reviewed. Every key finding must include `[^id]` citation inline.

**Route-specific behavior**:
- **Route A (Wide Search)**: Lighter scan — 3–5 searches for macro framing only. The heavy lifting is delegated to Phase 1W.
- **Route B (Focused)**: Full 5-search coarse-to-fine scan as below.
- **Route D (File-Augmented)**: Targeted scan — use file gap analysis from Phase F to guide search queries. Focus on areas the files don't cover. 3–5 searches.

**Process** (full version for Route B; Route A/D adapt per above):

1. Perform 5 broad exploratory searches by yourself. Search MUST follow a coarse-to-fine progression. Don't search details at beginning.
   * Level 1 – Macro Overview (Searches 1-2): Broad overview queries, Industry reports, High-level statistics, Wikipedia-level but verified via authoritative sources, General summaries
   * Level 2 – Structural Mapping (Searches 3-4): Market structure, Major actors, Regulatory bodies
   * Level 3 – Emerging Issues & Tensions (Search 5): Recent developments, Conflicting narratives, Trend signals
2. After EACH search, output:
   - Key findings (concise)
   - Dominant narratives identified
   - Controversies or conflicting claims detected
   - Key actors and authoritative sources discovered
   - Gaps requiring deeper investigation
3. Revise dimension decomposition if landscape reveals unexpected structure

---

## Phase 1W: Multi-Agent Wide Exploration (Route A Only)

**Goal**: Maximize search breadth through parallel sub-agent exploration before committing to dimensions. This is the key differentiator for wide-search scenarios — the orchestrator cannot achieve sufficient breadth alone.

**Trigger**: Route A only. Executes after Phase 1 (Quick Landscape).

**Process**:

1. Based on Phase 1's macro framing, identify **5–8 broad exploration facets**. Facets should be:
   - Mutually complementary (together they cover the full problem space)
   - Partially overlapping (≥20% overlap for cross-verification)
   - Examples of facet types: technology landscape, market/commercial landscape, regulatory/policy landscape, competitive dynamics, user/consumer perspective, supply chain, geographic variations, historical evolution, emerging disruptions

2. **Deploy one sub-agent per facet (≈5–8 total), using streaming dispatch.** Use batch size of 2 (not 3) for faster turnaround — when 1 of 2 agents completes, the next facet starts immediately without waiting for the slower agent. Each sub-agent's prompt MUST include:
   - **(1) Facet scope**: what broad area to explore, with explicit boundaries
   - **(2) Phase 1 context**: key findings from the quick landscape scan
   - **(3) Search requirements**: ≥10 independent searches per agent, coarse-to-fine within the facet
   - **(4) Output format**: structured findings (see below)
   - **(5) Output file path**: `{workspace}/research/{topic}_wide{NN}.md`

3. Each wide-exploration sub-agent MUST:
   - Perform **≥10 independent searches** with varied queries (no keyword recycling)
   - Cast a wide net: different source types, different angles within the facet
   - Identify key players, data points, trends, and controversies within their facet
   - Flag areas that warrant deep investigation in Phase 3
   - **Save output to `{workspace}/research/{topic}_wide{NN}.md`**

**Sub-Agent Output Format** (all citations use `[^id]`):

```
## Facet: [facet name]

### Key Findings
- [finding with inline citation]

### Major Players & Sources
- [entity]: [role/relevance]

### Trends & Signals
- [trend with citation]

### Controversies & Conflicting Claims
- [conflict description with citations to both sides]

### Recommended Deep-Dive Areas
- [area]: [why it warrants depth]
```

4. **Orchestrator Synthesis**: After all wide-exploration agents complete:
   - Read all `{topic}_wide{NN}.md` files
   - Merge findings into a unified landscape map
   - Identify the most promising and contentious areas
   - Feed this rich landscape into Phase 2 for dimension decomposition

**Output**: Each sub-agent saves to `{workspace}/research/{topic}_wide{NN}.md`. Orchestrator uses these to inform Phase 2.

**Key principle**: Phase 1W is about **breadth** — finding what exists, who matters, what's happening. Phase 3 is about **depth** — investigating each dimension thoroughly. The two-stage swarm ensures nothing important is missed.

**Progress reporting** (report after each round completes):
```
Phase 1W progress: Batch N/M complete. X/Y facets finished.
Key findings so far: [2-3 sentence summary of most important discoveries]
```

---

## Phase 2: Dimension Decomposition

**Goal**: Finalize research dimensions and prepare sub-agent assignments.

**Input varies by route**:
- **Route A**: Phase 1 + Phase 1W wide exploration outputs (richest input)
- **Route B**: Phase 1 landscape scan
- **Route C**: Phase F file analysis — consolidated theme list only (no external input)
- **Route D**: Phase F file analysis + Phase 1 targeted landscape scan

**Rules**:
- **≥10 dimensions (mandatory minimum)**. More is better — 10–20 dimensions depending on topic complexity
- **User override on dimension count**: If the user explicitly specifies a dimension count (e.g., "just 2 dimensions", "3 angles max"), use that exact count. The minimum is a default, not an inviolable rule when the user states a preference.
- **User override on output length**: If the user specifies a length target (e.g., "500 words", "brief", "2-page summary"), scale the dimension count down proportionally — brief targets (≤1000 words) → 2–3 dimensions; medium targets (1000–3000 words) → 5–7 dimensions; comprehensive → 10+ dimensions. The final report must respect the user's length target. Condense aggressively if synthesized content exceeds the cap.
- Each dimension approaches the topic from a **distinct angle or scenario**, ensuring the research covers the problem space from fundamentally different perspectives
- Dimensions may be organized by:
  - **Analytical angle** (technical, economic, regulatory, ethical, competitive, user-facing, supply-chain, etc.)
  - **Scenario** (optimistic, pessimistic, status quo, disruption, black swan, etc.)
  - **Stakeholder viewpoint** (consumer, enterprise, regulator, investor, competitor, workforce, etc.)
  - **Geography or market segment** (China, US, EU, emerging markets, etc.)
  - **Time horizon** (historical origins, current state, 1-year outlook, 5-year outlook, etc.)
  - **File-derived theme** (Route C/D: dimensions can map to major themes identified in Phase F)
  - Or any combination — the goal is maximum coverage with deliberate partial overlap
- ≥30% conceptual overlap between related dimensions — overlap creates cross-verification pressure
- Each dimension MUST cover:
  1. **Current state** — what is happening now from this angle, always with inline `[^id]` citations
  2. **Key evidence** — data, sources, and concrete examples using `[^id]`
  3. **Tensions and counter-arguments** — what opposing views exist from this angle, all claims referenced via `[^id]`

**Route C special rule**: For file-only research, dimensions are derived entirely from file themes. Each dimension should map to one or more files, and the scope should reference specific file sections.

Output: a numbered dimension list (≥10 items) with clear scope, assigned angle/scenario, and expected source types for each.

## Phase 3: Parallel Deep Dive (Sub-Agent Deployment)

**Goal**: Execute depth-first research across all dimensions, one sub-agent per dimension, **dispatched in rounds up to the concurrency limit** (the dimension count is a coverage target, not a simultaneous-launch requirement).

**Route-specific variants**:

### Standard Mode (Route A, B, D) — Streaming Dispatch

**Goal**: Minimize idle time by replacing completed agents immediately rather than waiting for entire batches.

**Hermes constraint**: `delegate_task` is synchronous — it blocks until ALL children in a batch finish. True streaming requires multiple sequential calls. The practical optimization is:

1. **Use smaller batch sizes** (1-2 agents per batch instead of maxing at 3) so completions return faster and new agents start sooner
2. **Dispatch highest-priority dimensions first** (dimensions that other dimensions depend on, or dimensions covering the most critical topic areas)
3. **Poll for early completions** between batch dispatches by checking if output files exist

**Dispatch algorithm**:
```python
# Streaming dispatch pseudocode
dimensions = [dim01, dim02, ..., dimN]  # ordered by priority
batch_size = min(2, max_concurrent_children)  # smaller = faster turnaround
completed = []
in_progress = []

while dimensions or in_progress:
    # Fill slots with next pending dimensions
    while len(in_progress) < batch_size and dimensions:
        next_dim = dimensions.pop(0)
        dispatch_single(next_dim)  # one agent per call for max flexibility
        in_progress.append(next_dim)
    
    # Wait for ONE agent to complete (not the whole batch)
    # In practice: call delegate_task with 1 agent, it returns when that agent finishes
    finished = wait_for_any(in_progress)
    in_progress.remove(finished)
    completed.append(finished)
    
    # Report progress immediately
    report(f"Phase 3: {len(completed)}/{total} complete. {len(in_progress)} in progress.")
```

**Practical implementation for Hermes**:
Since `delegate_task` with `tasks=[...]` waits for ALL tasks, use **single-task dispatch** for streaming:

```python
# Instead of batching 3 and waiting for all 3:
delegate_task(tasks=[dim01, dim02, dim03])  # waits for slowest

# Use sequential single dispatches for faster turnaround:
for dim in priority_order:
    delegate_task(goal=dim.goal, context=dim.context, toolsets=["web","file"], role="leaf")
    # This returns as soon as THIS agent finishes
    report(f"Dimension {dim.id} complete. Starting next...")
```

**Trade-off**: Single dispatch = less parallelism (only 1 agent at a time). Batch dispatch = more parallelism but waiting for slowest. **Recommended hybrid**:

```python
# Hybrid: 2-agent batches for parallelism + faster turnaround
batch_size = 2
for i in range(0, len(dimensions), batch_size):
    batch = dimensions[i:i+batch_size]
    delegate_task(tasks=batch)  # dispatch 2, wait for both
    report(f"Batch {i//batch_size + 1} complete: {batch}")
```

**Priority ordering** (dispatch these first):
1. Dimensions covering foundational topics (market size, technology baseline)
2. Dimensions that other dimensions reference or depend on
3. Dimensions with the broadest scope (likely to take longest)
4. Save narrow/focused dimensions for last (they complete faster)

**Progress reporting after each batch**:
```
Phase 3 progress: Batch N complete. X/Y dimensions finished (Z% complete).
Active agents: [list]. Pending: [list].
Estimated time remaining: [estimate based on average batch duration × remaining batches]
```

**Each sub-agent investigates from its assigned angle/scenario**, producing findings that are distinct from but partially overlapping with other agents.

**Each sub-agent's prompt** (the `goal` and `context` passed to `delegate_task`) MUST include:
   - **(1) Mission**: the dimension's scope, required angles (current state, key evidence, tensions/counter-arguments, and stakeholders), and depth expectations
   - **(2) Context**: key findings from earlier phases relevant to this dimension
   - **(3) File context (Route D only)**: relevant excerpts from Phase F file analysis — the sub-agent should treat file content as primary evidence and search for supplementary/corroborating external sources
   - **(4) Output format**: the evidence template below; citations MUST use inline `[^id]` markers plus matching `[^id]: Title. Date. URL` footnote definitions at the end of the file
   - **(5) Output file path**: the sub-agent MUST save to `{workspace}/research/{topic}_dim{NN}.md`

**Sub-Agent Requirements** (Standard Mode):
- Perform **≥20 independent searches** (no repeated keyword cycles)
- **Search budget scaling**: If the user explicitly requested a reduced scope (e.g., "quick", "brief", "just N dimensions", "500 words"), scale the search budget proportionally — minimum 5 searches per dimension for quick/short requests, up to the full ≥20 for comprehensive requests. Never exceed the user's stated scope.
- **Citation format**: Use inline `[^id]` markers in the text and include a matching `[^id]: Title. Date. URL` footnote definition at the end of the file. Reuse the same `id` when citing the same source again.
- Investigate primary sources where possible (government sites, academic journals, official filings, major media)
- **For academic topics: prioritize FREE open-access sources** — see `references/free-academic-sources.md` for the priority hierarchy (CORE, OpenAlex, Semantic Scholar, arXiv, PubMed Central, DOAJ, institutional repositories)
- Use search operators: `site:core.ac.uk`, `site:arxiv.org`, `site:pmc.ncbi.nlm.nih.gov`, `filetype:pdf site:.edu`
- Trace claims back to original publication
- Identify and document counter-arguments
- Avoid content farms, anonymous blogs, SEO aggregators
- **Route D**: Explicitly reference and build upon file-derived evidence. Search externally to fill gaps, verify file claims, and add depth. Clearly distinguish file-sourced vs. search-sourced evidence.
- **Save output to `{workspace}/research/{topic}_dim{NN}.md`**

### File-Only Mode (Route C)

1. Dispatch one Hermes `delegate_task` leaf agent per dimension with `toolsets=["file"]` (no `web`, which enforces the no-external-search rule), using batch mode — **dispatch in rounds up to the concurrency limit**
2. Each sub-agent analyzes its assigned dimension **using only the uploaded file content** — NO external search
3. Each sub-agent's prompt (the `goal` and `context` passed to `delegate_task`) MUST include:
   - **(1) Mission**: the dimension's scope, required angles (current state, key evidence, tensions/counter-arguments, and stakeholders), and depth expectations
   - **(2) Context**: key findings from earlier phases relevant to this dimension
   - **(3) Full file content or relevant excerpts**: provide the actual file content the agent needs (do not assume the sub-agent can access files independently)
   - **(4) Analysis requirements**: cross-reference between files, identify patterns, evaluate strength of evidence, note limitations
   - **(5) Output format**: the evidence template below (adapted — Source field references file name + section instead of URL); citations MUST use inline `[^id]` markers plus matching `[^id]: Title. Date. URL` footnote definitions at the end of the file (for file-only mode use `[^id]: File: {filename}, Section: {section}`)
   - **(6) Output file path**: `{workspace}/research/{topic}_dim{NN}.md`

**Sub-Agent Requirements** (File-Only Mode):
- Thoroughly analyze all provided file content relevant to the dimension
- Cross-reference claims and data across multiple files
- Evaluate evidence quality and identify potential biases
- Note where file evidence is thin or contradictory
- Identify implicit assumptions in the source material
- **Do NOT perform any external search**
- **Citation format**: Use inline `[^id]` markers in the text and include a matching `[^id]: File: {filename}, Section: {section}` footnote definition at the end of the file.
- **Save output to `{workspace}/research/{topic}_dim{NN}.md`**

### Sub-Agent Output Format (all modes)

All citations use `[^id]`:

```
Claim: [identified claim with inline citation]
Source: [source name / file name]
URL: [source URL / "File: {filename}, Section: {section}"]
Date: [publication date / "N/A" for files]
Excerpt: [verbatim raw excerpt — no paraphrasing]
Context: [surrounding context]
Confidence: [high / medium / low]
```

**Output**: Each sub-agent saves its output to **`{workspace}/research/{topic}_dim{NN}.md`**.

### Phase 3 Retry Logic (Automated)

After all batches complete, the orchestrator MUST verify each dimension output:

1. **Check file existence**: List `{workspace}/research/` and verify every expected `{topic}_dim{NN}.md` exists
2. **Check file size**: Each file must be > 1KB (empty files indicate failure)
3. **Check citation count**: Scan for `[^id]` markers — minimum 5 citations for standard scope, 2 for quick scope
4. **Check required sections**: File must contain "Current State", "Key Evidence", and "Tensions" sections

**Retry dispatch** (max 2 retries per failed dimension):
```python
# Pseudocode for retry logic
failed_dims = []
for dim in expected_dimensions:
    filepath = f"{workspace}/research/{topic}_dim{dim:02d}.md"
    if not file_exists(filepath) or file_size(filepath) < 1024:
        failed_dims.append(dim)
    elif count_citations(filepath) < min_citations:
        failed_dims.append(dim)

for dim in failed_dims:
    for attempt in range(1, 3):  # max 2 retries
        dispatch_retry(dim, attempt)
        wait_for_completion()
        if verify_output(dim):
            break  # success, stop retrying
        elif attempt == 2:
            log_permanent_failure(dim)  # log after max retries
```

**Retry prompt tightening**:
- Add explicit instruction: "Previous attempt failed to produce sufficient output. This retry MUST include: (a) ≥[N] searches, (b) ≥[N] citations, (c) all three required sections."
- Increase search budget by 50% for retry attempts
- Flag the dimension as "partial" in cross-verification if it still fails after 2 retries

**Progress reporting during retries**:
```
Phase 3 complete. X/Y dimensions successful.
Retrying Z failed dimensions (attempt 1/2)...
```

## Phase 4: Cross-Verification Engine (Orchestrator)

**Goal**: Compare all dimension outputs, classify confidence, surface contradictions, and **save the verification results to a file** for downstream use by report-writing.

**Process**:
1. List the `{workspace}/research/` directory or use the dimension plan from Phase 2 to identify all expected `{topic}_dim{NN}.md` files.
2. Read all `{workspace}/research/{topic}_dim{NN}.md` files. If any file is missing or empty, re-dispatch the corresponding sub-agent before proceeding.
3. Categorize every finding into one of four tiers:

| Tier | Criteria |
|------|----------|
| **High Confidence** | Confirmed by ≥2 agents from independent sources with consistent evidence |
| **Medium Confidence** | Confirmed by 1 agent from an authoritative source |
| **Low Confidence** | Weak sourcing, blog-level evidence, or single unverified claim |
| **Conflict Zone** | Statistical disagreement, interpretive divergence, temporal inconsistency between agents, or numerical discrepancy for the same metric (e.g., two agents report different figures for the same statistic) |

4. List all Conflict Zone items explicitly — contradictions are highlighted and analyzed, never suppressed. **Temporal conflicts are Conflict Zone**: if agents report data from different time periods for the same metric, flag this as a temporal inconsistency and record which time period each data point belongs to.
5. Determine if Phase 5 is needed (any Conflict Zone or critical Low Confidence items)
   - **Route C exception**: Phase 5 is skipped (no external search allowed). Conflicts are documented as-is and carried into Phase 6.
6. Inline citations `[^id]` must be preserved
7. Conflict Zone analysis must include `[^id]` references to all sources involved

**Output**: Save the complete cross-verification results (all tiers + conflict zone analysis) to **`{workspace}/research/{topic}_cross_verification.md`**. This file is critical — it carries confidence classifications that guide report-writing.

**Progress reporting** (report after cross-verification completes):
```
Phase 4 complete. Cross-verification results:
- High Confidence: X findings
- Medium Confidence: Y findings
- Low Confidence: Z findings
- Conflict Zone: W items
- Phase 5 validation needed: YES / NO
```

## Phase 5: Targeted Validation (Conditional)

**Goal**: Resolve conflicts and strengthen weak findings.

**Trigger**: Execute only if Phase 4 identified Conflict Zone or critical Low Confidence items. **NOT available for Route C** (file-only research cannot invoke external search).

All validation outputs must preserve inline `[^id]` citations.

**Process**:
1. For each unresolved item, deploy a focused sub-agent with:
   - The specific conflicting claims and their sources
   - Instructions to find independent evidence that resolves the disagreement
   - Minimum 3 additional searches per conflict

2. Repeat until each item is either:
   - **Resolved** — reclassified to High/Medium Confidence with new evidence
   - **Explicitly marked unresolved** — documented as a genuine disagreement in the field

3. **Update** `{workspace}/research/{topic}_cross_verification.md` with the resolution results.

## Phase 6: Insight Extraction

**Goal**: Identify non-obvious insights that do not explicitly appear in previous findings, but emerge from cross-dimension analysis.

**Definition of Insight**:
An insight is a higher-level inference derived from multiple validated findings. It must not repeat previously stated claims or evidence.

**Process**:

1. Review all validated findings from Phase 3–5 (and Phase F file analysis, if applicable).
2. Identify patterns that only become visible when comparing multiple dimensions.
3. Extract insights that reveal: structural relationships, hidden tensions, emerging trends, systemic risks, strategic opportunities.
4. Ensure each insight is supported indirectly by evidence from at least two dimensions.

**Route-specific emphasis**:
- **Route C/D (file-based)**: Prioritize insights that emerge from cross-file synthesis — patterns that no single file reveals on its own. For Route D, also highlight where external evidence strengthens, contradicts, or extends file-derived conclusions.
- **Route A (wide search)**: Prioritize insights that bridge different exploration facets — connections between areas that were explored independently.

**Genre-aware insight extraction**: Adjust emphasis based on the intended downstream writing format:
- **Report** (industry report, market analysis, consulting deliverable): prioritize actionable strategic insights, market opportunities, competitive dynamics, and forward-looking implications
- **Academic paper** (survey, empirical study, literature review): prioritize research gaps, methodological contradictions, theoretical tensions, and novel contribution angles that position against prior work
- When the target genre is unclear, produce insights in a neutral format covering both strategic and academic angles — the writing skill will adapt

**Output Requirements**:

For each insight, record:

- Insight: concise statement of the inferred pattern
- Derived From:
  - Dimension references (e.g., Dim 02, Dim 07)
  - Supporting evidence clusters (include file references for Route C/D)
- Rationale: explanation of how the insight emerges from the evidence
- Implications: potential impact or significance
- Confidence: high / medium / exploratory

**Output**: Save all insights to **`{workspace}/research/{topic}_insight.md`**. This file is the core synthesis of the entire deep research process and will be the primary input for the downstream writing skill.

**Rules**:

- Insights must not duplicate existing findings.
- Insights must be derived from cross-dimension comparison.
- Avoid speculative claims unsupported by evidence.
- **Minimum output**: at least 3 insights for small scopes (≤3 dimensions) and at least 5 insights for standard/deep scopes (≥10 dimensions). Scale proportionally for mid-sized scopes.
- Insights must include references to supporting evidence using inline citations `[^id]`

## Phase 7: Produce Final Output

**Goal**: Convert the validated research artifacts into the user's requested deliverable format by delegating to specialized output skills. Default format is **DOCX**; fall back to Markdown-only if conversion is not possible.

After cross-verification (and optional targeted validation) and insight extraction are complete:

### Phase 7A: Quality Gate (Automated)

Before producing output, run automated validation:

1. **File existence check**: Verify all required files exist under `{workspace}/research/`:
   - `{topic}_dim{NN}.md` — all dimension files
   - `{topic}_cross_verification.md` — confidence tiers and conflict analysis
   - `{topic}_insight.md` — cross-dimension insights
   - `{topic}_file_analysis.md` — (Route C/D only) file intake analysis
   - `{topic}_wide{NN}.md` — (Route A only) wide exploration outputs

2. **Citation format check**: Scan each dimension file for:
   - Inline `[^id]` markers in the text
   - Matching `[^id]: Title. Date. URL` footnote definitions at end of file
   - Minimum citation count: ≥5 per dimension for standard scope, ≥2 for quick scope
   - Flag files with zero citations as FAILED

3. **Content completeness check**:
   - Each dimension file must contain ≥3 sections (Current State, Key Evidence, Tensions)
   - Cross-verification file must have all four confidence tiers listed
   - Insight file must have ≥3 insights for standard scope

4. **Quality gate report**: Save results to `{workspace}/research/{topic}_quality_gate.md`:
   ```markdown
   ## Quality Gate Report
   - Dimensions checked: N
   - Passed: N | Failed: N | Warnings: N
   - Citation compliance: PASS / FAIL
   - Content completeness: PASS / FAIL
   - Failed files: [list]
   ```

5. **Auto-retry failed dimensions**: If any dimension file fails the quality gate, re-dispatch the sub-agent with tightened instructions (max 2 retries). Update the quality gate report after each retry.

### Phase 7B: Progress Report

Report status to user before final output production:

```
Research complete. Quality gate results:
- Dimensions: N checked, N passed, N failed (retried)
- Citations: N total across all dimensions
- Confidence: X High, Y Medium, Z Low, W Conflict
- Estimated output: [format] | [size estimate]
```

### Phase 7C: Delegate to Output Skill

Determine the target output format:
- **Default (no preference stated)**: `.docx` Word document
- **Slides/presentation**: `.pptx` via `pure-style-slides`
- **Spreadsheet / data table**: `.xlsx` via `Excel / XLSX`
- **Markdown only**: user explicitly requests raw research files with no conversion

**For DOCX output (default)**:
1. Compile a research brief from `{topic}_insight.md` and `{topic}_cross_verification.md`
2. Ensure `python-docx` is installed in the active Python environment (`pip install python-docx`)
3. Load the academic template: `templates/docx-academic-template.py` — this provides the document structure, color palette, font settings, and helper functions matching the academic style (Calibri, navy headings #1F3864, justified body text, 1.25 line spacing, 1" margins)
4. Convert `[^id]` inline citations to Cite Them Right Harvard format: `(Author, Year)` in text, full references in Reference List section
5. **Structure the report as an academic narrative** per `references/academic-narrative-structure.md` **UNLESS the user explicitly requested a different structure**:
   - **Executive Summary**: 2-3 substantial paragraphs capturing core question, findings, significance
   - **Knowledge Development**: Trace evolution of understanding, initial assumptions, turning points, confidence changes
   - **Comprehensive Analysis**: Primary findings as flowing narrative, patterns/trends, contradictions, evidence strength, limitations, integration across themes
   - **Practical Implications**: Applications, long-term developments, risks, implementation, future research, broader impacts
   - **References**: Cite Them Right Harvard, alphabetical, hanging indent
   - **Appendices** (if needed): Search strategy, source reliability, excluded sources, timeline
   - **If user provided custom structure**: Use their section headings and organization instead, while maintaining narrative paragraph style
6. **Narrative requirements**:
   - Every section must open with an orienting paragraph
   - Every finding must connect to at least one other finding
   - Use transitions between all sections and paragraphs
   - Integrate evidence into sentences (never list sources)
   - Minimum 3 sentences per paragraph, maximum 8
   - No bullet points in body text (except Appendix A)
   - No isolated facts without context
7. Dispatch a `delegate_task` leaf agent with `toolsets=["file", "terminal"]`:
   - `goal`: "Generate a DOCX report using the academic template. Read the research brief at [path] and produce a complete academic narrative with proper paragraphs, transitions, and integrated evidence."
   - `context`: Include the research brief content, narrative structure requirements (see `references/academic-narrative-structure.md` or user-specified structure if provided), formatting requirements (Title page with subtitle, Executive Summary as 2-3 paragraphs, Knowledge Development tracing understanding evolution, Comprehensive Analysis with flowing narrative, Practical Implications, Reference List with hanging indent 0.33" using Cite Them Right Harvard format), citation conversion rules (see `references/cite-them-right-harvard.md`), and output path `{workspace}/research/{topic}_report.docx`. CRITICAL: Content must be written as full paragraphs (3-8 sentences each) with context, data, and implications. Use transitions between every section and paragraph. Integrate evidence into sentences — never list sources. Connect every finding to at least one other finding. The report must read as a single coherent argument from start to finish. **If the user provided a custom report structure, use their sections and organization instead of the default academic narrative.**
   - The sub-agent loads `skill_view(name='word-docx')` and follows its guidance
8. The sub-agent produces the `.docx` using `python-docx` with the academic template
9. Verify the output file exists and is non-empty

**For PPTX output**:
1. Compile a research brief with: title, key findings, insights, data points, audience
2. Ensure `pptxgenjs` is installed (`npm install pptxgenjs` in the workspace)
3. Dispatch a `delegate_task` leaf agent with `toolsets=["file", "terminal", "web"]`:
   - `goal`: "Generate a PPTX presentation using the pure-style-slides skill. Read the research brief at [path] and produce a designer-quality presentation with charts."
   - `context`: Include the research brief, design system requirements (Pure Minimal, accent color, canvas 10"×5.625" via `LAYOUT_16x9`), required slide structure (Cover, Agenda, Intro, Body with charts, Insights, Closing), chart requirements (bar chart for comparisons, pie chart for market breakdown, line chart for trends — all using PptxGenJS native `addChart()`), and output path `{workspace}/research/{topic}_presentation.pptx`. CRITICAL: Include at least 2-3 chart slides (bar, pie, or line) with real data from the research. Place chart on left (55-60% width) with insight card on right (40-45%).
   - The sub-agent loads `skill_view(name='pure-style-slides')` and follows its guidance
4. The sub-agent produces the `.pptx` using PptxGenJS
5. Verify the output: use python-pptx to check for text overlaps and canvas overflows. Note: PptxGenJS v3+ uses `pres.layout = "LAYOUT_16x9"` instead of `defineSlideSize()`.

**For XLSX output**:
1. Compile structured data: evidence table, confidence tiers, conflict zones, source list
2. Dispatch a `delegate_task` leaf agent with `toolsets=["file"]`:
   - `goal`: "Generate an XLSX spreadsheet using the Excel / XLSX skill. Read the data at [path] and produce a formatted workbook."
   - `context`: Include the structured data, worksheet structure, and output path `{workspace}/research/{topic}_data.xlsx`
   - The sub-agent loads `skill_view(name='excel-xlsx')` and follows its guidance
3. Verify the output file exists

**For Markdown-only output**: The research artifacts themselves are the deliverable. Confirm the file paths to the user.

### Phase 7D: Final Verification

After output production:
1. Verify the output file exists and size > 1KB
2. For PPTX: run overlap/overflow check via python-pptx
3. For DOCX: verify it opens without errors (optional)
4. Report final delivery path to user

**Citation contract** (non-negotiable): every research artifact uses standard Markdown footnotes — `[^id]` in the text plus a `[^id]: Title. Date. URL` definition inline. Preserve these as-is in the final document. Do NOT renumber, do NOT replace them with bare superscript numbers, and do NOT strip definitions into a separate reference list.

**Sources placement (DOCX)**: All footnote definitions and source URLs must be collected into a dedicated **Sources** section at the end of the document. Do NOT scatter source definitions throughout the document body or at the bottom of individual pages. Inline citations (`[^id]`) remain in the text, but their full definitions are consolidated on the final page(s) only.

**Sources placement (PPTX)**: Consolidate all sources on the final slide only. No source lists on individual slides.

## Output Rules

- The default final deliverable is a `.docx` Word document saved to `{workspace}/research/{topic}_report.docx`, produced by delegating to the `Word / DOCX` skill via `delegate_task` sub-agent.
- If the user requests `.pptx`, delegate to `pure-style-slides` (designer-quality, Pure Minimal only, no approval step) and save to `{workspace}/research/{topic}_presentation.pptx`.
- If the user requests `.xlsx`, delegate to `Excel / XLSX` and save to `{workspace}/research/{topic}_data.xlsx`.
- If the user explicitly requests raw Markdown only, honor that request. If no format is specified, default to Word `.docx`.
- Insights from Phase 6 must be incorporated into the final document — as a dedicated Insights section (for reports) or woven into Discussion/Contribution sections (for papers).
- Insights must not be omitted even if the user requested a shorter output format.
- All outputs must include `[^id]` style citations.
- The final document must clearly distinguish verified findings, conflict zones, and derived insights.
- **Route C**: Citations reference file names and sections (not URLs). The report must clearly state it is based solely on the provided files.
- **Route D**: Citations must distinguish file-sourced evidence from externally-sourced evidence.
- **Output skill delegation**: Phase 7C dispatches a leaf agent that loads the appropriate output skill (`word-docx`, `pure-style-slides`, or `excel-xlsx`) and generates the final file. The orchestrator verifies the output file exists and passes quality checks.

## Testing / Validation

See `references/testing-recipe.md` for a lightweight end-to-end smoke test to validate skill changes without running a full swarm.

See `references/subagent-pitfalls.md` for recurring issues encountered during live execution (web_extract failures, output length scaling, empty delegate_task returns, Windows path handling, PptxGenJS API changes, **skill packaging hygiene**) and their workarounds.

See `templates/pptx-pure-minimal.js` for a validated PptxGenJS starter template that implements the Pure Minimal design system with correct canvas sizing and no text overlaps.

## Core Principles

1. **Depth over breadth** (Route B) / **Breadth then depth** (Route A). Shallow aggregation is forbidden. Each dimension must be investigated thoroughly before moving on.
2. **Raw evidence required.** Sub-agents must return verbatim excerpts with source URLs/file references and dates. No paraphrased-only outputs.
3. **Contradictions are signal.** Conflicts are highlighted and analyzed, never suppressed or averaged away.
4. **Everything is a file.** Never output long-form research content in chat. Chat is for status updates only.
5. **Source quality matters.** Prioritize: government sites, academic journals, official filings, major media. **For academic topics, prioritize free open-access sources** per `references/free-academic-sources.md`. Avoid: content farms, anonymous blogs, SEO aggregators. For file-based routes, treat user-provided files as primary authoritative sources.
6. **Research ethics** (non-negotiable):
   - **Transparency**: Always disclose limitations and uncertainties in the final report
   - **Balance**: Present competing viewpoints fairly — never suppress contradictory evidence
   - **Recency**: Prioritize recent sources unless historical context is specifically needed
   - **Verification**: Flag unverified claims; do not present speculation as fact
   - **Scope**: Stay within requested boundaries; note explicitly when expansion is needed
   - **Intellectual honesty**: Report contradictory findings even when they complicate conclusions
7. **Search budget by route** (targets for total coverage across all rounds, not per simultaneous batch — scale down if the concurrency limit makes the full budget impractical or the user requests reduced scope):
   - Route A: wide agents (~5–8) × ≥10 searches + deep agents (one per dimension) × ≥20 searches
   - Route B: deep agents (one per dimension) × ≥20 searches
   - Route C: **0 external searches** (file-only)
   - Route D: deep agents × ≥15 searches (reduced because files provide base evidence)
   - **Quick mode**: When user says "quick", "brief", or caps dimensions at ≤3, halve all search budgets (minimum 5 per agent).
8. **All outputs must include `[^id]` style citations.**
9. **All files under `{workspace}/research/`.** No exceptions.
10. **Route C respects user intent.** If the user says "only based on files", do NOT sneak in external searches. Fidelity to user intent is paramount.
11. **Route D balances sources.** File content is primary; external search fills gaps and adds depth. Do not let external sources overshadow the user's provided materials.
12. **Progress reporting.** The orchestrator reports progress after each batch completes: dimensions finished, estimated time remaining, key findings so far.
13. **Automated retry.** Failed dimension outputs (missing files, empty content, insufficient citations) are automatically retried up to 2 times with tightened instructions.
14. **Quality gates.** Automated validation runs before final output: file existence, citation compliance, content completeness. Failed items are retried or flagged.
15. **Output skill delegation.** Final output production is delegated to specialized skills (`word-docx`, `pure-style-slides`, `excel-xlsx`) via sub-agents, rather than generated inline by the orchestrator.
16. **Streaming dispatch.** Use smaller batch sizes (1-2 agents) and priority ordering to minimize idle time. Adapt batch size based on observed completion times.
17. **Output quality.** PPTX must include charts (bar, pie, line) with real data. DOCX must use full paragraphs (3-8 sentences) with context and implications, not bullet points. DOCX must follow the academic narrative structure per `references/academic-narrative-structure.md` with transitions, integrated evidence, and coherent argumentation. **If the user explicitly requests a different report structure, honor their instructions over the default.**
18. **Skill packaging hygiene.** Keep the `references/` folder clean. Session-specific files (validation records, test artifacts, temporary notes) belong in the workspace, not in the skill directory. See `references/subagent-pitfalls.md` "Skill packaging hygiene" section.

## File Naming

All files are saved under `{workspace}/research/`.

### Topic Slugification Rule

The `{topic}` token MUST be normalized to a consistent, URL-safe slug **once at Phase 0** and reused verbatim in every phase. This prevents duplicate files (e.g., `quantum_computing_2025_dim01.md` vs `quantum2025_dim01.md`) when the orchestrator and sub-agents independently abbreviate the topic.

**Slugification rules:**
1. Lowercase everything
2. Replace spaces and punctuation with single hyphens
3. Strip leading/trailing hyphens
4. Keep the slug stable — do not re-slugify mid-workflow

**Example:**
- User query: "Current state of quantum computing in 2025"
- Slug: `quantum-computing-2025`
- Files: `quantum-computing-2025_dim01.md`, `quantum-computing-2025_cross_verification.md`, etc.

The orchestrator MUST communicate the exact slug to every sub-agent in its `goal` / `context` so all agents write to the same filenames.

### File Naming Reference

| File | Phase | Route | Content |
|------|-------|-------|---------|
| `{topic}_file_analysis.md` | Phase F | C, D | File intake: per-file extraction, cross-file mapping, gap analysis |
| `{topic}_wide{NN}.md` | Phase 1W | A | Per-facet wide exploration output |
| `{topic}_dim{NN}.md` | Phase 3 | All | Per-dimension sub-agent research output |
| `{topic}_cross_verification.md` | Phase 4-5 | All | Confidence tier classification + conflict zone analysis |
| `{topic}_insight.md` | Phase 6 | All | Cross-dimension insights (core synthesis for downstream writing skill) |
