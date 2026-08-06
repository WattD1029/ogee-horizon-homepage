---
title: Build CLP Load More Progress and Promotion This Month
category: design-patterns
date: 2026-08-06
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - pagination
  - promotion-section
---

# Build CLP Load More Progress and Promotion This Month

## Problem

The CLP redesign needed the product grid handoff to match the Figma desktop and
mobile references. The area after the last visible product row needed:

- a centered manual load-more module with `Showing X of Y products`, a thin
  progress line, and a full-width black `Load more` CTA
- a `Promotion This Month` module immediately after the product grid
- desktop layout with campaign image on the left and offer accordions plus CTA
  on the right
- mobile layout with heading, image, and offer accordions stacked in a compact
  panel

The theme already had manual pagination on top of Horizon's `paginated-list`
custom element, but the existing load-more UI only displayed status text and a
button. The theme also had promotion sections, but their compositions were not
the Figma accordion module.

## Symptoms

- `templates/collection.json` sets the collection grid to manual pagination
  with 6 products per page so the initial handoff exposes the Load More CTA.
- `snippets/product-grid.liquid` renders manual load more when
  `pagination_style == 'manual'`.
- `assets/paginated-list.js` fetches and appends the next section-rendered page,
  then updates manual load-more status text.
- Refreshing or entering a final paginated URL can render only the last page of
  products, so the manual CTA still needs a recovery path when visible products
  are below the collection total.
- Existing `promotion-offer-banner` is a simple image/copy/CTA banner.
- Existing `promotion-blocks` is a carousel and does not match the CLP
  accordion reference.
- The exact campaign image from Figma was not present in `assets/`, so the
  production section needed an image picker and a usable Ogee fallback.

## What Didn't Work

### Creating a separate pagination path

The theme already fetches section HTML, appends product cards, processes card
aspect ratios, and updates collection URLs inside `paginated-list.js`.
Duplicating that behavior for a progress bar would risk divergence during
filter, sort, or direct page-entry states.

### Treating the progress bar as decorative only

The progress line communicates how much of the collection is visible. If it is
only a static visual element, it becomes stale after clicking `Load more` or
after filters replace the grid. It also misses an accessible progressbar state.

### Reusing the carousel promotion module

The Figma promotion reference is an editorial accordion panel, not a card
carousel. Reusing `promotion-blocks` would have brought carousel controls,
slide widths, and a different mobile interaction model into a static CLP handoff
area.

### Baking the reference image into the theme

The screenshot is a design reference, not a production asset. Shipping that crop
would make the section harder to manage in the theme editor and could introduce
asset-quality and licensing confusion.

## Solution

### Load-more progress

`snippets/product-grid.liquid` now derives `shown_count` from the number of
products rendered in the grid, clamps it to `total_products`, and calculates a
percentage from that value. In the manual load-more branch, the snippet renders:

- status text from the existing `content.showing_products` translation
- a `role="progressbar"` track with current count, total count, and translated
  accessible label
- a full-width black load-more button matching the Figma control width

The button is rendered when the visible product count is below the collection
total and either a next or previous paginated page exists. This keeps the CTA
available in the mobile `Showing 4 of 10 products` state caused by landing on a
final paginated URL.

`assets/paginated-list.js` now updates both the visible status and progressbar
state inside the existing `#updateManualLoadMoreState()` lifecycle. The same
method already runs on initial connection, after manual appends, and after
filter updates, so the progress bar stays tied to the rendered grid state.
Manual button clicks load the next page when available, or the previous page if
the current URL is already on the final page. Manual clicks do not push the next
pagination URL into browser history, which prevents a refresh from reopening the
last page as a sparse grid.

### Promotion This Month

`sections/clp-promotion-this-month.liquid` adds a collection-enabled section
with merchant-editable settings:

- heading
- image picker and image alt text
- button label, collection, custom link, fallback collection handle, and
  new-tab behavior
- desktop and mobile width/padding controls
- panel, text, rule, and button color controls
- up to six `offer` blocks, each with title, rich text body, and default-open
  state

The section renders native `details` and `summary` elements for the offers. The
first default offer is open to match the supplied screenshots, while later offers
start closed.

`templates/collection.json` places the new promotion section after `main` and
seeds the three CLP offer rows:

- free gift with purchase of $150+
- subscription savings
- free shipping on orders of $75+

The desktop CTA links to a selected collection, a custom URL, or the
`bestsellers` fallback handle. The mobile CTA is hidden because the supplied
mobile reference shows only the heading, image, and accordion panel before the
next section.

## Why This Works

The progress bar stays inside the existing manual pagination branch instead of
introducing another collection-query path. Because the JS counts the rendered
product-card nodes and compares them to `data-total-items`, direct page URLs and
filtered results report what is actually visible in the grid.

The CTA visibility is based on the same rendered-count check plus available
pagination in either direction. That makes the initial page show `Load more` for
6 of 10 products and lets direct final-page states recover the missing products
instead of ending at `Showing 4 of 10 products` with no action.

The promotion is isolated as a section because it is a full-width collection
page module with its own editable content and layout. Its offer blocks keep the
campaign copy reorderable and removable in the theme editor, while native
`details` elements provide accessible accordion behavior without new JavaScript.

The image picker keeps the production campaign image merchant-owned. The fallback
uses an existing Ogee image so the section remains visually useful in local or
empty-theme states without depending on a screenshot file.

## Review

Compound review found no blocking regressions in the implemented diff.

Checked risks:

- Manual pagination remains inside `paginated-list.js`.
- The progress count is clamped and based on rendered cards, so direct page-entry
  URLs cannot claim previous-page products are visible when only the current page
  has been rendered.
- The button can be re-shown after filter updates and direct final-page states
  while hidden only when all products are visible or no adjacent page exists.
- Manual load-more clicks avoid updating browser history to a later pagination
  URL, preventing refreshes from reopening a sparse final page.
- The promotion section is enabled only on collection templates.
- Offer accordions use semantic `details` / `summary` markup and
  `block.shopify_attributes`.
- The collection template references a section type that now exists in the same
  source tree.

Residual risks:

- The real Figma campaign image still needs to be selected in the Shopify theme
  editor.
- A Shopify upload should include `sections/clp-promotion-this-month.liquid`
  with `templates/collection.json`.
- Full Shopify Theme Check was not available locally.
- The hosted Shopify validator was not run because approval was rejected after
  the tool disclosed that changed source and prompt metadata can be sent to
  Shopify telemetry.
- Browser visual QA in a Shopify preview is still needed across desktop, tablet,
  mobile two-column, and mobile one-column CLP states.

## Verification

Local verification completed:

- `node --check assets/paginated-list.js`
- parsed `templates/collection.json` after removing JSONC comments
- parsed `locales/en.default.json` after removing JSONC comments
- parsed the schema JSON from `sections/clp-promotion-this-month.liquid`
- ran `git diff --check`, with only line-ending warnings
- confirmed Shopify CLI and standalone Theme Check were not installed on PATH

The required Shopify Liquid docs search was run before implementation for
`paginate` and section block schema. The repository-required
`learn_shopify_api` tool was not callable in this session, so Shopify docs
search was used as the available fallback.

## Prevention

- Keep pagination progress tied to the same counts that drive the status text.
- Update progress inside the existing paginator lifecycle instead of adding a
  separate click handler or collection fetch.
- Clamp visible counts before rendering status or progress values.
- For manual load-more pages, avoid using `paginate.current_offset` in visible
  status text unless previous pages are also rendered in the DOM.
- Keep manual load-more history stable unless the design explicitly wants page
  URLs to become shareable pagination states.
- Use native accordion elements for static offer rows unless the design requires
  custom cross-row behavior.
- Keep Figma reference images as references; use image picker settings for
  production campaign media.
- When a JSON template references a new section type, verify that the section
  file exists and is included in the same upload or deployment.
- Run Shopify Theme Check or the approved Shopify validator when privacy policy
  and tooling availability allow it.

## Related Docs

- [CLP product grid product cards](2026-08-04-figma-clp-product-grid-product-cards.md)
- [CLP filter sort layout controls](2026-08-04-figma-clp-filter-sort-layout-controls.md)
- [Promotion block carousel](2026-06-28-figma-promotion-block-carousel.md)
- [Collection template](../../../templates/collection.json)
- [Product grid snippet](../../../snippets/product-grid.liquid)
- [Paginated list behavior](../../../assets/paginated-list.js)
- [Promotion This Month section](../../../sections/clp-promotion-this-month.liquid)

## Reusable Insight

When a Figma CLP handoff combines pagination status and an editorial promo
module, treat pagination as behavior owned by the collection grid and promotion
content as merchant-owned section content. Add only the visual and accessibility
state needed to the paginator, then create a dedicated editable section for the
campaign layout.

## Compound Summary

The CLP now has a Figma-aligned manual load-more progress module and a
collection-enabled Promotion This Month section. The progress bar is rendered in
the existing product-grid manual pagination branch and updated by the existing
paginated-list custom element. The promotion section renders an editable image,
heading, offer accordions, and desktop CTA, then is wired into the collection
template after the product grid.

Review found no blocking regressions. Local validation covered JavaScript syntax,
JSON/JSONC parsing, section schema parsing, and whitespace checks. The remaining
launch dependency is Shopify preview QA with the final merchant-selected
campaign image and an approved Shopify validation path.
