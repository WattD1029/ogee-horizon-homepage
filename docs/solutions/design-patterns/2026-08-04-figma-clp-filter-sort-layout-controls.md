---
title: Build CLP Filter Sort Layout Controls on Horizon Facets
category: design-patterns
date: 2026-08-04
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - filters
  - sorting
  - layout-controls
---

# Build CLP Filter Sort Layout Controls on Horizon Facets

## Problem

The collection landing page redesign needed a slim filter, sort, product count,
and layout-control toolbar that matches the Figma desktop and mobile nodes:

- desktop: product count on the left, `Filter`, divider, `Sort By:`, current
  sort label, and caret on the right
- mobile: `Refine`, divider, product count on the left, and a compact `View`
  layout control on the right

The theme already had Horizon's facets block, sorting snippet, grid density
snippet, AJAX section rendering, and product-grid layout persistence. Replacing
that system would risk filter URL updates, sort behavior, drawer filtering, and
session-backed layout switching.

## Symptoms

- `sections/main-collection.liquid` renders a static `filters` block before
  the product grid.
- `blocks/filters.liquid` is shared by collection and search templates.
- Horizontal filters render individual facet dropdowns, a product count, sort,
  and desktop grid density controls.
- Mobile filters already open the drawer and render mobile grid density
  controls.
- `snippets/product-grid.liquid` stores and restores `product-grid-view` values
  from session storage.
- `assets/results-list.js` already owns `results-list/updateLayout`.
- The Figma mobile view mark is slimmer than the built-in Horizon grid icons,
  but the existing radio controls are the real behavior contract.
- A visual QA pass showed that later base Horizon facets styles could still
  push product count to the right, stack the sort label below `Filter`, and
  reveal the default mobile grid chips unless the CLP overrides won late in the
  cascade.

## What Didn't Work

### Replacing the facets block

A brand-new toolbar section would have had to recreate Shopify filter forms,
sort radio inputs, filter drawer coordination, URL parameter cleanup, AJAX
section rendering, and layout persistence. That would duplicate stable Horizon
behavior and increase regression risk.

### Restyling shared filters globally

The filters block is also used by search. Applying the CLP visual treatment to
the shared block without route scoping would unexpectedly alter search results
controls.

### Using only a decorative mobile view icon

The Figma mobile node shows a compact `View` treatment, but the storefront needs
real one-column and two-column controls. Keeping the existing radio inputs
preserves keyboard access, screen-reader labels, and `results-list/updateLayout`
behavior.

### Adding a new section dependency

The previous CLP navigation work showed that adding a new section type can be
brittle when the upload path applies a template before the new section file is
present. The toolbar already belongs to the existing `filters` block, so it is
safer to extend that block instead of introducing another template dependency.

## Solution

Extend the existing facets system with collection-scoped CLP presentation:

- `blocks/filters.liquid`
- `snippets/sorting.liquid`
- `snippets/grid-density-controls.liquid`
- `locales/en.default.json`

In `blocks/filters.liquid`, derive `use_clp_controls` from the collection
template and horizontal filter style. When true:

- add `facets--clp-controls`, `facets-block-wrapper--clp-controls`, and
  `facets__form--clp-controls`
- render product count on the desktop left side
- render a desktop right-side control group with the existing filter drawer
  trigger and existing sorting snippet
- suppress desktop grid density controls for this Figma composition
- render mobile `Refine`, divider, product count, and existing mobile grid
  density controls
- keep the drawer filter form intact for filtering and mobile sorting

In `snippets/sorting.liquid`, add an optional `show_sort_prefix` parameter. The
default path still renders `Sort`; the CLP toolbar passes `show_sort_prefix:
true` to render `Sort By:` and the active sort label in the summary.

In `snippets/grid-density-controls.liquid`, add a mobile-only `View` label and
hide it by default. Scoped CSS reveals and styles the label only when the
control sits inside `.facets-toggle--clp-controls`.

In `locales/en.default.json`, add translation keys for:

- `actions.refine`
- `actions.sort_by`
- `content.grid_view.view`
- `content.collection_product_count`

After visual QA, add a final CLP-specific override block late in the filters
stylesheet so it wins after the default `.products-count-wrapper`,
`.facets__summary`, and mobile grid-density rules. The follow-up also scopes the
CLP product count copy to `collection_product_count` so the toolbar reads
`Products` without changing shared `item_count` copy.

## Why This Works

The implementation keeps Shopify's existing behavior-bearing structure in
place. Sorting remains a real `sort_by` radio group inside the facets form.
Filtering still opens the existing drawer and submits through
`facets-form-component`. Layout controls still call `results-list/updateLayout`
and continue to persist per viewport through `sessionStorage`.

The visual changes are scoped by route and style, so search pages retain their
existing horizontal facets UI. This matters because `blocks/filters.liquid` is a
shared block, not a CLP-only component.

The mobile `View` control adds the Figma label while preserving both radio
options. That keeps the compact design intent without degrading accessibility or
the already-tested grid switching contract.

## Floating Bar Follow-Up

A later desktop refinement changed the CLP toolbar into a floating bar once the
customer scrolls into the product grid. The filters block now renders a hidden
navigation slot inside the collection-scoped toolbar branch, upgrades the
wrapper to a lightweight `clp-floating-controls` custom element, and clones the
links from the existing CLP intro navigation. In the floating state, the product
count is hidden and the compact bar shows subcollection navigation with
`Filter | Sort By` actions.

This keeps the floating bar synced with merchant-configured CLP navigation
labels and URLs without duplicating collection handles in the shared filters
block. The behavior is guarded to desktop breakpoints, so the mobile
`Refine | Products | View` toolbar remains unchanged.

The final Figma dimension node set the floating state at 54px high with 1200px
centered content, 16px navigation/action gaps, 13px uppercase navigation labels,
and a 3-column product grid whose 394.67px cards require 8px gutters inside the
1200px content area. The collection template therefore uses 8px horizontal and
vertical product-grid gaps for this CLP.

## Prevention

- Before redesigning filter controls, identify whether the current block owns
  forms, URL parameters, AJAX rendering, drawers, or layout persistence.
- Scope CLP-specific visual treatments in shared snippets and blocks so search
  and other routes do not inherit collection-only design changes.
- Prefer optional snippet parameters for small label/presentation variants over
  duplicating a snippet.
- Preserve native inputs for filters, sort, and layout controls; style around
  them instead of replacing them with decorative buttons.
- Keep mobile grid density controls wired to `results-list/updateLayout`.
- Validate the changed Liquid, snippets, and translation file after adding
  locale keys or optional render parameters.
- Review active state and count bubbles for inherited uppercase, font, or
  letter-spacing styles when controls are nested.
- Place route-specific toolbar overrides after the base facets rules they need
  to beat, or use a selector with enough specificity and equal/later cascade
  order.
- For sticky CLP controls, reuse rendered navigation as the source of truth
  instead of introducing a second hardcoded collection-link map.

## Related Docs

- [CLP subcollection navigation pattern](2026-08-03-figma-clp-subcollection-navigation.md)
- [Collection template](../../../templates/collection.json)
- [Main collection section](../../../sections/main-collection.liquid)
- [Filters block](../../../blocks/filters.liquid)
- [Sorting snippet](../../../snippets/sorting.liquid)
- [Grid density controls](../../../snippets/grid-density-controls.liquid)
- [Product grid snippet](../../../snippets/product-grid.liquid)
- [Results list behavior](../../../assets/results-list.js)

## Reusable Insight

When a Figma toolbar redesign sits on top of Shopify's Horizon collection
facets, treat the existing facets block as the behavior boundary. Add
collection-scoped presentation branches and small snippet parameters, but keep
the original forms, drawer, sorting inputs, and layout radio controls as the
source of truth.

## Compound Summary

The CLP filter, sort, and layout controls now match the Figma composition while
preserving Horizon's existing filtering, sorting, drawer, AJAX rendering, and
grid layout persistence. Implementation changed the shared facets block only
through a collection-scoped CLP branch, added an optional sort prefix variant,
added a scoped mobile `View` label for grid density controls, and added the
needed translations. Review found one inherited letter-spacing polish issue on
active filter count bubbles, which was fixed before final validation. A
follow-up screenshot comparison found that later base facets styles were still
winning over parts of the toolbar; the CLP overrides were moved to a winning
cascade position, desktop product count copy was scoped to `Products`, and the
mobile layout control was tightened to the Figma-style `View` plus two-bar mark.
A later desktop follow-up added a sticky floating state that clones the CLP
intro navigation into the toolbar after scroll, hides the product count while
floating, and keeps Filter/Sort available at the top of the product grid. The
Figma dimension pass then aligned the floating nav typography, bar height, gaps,
and product-grid gutter settings to the measured node.

Verification passed with the Shopify Liquid validator for
`blocks/filters.liquid`, `snippets/sorting.liquid`,
`snippets/grid-density-controls.liquid`, and `locales/en.default.json`, using
the cached Shopify validator that includes `@shopify/theme-check-common`.
The floating-bar follow-up revalidated `blocks/filters.liquid` and
`locales/en.default.json`, parsed the locale JSON, and reran `git diff --check`
with only line-ending warnings. The remaining launch dependency is visual QA in
a Shopify preview across desktop, tablet, and mobile because no local storefront
preview server is available in this workspace.
