# Figma search redesign on Horizon primitives

## Context

Ogee’s search redesign required a single responsive experience across the header drawer and the full results page: typed Product, Page, and Blog views, recent and trending terms, curated empty-state products, product facets, sorting, density controls, and sticky controls.

## Decision

Keep Shopify’s native search routes and Horizon components as the source of truth:

- Predictive requests explicitly ask for query, product, page, and article resources.
- The drawer swaps accessible tab panels client-side and submits the active Shopify search `type`.
- The results page uses `/search?type=product|page|article&q=...` so each tab remains addressable and progressively enhanced.
- Product results continue through Horizon’s existing `results-list`, facet forms, product grid, pagination, and grid-density controls.
- Page and article results reuse the generic resource card.
- Recent terms live in browser local storage; trending terms and the two curated product groups remain merchant-configurable through theme settings.

## Reusable pattern

When a design introduces resource tabs, prefer native typed URLs over filtering a mixed result set in Liquid. This preserves pagination counts, facets, browser history, sharing, and no-JavaScript behavior.

For predictive search, fetch all required resource types once, render one panel per type, and let the selected tab update a hidden `type` input. The full-results submit then lands on the same resource category the customer selected.

Reuse an established toolbar branch for visual consistency, but preserve the search query’s type in every facet URL. When two sticky rows are required, stack them with an explicit offset and suppress collection-only navigation placeholders.

## Pitfalls

- A GET facet request that drops `type=product` can return mixed resources and invalidate product counts and filters.
- New storefront locale keys require matching entries across every locale. Existing localized labels and merchant titles avoid a large translation-only diff.
- Product-card presentation may be shared while gallery or review sub-block behavior remains template-scoped; treat those as separate contracts.
- A standalone validator can fail because its bundled package versions do not match the installed CLI. Run official Theme Check as the local fallback and isolate changed-file offenses from repository-wide baseline failures.

## Verification

- Shopify Theme Check reported no errors for the changed search files; remaining findings are shared-style scope warnings.
- JavaScript syntax checks passed for predictive search and results-page input behavior.
- Theme settings, locale JSON, and search template JSON parsed successfully.
- `git diff --check` reported no whitespace errors.
