# Deep Research Swarm — Testing Recipe

Use this recipe to validate changes to the deep-research-swarm skill without running a full expensive swarm.

## Quick Smoke Test (5–10 minutes)

1. Create a test workspace:
   ```bash
   mkdir -p /c/Users/<user>/deep-research-test/research
   cd /c/Users/<user>/deep-research-test
   ```

2. Pick a focused, well-covered topic with clear dimensions, e.g.:
   - "benefits and challenges of four-day work week"
   - "electric vehicle battery recycling market"
   - "remote work productivity research"

3. Run a **Route B (Focused Search)** test with only 2 dimensions:
   - Dimension 1: employee/social impact angle
   - Dimension 2: business/economic angle
   - Dispatch 2 leaf sub-agents via `delegate_task(tasks=[...])`
   - Each agent should perform ≥5 searches (reduced from full ≥20)
   - Verify both files are written to `{workspace}/research/{topic}_dim01.md` and `_dim02.md`

4. Run a **Route C (File-Only)** test:
   - Create a short sample text file with 5–10 claims about the topic
   - Dispatch 1 leaf sub-agent with `toolsets=["file"]` only
   - Verify output file uses file-based citations (`File: {name}, Section: ...`)
   - Confirm no external search was performed

5. Inspect outputs for:
   - Correct file paths under `{workspace}/research/`
   - Inline `[^id]` citations in the body
   - Matching `[^id]: Title. Date. URL` footnote definitions
   - Evidence template fields (Claim / Source / URL / Date / Excerpt / Context / Confidence)
   - No raw research content dumped into chat

## What to Check After Skill Changes

| Area | Validation |
|------|------------|
| Phase 0 routing | Correct route selected for file/no-file + broad/focused combos |
| Phase 1 search count | Exactly 5 searches for Route B, numbered 1–5 |
| Sub-agent dispatch | Uses `delegate_task` with `goal` + `context`, not `prompt` |
| Dimension coverage | Output covers current state, key evidence, tensions/counter-arguments, stakeholders |
| Citation format | `[^id]` inline + `[^id]: Title. Date. URL` footnotes at end of file |
| File naming | All files use the same topic slug decided at Phase 0 |
| Phase 7 default output | If user requests no format, produces `.docx` via Word / DOCX skill |
| PPTX request | Routes to `Powerpoint / PPTX` or `pure-style-slides` |
| XLSX request | Routes to `Excel / XLSX` |

## Common Failures to Watch For

- Sub-agents output long content in chat instead of saving to file → re-emphasize "Everything is a file" rule.
- Sub-agents use bare URLs instead of `[^id]` citations → re-emphasize citation contract.
- Missing footnote definitions → add explicit "matching `[^id]: Title. Date. URL` footnote definition" instruction.
- Route C agent performs web search → verify `toolsets=["file"]` (no `web`) was passed.
- Different topic slugs across files → communicate exact slug explicitly in every sub-agent prompt.
- DOCX conversion fails on Windows with `unicodeescape` error → use raw strings (`r'C:\Users\...'`) in Python paths. See `docx-conversion-notes.md`.
- `pypandoc` not installed → install with `python3 -m pip install pypandoc-binary` (bundles Pandoc, no separate install needed).
