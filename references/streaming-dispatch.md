# Streaming Dispatch Guide

**Skill version**: v1.1.0+  
**Applies to**: Phase 1W (Wide Exploration) and Phase 3 (Parallel Deep Dive)

## Problem

Hermes `delegate_task` is synchronous — it blocks until ALL children in a batch finish. If you dispatch 3 agents and one takes 8 minutes while the others take 2 minutes, you wait 8 minutes before starting the next batch. This creates significant idle time.

## Solution: Streaming Dispatch

Use **smaller batch sizes** (1-2 agents) so completed agents are replaced faster, reducing total wait time.

## Batch Size Trade-offs

| Batch Size | Agents Running | Blocking Behavior | Total Time (example: 6 dims, 2/5/8 min) |
|---|---|---|---|
| 3 (max) | 3 | Wait for slowest in batch | Batch1: 8 min, Batch2: 5 min = **13 min** |
| 2 | 2 | Wait for slowest of 2 | Batch1: 5 min, Batch2: 8 min, Batch3: 2 min = **15 min** |
| 1 | 1 | No blocking | 2 + 5 + 8 + ... = **sum of all** |

**Insight**: Batch size 2 is often optimal. It provides parallelism while minimizing the "slowest agent" penalty. Batch size 3 only wins if all agents have similar completion times.

## Priority Ordering

Dispatch dimensions in this order:

1. **Foundational** — dimensions that other dimensions reference or build upon
2. **Broad scope** — likely to take longest (start them early)
3. **Narrow scope** — likely to complete faster (can fill gaps later)

Example for "AI Agent Market":
```
Priority 1: dim01 (Market Size) — foundational, other dims reference it
Priority 2: dim02 (Technology Landscape) — broad, takes longest
Priority 3: dim03 (Regulation) — broad, takes longest
Priority 4: dim04 (Enterprise Adoption) — moderate scope
Priority 5: dim05 (Startups) — narrow scope
Priority 6: dim06 (Workforce Impact) — narrow scope
```

## Implementation Patterns

### Pattern A: Fixed Batch Size 2 (Recommended)
```python
dimensions = sorted_by_priority(all_dimensions)
batch_size = 2

for i in range(0, len(dimensions), batch_size):
    batch = dimensions[i:i+batch_size]
    delegate_task(tasks=[
        {"goal": batch[0].goal, "context": batch[0].context, ...},
        {"goal": batch[1].goal, "context": batch[1].context, ...} if len(batch) > 1 else None
    ])
    report(f"Batch {i//batch_size + 1} complete: {[d.id for d in batch]}")
```

### Pattern B: Adaptive Batch Size
```python
# Start with batch size 2, adapt based on observed times
batch_size = 2
observed_times = []

for i in range(0, len(dimensions), batch_size):
    batch = dimensions[i:i+batch_size]
    start_time = now()
    delegate_task(tasks=[...])
    elapsed = now() - start_time
    observed_times.append(elapsed)
    
    # Adapt: if times are very similar, increase to 3; if very different, decrease to 1
    if len(observed_times) >= 2:
        variance = calculate_variance(observed_times)
        if variance < 30:  # times are similar
            batch_size = min(3, max_concurrent_children)
        elif variance > 120:  # times are very different
            batch_size = 1
```

### Pattern C: Single Dispatch (Maximum Streaming)
```python
# No parallelism, but zero idle time
for dim in dimensions:
    delegate_task(goal=dim.goal, context=dim.context, ...)
    report(f"Dimension {dim.id} complete. {len(dimensions) - i - 1} remaining.")
```

**Use when**: < 5 dimensions, or highly variable completion times (some agents take 2 min, others 10 min)

## Progress Reporting with Streaming

```
Phase 3 streaming dispatch:
- Batch 1/5 dispatched: dim01, dim02 (priority: foundational, broad)
- Batch 1 complete: dim01 (2m), dim02 (5m). Starting dim03, dim04.
- Batch 2 complete: dim03 (4m), dim04 (6m). Starting dim05.
- dim05 complete (3m). All dimensions finished.
- Total time: 14m (vs 19m with batch-size-3)
```

## When to Use Each Pattern

| Scenario | Recommended Pattern | Why |
|---|---|---|
| 3-5 dimensions, mixed scope | B (Adaptive) | Small set, adapt to observed times |
| 5-10 dimensions, similar scope | A (Fixed 2) | Good parallelism, low idle time |
| 10+ dimensions, similar scope | A (Fixed 2) or max (3) | At scale, max parallelism wins |
| Highly variable scope | C (Single) or B (Adaptive) | Avoid slow agents blocking fast ones |
| Quick mode (<5 searches each) | C (Single) | Fast agents, overhead not worth it |
| Deep mode (≥20 searches each) | A (Fixed 2) | Long-running, idle time is expensive |

## Anti-Patterns

❌ **Always using batch size 3**: Creates idle time when one agent is significantly slower  
❌ **Random dispatch order**: Foundational dimensions should start first  
❌ **Not reporting between batches**: User sees no progress for minutes  
❌ **Ignoring observed times**: First 2 batches reveal timing patterns — adapt accordingly

## See Also

- `subagent-pitfalls.md` — Common execution issues
- `SKILL.md` Phase 3 — Full streaming dispatch specification
