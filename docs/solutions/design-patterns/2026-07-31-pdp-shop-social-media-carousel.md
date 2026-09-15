---
title: Build a PDP Shop Social Media Carousel
category: design-patterns
date: 2026-07-31
type: knowledge
tags:
  - shopify
  - liquid
  - figma
  - pdp
  - carousel
  - social-media
---

# Build a PDP Shop Social Media Carousel

## Problem

The Ogee product detail page needed a `Shop @Ogee` social media section that
matched the desktop and mobile PDP Figma frames while remaining editable in the
Shopify theme editor.

The desktop design shows a pale editorial band, a serif heading, a small
hashtag line, four square social cards visible at once, a right-side arrow
over the final visible card, and a one-third active progress rail. The mobile
design uses the same content but a much tighter composition: 20px side padding,
264px square cards, a peek of the second card, and a centered Instagram/shop
overlay on the first visible tile.

## Symptoms

- The existing homepage `social-proof` section used portrait cards and a
  scroll-position progress fill, so it did not match the PDP square-card
  Figma target.
- A permanent implementation could not reference Figma MCP image URLs because
  those URLs expire.
- Adding only `image_picker` blocks would make the section blank in a fresh
  branch until a merchant configured media.
- Social post cards needed to link to social media instead of a generic shop
  collection, with the link editable per product.
- A true scrollbar-style progress fill started too wide on desktop because
  only a small amount of the fifth card overflows. The Figma rail starts at
  one third, not at the visible viewport ratio.
- Arrow navigation originally stopped at the rail ends; the requested
  interaction should wrap back to the beginning for a loop-like carousel.
- Desktop and mobile needed different interaction treatment: desktop arrows
  are visible, while the mobile reference hides arrows and emphasizes the
  first card overlay.

## What Didn't Work

### Modifying the Existing Homepage Social Proof Section

The existing `sections/social-proof.liquid` already solves a similar native
scroll carousel problem, but its content model and dimensions are homepage
specific. Changing it for the PDP would risk regressing the homepage and would
still require new square-card defaults.

### Keeping Figma Asset URLs in Liquid

The Figma design context exports image and SVG URLs that are intentionally
short-lived. Using them directly in committed Liquid would create a section
that works briefly, then silently loses its imagery.

### Treating the Progress Rail as a Viewport Scrollbar

The first implementation reused the previous social-proof progress formula:
`(scrollLeft + clientWidth) / scrollWidth`. For this design, that made the
initial progress fill much wider than the screenshot because the visible
viewport covers most of the scrollable width. The PDP Figma rail behaves more
like a three-segment indicator.

## Solution

Create a dedicated PDP-compatible section:

- `sections/shop-social-media.liquid`

Add stable fallback media. The eye-balm close-up fallback was replaced with the
user-provided PNG hosted on Shopify CDN after preview showed the prior theme
asset URL was not loading reliably. Verify the uploaded source image before
patching the CDN URL; uploading a preview screenshot will make the carousel
render that screenshot inside the card.

- `assets/shop-social-products-alt.png`
- `assets/shop-social-instagram.svg`

Wire the section into the product template before recommendations:

- `templates/product.json`

The section owns:

- Editable heading, subheading, overlay button label, colors, desktop padding,
  mobile padding, and desktop arrow visibility.
- Repeatable `post` blocks with `image_picker`, fallback image selection, alt
  text, social link override, new-tab behavior, and mobile overlay toggle.
- Product metafield-driven social links via `custom.social_media_url`, with the
  section fallback URL used when a product value is blank.
- A native horizontal scroller with square cards, hidden native scrollbars, CSS
  scroll snap, and mouse drag support.
- Desktop 282px cards with 24px gap and mobile 264px cards with 8px gap.
- A mobile-only overlay that renders the exported Figma Instagram SVG and
  `Shop` label over the selected block.
- Desktop arrow buttons that scroll by exactly one card plus gap and wrap from
  the end back to the beginning.
- A progress rail that defaults to one-third width and advances from 33.333%
  to 100% as the carousel scrolls.

The product template instantiates five cards, alternating the product tabletop
and eye-balm close-up fallbacks. Five cards preserve the Figma behavior where
four cards are visible and more content exists offscreen.

The Shopify Product metafield definition `custom.social_media_url` was created
as a `url` metafield. Product values can be managed per product; when values are
blank, the template fallback points to Ogee's Instagram profile.

## Why This Works

The implementation reuses the proven native-scroll carousel pattern from the
homepage social proof work, but isolates the PDP-specific dimensions, assets,
overlay, and progress semantics in a new section. That keeps both sections
easier to reason about and avoids coupling product-page polish to homepage
composition.

Bundled fallback assets make the branch immediately reviewable while
`image_picker` settings keep the production content path merchant-owned. The
section can ship with the Figma imagery and later be swapped to Shopify-hosted
social content without code changes.

The progress rail fix preserves the screenshot's initial one-third indicator
while still reflecting interaction after scroll. This matches the visual
language of the Figma slider component better than a literal scrollbar fill.

The link contract keeps social routing separate from layout configuration:
block overrides handle one-off cards, the product metafield handles PDP-specific
social destinations, and the section fallback prevents empty values from
leaving cards unlinked.

Linked cards receive an `aria-label` from block alt text and render decorative
empty-alt images inside the link. Unlinked cards keep their image alt text.
That avoids duplicate link names while keeping non-linked media meaningful.

## Prevention

- Check whether an existing carousel is content-compatible before reusing it.
  Similar interaction patterns can still need separate sections when dimensions
  and content contracts differ.
- Download and commit Figma image/SVG exports or replace them with Shopify
  content sources before committing code.
- Commit every bundled fallback asset referenced by the section; a single
  missing asset creates blank social cards even when the Liquid logic is valid.
- Compare progress indicators visually against the Figma component, not only
  against scroll math.
- Add one more block than the visible desktop card count when the design shows
  an arrow and offscreen continuation.
- Keep fallback assets small and inspect raw Figma exports; some raw exports
  can be transparent layers or oversized source crops with annotation handles.
- Validate both the section schema and the JSON template insertion after adding
  a new section to a Shopify theme.
- Preserve mobile and desktop interaction differences explicitly instead of
  assuming one carousel behavior covers every viewport.

## Related Docs

- [Build a Figma Social Proof Carousel Section](2026-06-29-figma-social-proof-carousel-section.md)
- [Shop social media section](../../../sections/shop-social-media.liquid)
- [Product template](../../../templates/product.json)

## Reusable Insight

For Figma-driven Shopify media rails, separate the interaction primitive from
the visual contract. Native scroll, progress updates, and arrow movement can be
reused, but card shape, asset strategy, overlay behavior, and progress semantics
should stay local to the section when the Figma frame is meaningfully different.

Treat Figma raw assets as candidates, not a guaranteed final set. Inspect each
download before committing it, then keep only the assets that render the clean
reference state.

When a social rail appears on a PDP, prefer a product-owned URL metafield over a
hardcoded collection link. This lets the same section point to a campaign,
creator post, or platform profile without duplicating templates.

## Compound Summary

The PDP `Shop @Ogee` social media section was implemented as a dedicated
Shopify Liquid section with merchant-editable image blocks, committed social
fallback assets, mobile overlay controls, looping desktop arrows, a product
social URL metafield contract, and a one-third starting progress rail. Review
found and fixed an initial progress mismatch caused by reusing scrollbar-style
math from the previous social proof pattern, then a second pass moved links to
the social media metafield/fallback flow. Shopify validation passed for the
section and product template using cached schemas; live Shopify preview remains
the main residual visual check.
