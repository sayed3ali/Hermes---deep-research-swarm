# llm-wiki

**Skill name**: `llm-wiki`  
**Invocation name**: `llm-wiki`  
**Path**: `C:\Users\User\AppData\Local\hermes\skills\llm-wiki\SKILL.md`

## Role in Deep Research Swarm

Supplementary knowledge-base skill for deep-research-swarm. Use when the research topic would benefit from a structured, interlinked markdown knowledge base that persists across sessions.

## Trigger within this workflow

- The research is longitudinal: the user plans to return to the topic repeatedly.
- Findings need to be organized into a queryable wiki for later reuse.
- User explicitly mentions building a knowledge base, wiki, or research repository.

## How to use it from deep-research-swarm

1. Load the skill (`skill_view(name='llm-wiki')`) for wiki structure and query guidance.
2. After the deep-research phases complete, export key findings, insights, and source summaries into the Obsidian-compatible markdown KB.
3. Cross-link related concepts so future queries can traverse the evidence graph.

## When NOT to use

- Do not use as a default for one-off research tasks.
- The standard deep-research output files (`{topic}_insight.md`, `{topic}_cross_verification.md`, etc.) are sufficient for most handoffs.

## See also

- Main skill: `C:\Users\User\AppData\Local\hermes\skills\llm-wiki\SKILL.md`
