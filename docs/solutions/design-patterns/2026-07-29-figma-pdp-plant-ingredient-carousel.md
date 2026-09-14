---
title: Build a Figma PDP Plant Ingredient Carousel
category: design-patterns
date: 2026-07-29
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - pdp
  - carousel
  - native-scroll
---

# Build a Figma PDP Plant Ingredient Carousel

## Problem

The Ogee PDP redesign needed the "Powered By High-Performance Plant-Derived
Ingredients" module from Figma implemented as a merchant-editable Shopify
theme section. Desktop Figma node `11348:1376` shows a centered heading and
description above a 1200px ingredient card rail with three visible image cards,
8px gaps, overlay arrows, and a thin segmented progress rule. Mobile Figma node
`11348:1797` shows the same module in a 390px viewport with 20px side padding,
a 350px scrollable card, a visible slice of the next card, overlay arrows, and
a white progress rule inside the image area.

The user also requested that the photos be extracted from Figma and used as the
reference imagery.

## Symptoms

- The current product template only had the Ogee buy section, a disabled legacy
  product-information section, and product recommendations.
- The local PDP design reference map listed Plant-derived ingredients as a PDP
  body section, but the local section image folder only contained `.gitkeep`
  placeholders.
- Figma MCP asset URLs are temporary and expire, so using them directly in
  committed Liquid would make the branch decay.
- Existing slideshow primitives can handle carousels, but this design needs a
  mobile rail that visibly exposes the next card and keeps the segmented
  progress line over the image area.
- The Figma stock images are watermarked comps, so they can support branch
  fidelity but should not be treated as launch-ready licensed assets.

## What Didn't Work

### Relying on temporary Figma URLs

The Figma design context returned ingredient image URLs such as
`https://www.figma.com/api/mcp/asset/...`. Those URLs are short-lived. The
solution downloads the exact image bytes into `assets/` and references them
with `asset_url`.

### Flattening the section as an image

A screenshot would match the Figma pixels but would make the heading, body
copy, metrics, and card titles non-editable and inaccessible. The final
implementation renders text as HTML and uses the images only as card media.

### Forcing the shared slideshow primitive

The theme's Horizon slideshow primitives remain the right choice for many
carousels, but this section needs a compact native scroll rail with the mobile
progress bar positioned over the active image card. Reusing the native-scroll
pattern from the collection card section kept the behavior lighter and closer
to the Figma mobile frame.

### Keeping one-off card data inside the section only

Putting all card fields directly in section settings would make add, reorder,
and duplicate workflows awkward. A dedicated `_plant-ingredient-card` block
keeps each ingredient card self-contained and theme-editor friendly.

## Solution

Create the section and block:

- `sections/plant-derived-ingredients.liquid`
- `blocks/_plant-ingredient-card.liquid`

Commit the extracted Figma assets:

- `assets/plant-ingredient-butterfly-bush.png`
- `assets/plant-ingredient-yellow-flower.png`
- `assets/plant-ingredient-white-flower.png`

Wire the section into the PDP template:

- `templates/product.json`
- Add `plant_derived_ingredients` after `ogee_product_buy`.
- Provide three default `_plant-ingredient-card` blocks matching the desktop
  Figma card content.

The section owns:

- Heading, description, colors, overlay color, progress colors, desktop/mobile
  dimensions, gaps, and padding.
- A native horizontal scroll track using scroll snap.
- Overlay previous and next buttons using the existing `icon-arrow.svg` glyph.
- A segmented progress indicator that updates from scroll position.
- Mobile positioning that places the progress rule over the card near the
  bottom of the image.

The block owns:

- Image override through `image_picker`.
- Bundled Figma image fallback selection.
- Image crop position and alt text.
- Metric, title, and body copy.
- Overlay text styles matching the Figma typography: Chronicle Display for the
  metric, Helvetica Neue for uppercase title and supporting body.

Review fixes made during implementation:

- Adjusted scroll targeting to subtract the mobile track's inline-start padding,
  so arrow/progress navigation aligns cards to the same 20px inset as the
  Figma frame.
- Replaced anonymous progress button click listeners with one removable
  delegated click handler to keep section reloads clean in the theme editor.
- Guarded the delegated handler so it only calls `closest()` on element
  targets.

Verification performed:

- Parsed `sections/plant-derived-ingredients.liquid` schema JSON.
- Parsed `blocks/_plant-ingredient-card.liquid` schema JSON.
- Syntax-checked embedded section JavaScript with `new Function(...)`.
- Parsed `templates/product.json` after stripping the generated Shopify comment
  header.
- Checked touched files for trailing whitespace.
- Ran `git diff --check` successfully.
- Confirmed the three downloaded image assets are valid PNGs around 1500px wide.

## Why This Works

The section/block split matches Shopify theme architecture. The full-width PDP
module stays in `sections/`, while each repeated ingredient card lives in a
merchant-editable block with `block.shopify_attributes`.

Native scroll snap fits this Figma composition because the mobile design is not
a fully hidden single-slide carousel. The user should see the next card peeking
in from the right edge, and scroll position should update a thin in-card
progress rule.

Using committed asset files avoids depending on Figma's expiring MCP URLs. The
`image_picker` override keeps those extracted images as branch defaults rather
than a permanent content lock.

The progress and arrow code is isolated to the section, so shared slideshow,
product recommendation, hero, and collection-list behavior remain untouched.

## Prevention

- Treat Figma MCP asset URLs as extraction sources only. Download production
  references or wire real Shopify media before committing.
- Keep Figma-specific PDP modules in dedicated sections and blocks unless the
  behavior is truly universal.
- Use native scroll when the mobile design intentionally shows partial adjacent
  cards and requires progress tied to the rendered scroll track.
- Account for scroll container padding when aligning cards programmatically.
- Use delegated event listeners or retained handler references for custom
  elements that can be mounted and unmounted by the theme editor.
- Keep text editable as HTML instead of baking text into reference images.
- Run Shopify Theme Check and visual QA in a theme preview when CLI tooling and
  a connected store are available.
- Replace watermarked stock comps before production launch.

## Related Docs

- [Figma collection card section](2026-07-05-figma-collection-card-section.md)
- [Figma promotion block carousel](2026-06-28-figma-promotion-block-carousel.md)
- [Figma social proof carousel section](2026-06-29-figma-social-proof-carousel-section.md)
- [Plant-derived ingredients section](../../../sections/plant-derived-ingredients.liquid)
- [Plant ingredient card block](../../../blocks/_plant-ingredient-card.liquid)
- [PDP template](../../../templates/product.json)

## Reusable Insight

For Figma PDP modules made of image-backed editorial cards, use a dedicated
section plus a focused settings block. Extract image assets into committed theme
files only as stable fallbacks, preserve all copy as editable HTML, and choose
native scroll when the mobile design depends on visible overflow and in-card
progress.

## Compound Summary

The plant-derived ingredients PDP module was implemented from Figma desktop
node `11348:1376` and mobile node `11348:1797` as a Shopify section and theme
block. It includes extracted Figma image assets, merchant image overrides,
responsive Figma-aligned typography and spacing, native scroll-snap behavior,
overlay arrows, segmented progress, PDP template wiring, changelog entries, and
review-driven fixes for scroll alignment and event cleanup.

No remaining actionable review issues were found after validation. Remaining
launch risks are visual verification in a Shopify preview, confirming real
storefront font availability, and replacing the watermarked stock reference
images with licensed production assets.
