---
title: Build a Figma Collection Card Section for the Ogee Homepage
category: design-patterns
date: 2026-07-05
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-cards
  - mobile-scroll
---

# Build a Figma Collection Card Section for the Ogee Homepage

## Problem

The Ogee homepage redesign needed a collection card section matching the Figma
desktop and mobile references. Desktop shows four image-backed collection cards
in one 1080px row. Mobile keeps the same four collections but presents them as
a horizontally scrollable strip with 300px cards and a thin progress indicator.

The section had to stay merchant-editable in Shopify and target only four
collections: Makeup, Skincare, Bundles, and Accessories.

## Symptoms

- The existing generic `collection-list` section supports grid, bento,
  editorial, and carousel layouts, but its card composition does not match the
  Figma overlay treatment.
- The Figma card has centered white text and an outlined CTA over a dark bottom
  gradient, not the default Horizon title-block layout.
- The mobile reference is a scrollable horizontal track, not a two-column grid.
- The section needs collection-resource fallbacks without baking Figma asset
  URLs into the theme.

## What Didn't Work

### Modifying the shared collection card

Changing `snippets/collection-card.liquid` or `blocks/_collection-card.liquid`
would affect other collection-list, list-collections, and card surfaces. The
Figma treatment is homepage-specific, so broadening shared card behavior would
create avoidable regression risk.

### Reusing the existing collection-list carousel as-is

The existing carousel primitive provides useful patterns, but its sizing,
navigation controls, and card contents are designed for generic resource lists.
For this design, mobile needs simple native horizontal scrolling with a small
progress line rather than arrow controls.

### Using temporary Figma screenshots as production images

The Figma screenshots are useful for geometry and visual inspection but should
not be used as storefront assets. The theme should use Shopify collection
images, block-level image overrides, or product-image fallbacks rendered through
`image_url` and `image_tag`.

## Solution

Create a dedicated section and a settings-only theme block:

- `sections/collection-card-section.liquid`
- `blocks/_collection-card-section-card.liquid`

The block owns merchant-editable card data:

- collection
- optional image override
- bundled theme image selection
- image crop position
- title override
- description
- button label
- optional link override

The section owns the Figma layout:

- desktop content width, card height, gap, and padding
- mobile card width, card height, gap, and scroll inset
- four-card limit
- collection image fallbacks
- bottom gradient overlay
- centered white title, description, and outlined CTA
- mobile native scroll-snap track
- one-pixel progress indicator updated by a small custom element

Wire the homepage template with exactly four blocks:

- Makeup
- Skincare
- Bundles
- Accessories

Resolve card URLs in this order:

1. block link override
2. selected collection URL
3. no link

Resolve images in this order:

1. block image override
2. bundled theme asset
3. collection image
4. first product featured image
5. Shopify placeholder SVG

The bundled theme assets are committed under `assets/`:

- `collection-card-makeup.png`
- `collection-card-skincare.png`
- `collection-card-bundles.png`
- `collection-card-accessories.png`

The supplied reference images had the title, description, and CTA baked into the
pixels. The implementation removes that baked text by deriving clean,
text-free card artwork from the upper image area, then renders the title,
description, and CTA in Liquid so the content remains editable and accessible.

## Why This Works

The implementation isolates the Figma-specific composition while preserving the
shared Horizon collection primitives for their existing callers. The section
still follows Shopify's theme architecture: a section controls the full-width
module, blocks define reusable merchant-editable card data, and per-component
CSS and JavaScript live in the section.

Using native scrolling on mobile keeps the interaction lightweight and resilient
without adding carousel arrows that are absent from the design. The progress
indicator is derived from the rendered track's scroll position and dimensions,
so it adapts to merchant width, gap, and card count settings.

The resource fallback chain lets the section work immediately with existing
collections while allowing art-directed image overrides later.

## Prevention

- Keep art-directed homepage sections separate from shared card snippets unless
  the new behavior is truly universal.
- Use settings-only blocks when the section needs to own the layout and loop
  over merchant-managed resources directly.
- Limit block count when the design specifies a fixed number of cards.
- Do not use temporary Figma MCP asset URLs in theme code.
- Do not ship screenshots with baked text when the text also exists as HTML.
- Render images through `image_url` and `image_tag` with explicit widths and
  sizes.
- For bundled theme assets, render with `asset_url` and fixed intrinsic
  dimensions when the asset is already the exact card ratio.
- Use collection image fallbacks before placeholders so the section remains
  useful in stores with partial collection media.
- Test mobile scroll math with real overflow; percentage transforms are relative
  to the thumb itself, so use margin or positional layout for progress travel.
- Validate section and block schemas with Shopify theme checks.
- Verify desktop, tablet, and mobile previews before launch, especially image
  crop positions and white text contrast over merchant-selected images.

## Related Docs

- [Collection card section](../../../sections/collection-card-section.liquid)
- [Collection card settings block](../../../blocks/_collection-card-section-card.liquid)
- [Homepage template](../../../templates/index.json)
- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Figma announcement strip](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)
- [Product carousel shade preview](../ui-bugs/2026-06-28-product-carousel-shade-preview-contract.md)

## Reusable Insight

When a Figma homepage module is resource-backed but highly art-directed, split
the data and presentation responsibilities: a small settings-only block stores
merchant choices, while a dedicated section owns the exact responsive
composition. Reuse the platform primitives for data, images, schema validation,
and theme editor integration, but do not force a bespoke visual treatment into a
shared generic card.

## Compound Summary

The collection card section was implemented as a focused Shopify section with a
settings-only card block and added to the homepage after the product carousel.
It renders the requested four collections only, matches the desktop 1080px
four-card row, and uses a mobile horizontal scroll track with a one-pixel
progress indicator. The supplied collection images were converted into clean
theme assets with the baked title, description, and CTA removed; the section now
renders that content as editable HTML using the Figma typography values:
Chronicle Display Light for collection titles, Helvetica Neue Light for
supporting text, and Helvetica Neue Medium for the CTA. Validation passed for
the new section, new block, and updated homepage template. Review found and
fixed one progress
indicator issue: using `translateX(%)` would have moved the thumb relative to
itself rather than the track, so the final implementation uses percentage
inline margin instead. The remaining launch dependency is visual QA in a
Shopify preview with the real storefront font files available.
