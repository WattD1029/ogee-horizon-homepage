---
title: Build a Figma PDP Customer Reviews Widget Section
category: design-patterns
date: 2026-08-01
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - pdp
  - reviews
---

# Build a Figma PDP Customer Reviews Widget Section

## Problem

The Ogee PDP redesign needed a full customer reviews section matching desktop
and mobile Figma references. The design is a quiet, unframed reviews widget:
aggregate score and rating histogram at the top, a recommendation percentage
and "How Did it Work" scale beside it, then filter/sort controls and a long
review list with separators.

The theme already had compact product rating snippets and blocks for product
cards and product details, but not a full review-list section. The locally
available Shopify data exposed only aggregate review metafields through
`product.metafields.reviews.rating` and `product.metafields.reviews.rating_count`;
there was no confirmed native Liquid source for individual reviews.

## Symptoms

- Reusing `blocks/review.liquid` would only render stars and counts, not review
  rows, histograms, filters, sort controls, or customer attributes.
- The PDP template needed the reviews widget placed as a first-class section,
  not folded into `sections/ogee-product-buy.liquid`.
- The Figma reference shows row separators and open page space, so card-based
  reviews would visually miss the target.
- The section needed to be immediately reviewable on the branch without a live
  reviews provider.
- A blank visible heading in the product template could accidentally leave the
  section without a valid accessible label.
- If aggregate product metafields are enabled, both the summary and toolbar
  counts must use the same source to avoid conflicting review totals.

## What Didn't Work

### Extending the compact review block

`blocks/review.liquid` is built for a small rating display in existing product
structures. Expanding it into a full review widget would mix two different
jobs: compact rating badges and long-form customer review content.

### Depending on provider-specific review data

The Figma widget includes review rows, attributes, helpful counts, filters, and
sort controls, but the repository did not expose a confirmed Okendo, Yotpo,
Judge.me, Loox, or Stamped data contract. Building against an assumed provider
would create brittle Liquid and likely fail in the live theme.

### Rendering only static markup

A static screenshot match would look right initially, but the `FILTERS`, sort,
and `SHOW MORE` controls are expected widget affordances. Keeping them inert
would make the section feel unfinished.

### Hiding the heading without a fallback

The product template sets the visual heading to blank to match the reference,
but the section still needs an accessible name. The review pass caught this and
added a hidden fallback heading.

## Solution

Create a dedicated Shopify section:

- `sections/ogee-customer-reviews.liquid`

Wire it into the product template:

- `templates/product.json`

Capture the implementation in this report:

- `docs/solutions/design-patterns/2026-08-01-figma-pdp-customer-reviews-widget-section.md`

The section owns:

- Aggregate score, star row, "Based on" text, and optional product metafield
  aggregate support.
- Five-row rating distribution with merchant-editable percentages and labels.
- Recommendation percentage and a Figma-style effect scale with muted markers
  and a gold active marker.
- A dark filter summary button using the existing `icon-filter.svg` asset.
- A filter panel for star rating and recommendation-only filtering.
- A sort select for recent, highest, lowest, and oldest ordering.
- Merchant-managed review blocks for reviewer details, verified state,
  recommendation, skin tone, skin concern, values, rating, title, body, date,
  and helpful counts.
- Client-side filtering, sorting, and show-more behavior for the section's
  static review blocks.
- Responsive layouts for desktop summary columns, desktop review rows, and
  single-column mobile review rows.
- A hidden fallback heading when the visible heading setting is blank.

The PDP template places the new section after `ogee_product_buy` and before the
disabled legacy product information section and product recommendations. It
seeds six review blocks so the first five match the reference and the
`SHOW MORE` button has a real hidden review to reveal.

## Why This Works

A dedicated section matches the information architecture of the design. The
review widget is full-width PDP content with its own aggregate summary,
controls, and review rows; it is not just a rating badge and not part of the buy
box.

Merchant-managed review blocks make the section reviewable immediately and keep
the branch independent from an unconfirmed reviews provider. Aggregate product
metafields are still supported for the summary totals when available, but the
individual review list remains explicit fallback content.

The section uses CSS variables for single-property merchant settings such as
colors, spacing, and rating-fill percentages. Multi-property responsive
behavior stays in section CSS, which keeps the schema manageable.

The client-side custom element is narrow: it only filters already-rendered
review blocks, reorders them, and reveals more rows. It does not try to persist
votes or call an external review API.

## Prevention

- Confirm the reviews provider before building a provider-backed review list.
- Keep aggregate Shopify review metafields separate from individual review row
  data unless the provider contract is known.
- Use a dedicated section for full PDP review widgets rather than expanding a
  compact review badge block.
- Seed enough fallback review blocks for show-more controls to have real hidden
  content.
- When a Figma section has no visible heading, render a hidden heading so the
  section still has an accessible name.
- If a setting can switch aggregate data to product metafields, synchronize all
  visible aggregate labels with the same source.
- Do not use wide numeric `range` settings for display-only counts. Shopify
  range settings can be rejected when the min, max, and step produce more than
  101 steps; use `text` for exact display counts such as "3696".
- Validate both the new section and the JSON template after wiring a section
  into a PDP route.
- Run a JavaScript syntax check for embedded section scripts because Liquid
  validation does not prove runtime JS behavior.
- Treat Shopify template JSON as theme-editor-owned and keep edits focused.

## Related Docs

- [Ogee customer reviews section](../../../sections/ogee-customer-reviews.liquid)
- [Product template](../../../templates/product.json)
- [Figma social proof carousel section](2026-06-29-figma-social-proof-carousel-section.md)
- [Result proof section fallback pattern](2026-06-29-result-proof-section-composite-fallback.md)
- [All makeup carousel section](2026-07-13-all-makeup-carousel-section.md)

## Reusable Insight

For Figma PDP review widgets in Shopify themes, split the problem into two
contracts: aggregate review data and individual review rows. Shopify product
review metafields can support the aggregate summary, but individual customer
reviews usually belong to a provider-specific app contract. Until that provider
is confirmed, a dedicated section with merchant-managed fallback review blocks
is safer than guessing at a data source.

Keep visual fidelity and interaction honesty together. If the reference shows
filters, sort, and show more, those controls should operate on the content that
the section actually owns, even if they are intentionally scoped to static
fallback blocks.

## Compound Summary

The PDP now includes a dedicated Ogee customer reviews section after the custom
product buy section. It matches the Figma review widget structure with a
summary histogram, recommendation metric, effect scale, filter and sort
controls, review rows, and a centered show-more button. The implementation uses
merchant-editable review blocks and supports product aggregate rating metafields
without assuming a live reviews provider for individual rows.

Compound review found two issues during implementation: a blank visual heading
could leave the section without an accessible label, and dynamic aggregate
metafields could make the summary and toolbar review counts disagree. Both were
fixed before final validation. A later Shopify upload check found that the
fallback review count used a 0-5000 range with one-unit steps, exceeding
Shopify's range-step limit. The count was converted to a text setting so exact
display totals remain possible and the section type can resolve from
`templates/product.json`.

Verification passed through Shopify Liquid validation for
`sections/ogee-customer-reviews.liquid` and `templates/product.json`, embedded
JavaScript syntax checking, and `git diff --check`. The validator could not
refresh Shopify Liquid docs from the network and loaded cached schemas instead.
Remaining launch risk is visual: desktop, tablet, and mobile pixel tuning still
needs confirmation in a live Shopify preview with real storefront fonts and the
store's actual reviews provider decision.
