# pure-style-slides

**Skill name**: `pure-style-slides`  
**Invocation name**: `pure-style-slides`  
**Path**: `C:\Users\User\AppData\Local\hermes\skills\pure-style-slides\SKILL.md`

## Role in Deep Research Swarm

Final-output skill for **.pptx presentations**. Produces magazine-quality slides that look like a creative agency built them.

## When to trigger

- User explicitly requests slides, presentation, deck, pitch, or .pptx
- User wants to redesign or improve an existing .pptx file

## How to use from deep-research-swarm

1. After Phase 5 (insight synthesis), compile the research content into a concise brief:
   - Topic / title
   - Key findings (3-7 bullet points)
   - Insights (2-5 synthesized points)
   - Supporting data points with citations
   - Audience and objective (informative / persuasive / celebratory)

2. Load the `pure-style-slides` skill via `skill_view(name='pure-style-slides')`.

3. Generate slides directly with PptxGenJS using the research brief. No Deck Blueprint approval step.

## Theme

**Pure Minimal** (fixed — no alternative themes):
- Swiss-inspired, ultra-clean, white backgrounds, sharp corners
- Best for: C-suite, board, investor, keynotes, research reports
- Single accent color per deck, chosen from: `FF3B30` (red), `007AFF` (blue), `FF9500` (amber), `34C759` (green), `F96167` (coral)
- Default accent for energy/environment topics: `34C759` (Forest Green)

## Canvas & Grid

```javascript
const W = 10.0;      // slide width
const H = 5.625;     // slide height (16:9)
const M = 0.5;       // margin
const CW = W - M*2;  // content width = 9.0"
const CH = H - M*2;  // content height = 4.625"
```

**Alignment rules**:
- Canvas: 10" × 5.625" (16:9, via `LAYOUT_16x9` in PptxGenJS v3+)
- All elements must stay within right edge ≤ 9.5" and bottom edge ≤ 5.33"
- Category label: y = 0.25", h = 0.18"
- Title: y = 0.45", h = 0.55" (font 24-28pt)
- Content starts: y ≥ 1.1"
- Bottom metadata: y = 5.0-5.15"
- No text overlaps — verify with bounding box checks

## Color System

| Token | Hex | Usage |
|---|---|---|
| BLACK | 1A1A1A | Primary text, titles |
| WHITE | FFFFFF | Backgrounds |
| OFF_WHITE | F5F5F5 | Card fills, muted panels |
| TEXT | 333333 | Body text |
| SECONDARY | 888888 | Labels, annotations, dates |
| TERTIARY | CCCCCC | Dividers, timeline connectors |
| BORDER | E8E8E8 | Card borders |
| ACCENT | 34C759 | Primary accent (energy default) |
| ACCENT_LIGHT | E8F5E9 | Light accent backgrounds |

## Typography

| Element | Size | Weight | Color |
|---|---|---|---|
| Category label | 9pt | Bold | SECONDARY |
| Slide title | 24-28pt | Bold | BLACK |
| Body text | 11-13pt | Normal | TEXT |
| Big number | 28-42pt | Bold | ACCENT |
| Card label | 9-10pt | Normal | SECONDARY |
| Annotation | 8pt | Normal | SECONDARY |

## Card System

```javascript
function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || "FFFFFF" },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 270, color: "000000", opacity: 0.06 }
  });
  if (opts.accentLeft) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.03, h,
      fill: { color: opts.accentLeft }
    });
  }
  if (opts.accentTop) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.03,
      fill: { color: opts.accentTop }
    });
  }
}
```

## Required Slide Structure

Unless the user provides specific slide content, every presentation MUST include:

1. **Cover** — Title, subtitle, date, author/organization
2. **Agenda** — 4-6 section titles with brief descriptions, numbered badge cards
3. **Introduction** — Context, problem statement, or research question
4. **Body slides** — Findings, data, analysis (2-4 slides)
5. **Insights/Conclusion** — Synthesized takeaways
6. **Closing** — Thesis restatement + consolidated sources

## Layout Patterns

### 0. Cover
- Full-bleed white background
- Large title left-aligned (28-32pt)
- Subtitle below (14-16pt)
- Accent line element (thin horizontal bar, 1.2" wide, 0.04" tall)
- Date and author at bottom in SECONDARY, side by side

```javascript
s.addShape(pres.shapes.RECTANGLE, {
  x: M, y: 2.8, w: 1.2, h: 0.04,
  fill: { color: C.ACCENT }
});
s.addText("Title", { x: M, y: 1.5, w: CW, h: 0.8, fontSize: 32, bold: true });
s.addText("Subtitle", { x: M, y: 2.4, w: CW * 0.8, h: 0.4, fontSize: 14 });
// Date and author side by side at bottom
s.addText("Date", { x: M, y: 4.9, w: 3, h: 0.18, fontSize: 10, color: C.SEC });
s.addText("Author", { x: M + 3.2, y: 4.9, w: 4, h: 0.18, fontSize: 10, color: C.SEC });
```

### 1. Agenda
- Category label + title
- 4-6 numbered badge cards in 2×3 or 3×2 grid
- Each: number badge (accent circle, 0.3" diameter) + section title + 1-line description
- Number badges: white text on accent fill

```javascript
const agenda = [
  { num: "01", title: "Section Name", desc: "Brief description" }
];
const agCols = 3, agCardW = (CW - 0.3) / agCols, agCardH = 1.6;
agenda.forEach((item, i) => {
  const col = i % agCols, row = Math.floor(i / agCols);
  const ax = M + col * (agCardW + 0.15);
  const ay = 1.1 + row * (agCardH + 0.15);
  card(s, ax, ay, agCardW, agCardH);
  // Number badge
  s.addShape(pres.shapes.OVAL, {
    x: ax + 0.1, y: ay + 0.12, w: 0.3, h: 0.3,
    fill: { color: C.ACCENT }
  });
  s.addText(item.num, {
    x: ax + 0.1, y: ay + 0.12, w: 0.3, h: 0.3,
    fontSize: 10, color: C.WHITE, bold: true,
    align: "center", valign: "middle"
  });
  s.addText(item.title, { x: ax + 0.5, y: ay + 0.12, w: agCardW - 0.6, h: 0.25, fontSize: 13, bold: true });
  s.addText(item.desc, { x: ax + 0.1, y: ay + 0.55, w: agCardW - 0.2, h: 0.4, fontSize: 10 });
});
```

### 2. Introduction
- Category label + title
- Left: context text (problem statement, research question)
- Right: key context card with accent-left bar

```javascript
// Left text
s.addText("Context paragraph...", { x: M, y: 1.1, w: CW * 0.52, h: 0.9, fontSize: 11 });
// Right card
const cardX = M + CW * 0.55;
card(s, cardX, 1.1, CW * 0.45, 2.4, { fill: C.OFF, accentLeft: C.ACCENT });
s.addText("RESEARCH QUESTION", { x: cardX + 0.12, y: 1.25, w: 3, h: 0.18, fontSize: 9, color: C.SEC });
s.addText("Question text...", { x: cardX + 0.12, y: 1.5, w: CW * 0.42, h: 0.6, fontSize: 13, bold: true });
```

### 3. Title Hero
- Category label + title + subtitle
- 3 bottom metrics with big numbers
- Date/source at bottom-left

### 4. Timeline + Insight Card
- Left: vertical timeline with circles and connecting lines
- Right: insight card with accent-left bar
- Highlight current milestone with accent color

### 5. Two-Column Split
- Left 55%: text content, data points
- Right 45%: card with accent-left bar, key insight

### 6. Stat Cards Row
- 2 large cards with accent-top bars
- Big number + unit + label + sub-label

### 7. KPI Card Grid
- 3-4 cards evenly spaced: `(CW - gaps) / count`
- Accent-top bar on each card
- Stat + label + change indicator

### 8. Country/Region Grid
- 4 cards with accent-top bars
- Country name + big stat + description + detail

### 9. Risk/Challenges Cards
- 3 cards with accent-left bars
- Severity badge (rounded rectangle): red for High, amber for Medium
- Title + description

### 10. Insights/Conclusion
- Category label + title
- 2-3 insight cards with accent-left bars
- Each: insight title + description + supporting evidence
- Or: single statement slide with thesis

### 11. Closing Echo
- Category label + thesis statement (large)
- Supporting sentence
- Sources consolidated at bottom

## Visual Elements

### Charts
PptxGenJS supports native charts. Use them for data-heavy slides:

**Bar Chart**:
```javascript
s.addChart(pres.charts.BAR, [
  {
    name: "Revenue",
    labels: ["2022", "2023", "2024", "2025"],
    values: [10, 20, 30, 45]
  }
], {
  x: M, y: 1.1, w: CW * 0.55, h: 3.5,
  barDir: "bar",
  chartColors: [C.ACCENT],
  showValue: true,
  dataLabelColor: C.TEXT,
  dataLabelFontSize: 10,
  catAxisLabelColor: C.TEXT,
  valAxisLabelColor: C.TEXT,
  showLegend: false
});
```

**Pie Chart**:
```javascript
s.addChart(pres.charts.PIE, [
  {
    name: "Market Share",
    labels: ["IBM", "Google", "IonQ", "Other"],
    values: [35, 25, 20, 20]
  }
], {
  x: M, y: 1.1, w: CW * 0.5, h: 3.5,
  chartColors: [C.ACCENT, "007AFF", "FF9500", "FF3B30"],
  showPercent: true,
  showLegend: true,
  legendPos: "b"
});
```

**Line Chart**:
```javascript
s.addChart(pres.charts.LINE, [
  {
    name: "Series A",
    labels: ["2022", "2023", "2024", "2025", "2026"],
    values: [10, 15, 22, 30, 45]
  },
  {
    name: "Series B",
    labels: ["2022", "2023", "2024", "2025", "2026"],
    values: [8, 12, 18, 25, 35]
  }
], {
  x: M, y: 1.1, w: CW * 0.6, h: 3.5,
  chartColors: [C.ACCENT, "007AFF"],
  lineDataSymbol: "circle",
  lineDataSymbolSize: 8,
  showLegend: true,
  legendPos: "b",
  lineSmooth: true
});
```

**Chart placement rules**:
- Chart on left (55-60% width), insight card on right (40-45%)
- Chart height: 3.0-3.5", starting at y = 1.1"
- Always include a "KEY INSIGHT" or "TREND INSIGHT" card next to the chart
- Use accent color for primary data series
- Limit to 2-4 data series per chart

### Timeline
```javascript
// Circle
slide.addShape(pres.shapes.OVAL, {
  x, y, w: 0.25, h: 0.25,
  fill: { color: isCurrent ? ACCENT : TERTIARY }
});
// Connecting line
slide.addShape(pres.shapes.LINE, {
  x: x + 0.125, y: y + 0.25, w: 0, h: gap,
  line: { color: TERTIARY, width: 1 }
});
```

### Severity Badge
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w: 0.5, h: 0.18,
  fill: { color: severity === "High" ? "FF3B30" : "FF9500" },
  rectRadius: 0.09
});
slide.addText(severity.toUpperCase(), {
  x, y, w: 0.5, h: 0.18,
  fontSize: 8, color: "FFFFFF", bold: true,
  align: "center", valign: "middle"
});
```

### Accent Bar
- Left bar: 0.03" wide, full card height
- Top bar: full card width, 0.03" tall

## Content Guidelines

- **Minimum 6-8 slides** for a research presentation
- **Maximum 10-12 slides** for a 10-15 minute deck
- Every slide needs a category label (ALL CAPS, tracked)
- Every slide needs a clear title
- Cards should have consistent padding (0.1-0.15" internal)
- Sources consolidated on final slide only
- No "Thank You" slides — end with thesis restatement

## Key constraints

- Never repeat the same layout on consecutive slides
- Minimum 4 different layouts per 10 slides
- One primary accent color per deck maximum
- End with thesis restatement (Closing Echo), never "Thank You"
- All elements within canvas bounds (right ≤ 9.5", bottom ≤ 5.33")
- No text overlaps — verify bounding boxes

## Expected output file

`{workspace}/research/{topic}_presentation.pptx`

## See also

- Main skill: `C:\Users\User\AppData\Local\hermes\skills\pure-style-slides\SKILL.md`
- Theme file: `references/pure-minimal.md`
- Layout library: `references/layouts-compact.md`
- Icon keywords: `references/icon-keywords.json`
