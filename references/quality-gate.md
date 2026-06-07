# Quality Gate Procedures

**Skill version**: v1.1.0+  
**Applies to**: Phase 7A (automated validation before final output)

## Purpose

Prevent production of low-quality or incomplete research outputs by validating all dimension files before they are consumed by the output skill.

## Gate Checks

### 1. File Existence Check

Verify every expected `{topic}_dim{NN}.md` file exists under `{workspace}/research/`.

**Failure condition**: File missing or path incorrect.  
**Action**: Trigger retry dispatch for missing dimensions.

### 2. File Size Check

Each dimension file must be > 1KB.

**Failure condition**: File size < 1KB (indicates empty or near-empty output).  
**Action**: Trigger retry dispatch.

### 3. Citation Format Check

Scan each file for:
- Inline `[^id]` markers in the text
- Matching `[^id]: Title. Date. URL` footnote definitions at end of file
- Minimum citation count: ≥5 for standard scope, ≥2 for quick scope

**Failure condition**: Zero citations or citation count below minimum.  
**Action**: Trigger retry with explicit citation requirement.

### 4. Content Completeness Check

Each dimension file must contain sections covering:
- **Current State** — what is happening now
- **Key Evidence** — data and sources
- **Tensions** — counter-arguments and conflicts

**Failure condition**: Missing any of the three required sections.  
**Action**: Trigger retry with section checklist.

## Quality Gate Report

Save results to `{workspace}/research/{topic}_quality_gate.md`:

```markdown
## Quality Gate Report
**Date**: [timestamp]
**Topic**: [topic]

### Summary
- Dimensions checked: N
- Passed: N
- Failed: N
- Warnings: N

### Detailed Results
| Dimension | Size | Citations | Sections | Status |
|-----------|------|-----------|----------|--------|
| dim01 | 12KB | 8 | 3/3 | PASS |
| dim02 | 0.8KB | 0 | 1/3 | FAIL |
| dim03 | 15KB | 12 | 3/3 | PASS |

### Retry Log
- dim02: Retry attempt 1/2 dispatched at [time]
- dim02: Retry attempt 2/2 dispatched at [time]
- dim02: Final status: PASS / PERMANENT FAIL

### Final Assessment
- Citation compliance: PASS / FAIL
- Content completeness: PASS / FAIL
- Output production: ALLOWED / BLOCKED
```

## Retry Procedure

1. Identify failed dimensions from quality gate report
2. Dispatch retry sub-agent with tightened instructions:
   - Explicit minimum search count
   - Explicit minimum citation count
   - Required section checklist
   - Increased search budget (+50%)
3. Wait for retry completion
4. Re-run quality gate on retried dimensions
5. If still failing after 2 retries, flag as "partial" in cross-verification

## Integration with Output Production

The quality gate MUST complete before Phase 7C (output skill delegation):
- All dimensions PASS → proceed to output production
- Some dimensions FAIL after max retries → proceed with warning, note partial coverage in final output
- All dimensions FAIL → block output production, report failure to user
