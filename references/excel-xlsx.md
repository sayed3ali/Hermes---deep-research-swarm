# Excel / XLSX

**Skill name**: `Excel / XLSX`  
**Invocation name**: `excel-xlsx`  
**Path**: `C:\Users\User\AppData\Local\hermes\skills\excel-xlsx\SKILL.md`

## Role in Deep Research Swarm

Final-output skill for deep-research-swarm when the user requests a spreadsheet or data-table deliverable.

## Trigger within this workflow

- User asks for `.xlsx`, Excel, spreadsheet, data table, or structured evidence matrix.
- Useful for exporting evidence tables, confidence tiers, conflict zones, and source lists into separate worksheets.

## Expected output file

```
{workspace}/research/{topic}_data.xlsx
```

## How to use it from deep-research-swarm

1. Load the skill (`skill_view(name='excel-xlsx')`) for spreadsheet formatting and formula guidance.
2. Parse the structured evidence from `{topic}_dim{NN}.md` files and `{topic}_cross_verification.md`.
3. Create worksheets such as:
   - **Evidence** — Claim, Source, URL, Date, Excerpt, Confidence
   - **Confidence Tiers** — High / Medium / Low / Conflict Zone classifications
   - **Conflict Zones** — Contradictions with source references
   - **Sources** — Deduplicated bibliography with IDs
   - **Insights** — Cross-dimension insights with supporting references
4. Use `openpyxl`, `pandas`, or `xlsxwriter` to generate the workbook.
5. Save to `{workspace}/research/{topic}_data.xlsx`.

## Key constraints from Excel / XLSX skill

- Formulas, dates, types, and formatting must be reliable.
- Workbook structure and template preservation matter.
- Recalculation should work after edits.

## See also

- Main skill: `C:\Users\User\AppData\Local\hermes\skills\excel-xlsx\SKILL.md`
