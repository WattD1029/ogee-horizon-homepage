---
title: Build CLP Product Grid Product Cards on Horizon Blocks
category: design-patterns
date: 2026-08-04
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - product-grid
  - product-cards
---

# Build CLP Product Grid Product Cards on Horizon Blocks

## Problem

The collection landing page redesign needed the product grid and cards to match
the Figma desktop, mobile double-column, and mobile single-column references:

- desktop: a centered 3-column product grid with square media tiles, compact
  details, badges, wishlist, review stars, swatches, and black hover CTAs
- mobile double-column: compact 2-up cards with square media, tight detail
  typography, hidden swatches, and full-width outline CTAs
- mobile single-column: 350px cards, visible swatches, light page treatment,
  and the same product action contract
- pagination: manual `Load more` with a `Showing X of Y products` status

The theme already had Horizon's static `_product-card` block, card gallery,
price, review, swatches, quick-add, filtering, sorting, AJAX pagination, and
grid layout persistence. The work needed to change the CLP presentation without
breaking those shared contracts.

## Symptoms

- `sections/main-collection.liquid` renders collection products through a
  static `_product-card` block.
- `templates/collection.json` already owns the CLP product-card block order and
  product-grid gaps.
- `snippets/product-card.liquid` is shared by collection grids, product lists,
  and product blocks.
- `_product-card-gallery` owns badges and quick-add placement inside the media
  tile.
- `assets/paginated-list.js` already fetches and appends collection pages for
  infinite scroll.
- The previous CLP toolbar work set the collection grid to 8px gutters, which
  matches the 1200px desktop Figma grid.

## What Didn't Work

### Rebuilding cards in `main-collection`

Hardcoding a new card directly in the collection section would bypass the
merchant-editable static product-card block, duplicate media, review, swatch,
and quick-add behavior, and make future card changes harder to manage in the
theme editor.

### Restyling product cards globally

The product-card snippet is shared by product lists and recommendation surfaces.
Global changes would leak CLP typography, mobile CTAs, and swatch visibility to
non-collection contexts.

### Replacing pagination behavior

The existing paginated-list component already knows how to fetch section HTML,
append product card nodes, process media aspect ratios, and prefetch next
pages. A separate load-more implementation would have duplicated that behavior
and risked breaking filtered collection URLs.

## Solution

Use Horizon's existing product-card block composition, then add CLP-specific
presentation and manual pagination where the current architecture already owns
the behavior.

### Product metadata

Add `blocks/product-subtitle.liquid` as a reusable card block. It reads product
subtitle text from this cascade:

1. `product.metafields.custom.subtitle`
2. `product.metafields.custom.short_description`
3. `product.metafields.descriptors.subtitle`
4. `product.type`
5. optional vendor fallback

Register the block in both static and resource product-card schemas, then add it
to the collection product-card block order between title and price.

### Product-card composition

Update `templates/collection.json` so the collection card order is:

1. media gallery
2. product title
3. product subtitle
4. price
5. review stars
6. swatches

Set card gallery media to `square`, preserve 8px product-grid gaps, enable
manual pagination, and set the first page to 16 products.

### CLP-scoped card styling

Add `.product-card--clp` only on collection templates. Scoped styles handle:

- square grey media tiles
- desktop 3-up cards with light detail content below each media tile
- desktop 16px detail insets and compact type hierarchy
- uppercase subtitle typography
- review and swatch spacing
- hidden swatches in mobile double-column view
- visible swatches and default text color in mobile single-column view
- horizontally scrollable CLP shade rows with previous/next arrows for long
  variant ranges
- mobile quick-add action positioning above the card link overlay

The desktop reference follow-up also adds a CLP gallery chrome layer:

- top-left merchandising badge chips
- top-right decorative wishlist heart
- badge text sourced from product badge metafields first, then common
  `best-seller` / `new shade` product tag fallbacks
- no CLP badge or heart overlays in zoom-out grid mode

The CLP grid gets section-scoped responsive column rules instead of relying on
the generic Horizon auto-fill card size:

- 3 columns on desktop
- 2 columns on tablet
- existing mobile grid controls for one-column and two-column mobile views

### Quick-add variants

Extend `snippets/quick-add.liquid` with optional parameters for:

- contextual ref names
- contextual classes
- custom add and choose labels
- mobile label visibility

The gallery quick-add keeps the desktop overlay behavior and gets CLP labels.
The collection card renders a second mobile-only quick-add action below the
card details so mobile matches the Figma full-width CTA treatment while desktop
retains hover CTAs over media. The desktop reference follow-up styles the media
overlay CTA as a split control with a black text area and darker icon square.

### Manual load more

Add a `pagination_style` section setting to `main-collection`:

- `automatic`: current infinite-scroll behavior
- `manual`: button-driven load more
- existing disabled infinite scroll still falls back to numbered pagination

Reuse `assets/paginated-list.js` by exposing a public `loadMoreNext` action that
calls the existing private next-page renderer. The manual status text reads from
`data-current-offset` and `data-total-items`, so linked or refreshed collection
pages still report the correct `Showing X of Y products` count.

## Review

Compound review focused on shared-surface risk:

- CLP card styling is scoped to `template.name == 'collection'`.
- Search and product-list callers keep the existing product-card presentation.
- Quick-add remains the behavior-bearing snippet; CLP only adds contextual
  labels, refs, and CSS.
- Manual pagination reuses section-rendered page fetching rather than adding a
  second collection query path.
- The hidden zoom-out details node between gallery and title required an
  additional spacing rule so the first visible text block still aligns to the
  Figma top inset.
- Manual load-more status needed `paginate.current_offset` support so page 2
  entry URLs do not reset the status count to only visible DOM cards.
- A selector review found that `product-title` is a block file, not a rendered
  custom element. The CLP title selector now targets the actual
  `ref="productTitleLink"` anchor so product titles receive the intended
  typography and contrast.
- A visual correction aligned the desktop close-up reference to the intended
  Figma schema: each desktop card has square light media with light details
  beneath it, while mobile double-column and single-column both keep the light
  page treatment.
- A proportionality review found the desktop grid was still using the full
  collection width, making three cards too large for the component reference.
  The CLP grid is now capped to a desktop component width and CLP card media is
  forced to `contain` so product imagery stays within the square tile.
- A follow-up proportionality review found the intermediate cap overcorrected
  and made the desktop grid feel like a small inset module. The final desktop
  grid uses the theme content rail and keeps the desktop product details on the
  light page background to restore the Figma media-to-detail ratio.
- A mobile CTA review found the CLP mobile quick-add selector was forcing both
  rendered quick-add buttons visible. The CLP mobile scope now restores the
  shared `data-quick-add-button` contract: one-variant products show Add to
  cart, while multi-variant products show Select shade.
- A follow-up CTA review found Add to cart was still sizing to its
  `add-to-cart-component` wrapper rather than the card column. The CLP mobile
  scope now makes that wrapper full-width so Add to cart and Select shade share
  the same button footprint.
- A data review found the shared swatch and review blocks were correct for
  native Shopify data but too strict for the CLP reference: products without
  saved `value.swatch` metadata or review metafields rendered no dots or stars.
  Collection-scoped fallbacks now use Shade/Color option values for cosmetic
  swatch dots and render a five-star visual row only when real rating data is
  absent.
- A shade-row review found long CLP swatch sets were visually clipped inside the
  card width. The CLP swatch block now keeps both native Shopify swatches and
  fallback shade dots horizontally scrollable with previous/next controls.

No remaining actionable review issues were found after those fixes.

## Verification

Local verification passed for the available tools:

- `node --check assets/paginated-list.js`
- parsed `templates/collection.json`
- parsed `locales/en.default.json`
- parsed `locales/en.default.schema.json`
- parsed schema JSON from:
  - `blocks/_product-card.liquid`
  - `blocks/product-card.liquid`
  - `blocks/product-subtitle.liquid`
  - `sections/main-collection.liquid`

The desktop reference follow-up also passed:

- `node --check assets/paginated-list.js`
- parsed `locales/en.default.json`
- parsed schema JSON from `blocks/_product-card-gallery.liquid`
- `git diff --check` with only line-ending warnings

Official Shopify CLI and standalone `theme-check` were not available on PATH in
this workspace, so a full Shopify Theme Check could not be run locally. The
repository instruction to call `learn_shopify_api` was also not directly
actionable because no callable `learn_shopify_api` tool was exposed in this
thread; Shopify docs search was used instead before implementation.

## Prevention

- Keep CLP card design inside the static `_product-card` block and scoped
  product-card CSS instead of forking collection card markup.
- Add new product-card metadata as a block so merchants can reorder or remove it
  in the product-card composition.
- For responsive CLP states, use the existing `product-grid-view` attribute as
  the view source of truth.
- Treat quick-add as a shared behavior snippet and add presentation parameters
  instead of duplicating add-to-cart forms.
- For manual load more, call the existing paginated-list renderer so section
  HTML, filters, product refs, aspect-ratio processing, and history updates stay
  consistent.
- Include current pagination offset in status calculations whenever manual load
  more can be entered from a page URL.
- Validate schema and locale files after adding new `t:` keys or block schema
  settings.

## Related Docs

- [CLP filter sort layout controls](2026-08-04-figma-clp-filter-sort-layout-controls.md)
- [CLP subcollection navigation pattern](2026-08-03-figma-clp-subcollection-navigation.md)
- [Collection template](../../../templates/collection.json)
- [Main collection section](../../../sections/main-collection.liquid)
- [Product grid snippet](../../../snippets/product-grid.liquid)
- [Product card snippet](../../../snippets/product-card.liquid)
- [Quick-add snippet](../../../snippets/quick-add.liquid)
- [Paginated list behavior](../../../assets/paginated-list.js)

## Reusable Insight

When a Figma CLP redesign needs product-card changes on a Horizon theme, keep
the product-card block tree as the source of truth. Add small reusable metadata
blocks, collection-scoped card presentation, and narrow behavior parameters
around existing snippets. That preserves merchant editing, swatches, quick-add,
reviews, and AJAX pagination while allowing the collection page to match the
art direction.

## Compound Summary

The CLP product grid and cards now use the existing Horizon collection
infrastructure with a Figma-aligned card composition. Implementation added a
product subtitle block, registered it for product-card usage, updated the
collection product-card block order, added review stars and square media,
scoped CLP card styles, added contextual quick-add labels and mobile CTAs, and
introduced manual load-more pagination on top of the existing paginated-list
renderer.

Review found two issues before finalization: first visible detail spacing needed
to account for the hidden zoom-out node, and manual status text needed to
include `paginate.current_offset`. Both were fixed. Local validation passed for
JavaScript syntax, JSON-with-comments parsing, and all touched schema blocks.
A later desktop close-up reference added data-driven CLP badge chips, wishlist
hearts, and split desktop overlay CTA styling. Subsequent visual corrections
fixed the title selector, forced the CLP desktop grid to three columns using the
same section id as the winning Horizon auto-fill rule, tightened swatch sizing,
capped then widened the desktop grid back to the theme content rail, forced CLP
media to contain, and restored the mobile one-button quick-add contract. A later
correction removed the desktop and mobile single-column black grid/card
backgrounds so product details remain on the light page background. A final CTA
correction made the CLP mobile Add to cart wrapper full-width so it aligns with
Select shade, and restored visible product swatches and ratings with
collection-only fallbacks for products that lack native Shopify swatch metadata
or review metafields. A final shade-row correction made long CLP swatch sets
horizontally scrollable and added previous/next arrow controls so users can
reach clipped variant colors. Remaining launch dependency is visual QA in a
Shopify preview because neither Shopify CLI nor standalone Theme Check is
available on this machine.
