---
title: Build a Figma PDP How To Use Media Section
category: design-patterns
date: 2026-07-31
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - pdp
  - responsive-layout
  - media
---

# Build a Figma PDP How To Use Media Section

## Problem

The Ogee PDP redesign needed a "How To Use" visual media section from the R5
Figma file. The desktop node shows a quiet ivory band with a centered 1200px
two-column layout: square media on the left, centered editorial copy on the
right. The mobile node changes the reading order to heading, square media, and
body copy in a single centered stack.

The implementation needed to render on the product template, stay editable in
Shopify's theme editor, and use the exact Figma-provided media image without
depending on temporary Figma MCP URLs.

## Symptoms

- Desktop and mobile have different visual order, even though the content is
  the same.
- The desktop media must be a square crop, while mobile uses a fixed 350px
  media block that is square at the 390px Figma viewport.
- The existing PDP `ogee-product-buy` section already has an accordion row for
  `product.metafields.custom.how_to_use`, so the new section should not replace
  that accordion contract by accident.
- The Figma play icon is a standalone triangle asset and should not be
  hand-drawn.
- Figma MCP media URLs expire, so they are unsafe for committed Liquid.
- Tablet behavior is not provided by Figma but still needs to avoid awkward
  stretched crops.

## What Didn't Work

### Reusing the accordion how-to content

The product-buy accordion already handles product-specific "How to apply" copy.
Reusing that area for the Figma visual section would mix an informational
accordion with a standalone media module and change an existing PDP behavior.

### Reusing `media-with-content`

The shared `media-with-content` section can create a generic split layout, but
the Figma module needs mobile heading/media/text reordering, a bundled media
fallback, an optional play overlay, explicit brand font stacks, and a
Figma-specific tablet correction. A dedicated section keeps those assumptions
local.

### Shipping the temporary Figma URLs

The design context returned short-lived asset URLs. Those are useful for
inspection, but committed theme code needs permanent assets or merchant-selected
Shopify media. The fallback poster was downloaded from Figma and committed as a
theme asset.

### Applying the mobile fixed height to tablet

The first implementation used the 350px mobile media height for every viewport
below desktop. A tablet screenshot showed that this made the media a wide,
shallow strip. The final CSS keeps tablet media square and centered, then
applies the fixed 350px height only below 750px.

## Solution

Create a dedicated section and wire it into the product template:

- `sections/how-to-use.liquid`
- `templates/product.json`
- `assets/how-to-use-poster.jpg`
- `assets/how-to-use-play.svg`

The section owns:

- Merchant `image_picker` override with `image_tag` rendering for Shopify focal
  point support.
- Bundled Figma poster fallback through `assets/how-to-use-poster.jpg`.
- Bundled Figma play triangle through `assets/how-to-use-play.svg`.
- Media type selector for the Figma image/poster layout or an uploaded Shopify
  video.
- Native controls for uploaded Shopify video, with optional looping and an
  editable accessible label.
- Optional video link for image mode. When no link is set, the play icon is
  visual only and hidden from assistive technology.
- Editable heading, rich text body, image alt text, colors, content width, and
  mobile media height.

The product template places the section directly after `ogee_product_buy`, before
the disabled generic `main` section and before product recommendations.

Responsive structure:

- Desktop: flex row, max width 1200px, two equal columns, square media, 64px
  vertical padding, 40px copy padding.
- Tablet: stacked layout, centered square media capped at 600px to prevent a
  wide shallow crop.
- Mobile: heading first, 350px media block, body copy below, 20px side gutters,
  32px vertical padding.

Typography is section-scoped:

- Heading prefers `Chronicle Display`, then serif/theme heading fallbacks.
- Body prefers `Helvetica Neue`, then Helvetica/Arial/theme body fallbacks.

## Why This Works

The dedicated section isolates a PDP-specific Figma module while preserving the
existing product-buy accordion behavior. Merchants can edit the visible copy and
swap the poster image without changing Liquid.

Using `image_picker` plus `image_tag` follows Shopify's focal point behavior for
merchant-selected images. Keeping the Figma poster as an optimized theme asset
gives the branch an immediate visual match without relying on an expiring remote
URL.

The CSS ordering keeps semantic markup simple and avoids duplicate headings:
desktop renders media then copy, while mobile uses `display: contents` on the
copy wrapper so the heading, media, and body can be ordered as separate flex
items.

The tablet correction covers the viewport not shown in Figma. This keeps the
media composition stable between the mobile and desktop designs.

## Prevention

- Check whether a PDP already has a how-to data contract before adding a new
  visual how-to module.
- Download and commit Figma media that must render later, or expose it through
  merchant-managed Shopify media.
- Optimize raw Figma exports before committing theme fallbacks.
- Reuse exported Figma icons unless a local icon clearly matches the glyph.
- Verify desktop, mobile, and tablet even when Figma provides only desktop and
  mobile nodes.
- Do not apply fixed mobile media heights to tablet without checking the crop.
- Keep optional play controls accessible: use a real link/button only when an
  action exists.
- Validate section schema and product JSON with Shopify-aware tooling after
  template wiring.

## Related Docs

- [How to use section](../../../sections/how-to-use.liquid)
- [Product template placement](../../../templates/product.json)
- [Story split video section](2026-06-29-figma-story-split-video-section.md)
- [Featured In carousel Figma asset handling](2026-07-05-figma-featured-in-press-carousel.md)

## Reusable Insight

When a Figma PDP module looks like a generic image-with-text section, inspect
the content contract before reusing a shared primitive. PDP modules often have
existing metafield or accordion behavior nearby, and a visual section can be
safer as a narrow, merchant-editable component.

For responsive Figma work, treat the missing tablet layout as its own design
decision. A mobile fixed height can match the screenshot perfectly while still
breaking the composition at tablet widths.

## Compound Summary

The PDP How To Use module was implemented as a dedicated Shopify section with a
permanent optimized Figma poster, exported Figma play icon, editable copy,
image override, uploaded Shopify video mode, optional image-mode video link, and
product template placement. Review found one responsive issue: tablet media used
the mobile fixed height and became too shallow. The final version keeps tablet
media square and centered while preserving the Figma mobile 350px media block.

Validation passed for `sections/how-to-use.liquid` and `templates/product.json`
with the Shopify Liquid validator. Visual harness screenshots were captured for
desktop, tablet, and mobile in `output/playwright/`.
