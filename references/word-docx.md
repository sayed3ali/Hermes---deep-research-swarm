# Word / DOCX

**Skill name**: `Word / DOCX`  
**Invocation name**: `word-docx`  
**Path**: `C:\Users\User\AppData\Local\hermes\skills\word-docx\SKILL.md`

## Role in Deep Research Swarm

Default final-output skill for deep-research-swarm. Used in **Phase 7: Produce Final Output** when the user does not specify a format or explicitly requests a Word document.

## Trigger within this workflow

- User asks for a report, market analysis, policy brief, consulting deliverable, or any long-form document.
- No output format specified → default to `.docx`.

## Expected output file

```
{workspace}/research/{topic}_report.docx
```

## How to use it from deep-research-swarm

1. Load the skill (`skill_view(name='word-docx')`) for formatting guidance.
2. Load the academic template (`templates/docx-academic-template.py`) for document structure, colors, fonts, and helper functions.
3. Load the narrative structure guide (`references/academic-narrative-structure.md`) for the required report structure and writing rules.
4. Convert the Markdown research artifacts (primarily `{topic}_insight.md` and `{topic}_cross_verification.md`) to DOCX using:
   - `python-docx` with the academic template for full control over styling
   - `pypandoc` as a fallback for quick conversion
5. Convert `[^id]` inline citations to Cite Them Right Harvard format — see `references/cite-them-right-harvard.md`.
6. **Structure the report as an academic narrative** per `references/academic-narrative-structure.md`:
   - Executive Summary (2-3 substantial paragraphs)
   - Knowledge Development (evolution of understanding)
   - Comprehensive Analysis (findings, patterns, contradictions, evidence strength, limitations, integration)
   - Practical Implications (applications, risks, future research, broader impacts)
   - References (Cite Them Right Harvard)
   - Appendices (if needed)
7. **Writing rules**:
   - Every section must open with an orienting paragraph
   - Every finding must connect to at least one other finding
   - Use transitions between all sections and paragraphs
   - Integrate evidence into sentences (never list sources)
   - Minimum 3 sentences per paragraph, maximum 8
   - No bullet points in body text (except Appendix A)
   - No isolated facts without context
8. Save the final `.docx` to `{workspace}/research/{topic}_report.docx`.

## Content Style Guide

**Paragraph format (required)**:
```
The global quantum computing market is valued at $698.6 million in 2026, 
with projections ranging from $1.72 billion by 2033 to $18.33 billion by 
2034 depending on the analyst. North America dominates with 43.6% market 
share, driven by $2 billion in US government CHIPS Act funding to nine 
quantum companies including IBM and D-Wave.
```

**NOT acceptable**:
```
• Market: $698.6M
• North America: 43.6%
• US funding: $2B
```

**Narrative transitions (required)**:
- Between sections: "This finding connects to the broader pattern of..."
- Between paragraphs: "However, evidence from... challenges this interpretation."
- Within paragraphs: "Building on this, the research also revealed..."

**Evidence integration (required)**:
- **Good**: "McKinsey's Quantum Technology Monitor (2026) found that private investment surged to $12.6 billion, a figure that contextualizes the market optimism but also raises questions about sustainability."
- **Bad**: "Source 1: McKinsey says $12.6B. Source 2: Fortune says $2.04B market."

**When to use bullet points**:
- Only in Appendix A (search strategy lists)
- Step-by-step procedures in appendices
- Feature comparisons in appendices

**When to use paragraphs**:
- All findings and analysis
- Executive summaries
- Knowledge development narrative
- Insights and conclusions
- Context and background
- Contradictions and competing evidence
- Practical implications

## Key constraints from Word / DOCX skill

- DOCX is OOXML under the hood; prefer named styles over direct formatting.
- Lists and numbering use Word's numbering definitions, not Unicode bullets.
- Page layout (margins, headers, footers) is section-level.
- Track changes, comments, and fields need precise edits.
- Verify round-trip compatibility if the recipient uses LibreOffice or Google Docs.

## Academic Style Specification

### Color Palette
| Element | Color | Hex |
|---|---|---|
| Heading 1 | Dark navy | #1F3864 |
| Heading 2 | Medium blue | #2A4D7A |
| Heading 3 | Blue | #1F4D78 |
| Heading 4-6 | Light blue | #2E74B5 |
| Part labels | Medium blue | #2E75B6 |
| Subtitle | Gray | #595959 |
| Body text | Black | #000000 |
| Table header bg | Dark navy | #1F3864 |
| Table header text | White | #FFFFFF |
| Table borders | Light gray | #BFBFBF |

### Font Settings
| Element | Font | Size | Weight |
|---|---|---|---|
| Title | Calibri | 24pt | Bold |
| Subtitle | Calibri | 12pt | Italic |
| Part label | Calibri | 12pt | Bold |
| Heading 1 | Calibri | 15pt | Bold |
| Heading 2 | Calibri | 12.5pt | Bold |
| Heading 3 | Calibri | 12pt | Regular |
| Body text | Calibri | 11pt | Regular |
| Footnote | Calibri | 10pt | Regular |

### Page Layout
- Page size: US Letter 8.5" x 11"
- Margins: 1" all sides
- Line spacing: 1.25 for body paragraphs
- Paragraph spacing: 10pt after body, 6pt after headings

### Body Paragraph Format
- Justified alignment
- 1.25 line spacing
- 10pt space after paragraph
- Full paragraphs (3-8 sentences) with context, data, and implications
- Bold inline headings for key topics within paragraphs
- Transitions between paragraphs required
- Evidence integrated into sentences (never listed)

### Narrative Structure
The report must follow `references/academic-narrative-structure.md`:
- **Executive Summary**: 2-3 substantial paragraphs, standalone
- **Knowledge Development**: Trace evolution of understanding, turning points
- **Comprehensive Analysis**: Flowing narrative of findings, patterns, contradictions
- **Practical Implications**: Applications, risks, future research, broader impacts
- **References**: Cite Them Right Harvard
- **Appendices**: Search strategy, source reliability, excluded sources, timeline

### Reference List Format
- Cite Them Right Harvard (12th Edition)
- Hanging indent: 0.33"
- 6pt space after each entry
- Alphabetised by author surname
- See `references/cite-them-right-harvard.md` for full format specification

### Table Format
- Header row: dark navy background (#1F3864), white bold text
- Data rows: white background, black text
- Borders: single line, light gray (#BFBFBF), 0.5pt

### Footer
- Left text + page number on right
- Format: "Document Title    |   2"
- Font: Calibri 10pt, gray (#595959)

## See also

- Main skill: `C:\Users\User\AppData\Local\hermes\skills\word-docx\SKILL.md`
- Academic template: `templates/docx-academic-template.py`
- Harvard format guide: `references/cite-them-right-harvard.md`
- Narrative structure guide: `references/academic-narrative-structure.md`
