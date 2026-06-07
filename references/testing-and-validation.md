# Deep Research Swarm — Testing and Validation Notes

Session-tested fixes that went into v1.0.2. Use this as a checklist when regression-testing the skill or when a user reports odd behavior.

## End-to-End Test Recipe

Use a small, bounded topic so the test completes quickly:

1. Create a workspace directory and `research/` subdirectory.
2. Run Phase 1 manually with 2-3 `web_search` calls to verify search works.
3. Dispatch 2 leaf sub-agents for 2 dimensions (Route B) using `delegate_task` batch mode.
4. Verify files appear under `{workspace}/research/` with correct slug naming.
5. Inspect output for:
   - Inline `[^id]` citations
   - Matching `[^id]: Title. Date. URL` footnote definitions
   - Evidence template fields (Claim / Source / URL / Date / Excerpt / Context / Confidence)
6. For Route C, create a small sample file and dispatch one `toolsets=["file"]` leaf agent.
   - Verify no `web_search` calls appear in the sub-agent trace.
   - Verify file references use `File: {filename}, Section: {section}` format.

## Common Bugs to Watch For

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Sub-agents output citations but no footnote definitions | Citation format not explicit in prompt | Add: "Use inline `[^id]` markers plus matching `[^id]: Title. Date. URL` footnote definitions at the end of the file" |
| Phase 3 angles don't match Phase 2 rules | Mission requirements drifted | Keep Phase 3 mission angles in sync with Phase 2 (current state, key evidence, tensions/counter-arguments, stakeholders) |
| Orchestrator can't find dimension files after sub-agents run | No enumeration guidance in Phase 4 | Tell orchestrator to list `{workspace}/research/` or use the Phase 2 plan, and re-dispatch missing files |
| Handoff references non-existent skills | Skill registry changed | Verify target skill names with `skills_list` before referencing them in Phase 7 |
| "Shell tool" mentioned for time check | Hermes has no tool named "Shell" | Use `terminal` tool (e.g., `date`) |
| Path issues on Windows | Sub-agent gets relative or mixed-slash path | Pass exact absolute path; both `C:\...` and `/c/Users/...` work, but must be consistent |

## Skill Registry Reality Check

Before Phase 7 tells the orchestrator to invoke another skill, confirm the skill exists:

```
skills_list
```

As of the v1.1.0 patch, valid handoff targets are:
- `Word / DOCX` — default for reports, policy briefs, market analysis (delegated via sub-agent)
- `pure-style-slides` — designer-quality slide decks (Pure Minimal only, no Deck Blueprint approval, delegated via sub-agent)
- `Excel / XLSX` — structured data tables, evidence matrices (delegated via sub-agent)
- Raw Markdown — when user explicitly requests no conversion

**v1.1.0 new features**:
- **Quality Gate (Phase 7A)**: Automated validation of dimension files before output production — checks file existence, citation count, content completeness
- **Retry Logic (Phase 3)**: Automatic retry of failed dimension sub-agents (max 2 retries) with tightened instructions
- **Progress Reporting**: Status updates after each batch completes — dimensions finished, estimated time remaining, confidence tier counts
- **Output Skill Delegation (Phase 7C)**: Final output production delegated to specialized skills via `delegate_task` sub-agents rather than inline generation
Do not reference `report-writing`, `paper-writing`, `md2docx`, or `md2pdf` — those do not exist.

## Version Bump Trigger

Patch the version in SKILL.md frontmatter whenever:
- A workflow bug is fixed
- A phase requirement changes
- Handoff targets change
- File naming or citation conventions change

Use semver: bug fixes → patch, new phases or major workflow changes → minor.
