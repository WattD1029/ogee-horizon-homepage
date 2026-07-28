---
title: Build Figma Quiz Cards as Editable Shopify Section Blocks
category: design-patterns
date: 2026-06-29
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - homepage
  - responsive-images
---

# Build Figma Quiz Cards as Editable Shopify Section Blocks

## Problem

The Ogee homepage redesign needed a two-card quiz section matching Figma's
desktop and mobile geometry. The cards use photographic backgrounds with white
overlay copy, a time label, and a bordered quiz CTA.

The section also needed to use supplied local images immediately while still
remaining editable through the Shopify theme editor when final Shopify-hosted
media and quiz URLs are ready.

## Symptoms

- Desktop Figma uses two `536px` by `400px` cards inside a `1080px` row with an
  `8px` gap.
- Mobile Figma stacks two `360px` square cards inside a `390px` frame with
  `15px` side gutters.
- The supplied images are photographic `1072px` by `800px` PNGs, much heavier
  than needed for theme assets.
- The final quiz URLs were not provided, but the button still needs to render
  for design review.
- Isolated visual previews can miss global theme assumptions such as
  `box-sizing: border-box`.

## What Didn't Work

### Baking text into the images

Flattening the Figma card into a single image would match the screenshot but
would make copy, time labels, and CTA text inaccessible and harder for merchants
to edit.

### Using temporary Figma asset URLs

Figma preview URLs are not production assets. They can expire, change, or bypass
Shopify's normal asset and media workflows.

### Keeping supplied photo PNGs as-is

The local PNG files were close to 1 MB each. For photographic content used as
bundled fallbacks, optimized JPEGs preserve the visual result at a much smaller
payload.

### Assuming global CSS in the component

The visual harness exposed that the CTA height became too large when the
component did not inherit the theme's global `border-box` rule. Component CSS
should define critical box sizing locally for fixed-format UI.

## Solution

Create a dedicated section with local section blocks:

- `sections/quiz-cards.liquid`

The section owns:

- Maximum row width.
- Desktop and mobile card heights.
- Grid gap.
- Mobile gutter.
- Section padding.
- Shared text, overlay, and button colors.
- A visually hidden accessible section heading.

Each local section block owns:

- Desktop and mobile `image_picker` settings.
- A bundled fallback image selector for the supplied design assets.
- Desktop and mobile `object-position` controls.
- Time label, heading, description, CTA label, link, and new-tab behavior.
- Overlay strength.
- Decorative media rendering with live HTML copy.
- Disabled visual CTA state when no link is configured.

Use local `quiz_card` blocks in the section schema so uploads do not depend on a
separate theme block file resolving during deployment. Render background images
decoratively and keep all message and CTA text in HTML.

Convert supplied photographic PNGs to optimized JPEGs before committing them as
theme assets:

- `assets/ogee-quiz-perfect-shade.jpg`
- `assets/ogee-quiz-skincare-routine.jpg`

Keep bundled images as fallback assets only. The primary merchant path remains
`image_picker`, which allows Shopify-hosted media to be selected later.

Load bundled quiz images lazily unless the section is moved to the first page
position. If it becomes the first section, eager-load only the first card image
and give it high fetch priority.

## Why This Works

The custom section preserves Figma's exact card geometry without turning the
design into an inaccessible flat image. Merchants can still replace images,
copy, links, and layout values in the theme editor.

The block-level fallback selector makes supplied design-review assets available
immediately while avoiding temporary external URLs. Optimized JPEGs reduce page
weight and are more appropriate for photographic bundled fallbacks than PNG.

Separating section-level layout from block-level content keeps the editor
contract straightforward while avoiding cross-file upload dependencies. Local
`box-sizing` on the CTA and content wrapper protects the fixed card layout in
static previews, Shopify previews, and any context where global CSS loads in a
different order.

## Prevention

- Keep text and buttons as HTML over card imagery.
- Treat Figma or clipboard images as source assets, not final delivery format.
- Optimize photographic bundled fallbacks before committing them.
- Prefer Shopify `image_picker` settings for merchant-controlled production
  media.
- Do not make the full image card clickable when the design shows a specific
  button target.
- Keep CTA labels visible but render a disabled state when final URLs are not
  known.
- Add local `box-sizing` to fixed-format buttons and card content.
- Verify desktop and mobile rendered geometry with screenshots, not only code
  inspection.
- Check image payload size after adding bundled assets.

## Related Docs

- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Figma announcement strip](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)
- [Quiz cards section](../../../sections/quiz-cards.liquid)

## Reusable Insight

For Figma-driven homepage cards, use local section blocks when the design is
specific to one section and upload compatibility matters. Treat local imagery as
optimized bundled fallbacks so design review can use assets immediately, while
production can later swap to Shopify-hosted media and real links without
changing the component contract.

## Compound Summary

The Ogee quiz section was implemented as a targeted two-card section with
editable `quiz_card` section blocks. The supplied images were converted from
large PNGs to lightweight JPEG bundled fallbacks, while image pickers remain
available for production media. Desktop and mobile geometry were verified with
Playwright screenshots against the Figma dimensions, and review tightened
performance, upload compatibility, and box-model behavior before documenting the
pattern.
