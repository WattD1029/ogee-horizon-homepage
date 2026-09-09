---
title: Build CLP Filter Drawer on Horizon Facets
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
  - drawer
---

# Build CLP Filter Drawer on Horizon Facets

## Problem

The collection landing page redesign needed the filter drawer to match the
Figma desktop and mobile references without replacing Shopify Horizon's facets
system. The visual target used a clean right-side drawer with a compact
`Filter | Results` header, removable selected-filter chips, a mobile `Sort By`
row, Figma-style checkbox rows, and pinned `Apply` plus `Clear all` actions.

The existing theme already used `blocks/filters.liquid`,
`facets-form-component`, `filter-remove-buttons`, `list-filter`,
`price-filter`, `sorting`, and `dialog-component` to own filtering, sorting,
active filter removal, URL parameters, AJAX section rendering, and body scroll
lock. Replacing that drawer would duplicate behavior and risk breaking the
collection page after filter updates.

## Symptoms

- The CLP toolbar had already been restyled, but the drawer still used the
  default Horizon drawer visual language.
- The default drawer header showed the filter label and active-value bubble,
  while the Figma drawer shows `Filter | 15 Results`.
- Active filters were rendered as default pills rather than compact beige chips.
- Short filter values could render as pill buttons because `list-filter` chooses
  a pill layout when labels are short.
- Mobile sorting used the existing mobile select path, but the Figma drawer
  shows sorting as a collapsible row above the filter groups.
- The default bottom action bar used the existing `See items` label and theme
  button styles instead of the Figma `Apply` and outlined `Clear all` buttons.
- The same filters block is shared by collection and search templates, so
  global drawer styling would affect unrelated pages.

## What Didn't Work

### Rebuilding the drawer

A standalone drawer would have needed to recreate active filter URLs,
`filter_value.url_to_remove`, `filter.url_to_remove`, `sort_by` radio inputs,
AJAX section rendering, dialog focus/escape handling, and scroll lock. The
existing Horizon implementation already does those jobs.

### Restyling every facets drawer globally

`blocks/filters.liquid` is shared beyond the CLP route. Applying Figma drawer
styles to `.facets--drawer` alone would affect search results and any non-CLP
collection layouts using the same block.

### Leaving short values as pills

The Figma drawer uses checkbox rows for text filter values. The default
`list-filter` pill optimization is useful for compact filters, but it produces
the wrong shape in this drawer and makes short labels visually inconsistent
with longer labels.

### Forcing mobile sorting through the existing select

The default mobile sort select preserves behavior, but it does not match the
Figma `Sort By` row. The safer adjustment was to reuse the existing sorting
radio list inside a details panel and only override the label and presentation
for the CLP drawer.

## Solution

Extend the existing facets components with CLP-scoped variants:

- `blocks/filters.liquid`
- `snippets/filter-remove-buttons.liquid`
- `snippets/list-filter.liquid`
- `snippets/sorting.liquid`
- `locales/en.default.json`

In `blocks/filters.liquid`, keep the existing `use_clp_controls` route and
horizontal-style gate, then add drawer-specific classes only when that gate is
true:

- `facets-block-wrapper--clp-drawer`
- `facets--clp-drawer`
- `facets__title-wrapper--clp-drawer`
- `facets-drawer__title--clp`
- `facets-drawer__filters--clp`
- `facets__drawer-actions--clp`

The CLP drawer header renders `blocks.filter`, a divider, and a new
`content.results_count` translation based on `products_count`. The original
active-value bubble remains unchanged for non-CLP drawers.

The active filter chips still come from `filter-remove-buttons`, but the CLP
drawer passes `variant: 'clp-drawer'`. The snippet keeps the same
`facet-remove-component` and `data-url` behavior while adding a beige chip
presentation scoped to `.facets-remove--clp-drawer`.

The drawer renders sorting above the filter groups for the CLP path only. It
uses the existing `sorting` snippet with `should_use_select_on_mobile: false`
so mobile gets the details row instead of the select. A new
`label_translation_key` parameter lets the drawer use `actions.sort_by_drawer`
without changing the desktop toolbar's `Sort By:` label.

The drawer passes `force_checkbox: use_clp_controls` into `list-filter`, which
turns off the short-label pill optimization only for this CLP drawer. The
native checkbox snippet and `facet-inputs-component` events remain intact.

The bottom action bar keeps the existing behavior. `Apply` is the existing
close-dialog action with a CLP label, and `Clear all` still removes filters via
the existing clear URL. The CLP styling makes both buttons 58px tall, with the
primary black `Apply` button first and the outlined `Clear all` button second,
matching the Figma composition.

During review, one issue was found and fixed: a custom rotate rule on the caret
wrapper would have combined with the existing theme rule that rotates the inner
SVG, canceling the open-state caret direction. The custom wrapper rotation was
removed so the existing `icon-animated` behavior remains the source of truth.
A mobile-only divider was also added between the new `Sort By` row and the
first filter group.

A follow-up visual check caught two additional CLP-specific issues. The global
`.drawer` rule anchors drawers to the left by default, so the CLP drawer now
overrides the inset and margin values to dock the panel to the right edge. The
selected-filter tab row also needed a CLP drawer override because the horizontal
facets layout hides active-filter chips at desktop widths.

## Why This Works

The drawer remains inside the same Horizon facets behavior boundary. Filter
inputs still submit through `facets-form-component`, which updates URL
parameters, dispatches `FilterUpdateEvent`, and asks the section renderer to
refresh the collection results. Active chips and `Clear all` still use
`facet-remove-component`, so they continue to remove filters by URL rather than
duplicating URL manipulation in new JavaScript.

Sorting still uses the existing `sorting-filter-component` radio input flow.
Only the display mode and label change for the CLP drawer. The desktop toolbar
sort path remains unchanged, and the drawer sort stays hidden at desktop
breakpoints.

The visual rules are scoped to the CLP drawer classes, which keeps search and
other collection layouts on the default drawer styling. Optional snippet
parameters make the variants reusable without forking the snippets or adding a
new section dependency.

## Prevention

- Treat `blocks/filters.liquid` as the behavior boundary for Horizon facets:
  extend it carefully instead of rebuilding filtering controls.
- Gate CLP visual variants behind collection and horizontal filter-style
  conditions so shared search UI does not inherit CLP-only styles.
- Use optional snippet parameters for small display variants, such as chip
  styles, checkbox forcing, and alternate sort labels.
- Keep `facet-remove-component`, `facets-form-component`, and
  `sorting-filter-component` wired to the same forms and URLs.
- When overriding accordion carets, check existing `icon-animated` rules first
  to avoid double transforms.
- Review separators after reordering drawer content; rows that move across
  wrapper boundaries often lose their expected divider.
- Validate Liquid and translation files after adding snippet parameters or
  locale keys.
- Confirm final pixel behavior in a Shopify preview because the drawer depends
  on live collection filters, products, and theme runtime JavaScript.

## Related Docs

- [CLP filter, sort, and layout toolbar pattern](2026-08-04-figma-clp-filter-sort-layout-controls.md)
- [CLP subcollection navigation pattern](2026-08-03-figma-clp-subcollection-navigation.md)
- [Filters block](../../../blocks/filters.liquid)
- [Filter remove buttons snippet](../../../snippets/filter-remove-buttons.liquid)
- [List filter snippet](../../../snippets/list-filter.liquid)
- [Sorting snippet](../../../snippets/sorting.liquid)
- [Facets behavior](../../../assets/facets.js)
- [Collection template](../../../templates/collection.json)

## Reusable Insight

When a Figma drawer redesign sits on top of Shopify Horizon facets, make the
drawer a scoped presentation variant of the existing facets system. Preserve
the form components, URL-backed remove actions, sorting inputs, and dialog
component, and add narrow snippet parameters only where the same underlying
data needs a different visual treatment.

## Compound Summary

The CLP filter drawer now matches the Figma structure more closely while
preserving Horizon behavior. The implementation adds CLP-only drawer classes,
a `Filter | Results` title treatment, selected-filter chip styling, mobile
`Sort By` row placement, forced checkbox rows for text filters, and Figma-style
bottom actions. Follow-up fixes docked the drawer on the right edge and kept
the selected-filter tab row visible inside the desktop CLP drawer.

Verification passed with the Shopify Liquid validator for
`blocks/filters.liquid`, `snippets/list-filter.liquid`,
`snippets/filter-remove-buttons.liquid`, `snippets/sorting.liquid`, and
`locales/en.default.json`. The locale file also parsed successfully with the
local JSONC parser, and `git diff --check` passed with only Git line-ending
warnings. The follow-up right-dock and selected-filter tab CSS passed local
`git diff --check`; the external Shopify validator was blocked by the approval
reviewer because it may transmit theme code. A live Shopify preview was not run
because no local Shopify CLI preview command is available in this workspace, so
final desktop/tablet/mobile pixel QA remains the launch dependency.
