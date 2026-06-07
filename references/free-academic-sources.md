# Free Academic Sources Guide

**Version**: v1.1.2+  
**Purpose**: Guide sub-agents to find and cite free, open-access academic sources

## Priority Source Hierarchy

When searching for academic evidence, sub-agents MUST prioritize sources in this order:

### Tier 1: Open Access Aggregators (Highest Priority)

| Source | URL | Scope | Search Tip |
|---|---|---|---|
| **CORE** | core.ac.uk | All disciplines, 200M+ papers | `site:core.ac.uk [topic]` |
| **OpenAlex** | openalex.org | All disciplines, 250M+ works | Use API or web search with `openalex.org` |
| **Semantic Scholar** | semanticscholar.org | All disciplines, AI-enhanced | `site:semanticscholar.org [topic]` |
| **Google Scholar** | scholar.google.com | All disciplines | Add `filetype:pdf` or `intitle:[topic]` |

### Tier 2: Discipline-Specific Repositories

| Source | URL | Discipline | Search Tip |
|---|---|---|---|
| **arXiv** | arxiv.org | Physics, CS, math, quantitative biology | `site:arxiv.org [topic]` or use arxiv skill |
| **PubMed Central** | pmc.ncbi.nlm.nih.gov | Biomedical, life sciences | `site:pmc.ncbi.nlm.nih.gov [topic]` |
| **Europe PMC** | europepmc.org | Biomedical, life sciences | `site:europepmc.org [topic]` |
| **bioRxiv** | biorxiv.org | Biology preprints | `site:biorxiv.org [topic]` |
| **medRxiv** | medrxiv.org | Medicine preprints | `site:medrxiv.org [topic]` |
| **SSRN** | ssrn.com | Social sciences, humanities | `site:ssrn.com [topic]` |
| **RePEc** | repec.org | Economics | `site:repec.org [topic]` |
| **HAL** | hal.science | French research, all disciplines | `site:hal.science [topic]` |
| **OSF** | osf.io | All disciplines, preprints | `site:osf.io [topic]` |

### Tier 3: Open Access Journals and Directories

| Source | URL | Scope | Search Tip |
|---|---|---|---|
| **DOAJ** | doaj.org | Peer-reviewed OA journals | Search directory, then visit journal |
| **PLOS** | plos.org | Science, medicine | `site:plos.org [topic]` |
| **BMC** | biomedcentral.com | Biomed, all OA | `site:biomedcentral.com [topic]` |
| **Frontiers** | frontiersin.org | All disciplines | `site:frontiersin.org [topic]` |
| **MDPI** | mdpi.com | All disciplines | `site:mdpi.com [topic]` |
| **Hindawi** | hindawi.com | All disciplines | `site:hindawi.com [topic]` |
| **JSTOR Open** | jstor.org/open | Humanities, social sciences | `site:jstor.org [topic]` (filter for OA) |
| **Directory of Open Access Books** | doabooks.org | Academic books | Search directory |

### Tier 4: Institutional Repositories

| Source | URL | Scope | Search Tip |
|---|---|---|---|
| **MIT DSpace** | dspace.mit.edu | MIT research | `site:dspace.mit.edu [topic]` |
| **Harvard DASH** | dash.harvard.edu | Harvard research | `site:dash.harvard.edu [topic]` |
| **Stanford** | searchworks.stanford.edu | Stanford research | `site:searchworks.stanford.edu [topic]` |
| **Cambridge Digital** | repository.cam.ac.uk | Cambridge research | `site:repository.cam.ac.uk [topic]` |
| **Oxford Research** | ora.ox.ac.uk | Oxford research | `site:ora.ox.ac.uk [topic]` |
| **ETH Zurich** | ethz.ch | ETH Zurich research | `site:ethz.ch [topic]` |

## Search Operators for Free Academic Content

### Google Scholar / Web Search

```
# Find PDFs directly
[topic] filetype:pdf

# Search specific open access sites
[topic] site:arxiv.org OR site:pmc.ncbi.nlm.nih.gov OR site:core.ac.uk

# Find preprints
[topic] site:biorxiv.org OR site:medrxiv.org OR site:ssrn.com

# Institutional repositories
[topic] site:.edu filetype:pdf

# Government research
[topic] site:.gov filetype:pdf

# Exclude paywalled sites
[topic] -site:sciencedirect.com -site:springer.com -site:wiley.com filetype:pdf
```

### CORE Search

```
# Direct search
https://core.ac.uk/search?q=[topic]

# API (no key required for basic search)
https://api.core.ac.uk/v3/search/works?q=[topic]
```

### OpenAlex Search

```
# Web search
https://openalex.org/works?page=1&filter=default.search:[topic]

# API (no key required)
https://api.openalex.org/works?search=[topic]
```

### Semantic Scholar

```
# Web search
https://www.semanticscholar.org/search?q=[topic]

# API (free tier, no key required for basic)
https://api.semanticscholar.org/graph/v1/paper/search?query=[topic]
```

## Unpaywall Integration

Unpaywall is a browser extension and API that finds legal open-access versions of paywalled papers.

```
# Web search with Unpaywall
[topic] unpaywall open access

# API (email required for key)
https://api.unpaywall.org/v2/[DOI]?email=your@email.com
```

## Citation Format for Open Access Sources

When citing open access sources, include the access information:

**Journal article (OA)**:
```
Author, A.A. (Year) 'Title of article', Journal Name, Volume(Issue), pp. pages.
Available at: URL (Accessed: Day Month Year).
```

**Preprint**:
```
Author, A.A. (Year) 'Title of preprint', Repository Name. Available at: URL
(Accessed: Day Month Year).
```

**Repository paper**:
```
Author, A.A. (Year) 'Title of paper', Repository Name, Institution.
Available at: URL (Accessed: Day Month Year).
```

## Quality Indicators for Free Sources

| Indicator | Good Sign | Caution |
|---|---|---|
| Peer review | Published in DOAJ-listed journal | Unmoderated preprint server |
| Citations | High citation count on Semantic Scholar | Zero citations, very recent |
| Institution | Top university repository | Unknown institution |
| Version | Published version (VoR) | Early draft, not peer-reviewed |
| License | CC-BY or CC0 | All rights reserved, no license |

## Sub-Agent Instructions

When dispatching research sub-agents, include this in their context:

```
## Free Academic Source Priority

When searching for academic evidence, prioritize FREE open-access sources:

1. **First search**: Use `site:core.ac.uk OR site:arxiv.org OR site:pmc.ncbi.nlm.nih.gov OR site:semanticscholar.org` with your query
2. **For preprints**: Check bioRxiv, medRxiv, SSRN, OSF
3. **For journals**: Check DOAJ-listed journals, PLOS, BMC, Frontiers, MDPI
4. **For institutional research**: Search `.edu` repositories
5. **For government research**: Search `.gov` sites

**Always prefer**:
- Peer-reviewed OA journals over preprints
- Published versions over drafts
- Sources with clear licensing (CC-BY, CC0)
- Recent sources (2020+) for current topics

**Avoid**:
- Sci-Hub or illegal access methods
- Paywalled content without open-access alternatives
- Unverified preprints for medical/clinical claims
```

## API Access (No Key Required)

| API | Endpoint | Rate Limit | Notes |
|---|---|---|---|
| CORE | `api.core.ac.uk/v3/search/works` | 1000/day | No key needed |
| OpenAlex | `api.openalex.org/works` | 100k/day | No key needed |
| Semantic Scholar | `api.semanticscholar.org/graph/v1/paper/search` | 100/min | No key for basic |
| Crossref | `api.crossref.org/works` | 50/sec | Polite pool |
| DOAJ | `doaj.org/api/v2/search/articles` | 100/day | No key needed |

## Integration with Existing Skills

| Skill | How to Use | When |
|---|---|---|
| `arxiv` | `skill_view(name='arxiv')` for physics/CS/math topics | Phase 1 or Phase 3 |
| `blogwatcher` | Monitor academic blogs and RSS feeds | Phase 1 for emerging research |
| `llm-wiki` | Build knowledge base from findings | Phase 6 for synthesis |
