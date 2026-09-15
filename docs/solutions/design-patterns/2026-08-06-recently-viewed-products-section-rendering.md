---
title: Build Recently Viewed Product Rails With Section Rendering
category: design-patterns
date: 2026-08-06
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - recently-viewed
  - section-rendering
---

# Build Recently Viewed Product Rails With Section Rendering

## Problem

The collection landing page redesign needed a `Recently Viewed` rail below the
promotion module and collection product area. The Figma references called for a
compact Ogee product carousel: centered editorial heading, light square product
media, badge chips, wishlist affordances, prices, stars, shade dots, desktop
arrows, and a mobile horizontal rail with the next card peeking in.

The theme already persisted viewed product IDs in browser storage through
`assets/recently-viewed-products.js`, and it already had a rich
`product-carousel-card` snippet for carousel surfaces. The missing piece was a
section that could turn locally stored IDs into fresh Shopify product objects
without duplicating card markup or hardcoding product handles.

## Symptoms

- Viewed product state lives in localStorage, so Liquid cannot read it during
  the first page render.
- Product cards need live Shopify product data, review fallbacks, shade
  previews, quick-add forms, and wishlist controls.
- The section must be hidden when there are no usable viewed products.
- Product pages should not recommend the product currently being viewed.
- Search or section-rendering requests may return products in a different order
  than the localStorage list.
- The implementation needs to work both for a live template section ID and for
  fallback section rendering by section file name.
- Card CSS and custom elements need to be available even when the first page
  load initially renders no products.

## What Didn't Work

### Rendering cards directly from JavaScript

Building product-card DOM in JavaScript would have duplicated Liquid card
logic, quick-add forms, variant media rules, swatch fallbacks, review display,
and wishlist markup. It would also create another surface to maintain whenever
the shared carousel card changes.

### Querying product handles from localStorage

The existing storage contract records product IDs, not handles. Introducing a
second handle-based storage shape would make old viewed-product state
unusable and would create migration or compatibility work for no real benefit.

### Fetching only a static section file name

Fetching only `sections/recently-viewed-products.liquid` by static section file
name can bypass merchant-edited settings on the live collection template.
Using the rendered section ID first keeps template settings authoritative,
while the static section file name remains a fallback for contexts where the
live ID cannot render.

## Solution

Create a reusable `sections/recently-viewed-products.liquid` section and a
small `assets/recently-viewed-section.js` custom element.

The client element:

- imports the existing `RecentlyViewed` helper and shared `sectionRenderer`
- reads viewed product IDs from localStorage
- clears malformed viewed-product storage instead of failing the section
- filters IDs to digits only, dedupes them, excludes the current product ID,
  and clamps the request to the section maximum
- builds a Shopify search URL with `q=id:ID OR id:ID` and
  `resources[type]=product`
- tries the live section ID from `data-render-section-id` first, then falls
  back to `recently-viewed-products`
- parses the returned HTML and swaps only the rendered viewport contents into
  the existing section shell
- hides the section when no product cards can be rendered

The Liquid section:

- renders nothing visible until search-context products are available or the
  theme editor needs placeholders
- uses `search.results | where: 'object_type', 'product'`
- reconstructs the localStorage order from `search.terms`
- renders each product through the existing `product-carousel-card` snippet
- wraps cards with the shared slideshow snippets and controls
- adds a hidden product-card asset primer so card styles and custom elements
  are present before fetched cards are injected
- exposes merchant settings for heading, max products, badge behavior,
  subtitle source, reviews, swatches, wishlist, width, gaps, media background,
  color scheme, and responsive padding
- wires the section into `templates/collection.json` after `main`

The CSS stays section-scoped under `.recently-viewed-products` and matches the
provided references: three desktop cards inside a 1200px rail, 8px desktop
gaps, square light media, hidden review count labels, compact shade dots,
centered heading, desktop arrows over media, and a 300px mobile card rail with
16px gaps and full-width mobile actions.

## Why This Works

The section-rendering bridge keeps the data responsibilities split cleanly.
JavaScript owns browser-only state and network orchestration; Liquid owns
product objects, card markup, settings, translations, and theme-editor
customization.

Reusing `product-carousel-card` preserves the existing carousel shade preview,
rating fallback, wishlist, media, and quick-add contracts. It also means future
fixes to product-card behavior naturally reach the recently viewed rail.

Trying the live section ID before the static section file name protects
merchant-edited settings while retaining a fallback for render contexts that
cannot address the live template section. Parsing `search.terms` keeps the
visual card order aligned with the user's actual viewed-product history.

## Review

Compound review found two implementation risks and fixed both before the
report was captured.

- Malformed `viewedProducts` localStorage originally could throw before the
  loading guard handled empty state. The client now catches helper failures,
  clears invalid storage, and hides the section cleanly.
- Rendering only the static section ID could ignore the collection template's
  merchant settings. The client now tries the live section ID first and uses
  the static section file name only as a fallback.

No remaining code-level blockers were found after those fixes. The main
residual risk is preview-only: the Shopify Section Rendering API behavior and
desktop/tablet/mobile visual parity still need to be checked against a live
theme preview.

## Verification

Available local checks passed:

- `node --check assets/recently-viewed-section.js`
- parsed `templates/collection.json` after removing the Shopify-generated
  header comment
- parsed schema JSON from `sections/recently-viewed-products.liquid`
- `git diff --check` with only line-ending warnings in existing edited files

The Shopify Liquid validator was attempted with the required prompt metadata,
but it could not run because `@shopify/theme-check-common` is missing from the
local skill bundle. Shopify CLI and standalone Theme Check are also not
available on PATH in this workspace.

The repository instruction to call `learn_shopify_api` was not directly
actionable because no callable `learn_shopify_api` tool was exposed in this
thread. Shopify Liquid documentation search was used before implementation,
including Section Rendering and search-result context.

## Prevention

- Keep browser-only viewed-product state in a tiny client element and keep
  product-card rendering in Liquid.
- Reuse established product-card snippets for recommendation rails instead of
  recreating card DOM in JavaScript.
- When rendering a dynamic section from JavaScript, try the live section ID
  before falling back to a static section file name.
- Sanitize IDs from localStorage before building search queries.
- Preserve requested product order explicitly when search results can be
  returned in a different order.
- Add an asset primer or equivalent initial render path when injected markup
  depends on section-scoped styles or custom elements.
- Verify empty storage, malformed storage, duplicate IDs, current-product
  exclusion, one product, three products, and four products.
- Run Shopify preview QA for desktop, tablet, and mobile because Section
  Rendering behavior cannot be fully proven by static parsing.

## Related Docs

- [Recently viewed section](../../../sections/recently-viewed-products.liquid)
- [Recently viewed loader](../../../assets/recently-viewed-section.js)
- [Viewed product storage helper](../../../assets/recently-viewed-products.js)
- [Product carousel card](../../../snippets/product-carousel-card.liquid)
- [Collection template](../../../templates/collection.json)
- [All Makeup carousel pattern](2026-07-13-all-makeup-carousel-section.md)
- [CLP product grid and product-card pattern](2026-08-04-figma-clp-product-grid-product-cards.md)
- [Product carousel shade preview contract](../ui-bugs/2026-06-28-product-carousel-shade-preview-contract.md)
- [Promotion block carousel pattern](2026-06-28-figma-promotion-block-carousel.md)

## Reusable Insight

For Shopify recommendation rails whose product IDs only exist in the browser,
use client-side Section Rendering as the bridge back to Liquid. JavaScript can
provide a clean list of IDs and replace a viewport; Liquid should still own the
product objects, snippets, settings, translations, and merchant-customizable
presentation.

## Compound Summary

Work mode added a reusable recently viewed section, a client loader that reads
the existing viewed-product storage contract, search-context section rendering,
and collection-template wiring below the main collection section. Review mode
fixed malformed localStorage handling and live-section-ID rendering so the rail
fails closed and respects merchant settings. Full Compound documentation found
moderate overlap with existing carousel and CLP product-card patterns but a
distinct reusable pattern around Section Rendering from localStorage product
IDs, so this new design-pattern report was created.
