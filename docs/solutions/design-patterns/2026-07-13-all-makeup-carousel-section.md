---
title: Build Art-Directed Collection Carousels From Shared Product Cards
category: design-patterns
date: 2026-07-13
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - product-carousel
  - homepage
---

# Build Art-Directed Collection Carousels From Shared Product Cards

## Problem

The homepage redesign needed a high-fidelity `All Makeup` section that looked
different from the existing tabbed product carousel while keeping the same
product-card behavior: media, shade previews, wishlist affordance, reviews,
price, and quick-add behavior.

The target Figma treatment was a white editorial product rail derived from the
existing carousel sizing: a `1080 x 741` desktop frame, a `390 x 541` mobile
frame, four desktop cards, two visible mobile cards, first-card best-seller
badges, a visible editorial heading, desktop and mobile-specific `All Makeup`
link placement, a black mobile CTA bar, and a desktop progress rail with arrow
controls.

## Symptoms

- The existing `product-carousel` section already supported multiple
  collections through tabs, but its header, tab list, CTA treatment, and spacing
  did not match the single-collection wireframe.
- Rebuilding product cards directly inside a new section would risk losing the
  shade-preview contract captured in the prior carousel work.
- A single-collection carousel still needed empty and placeholder states so it
  remained useful in the theme editor.
- Badge behavior needed to be art-directed for only the first cards without
  changing the existing carousel's default `New` badge behavior.
- The desktop progress rail needed real scroll-position math rather than a
  scaled full-width element that could drift visually.
- The shared slideshow primitive defaulted its `slideshow-container`
  background to the theme surface, which created a white slab behind product
  details inside the black All Makeup section.
- The section header initially hid the heading and rendered the desktop CTA as
  a text link, while the card overrides made live product titles, prices,
  ratings, badges, and swatches much heavier than the Figma component.

## What Didn't Work

Changing the existing tabbed carousel would have coupled two different
homepage modules: the multi-category product carousel and the art-directed
makeup rail. That would make the tabbed section harder to reuse and would
force design-specific spacing and CTA overrides into a general component.

Duplicating the product-card Liquid was also the wrong path. The card already
owns product media, shade detection, shade swatch previews, review fallback,
quick-add state, and responsive behavior. Duplicating that would create a
second place to fix product-card bugs.

The first progress rail implementation used `scaleX()` on a full-width thumb.
That was simple, but progress rails are easier to reason about when the thumb
has an explicit width and translates across the remaining track distance.

## Solution

Create `sections/all-makeup-carousel.liquid` as a single-collection wrapper
around the existing `product-carousel-card` snippet.

- Default the section to the `makeup` collection, while keeping a collection
  setting for merchants.
- Render products through the existing `product-carousel-card` snippet instead
  of duplicating card markup.
- Use the shared slideshow snippets for the horizontal product rail.
- Scope visual overrides under `.all-makeup-carousel` so the black-background
  treatment experiments do not leak into the tabbed carousel.
- Add section settings for badge label/count, desktop and mobile gutters, card
  gap, colors, mobile and desktop padding, visible products, and fallback
  review data.
- Add a small `all-makeup-carousel` custom element only for the desktop
  progress rail.
- Match the Figma sizing source: desktop content width `1080`, card gap `8`,
  desktop top rhythm `96 + 42 + 24`, mobile gutter `15`, mobile gap `8`, and
  mobile top padding `36`.
- Override the All Makeup slideshow container and slides to transparent so the
  section background remains visible beneath product details while media tiles
  keep their light product-image surface.
- Render the configured heading visibly with the Ogee serif stack, convert the
  desktop `All Makeup` link into the outlined Figma CTA, and scope lighter
  card typography, badge, rating, and swatch sizing under `.all-makeup-carousel`.
- Reuse the theme's `slideshow-controls` arrows for the desktop rail instead
  of maintaining a separate JavaScript-only progress component.
- Compress the mobile-only rhythm after visual review: reduce the heading gap,
  shrink the bottom CTA label and height, and bring shade buttons down to the
  Figma-scale `10px` label treatment.
- Extend `product-carousel-card` with optional `show_badge`, `badge_limit`,
  and `card_index` parameters so the new section can show badges only on the
  first cards without changing existing callers.
- Keep the original carousel's default badge behavior by falling back to `New`
  only when no badge limit is provided.
- Wire the section into `templates/index.json` immediately after the existing
  homepage product carousel.

## Why This Works

The new section owns layout, art direction, CTA placement, spacing, colors, and
progress feedback. The shared product-card snippet keeps owning product
semantics and interactions.

That split preserves the existing carousel contract and makes future product
card fixes apply to both the tabbed carousel and the All Makeup rail. It also
keeps the theme-editor surface focused: merchants can choose the collection and
tune section-level presentation without managing individual product-card blocks.

The `badge_limit` extension is intentionally small. Existing callers still get
the previous default `New` badge, while art-directed callers can limit badges
by index and let a blank badge label truly hide badges.

The progress rail now sets the thumb width from the visible scroll ratio and
translates it across the remaining track in pixels, which maps directly to the
scroll container's `scrollLeft`.

## Prevention

- Prefer a new section wrapper when the design changes the carousel's purpose,
  chrome, spacing, and background, but not the underlying product-card
  contract.
- Reuse `product-carousel-card` for carousel-like product rails unless the
  product metadata, media, or quick-add behavior truly diverges.
- Add narrowly scoped snippet parameters for small card variations instead of
  cloning card markup.
- Keep art-directed CSS under a section-specific parent class.
- Verify badge defaults do not surprise merchants who clear optional labels.
- For progress rails, compute explicit thumb width and travel distance from the
  scroller dimensions.
- Run Shopify theme validation on the section, shared snippet, and JSON
  template together because cross-file translation and schema issues often show
  up outside the file being edited.

## Related Docs

- [All Makeup carousel section](../../../sections/all-makeup-carousel.liquid)
- [Product carousel card](../../../snippets/product-carousel-card.liquid)
- [Homepage template](../../../templates/index.json)
- [Product carousel shade preview contract](../ui-bugs/2026-06-28-product-carousel-shade-preview-contract.md)

## Reusable Insight

For Shopify theme homepage work, reusable product cards and art-directed
sections should be separate layers. The card should own product data and
interaction contracts; the section should own layout, collection choice, visual
rhythm, and editorial styling.

## Compound Summary

Work mode produced a new `all-makeup-carousel` homepage section, wired it into
the homepage template, and extended `product-carousel-card` with limited badge
control. Review mode found and fixed two issues: blank limited badges could
fall back to `New`, and the progress rail was easier to make accurate with
explicit thumb width plus pixel translation. A Figma-size follow-up corrected
the final desktop/mobile proportions, restored the white section surface, and
kept the mobile `All Makeup` CTA as a black bar. A later visual review restored
the missing editorial heading, converted the desktop CTA to the outlined button,
softened the product-card typography to match Figma, and replaced the standalone
progress script with theme slideshow controls for the bottom arrows. Validation
passed for the initial implementation, and a final mobile pass reduced the
large top spacer plus oversized mobile button text. Validation passed for
`sections/all-makeup-carousel.liquid`, `snippets/product-carousel-card.liquid`,
and `templates/index.json`; JavaScript blocks parsed locally;
`templates/index.json` also parsed as JSON after removing the Shopify-generated
header comment.
