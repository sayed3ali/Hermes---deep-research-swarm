# Connected Skills Reference

This folder contains quick-reference notes for all Hermes skills that connect to `deep-research-swarm`.

## Output-format skills (Phase 7)

These skills are invoked after deep research completes to convert Markdown artifacts into the user's requested deliverable format.

| File | Skill | Default? | Output file |
|---|---|---|---|
| `word-docx.md` | `Word / DOCX` | **Yes** | `{workspace}/research/{topic}_report.docx` |
| `pure-style-slides.md` | `pure-style-slides` | No | `{workspace}/research/{topic}_presentation.pptx` (designer-quality, Pure Minimal only) |
| `excel-xlsx.md` | `Excel / XLSX` | No | `{workspace}/research/{topic}_data.xlsx` |

## Supplementary research skills

These skills can be loaded during Phase 1 or Phase 3 when the topic benefits from specialized source types.

| File | Skill | When to use |
|---|---|---|
| `arxiv.md` | `arxiv` | Academic / scientific dimensions |
| `blogwatcher.md` | `blogwatcher` | Fast-moving narratives, blogs, RSS feeds |
| `llm-wiki.md` | `llm-wiki` | Building a persistent markdown knowledge base |
| `free-academic-sources.md` | N/A (reference guide) | When academic evidence is required — prioritizes free OA sources |

## Technical implementation notes

| File | Purpose |
|---|---|
| `templates/pptx-pure-minimal.js` | Validated PptxGenJS template for Pure Minimal presentations (v1.1.0+) |
| `templates/docx-academic-template.py` | Academic DOCX template with Cite Them Right Harvard styling (v1.1.2+) |

## Testing and validation

| File | Purpose |
|---|---|
| `testing-recipe.md` | Quick smoke-test recipe for validating skill changes |
| `testing-and-validation.md` | Regression checklist and common bug fixes |
| `quality-gate.md` | Automated validation procedures for Phase 7A (v1.1.0+) |
| `streaming-dispatch.md` | Parallelism optimization guide for Phase 1W and Phase 3 (v1.1.0+) |
| `cite-them-right-harvard.md` | Cite Them Right Harvard reference format (12th ed) for DOCX output |
| `free-academic-sources.md` | Free open-access academic sources and search strategies (v1.1.2+) |
| `academic-narrative-structure.md` | Academic narrative report structure with transitions and integrated evidence (v1.1.2+) |

## Note

These reference files are connection guides — they explain how each skill fits into the deep-research workflow. For the full skill content, load the skill directly with `skill_view(name='<skill-name>')` or read the main `SKILL.md` at the skill's install path.
