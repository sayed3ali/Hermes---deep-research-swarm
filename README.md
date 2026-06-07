# Deep Research Swarm

**Version**: 1.1.2  
**License**: MIT  
**Author**: Hermes Agent

Multi-agent deep research orchestration with adaptive routing. Use this skill whenever comprehensive, multi-dimensional, evidence-backed investigation is required: competitive intelligence, market analysis, controversy investigation, policy evaluation, academic landscape review, risk assessment, file-based analysis, or any task demanding cross-verified, multi-source findings.

**Do NOT use for simple factual lookup or single-source Q&A.**

---

## What This Skill Does

The deep-research-swarm skill orchestrates multiple AI agents to conduct thorough, multi-dimensional research. It:

- **Routes tasks adaptively** — chooses the right pipeline based on whether you provide files, want broad or focused research
- **Dispatches parallel research agents** — each investigates a different dimension of your topic simultaneously
- **Cross-verifies findings** — detects contradictions, assesses confidence, and flags conflicts
- **Produces polished output** — generates academic narrative reports (DOCX), presentations (PPTX), or data tables (XLSX)
- **Prioritizes free academic sources** — uses open-access repositories when available

---

## Quick Start

### 1. Load the skill

```
/skill deep-research-swarm
```

Or in code:
```python
skill_view(name='deep-research-swarm')
```

### 2. Run a research query

**Basic focused research** (no files):
```
Research the current state of quantum computing commercialization in 2026.
```

**File-based research** (analyze documents you provide):
```
Analyze these earnings reports and tell me what they reveal about market trends.
```
(Attach or reference your files — the skill will use Route C or D automatically.)

**With output format specified**:
```
Research remote work productivity and give me a presentation.
```

### 3. The skill handles the rest

1. **Phase 0**: Determines the best route (A/B/C/D) based on your input
2. **Phase 1**: Scans the landscape with web searches
3. **Phase 2**: Decomposes the topic into research dimensions
4. **Phase 3**: Dispatches parallel agents to investigate each dimension
5. **Phase 4-6**: Cross-verifies, extracts insights, resolves contradictions
6. **Phase 7**: Produces your final report in the requested format

---

## Routes

| Route | When to use | Input | Search |
|---|---|---|---|
| **A** — Wide Search | Broad, exploratory topics | No files | 10+ searches |
| **B** — Focused Search | Specific, bounded questions | No files | 5+ searches |
| **C** — File Only | Analyze documents you provide | Files only | None |
| **D** — File Augmented | Documents + external context | Files + search | 3+ searches |

The skill auto-detects the right route. You can override by saying "Route B" or "do a focused search."

---

## Output Formats

| Format | Default? | Skill Used | File Extension |
|---|---|---|---|
| **DOCX** (Word) | Yes | `Word / DOCX` | `.docx` |
| **PPTX** (Slides) | No | `pure-style-slides` | `.pptx` |
| **XLSX** (Excel) | No | `Excel / XLSX` | `.xlsx` |
| **Markdown** | Fallback | None | `.md` |

All output files are saved to `C:\Users\User\hermes\research\` (or your configured workspace).

---

## Report Structure

The default output is an **academic narrative** with these sections:

1. **Executive Summary** — Core findings and significance
2. **Knowledge Development** — How understanding evolved
3. **Comprehensive Analysis** — Findings, patterns, contradictions, limitations
4. **Practical Implications** — Applications, risks, future research
5. **References** — Cite Them Right Harvard format
6. **Appendices** — Search strategy, source assessment (optional)

**You can override this.** If you provide your own structure ("Use SWOT analysis", "Follow this outline..."), the skill follows your instructions.

---

## Key Features

### Research Ethics (Non-Negotiable)
- **Transparency** — Disclose limitations and uncertainties
- **Balance** — Present competing viewpoints fairly
- **Recency** — Prioritize recent sources unless historical context needed
- **Verification** — Flag unverified claims; no speculation as fact
- **Scope** — Stay within requested boundaries
- **Intellectual honesty** — Report contradictory findings even when inconvenient

### Free Academic Sources
The skill prioritizes free open-access sources:
- **Aggregators**: CORE, OpenAlex, Semantic Scholar, Google Scholar
- **Repositories**: arXiv, PubMed Central, bioRxiv, SSRN, Europe PMC
- **OA Journals**: DOAJ, PLOS, BMC, Frontiers
- **Institutional**: MIT DSpace, Harvard DASH, university repositories

### Quality Assurance
- **Quality Gate (Phase 7A)**: Automated validation before output production
- **Retry Logic**: Failed dimensions are retried with tightened instructions
- **Cross-Verification**: Conflicts detected and analyzed transparently

---

## File Structure

```
deep-research-swarm/
├── SKILL.md                          # Main skill definition (workflow, phases, rules)
├── README.md                         # This file
├── references/                       # Connection guides for related skills
│   ├── README.md                     # Index of all reference files
│   ├── academic-narrative-structure.md   # Report structure and writing rules
│   ├── arxiv.md                      # arXiv skill connection guide
│   ├── blogwatcher.md                # BlogWatcher skill connection guide
│   ├── cite-them-right-harvard.md    # Harvard referencing format (12th ed)
│   ├── excel-xlsx.md                 # Excel / XLSX skill connection guide
│   ├── free-academic-sources.md      # Free OA sources and search operators
│   ├── llm-wiki.md                   # LLM Wiki skill connection guide
│   ├── pure-style-slides.md          # pure-style-slides skill connection guide
│   ├── quality-gate.md               # Automated validation procedures
│   ├── streaming-dispatch.md         # Parallelism optimization guide
│   ├── subagent-pitfalls.md          # Common issues and workarounds
│   ├── testing-and-validation.md     # Regression checklist
│   ├── testing-recipe.md             # Quick smoke-test recipe
│   └── word-docx.md                  # Word / DOCX skill connection guide
├── templates/
│   ├── docx-academic-template.py     # Academic DOCX styling template
│   └── pptx-pure-minimal.js          # Pure Minimal PPTX template
└── scripts/
    └── verify-skill-structure.py     # Structural validation script
```

---

## Dependencies

The skill itself requires no installation. Output generation may need:

| Tool | For | Install |
|---|---|---|
| `python-docx` | DOCX generation | `pip install python-docx` |
| `pypandoc-binary` | Markdown-to-DOCX | `pip install pypandoc-binary` |
| `pptxgenjs` | PPTX generation | `npm install pptxgenjs` |
| `openpyxl` | XLSX generation | `pip install openpyxl` |

---

## Testing

Run a quick smoke test:

```bash
python3 scripts/verify-skill-structure.py
```

Or follow the recipe in `references/testing-recipe.md` for a 5-10 minute end-to-end test.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.1.2 | 2026-06-07 | Academic narrative structure, free academic sources, Cite Them Right Harvard, research ethics, user override for report structure |
| 1.1.0 | 2026-06-07 | Quality gate, retry logic, streaming dispatch, output skill delegation, Pure Minimal PPTX |
| 1.0.2 | 2026-06-07 | Bug fixes: search counts, terminology, skill references, Windows paths, file verification |
| 1.0.1 | 2026-06-07 | Initial release with Route A/B/C/D, parallel sub-agents, cross-verification |

---

## Related Skills

| Skill | Use Case |
|---|---|
| `arxiv` | Academic paper search and download |
| `blogwatcher` | Monitor blogs and RSS feeds |
| `llm-wiki` | Build persistent markdown knowledge bases |
| `word-docx` | Create and edit Word documents |
| `pure-style-slides` | Generate designer-quality presentations |
| `excel-xlsx` | Create and edit Excel spreadsheets |

---

## License

MIT License — see SKILL.md frontmatter.