---
title: Build a Figma Social Proof Carousel Section
category: design-patterns
date: 2026-06-29
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - carousel
  - social-proof
---

# Build a Figma Social Proof Carousel Section

## Problem

The Ogee homepage redesign needed a social proof image strip matching desktop
and mobile Figma frames while remaining editable in Shopify's theme editor. The
desktop design shows an editorial heading, four portrait media cards, a thin
progress rail, and arrow controls. The mobile design centers the heading and
uses a horizontally scrollable row with roughly two cards visible and no arrow
controls.

The section also needed launch-ready fallback media from supplied image files,
but merchants should still be able to replace the images with Shopify-hosted
media later.

## Symptoms

- A simple CSS grid would match the four-card desktop still, but would not
  preserve the required horizontal mobile behavior.
- The Figma progress line is a visual scrollbar, not dots or numbered
  slideshow pagination.
- Rendering only merchant `image_picker` settings would leave the homepage
  blank until images are uploaded in Shopify admin.
- Making image cards linkable without fallback alt text can create unnamed
  links if a merchant clears the alt text.
- Four visible cards can exactly fill the desktop frame, so controls must
  handle both overflow and no-overflow states gracefully.

## What Didn't Work

### Reusing the product carousel section

The existing product carousel is built around tabs, products, collection data,
CTA buttons, and product-card snippets. Reusing it for social proof images
would add unrelated product behavior and make the section harder for merchants
to reason about.

### Using the shared slideshow primitives directly

The shared slideshow system provides selection state, dots, counters, and arrow
controls, but the Figma target behaves more like a native horizontal media rail
with a progress bar based on scroll position. A small native-scroll controller
is a narrower fit than adapting slideshow controls.

### Depending only on theme-editor media

`image_picker` settings are the right long-term content model, but the
homepage would be visually empty in a fresh branch without selected Shopify
files. Bundled fallback assets keep the section reviewable immediately while
preserving image pickers for production replacement.

### Leaving progress at zero before JavaScript runs

If the progress fill starts at `width: 0`, users with delayed or unavailable
JavaScript see a broken-looking rail. Start the fill at 100% and let the
controller correct it when JavaScript runs.

## Solution

Create a dedicated section:

- `sections/social-proof.liquid`

Add bundled fallback assets:

- `assets/social-proof-products.png`
- `assets/social-proof-foundation.png`
- `assets/social-proof-brush.png`
- `assets/social-proof-stick.png`

Wire the section into the homepage:

- `templates/index.json`

The section owns:

- Heading, color, spacing, card gap, visible-card count, and arrow settings.
- Repeatable image blocks with `image_picker`, bundled fallback selector, alt
  text, and optional link.
- A native horizontal scroller with CSS scroll snap and hidden native
  scrollbars.
- A thin progress rail updated from `scrollLeft`, `clientWidth`, and
  `scrollWidth`.
- Desktop-only previous/next controls with 44px hit targets.
- Mobile and tablet-specific card sizing so the design does not collapse at
  intermediate viewport widths.

Use the supplied image files as static bundled fallbacks and render merchant
images with `image_url` and `image_tag` when selected. Add
`{{ block.shopify_attributes }}` to the rendered card wrapper so theme editor
selection and drag-and-drop remain intact.

Review added two guardrails:

- Linked cards synthesize fallback alt text from the section heading, then a
  stable fallback string, so optional links do not become unnamed.
- The progress rail fill defaults to 100% without JavaScript and is corrected
  after component initialization.

## Why This Works

The dedicated section matches the information architecture of the design:
social proof is a standalone editorial media strip, not product merchandising.
That keeps merchant settings small and avoids coupling to collection/product
contracts.

Native scrolling handles touch, trackpad, keyboard focus, and scroll momentum
without introducing a second full slideshow runtime. The custom element only
adds the design-specific pieces: progress fill, one-card arrow movement, and
disabled arrow state.

Bundled fallbacks make the branch visually reviewable immediately. The
`image_picker` field still remains the production path for Shopify-hosted
content, so merchants can replace the fallbacks without code.

Separating visible card counts by desktop, tablet, and mobile prevents the
reference desktop ratio from becoming cramped on tablet widths while keeping
the mobile two-card peek.

## Prevention

- Inspect existing carousel sections first, then reuse patterns rather than
  unrelated product-specific components.
- Keep social-proof media as section blocks when the content is only a set of
  editable images and links.
- Use CSS variables for merchant-controlled single-property values such as
  gap, padding, colors, and visible card counts.
- Preserve minimum 44px control targets even when Figma arrows are visually
  small.
- Make progress indicators tolerant of no-overflow states and no-JavaScript
  states.
- If cards can become links, ensure there is always an accessible name.
- Add tablet sizing for Figma sections that specify only desktop and mobile
  frames.
- Validate section schema and homepage JSON after adding a new section.
- Treat generated Shopify template JSON as theme-editor-owned; keep edits
  focused and avoid unrelated formatting churn.

## Related Docs

- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Figma announcement strip](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)
- [Social proof section](../../../sections/social-proof.liquid)
- [Homepage template](../../../templates/index.json)

## Reusable Insight

For Figma media strips in Shopify themes, choose the smallest interaction model
that matches the design. If the design is a horizontally scrollable image rail,
a dedicated section with native scroll snap and a small progress controller can
be safer than forcing the content into a product carousel or full slideshow
primitive.

Bundled fallback media can be useful for branch review, but production should
keep an editable `image_picker` path so merchants own final content.

## Compound Summary

The Ogee social proof section was implemented as a focused Shopify section with
editable image blocks, bundled fallback assets, responsive card sizing, a
scroll-position progress rail, desktop arrows, and mobile horizontal scroll.
Review hardened linked-card accessibility, no-JavaScript progress behavior, and
tablet layout. Shopify Liquid validation passed for the new section and
homepage template using cached schemas with instrumentation opted out.
