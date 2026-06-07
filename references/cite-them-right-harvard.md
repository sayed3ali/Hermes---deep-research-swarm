# Cite Them Right Harvard Reference Format

**Version**: 12th Edition  
**Used by**: deep-research-swarm DOCX output (academic style)

## In-Text Citations

| Scenario | Format | Example |
|---|---|---|
| One author | (Surname, Year) | (Smith, 2020) |
| Two authors | (Surname and Surname, Year) | (Smith and Jones, 2019) |
| Three+ authors | (Surname et al., Year) | (Smith et al., 2018) |
| Direct quote | (Surname, Year, p. X) | (Smith, 2020, p. 45) |
| No author | ('Title', Year) or (Organisation, Year) | ('Climate Change', 2021) |
| No date | (Surname, no date) | (Smith, no date) |
| Same author, same year | (Surname, Yeara), (Surname, Yearb) | (Smith, 2020a), (Smith, 2020b) |

## Reference List Format

Reference list is alphabetised by author surname. Use hanging indent (0.33").

### Book
```
Author, A.A. (Year) Title of Book. Place: Publisher.
```
Example: Bryman, A. (2016) Social Research Methods. 5th edn. Oxford: Oxford University Press.

### Edited Book
```
Editor, A.A. (ed.) (Year) Title of Book. Place: Publisher.
```

### Journal Article
```
Author, A.A. (Year) 'Title of article', Title of Journal, Volume(Issue), pp. page range.
```
Example: Clegg, S.R. and Cartner, M. (1990) 'Organisation and management in East Asia', Organisation Studies, 11(1), pp. 123-145.

### Website / Online Source
```
Author or Organisation. (Year) Title of webpage. Available at: URL (Accessed: Day Month Year).
```
Example: BBC News. (2021) Climate change: UK aims to cut emissions by 78% by 2035. Available at: https://www.bbc.co.uk/news (Accessed: 21 April 2021).

### Report
```
Author or Organisation. (Year) Title of Report. Place: Publisher.
```
Example: World Economic Forum. (2025) The Future of Jobs Report 2025. Geneva: World Economic Forum.

### Government Publication
```
Government Name. (Year) Title. Place: Publisher.
```
Example: UK Government. (2023) Policy Paper: AI Regulation. London: HM Government.

### Newspaper Article
```
Author, A.A. (Year) 'Title of article', Title of Newspaper, Day Month, p. page.
```

### Conference Paper
```
Author, A.A. (Year) 'Title of paper', in Title of Conference Proceedings. Place: Publisher, pp. pages.
```

### Dissertation / Thesis
```
Author, A.A. (Year) 'Title of dissertation', Degree level. Institution.
```

## Key Rules

1. **Alphabetical order**: Reference list is sorted by first author surname
2. **Page ranges**: Use `pp.` for multiple pages, `p.` for single page
3. **Quotation marks**: Single quotes for article/chapter titles
4. **Italics**: Italicise book and journal titles
5. **Online sources**: Always include `Available at:` and `Accessed:`
6. **Multiple works by same author**: Order by year (earliest first)
7. **Same author + same year**: Add a, b, c suffixes
8. **Hanging indent**: 0.33" indent with negative first-line indent
9. **Spacing**: 6pt after each reference entry
10. **Author separator**: Use `and` (not `&`) between authors — Cite Them Right convention
11. **DOIs**: Write as `https://doi.org/10.xxxx/xxxxx` (full URL, not doi: prefix)

## Quick Checklist

Before finalising the reference list, verify every item:

- [ ] Reference list is alphabetical by first author's surname
- [ ] Hanging indent applied to all entries (0.33" left indent, -0.33" first line)
- [ ] In-text citations use round brackets with comma after author: `(Author, Year)`
- [ ] Page numbers use `p.` or `pp.` (not just numbers)
- [ ] Standalone titles (books, journals, reports) in italics
- [ ] Article/chapter titles in 'single quotes'
- [ ] Online sources include `Available at:` and `(Accessed: Day Month Year)`
- [ ] DOIs written as `https://doi.org/...` (full URL)
- [ ] Consistent use of `and` (not `&`) between authors
- [ ] Same author + same year uses a, b, c suffixes
- [ ] No entries begin with http:// or https:// (always include author/organisation)
- [ ] No bare URLs in reference list (wrap in `Available at:`)

## Formatting Examples by Source Type

### Book with edition
```
Bryman, A. (2016) Social Research Methods. 5th edn. Oxford: Oxford University Press.
```

### Journal article with DOI
```
Clegg, S.R. and Cartner, M. (1990) 'Organisation and management in East Asia', Organisation Studies, 11(1), pp. 123-145. Available at: https://doi.org/10.1177/017084069001100107
```

### Website / Online source
```
BBC News. (2021) 'Climate change: UK aims to cut emissions by 78% by 2035'. Available at: https://www.bbc.co.uk/news (Accessed: 21 April 2021).
```

### Report
```
World Economic Forum. (2025) The Future of Jobs Report 2025. Geneva: World Economic Forum.
```

### Government publication
```
UK Government. (2023) Policy Paper: AI Regulation. London: HM Government.
```

### Newspaper article
```
Smith, J. (2021) 'New policy announced', The Guardian, 15 March, p. 12.
```

### Conference paper
```
Jones, A. (2020) 'Remote work and productivity', in Proceedings of the 2020 ACM Conference. New York: ACM, pp. 45-56.
```

### Dissertation / Thesis
```
Brown, L. (2019) 'The impact of flexible working on employee wellbeing', PhD thesis. University of Manchester.
```

### NBER Working Paper
```
Bloom, N., Liang, J., Roberts, J. and Ying, Z.J. (2015) 'Does working from home work? Evidence from a Chinese experiment'. NBER Working Paper No. 18871. Available at: https://www.nber.org/papers/w18871 (Accessed: 7 June 2026).
```

## Common Errors to Avoid

| Error | Correction |
|---|---|
| `Smith & Jones (2019)` | `Smith and Jones (2019)` |
| `(Smith 2020)` | `(Smith, 2020)` |
| `Smith (2020) p.45` | `(Smith, 2020, p. 45)` |
| `*Journal of Studies*` | `*Journal of Studies*` (italics) |
| `"Article Title"` | `'Article Title'` (single quotes) |
| `doi: 10.xxxx` | `https://doi.org/10.xxxx` |
| `Available at: www.example.com` | `Available at: https://www.example.com` |
| `Accessed 21 April 2021` | `(Accessed: 21 April 2021)` |
| `pp.123-145` | `pp. 123-145` (space after pp.) |
| `1st ed.` | `1st edn.` (Cite Them Right convention) |

## Conversion from Inline Citations

The deep-research-swarm produces `[^id]` inline citations. Convert these to Harvard:

1. Replace `[^id]` with `(Author, Year)` in the text
2. Build a Reference List section at the end
3. Each `[^id]: Title. Date. URL` footnote becomes a full Harvard reference
4. For web sources: `Author. (Year) Title. Available at: URL (Accessed: Day Month Year).`
5. For reports: `Author. (Year) Title. Place: Publisher.`
6. For journals: `Author. (Year) 'Title', Journal, Volume(Issue), pp. pages.`
