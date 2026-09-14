---
title: Build a Figma PDP Result Stats Card Carousel
category: design-patterns
date: 2026-07-31
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - pdp
  - slideshow
---

# Build a Figma PDP Result Stats Card Carousel

## Problem

The PDP redesign needs the `Results stats` module from Figma nodes `11348:1398`
and `11348:1817`. The module is a compact editorial results section: centered
heading and description, repeated stat cards, a Figma model image crop, and
desktop/mobile carousel behavior.

The theme already has a homepage `result-proof` section, but that section owns
a larger before/after proof composition with comparison-slider media, stat
bars, testimonial copy, and homepage ordering. Reusing it for this PDP module
would mix two different content contracts.

## Symptoms

- Desktop Figma shows a 1200px card rail with four visible vertical cards,
  desktop arrows, and a thin progress rule.
- Mobile Figma switches to 300px horizontal cards with an 88px image and text
  beside it.
- The mobile Figma node includes five cards, while desktop shows four visible
  cards.
- The Figma asset URLs are temporary, so the storefront cannot depend on them
  directly.
- The existing PDP template only had product buy/content and recommendations,
  so this section needed explicit route wiring.

## What Didn't Work

### Reusing `sections/result-proof.liquid`

`result-proof` has the wrong visual and data model. It combines comparison
media, progress bars, testimonial copy, and a homepage proof narrative. Adding
the PDP card rail there would make that section harder to maintain and would
force merchants to work around irrelevant settings.

### Building a section-local scroll rail without the slideshow primitive

A plain CSS overflow rail could match the still screenshots, but it would miss
the existing Horizon slideshow behavior for selected slides, arrow actions,
dot state, and consistent carousel controls.

### Styling slideshow dots as the progress rail

The initial implementation styled slideshow dots as a segmented bottom line.
That looked close in a still screenshot, but manual drag, trackpad scroll, and
mobile swipe need a progress indicator that follows the actual scroll offset.

### Referencing Figma MCP image URLs directly

Figma MCP asset URLs expire. They are useful for implementation context and
source extraction, but committed theme code needs either merchant-selected
images or local/static Shopify-hosted assets.

### Keeping the full raw Figma image

The downloaded Figma source image was roughly 8.8 MB, much larger than needed
for the card fallback. A compressed local fallback preserves the crop while
keeping storefront weight reasonable.

## Solution

Create a dedicated PDP section:

- `sections/result-stats.liquid`
- `assets/result-stats-model.jpg`
- `templates/product.json`

The section owns:

- Heading, description, accessible carousel label, colors, desktop content
  width, desktop visible-card count, and desktop/mobile padding settings.
- Local `stat` blocks for one card each, with an optional `image_picker`,
  image alt text, title, and body.
- Product-level custom data overrides for `custom.result_stats_heading`,
  `custom.result_stats_description`, and `custom.result_stats`.
- Five default blocks in both the section preset and PDP template wiring.
- A merchant image first, compressed Figma-derived fallback image second.
- Desktop layout with four visible cards at the default 1200px rail.
- Mobile layout with 300px cards, 88px image crop, 10px card gap, and a
  scroll-position progress rail.
- Desktop arrows over the existing Horizon slideshow primitive.
- A section-local progress thumb updated from the slideshow scroller's
  `scrollLeft`, `clientWidth`, and `scrollWidth`.

The implementation reuses:

- `snippets/slideshow.liquid`
- `snippets/slideshow-slide.liquid`
- `snippets/slideshow-arrow.liquid`
- The theme slideshow runtime already used by other carousel sections.

An accessibility review found one edge case: if a merchant blanks the visible
heading, the section could point `aria-labelledby` to an absent ID. The section
now falls back to `aria-label` from the carousel label setting when no visible
heading renders.

## Admin Custom Data Contract

The section first reads product custom data, then falls back to section blocks.
This lets global/default content live in the theme editor while product-specific
claims stay editable from the Shopify product admin.

Definitions created in the connected store:

- Metaobject definition: `Result statistic`, type `result_stat`,
  ID `gid://shopify/MetaobjectDefinition/16585064553`.
- Product metafield definition: `custom.result_stats`, type
  `list.metaobject_reference`, pinned, constrained to `result_stat`,
  ID `gid://shopify/MetafieldDefinition/191701483625`.
- Product metafield definition: `custom.result_stats_heading`, type
  `single_line_text_field`, pinned,
  ID `gid://shopify/MetafieldDefinition/191701516393`.
- Product metafield definition: `custom.result_stats_description`, type
  `multi_line_text_field`, pinned,
  ID `gid://shopify/MetafieldDefinition/191701549161`.

Each `Result statistic` entry has:

- `title`: `single_line_text_field`, required.
- `text`: `multi_line_text_field`.
- `image`: `file_reference`.
- `image_alt`: `single_line_text_field`.

Value workflow:

1. In Shopify Admin, create one or more `Result statistic` metaobject entries.
2. On each product, optionally fill `Result stats heading` and
   `Result stats description`.
3. On each product, select the ordered `Result stats` list of metaobject
   entries.
4. Leave product metafields blank to use the section's default theme-editor
   blocks instead.

## Why This Works

The dedicated section keeps the PDP results card contract small and editable.
Merchants can manage product-specific cards through Admin custom data without
touching unrelated proof media settings, while the fallback block content keeps
the section usable before product metafields are populated.

Reusing Horizon slideshow snippets keeps carousel interaction behavior aligned
with the rest of the theme. Section-scoped CSS handles the Figma-specific card
sizing, typography, image crop, arrows, and progress presentation, while a
small custom element maps actual scroll position to the progress thumb.

Committing a compressed Figma-derived fallback image solves the asset lifetime
problem while still letting merchant `image_picker` values override it through
Shopify's image pipeline.

The desktop/mobile difference is modeled as responsive presentation, not as
two separate sections. The same block content becomes vertical desktop cards
and horizontal mobile cards, matching the Figma nodes without duplicating data.

## Prevention

- Check whether an existing proof/results section has the same content
  contract before reusing it.
- Use dedicated sections when Figma modules share labels but not behavior.
- Reuse the theme slideshow primitive for card rails when controls and selected
  state matter.
- Use a scroll-position progress thumb, not dot state, when users need visual
  feedback during manual drag, trackpad scroll, or mobile swipe.
- Commit Figma-derived image assets or map them to merchant settings; do not
  leave expiring MCP URLs in theme code.
- Compress raw Figma images before committing them to theme assets.
- Add `block.shopify_attributes` to repeated editable card wrappers.
- Guard section labeling when the visible heading can be blanked by merchants.
- Let product metafields override theme-editor fallback blocks when PDP content
  differs by product and belongs in Admin.
- Validate the section and JSON template together so the template section type
  resolves to a real file.
- Treat `templates/product.json` as launch wiring that can later be overwritten
  by the Shopify theme editor.

## Related Docs

- [PDP UI R5 section map](../../../docs/design-references/pdp-ui-r5/README.md)
- [Result stats section](../../../sections/result-stats.liquid)
- [PDP template](../../../templates/product.json)
- [Result stats fallback image](../../../assets/result-stats-model.jpg)
- [Result proof section pattern](2026-06-29-result-proof-section-composite-fallback.md)
- [Featured In carousel pattern](2026-07-05-figma-featured-in-press-carousel.md)

## Reusable Insight

For Figma PDP modules that look like proof/results content, classify the content
contract before choosing reuse. A proof section with before/after media and a
card carousel with repeated claims are different primitives even if their
headings sound similar.

## Compound Summary

Work mode produced a new `result-stats` PDP section, a compressed
Figma-derived fallback image, and product template wiring for five default
stat cards. Review found and fixed an accessibility edge case around blank
headings. A follow-up made the section dynamic from product metafields and
created the matching Shopify Admin custom-data definitions. A later progress
fix replaced dot-styled controls with a real scroll-position thumb for desktop
and mobile. Shopify Liquid validation passed for the new section and product
template using cached schema resources; `git diff --check` and JSONC parsing
also passed. Remaining launch risk is visual: desktop, tablet, and mobile
should still be checked in a real Shopify theme preview because local CLI
preview was not available in this environment.
