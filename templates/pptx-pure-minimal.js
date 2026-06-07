// Pure Minimal PPTX Template for deep-research-swarm
// Generated from v1.1.1 testing — validated with 10-slide deck, no overlaps
// Includes charts (bar, pie, line) per pure-style-slides design system
//
// Usage: Copy this template, replace content placeholders, run with Node.js + pptxgenjs
//        npm install pptxgenjs
//
// Design system: Swiss-inspired, white backgrounds, sharp corners, single accent color
// Canvas: 10" x 5.625" (16:9) — all elements must stay within right <= 9.5", bottom <= 5.33"

const PptxGenJS = require("pptxgenjs");
const pres = new PptxGenJS();
pres.layout = "LAYOUT_16x9";

// === CANVAS & GRID ===
const W = 10.0, H = 5.625, M = 0.5, CW = 9.0;

// === COLOR SYSTEM ===
const C = {
  BLACK: "1A1A1A", WHITE: "FFFFFF", OFF: "F5F5F5",
  TEXT: "333333", SEC: "888888", TER: "CCCCCC",
  ACCENT: "34C759"  // Change per topic: 007AFF tech, FF3B30 urgency, F96167 investment
};
const F = { H: "Calibri", B: "Calibri Light" };

// === HELPER FUNCTIONS ===
function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || "FFFFFF" },
    shadow: { type: "outer", blur: 3, offset: 1, angle: 270, color: "000000", opacity: 0.06 }
  });
  if (opts.accentLeft) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.03, h, fill: { color: opts.accentLeft } });
  }
  if (opts.accentTop) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.03, fill: { color: opts.accentTop } });
  }
}

function cat(slide, text, y = 0.25) {
  slide.addText(text.toUpperCase(), {
    x: M, y, w: CW, h: 0.18,
    fontSize: 9, fontFace: F.H, color: C.SEC,
    bold: true, charSpacing: 3, align: "left", valign: "top"
  });
}

function titl(slide, text, y = 0.45, size = 24) {
  slide.addText(text, {
    x: M, y, w: CW, h: 0.55,
    fontSize: size, fontFace: F.H, color: C.BLACK,
    bold: true, align: "left", valign: "top"
  });
}

function body(slide, text, x, y, w, h, size = 11, color = C.TEXT) {
  slide.addText(text, { x, y, w, h, fontSize: size, fontFace: F.B, color, align: "left", valign: "top" });
}

function bignum(slide, text, x, y, w, h, size = 48) {
  slide.addText(text, { x, y, w, h, fontSize: size, fontFace: F.H, color: C.ACCENT, bold: true, align: "left", valign: "top" });
}

// === CHART DATA PLACEHOLDERS ===
// Replace these with actual values when generating
const BAR_DATA = { labels: ["A", "B", "C", "D"], values: [10, 20, 30, 40] };
const PIE_DATA = { labels: ["A", "B", "C", "D"], values: [25, 25, 25, 25] };
const LINE_DATA = {
  series1: { name: "Series A", labels: ["2022", "2023", "2024", "2025", "2026"], values: [10, 15, 22, 30, 45] },
  series2: { name: "Series B", labels: ["2022", "2023", "2024", "2025", "2026"], values: [8, 12, 18, 25, 35] }
};

// === SLIDE 1: COVER ===
let s = pres.addSlide();
s.background = { color: C.WHITE };
s.addShape(pres.shapes.RECTANGLE, { x: M, y: 2.8, w: 1.2, h: 0.04, fill: { color: C.ACCENT } });
s.addText("{{TITLE}}", { x: M, y: 1.5, w: CW, h: 0.8, fontSize: 32, fontFace: F.H, color: C.BLACK, bold: true, align: "left", valign: "top" });
s.addText("{{SUBTITLE}}", { x: M, y: 2.4, w: CW * 0.8, h: 0.4, fontSize: 14, fontFace: F.B, color: C.TEXT, align: "left", valign: "top" });
body(s, "{{DATE}}", M, 4.9, 3, 0.18, 10, C.SEC);
body(s, "{{AUTHOR}}", M + 3.2, 4.9, 4, 0.18, 10, C.SEC);

// === SLIDE 2: AGENDA ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Overview");
titl(s, "Agenda", 0.45, 24);

const agenda = [
  { num: "01", title: "{{SECTION_1}}", desc: "{{DESC_1}}" },
  { num: "02", title: "{{SECTION_2}}", desc: "{{DESC_2}}" },
  { num: "03", title: "{{SECTION_3}}", desc: "{{DESC_3}}" },
  { num: "04", title: "{{SECTION_4}}", desc: "{{DESC_4}}" },
  { num: "05", title: "{{SECTION_5}}", desc: "{{DESC_5}}" },
  { num: "06", title: "{{SECTION_6}}", desc: "{{DESC_6}}" }
];

const agCols = 3, agCardW = (CW - 0.3) / agCols, agCardH = 1.6;
agenda.forEach((item, i) => {
  const col = i % agCols, row = Math.floor(i / agCols);
  const ax = M + col * (agCardW + 0.15);
  const ay = 1.1 + row * (agCardH + 0.15);
  card(s, ax, ay, agCardW, agCardH, { fill: C.WHITE });
  s.addShape(pres.shapes.OVAL, { x: ax + 0.1, y: ay + 0.12, w: 0.3, h: 0.3, fill: { color: C.ACCENT } });
  s.addText(item.num, { x: ax + 0.1, y: ay + 0.12, w: 0.3, h: 0.3, fontSize: 10, fontFace: F.H, color: C.WHITE, bold: true, align: "center", valign: "middle" });
  s.addText(item.title, { x: ax + 0.5, y: ay + 0.12, w: agCardW - 0.6, h: 0.25, fontSize: 13, fontFace: F.H, color: C.BLACK, bold: true, align: "left", valign: "top" });
  s.addText(item.desc, { x: ax + 0.1, y: ay + 0.55, w: agCardW - 0.2, h: 0.4, fontSize: 10, fontFace: F.B, color: C.TEXT, align: "left", valign: "top" });
});

// === SLIDE 3: INTRODUCTION ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Context");
titl(s, "{{INTRO_TITLE}}", 0.45, 24);
body(s, "{{INTRO_PARA_1}}", M, 1.1, CW * 0.52, 0.5, 13, C.TEXT);
body(s, "{{INTRO_PARA_2}}", M, 1.7, CW * 0.52, 0.9, 11, C.TEXT);

const introCardX = M + CW * 0.55;
card(s, introCardX, 1.1, CW * 0.45, 2.4, { fill: C.OFF, accentLeft: C.ACCENT });
body(s, "RESEARCH QUESTION", introCardX + 0.12, 1.25, 3, 0.18, 9, C.SEC);
body(s, "{{RESEARCH_QUESTION}}", introCardX + 0.12, 1.5, CW * 0.42, 0.6, 13, C.BLACK);
body(s, "{{SCOPE}}", introCardX + 0.12, 2.2, CW * 0.42, 0.4, 10, C.TEXT);

// === SLIDE 4: BAR CHART ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Data Analysis");
titl(s, "{{BAR_CHART_TITLE}}", 0.45, 24);

s.addChart(pres.charts.BAR, [
  {
    name: "{{BAR_SERIES_NAME}}",
    labels: BAR_DATA.labels,
    values: BAR_DATA.values
  }
], {
  x: M, y: 1.1, w: CW * 0.55, h: 3.5,
  barDir: "bar",
  chartColors: [C.ACCENT],
  showValue: true,
  dataLabelColor: C.TEXT,
  dataLabelFontSize: 10,
  dataLabelPosition: "outEnd",
  catAxisLabelColor: C.TEXT,
  catAxisLabelFontSize: 10,
  valAxisLabelColor: C.TEXT,
  valAxisLabelFontSize: 9,
  showLegend: false,
  lineDataBorder: { pt: 0 },
  dataBorder: { pt: 0 }
});

// Insight card next to chart
const barCardX = M + CW * 0.58;
card(s, barCardX, 1.1, CW * 0.42, 3.5, { fill: C.OFF, accentLeft: C.ACCENT });
body(s, "KEY INSIGHT", barCardX + 0.12, 1.25, 3, 0.18, 9, C.SEC);
body(s, "{{BAR_INSIGHT}}", barCardX + 0.12, 1.5, CW * 0.38, 1.5, 13, C.BLACK);
body(s, "{{BAR_DETAIL}}", barCardX + 0.12, 3.1, CW * 0.38, 1.2, 11, C.TEXT);

// === SLIDE 5: PIE CHART ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Market Breakdown");
titl(s, "{{PIE_CHART_TITLE}}", 0.45, 24);

s.addChart(pres.charts.PIE, [
  {
    name: "{{PIE_SERIES_NAME}}",
    labels: PIE_DATA.labels,
    values: PIE_DATA.values
  }
], {
  x: M, y: 1.1, w: CW * 0.5, h: 3.5,
  chartColors: [C.ACCENT, "007AFF", "FF9500", "FF3B30"],
  showPercent: true,
  showValue: false,
  dataLabelColor: C.WHITE,
  dataLabelFontSize: 11,
  dataLabelPosition: "bestFit",
  showLegend: true,
  legendPos: "b",
  legendColor: C.TEXT,
  legendFontSize: 10
});

// Right side: breakdown list
const pieRightX = M + CW * 0.53;
card(s, pieRightX, 1.1, CW * 0.47, 3.5, { fill: C.WHITE });
body(s, "SEGMENT DETAIL", pieRightX + 0.12, 1.25, 3, 0.18, 9, C.SEC);

const pieItems = [
  { color: C.ACCENT, label: "{{PIE_LABEL_1}}", value: "{{PIE_VALUE_1}}%" },
  { color: "007AFF", label: "{{PIE_LABEL_2}}", value: "{{PIE_VALUE_2}}%" },
  { color: "FF9500", label: "{{PIE_LABEL_3}}", value: "{{PIE_VALUE_3}}%" },
  { color: "FF3B30", label: "{{PIE_LABEL_4}}", value: "{{PIE_VALUE_4}}%" }
];
pieItems.forEach((item, i) => {
  const iy = 1.55 + i * 0.55;
  s.addShape(pres.shapes.RECTANGLE, { x: pieRightX + 0.12, y: iy, w: 0.12, h: 0.12, fill: { color: item.color } });
  body(s, item.label, pieRightX + 0.3, iy - 0.02, 2.5, 0.2, 12, C.BLACK);
  body(s, item.value, pieRightX + 0.3, iy + 0.2, 2.5, 0.18, 11, C.SEC);
});

// === SLIDE 6: LINE CHART ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Trend Analysis");
titl(s, "{{LINE_CHART_TITLE}}", 0.45, 24);

s.addChart(pres.charts.LINE, [
  {
    name: LINE_DATA.series1.name,
    labels: LINE_DATA.series1.labels,
    values: LINE_DATA.series1.values
  },
  {
    name: LINE_DATA.series2.name,
    labels: LINE_DATA.series2.labels,
    values: LINE_DATA.series2.values
  }
], {
  x: M, y: 1.1, w: CW * 0.6, h: 3.5,
  chartColors: [C.ACCENT, "007AFF"],
  lineDataSymbol: "circle",
  lineDataSymbolSize: 8,
  showValue: false,
  catAxisLabelColor: C.TEXT,
  catAxisLabelFontSize: 10,
  valAxisLabelColor: C.TEXT,
  valAxisLabelFontSize: 9,
  showLegend: true,
  legendPos: "b",
  legendColor: C.TEXT,
  legendFontSize: 10,
  lineSmooth: true
});

// Right side: trend insight
const lineRightX = M + CW * 0.63;
card(s, lineRightX, 1.1, CW * 0.37, 3.5, { fill: C.OFF, accentLeft: C.ACCENT });
body(s, "TREND INSIGHT", lineRightX + 0.12, 1.25, 3, 0.18, 9, C.SEC);
body(s, "{{LINE_INSIGHT}}", lineRightX + 0.12, 1.5, CW * 0.33, 1.5, 13, C.BLACK);
body(s, "{{LINE_DETAIL}}", lineRightX + 0.12, 3.1, CW * 0.33, 1.2, 11, C.TEXT);

// === SLIDE 7: STAT CARDS ROW ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Key Metrics");
titl(s, "{{STATS_TITLE}}", 0.45, 24);

const stats = [
  { num: "{{STAT_1_NUM}}", label: "{{STAT_1_LABEL}}", sub: "{{STAT_1_SUB}}" },
  { num: "{{STAT_2_NUM}}", label: "{{STAT_2_LABEL}}", sub: "{{STAT_2_SUB}}" },
  { num: "{{STAT_3_NUM}}", label: "{{STAT_3_LABEL}}", sub: "{{STAT_3_SUB}}" }
];
const statW = (CW - 0.4) / 3;
stats.forEach((st, i) => {
  const sx = M + i * (statW + 0.2);
  card(s, sx, 1.2, statW, 2.8, { fill: C.WHITE, accentTop: C.ACCENT });
  bignum(s, st.num, sx + 0.15, 1.5, statW - 0.3, 0.7, 42);
  body(s, st.label, sx + 0.15, 2.3, statW - 0.3, 0.25, 13, C.BLACK);
  body(s, st.sub, sx + 0.15, 2.6, statW - 0.3, 0.3, 10, C.SEC);
});

// === SLIDE 8: INSIGHTS/CONCLUSION ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Synthesis");
titl(s, "{{INSIGHTS_TITLE}}", 0.45, 24);

const insights = [
  { title: "{{INSIGHT_1_TITLE}}", desc: "{{INSIGHT_1_DESC}}" },
  { title: "{{INSIGHT_2_TITLE}}", desc: "{{INSIGHT_2_DESC}}" },
  { title: "{{INSIGHT_3_TITLE}}", desc: "{{INSIGHT_3_DESC}}" }
];
insights.forEach((ins, i) => {
  const iy = 1.1 + i * 1.15;
  card(s, M, iy, CW, 1.0, { fill: C.WHITE, accentLeft: C.ACCENT });
  body(s, ins.title, M + 0.12, iy + 0.12, CW - 0.24, 0.25, 13, C.BLACK);
  body(s, ins.desc, M + 0.12, iy + 0.42, CW - 0.24, 0.5, 11, C.TEXT);
});

// === SLIDE 9: CLOSING ===
s = pres.addSlide();
s.background = { color: C.WHITE };
cat(s, "Outlook");
s.addText("{{THESIS}}", { x: M, y: 1.6, w: CW, h: 0.7, fontSize: 28, fontFace: F.H, color: C.BLACK, bold: true, align: "left", valign: "top" });
body(s, "{{CLOSING_SENTENCE}}", M, 2.45, CW * 0.8, 0.5, 13, C.TEXT);

s.addShape(pres.shapes.RECTANGLE, { x: M, y: 3.5, w: CW, h: 1.5, fill: { color: C.OFF } });
body(s, "SOURCES", M + 0.1, 3.6, 2, 0.18, 9, C.SEC);
const sources = [
  "{{SOURCE_1}}",
  "{{SOURCE_2}}",
  "{{SOURCE_3}}",
  "{{SOURCE_4}}",
  "{{SOURCE_5}}"
];
sources.forEach((src, i) => {
  body(s, "• " + src, M + 0.1, 3.85 + i * 0.2, CW - 0.2, 0.18, 9, C.TEXT);
});

// === SAVE ===
pres.writeFile({ fileName: "{{OUTPUT_PATH}}" })
  .then(() => console.log("PPTX created successfully: 9 slides with charts"))
  .catch(err => console.error("Error:", err));

// === POST-GENERATION VERIFICATION ===
// Run this after generation to check for overlaps:
/*
const { Presentation } = require("pptxgenjs"); // actually python-pptx
// See references/pure-style-slides.md for full verification script
*/