# Sub-Agent Pitfalls & Workarounds

**Purpose:** Capture recurring issues encountered during live swarm execution and their workarounds, so future orchestrators don't rediscover them the hard way.

## web_extract fails on search-only backends

**Symptom:** Sub-agents call `web_extract` to fetch full page content, but the configured backend (e.g., DuckDuckGo) is search-only and cannot retrieve pages. The tool returns an error or empty result.

**Workaround:**
- Sub-agents should fall back to using `web_search` result snippets and descriptions as their primary evidence source.
- Search result snippets often contain sufficient detail for research purposes — the title, description, and URL together provide a citable source.
- If a snippet is too short, the sub-agent can perform additional targeted searches with more specific queries rather than attempting full-page extraction.
- Document this limitation in the sub-agent's `context` so it knows not to waste API calls on `web_extract`.

**Prevention:** In the orchestrator's sub-agent `context`, explicitly state: "If `web_extract` fails, rely on `web_search` snippets and descriptions for sourcing. Do not let extraction failures block your research."

## Output length scaling

**Symptom:** User requests a specific output length (e.g., "500 words", "2-page summary", "brief"). The orchestrator produces a full deep-research output that ignores the length constraint, or scales down dimensions but not final report length.

**Rule:**
- When the user specifies a length target, apply it to the **final deliverable**, not just the research process.
- Scale dimension count first: "brief" or word-count targets ≤1000 words → use 2–3 dimensions instead of the default 10.
- Scale search budget proportionally: brief requests → minimum 5 searches per dimension (not 20).
- Scale insight count: ≤3 dimensions → minimum 3 insights (not 5).
- The final report must respect the user's length target. If the synthesized content exceeds the target, condense aggressively — prioritize the executive summary, top 2–3 insights, and key findings. Move detailed evidence to appendices or keep it in the dimension files only.
- If the user says "write 500 words about X", treat it as a focused query (Route B) with 2–3 dimensions and a hard 500-word cap on the final report.

## Sub-agent returns empty string despite success

**Symptom:** `delegate_task` returns `''` (empty string) as the result, but the sub-agent's output file was written successfully.

**Explanation:** This is a known tool behavior — the sub-agent's `write_file` output does not propagate back through `delegate_task`'s return value. The return value may contain a summary or may be empty.

**Workaround:**
- Always verify sub-agent output by reading the expected file directly after dispatch.
- Do not rely on `delegate_task`'s return value to confirm success — check the filesystem.

## Path handling on Windows

**Symptom:** Sub-agents fail to write files because path formats mismatch between the orchestrator and the sub-agent's tool expectations.

**Rule:**
- The `file` tool on Windows accepts both `C:\Users\...` and `/c/Users/...` forms.
- Python tools (e.g., `pypandoc`) require native Windows paths. Use raw strings (`r'C:\Users\...'`) to avoid `unicodeescape` errors.
- Always pass the **exact absolute path** to sub-agents in their `goal` / `context`. Never assume the sub-agent can resolve relative paths or `{workspace}` placeholders.

## Output skill sub-agents lack execution capability

**Symptom:** DOCX/PPTX sub-agents write generation scripts but cannot execute them because they lack `terminal` tool access.

**Workaround:**
- Grant `toolsets=["file", "terminal"]` to output skill sub-agents so they can install dependencies and run generation scripts.
- Alternatively, have the sub-agent write the script and return its path; the orchestrator then runs it with `terminal`.
- For PptxGenJS: sub-agents may not have `npm` access. Pre-install `pptxgenjs` globally or have the orchestrator handle npm install.
- For python-docx: ensure `python-docx` is installed in the active Python environment before dispatching the sub-agent.

**Prevention:** In the orchestrator's output skill dispatch, either:
- Include `terminal` in toolsets: `toolsets=["file", "terminal"]`
- Or handle dependency installation and script execution in the orchestrator after the sub-agent returns

## PptxGenJS API version mismatch

**Symptom:** `TypeError: pres.defineSlideSize is not a function` when running PptxGenJS code.

**Explanation:** Newer versions of PptxGenJS (v3+) removed `defineSlideSize()`. Use `pres.layout = "LAYOUT_16x9"` instead, which sets the standard 10" × 5.625" canvas automatically.

**Fix:** Remove `pres.defineSlideSize({ width: 10, height: 5.625 })` and use `pres.layout = "LAYOUT_16x9"` only.

## Output quality: PPTX lacks charts, DOCX uses bullet points

**Symptom:** User complains that PPTX presentations contain only text with no visualizations, or DOCX reports are just bullet-point lists instead of flowing paragraphs.

**Root cause:** Output skill sub-agents default to the simplest possible format (text-only slides, bullet lists) unless explicitly instructed otherwise.

**Fix for PPTX:**
- Mandate chart inclusion in the sub-agent's `goal`: "Include at least 2-3 chart slides (bar, pie, or line) with real data from the research."
- Provide chart placement rules in `context`: "Place chart on left (55-60% width) with insight card on right (40-45%)."
- Reference `templates/pptx-pure-minimal.js` which includes working `addChart()` examples for bar, pie, and line charts.

**Fix for DOCX:**
- Mandate paragraph format in the sub-agent's `goal`: "Content must be written as full paragraphs (2-4 sentences each) with context, data, and implications."
- Explicitly prohibit bullet-only output: "Use bullet points ONLY for lists of 3+ related items."
- Provide the academic template (`templates/docx-academic-template.py`) which enforces justified paragraphs, 1.25 line spacing, and proper heading hierarchy.

**Prevention:** Always include output quality requirements in the sub-agent's `goal` and `context`. Never assume the sub-agent will produce visually rich or well-structured output without explicit guidance.

## Academic source quality: sub-agents miss free OA papers

**Symptom:** Research citations rely on paywalled sources, news articles, or blog posts when high-quality free academic papers exist.

**Root cause:** Sub-agents default to general web search and don't know about free academic aggregators.

**Fix:**
- Include free academic source priority in sub-agent `context`: "For academic topics, prioritize free open-access sources: CORE, OpenAlex, Semantic Scholar, arXiv, PubMed Central, DOAJ."
- Provide search operators: `site:core.ac.uk`, `site:arxiv.org`, `site:pmc.ncbi.nlm.nih.gov`, `filetype:pdf site:.edu`
- Reference `references/free-academic-sources.md` for the complete priority hierarchy and API access details.

**Prevention:** When the topic has any academic or scientific dimension, explicitly instruct sub-agents to search free academic repositories before general web search.

## Skill packaging hygiene: references/ folder bloat

**Symptom:** The skill's `references/` folder accumulates session-specific files (validation records, test artifacts, temporary notes, one-off guides) that should not be distributed with the skill. The zip file becomes bloated with files that confuse future users.

**Root cause:** During iterative development, temporary files are created for testing or documentation but never cleaned up before creating the distribution zip.

**Fix:**
- Before creating the distribution zip, audit the `references/` folder and delete files that are:
  - Session-specific validation records (e.g., `validation-YYYY-MM-DD.md`)
  - Temporary test artifacts (e.g., `test-report-template.md` if empty/unused)
  - One-off workflow guides that are now superseded (e.g., `docx-conversion-notes.md` when a template exists)
  - Redundant content covered by other reference files (e.g., `pptx-generation-patterns.md` when `pure-style-slides.md` and `templates/pptx-pure-minimal.js` exist)
  - Personal analysis notes (e.g., `example-document-analysis.md` from a single user request)
- Keep only class-level, reusable reference files:
  - Output skill connection guides (`word-docx.md`, `pure-style-slides.md`, `excel-xlsx.md`)
  - Supplementary research skills (`arxiv.md`, `blogwatcher.md`, `llm-wiki.md`, `free-academic-sources.md`)
  - Academic standards (`cite-them-right-harvard.md`, `academic-narrative-structure.md`)
  - Testing infrastructure (`testing-recipe.md`, `testing-and-validation.md`, `quality-gate.md`)
  - Operations guides (`streaming-dispatch.md`, `subagent-pitfalls.md`)
  - Index (`README.md`)
- Update `references/README.md` after deletions to remove deleted files from the index.

**Prevention:** Treat `references/` like a library, not a scratchpad. Session-specific notes belong in the workspace (`{workspace}/research/`), not in the skill directory. Before every zip creation, run a cleanup pass.
