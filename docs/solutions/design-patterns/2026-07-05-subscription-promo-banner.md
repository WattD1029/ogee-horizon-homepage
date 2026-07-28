---
title: Build a Subscription Promo Banner from Figma on an Existing Section
category: design-patterns
date: 2026-07-05
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - homepage
  - typography
---

# Build a Subscription Promo Banner from Figma on an Existing Section

## Problem

The Ogee homepage needed the Round 3 Figma subscription promo banner implemented
in the Shopify theme. The reference is a quiet full-width ivory strip with
editorial typography and a single black CTA:

- Desktop frame: `1920x220`
- Desktop content frame: `1080x100`, centered at `x=420`, `y=60`
- Desktop copy lane: `848px`
- Desktop button: `200x42`, offset by `32px` from copy
- Mobile frame: `390x259`
- Mobile content width: `342px`, with `24px` side gutters
- Mobile content padding: `32px` top and bottom

The existing `promotion-offer-banner` section was an image-led product promo.
It already had merchant-editable text, CTA, product picker, custom link, handle
fallback, and color settings, but its visible structure and defaults did not
match the subscription design.

## Symptoms

- The previous implementation reserved a product image lane, which the Figma
  subscription banner hides.
- The old homepage instance still promoted the contour collection rather than
  subscribe-and-save messaging.
- The section background was constrained by the page-width section model instead
  of behaving like the Figma full-width strip.
- Heading typography used Georgia directly, while Figma specifies Chronicle
  Display Light.
- Body, eyebrow, and button typography needed Helvetica Neue-style metrics.
- Mobile height and spacing were tuned for an image card, not the compact
  `390x259` Figma composition.
- The Figma node includes a hidden media placeholder; implementing that as real
  media would create an unnecessary empty lane.

## What Didn't Work

### Building a new section first

The theme already had a section with the right editable data model and homepage
placement. Creating a second subscription-only section would duplicate CTA
routing and color controls without solving a new data problem.

### Keeping the image lane

The desktop Figma metadata shows a hidden `220x220` placeholder, but the visible
composition starts at `x=0` inside the `1080px` frame with only copy and button.
Keeping the image grid column would shift the copy and prevent the `848 + 32 +
200 = 1080` layout from matching Figma.

### Depending on current theme font settings

The inspected theme settings currently use Inter for body and heading fonts.
Relying on `--font-heading--family` and `--font-body--family` alone would render
Inter before the intended brand-like fallbacks. The banner needs explicit
Chronicle Display and Helvetica Neue font-family preferences, with practical
fallbacks when licensed fonts are not available.

### Treating strict JSON parsing as the template source of truth

`templates/index.json` contains Shopify's generated warning comment. Generic
JSON parsers can reject that file, while the Shopify validator correctly handles
the theme file format and schema context.

## Solution

Reuse and restyle the existing section:

- `sections/promotion-offer-banner.liquid`
- `templates/index.json`

The section was simplified to a full-width text-and-CTA strip:

- Outer wrapper uses `section--full-width` and owns the ivory background.
- Inner banner centers a `1080px` desktop frame.
- Desktop grid uses `minmax(0, 848px) 200px` with a `32px` gap.
- Mobile switches to a centered column at `max-width: 989px`.
- Mobile content width defaults to `342px`.
- Mobile padding is `32px 24px`, producing the `259px` frame when combined with
  the `195px` content stack.
- Product image markup and media settings were removed.

The editable section settings remain focused:

- Eyebrow
- Heading
- Subheading
- Desktop height
- Mobile height
- Desktop content width
- Copy lane width
- Mobile content width
- Button label
- Product/custom link/fallback handle routing
- Background, text, muted, subheading, and button colors

The homepage instance now uses the subscription content:

- `Subscribe and Save Up to 10%`
- `Glow Naturally. Replenish Regularly. Save Effortlessly.`
- `Unlock exclusive subscriber discounts`
- `Learn More`
- Background `#faf8f3`
- Desktop height `220`
- Mobile height `259`
- Content widths `1080`, `848`, and `342`

Typography is section-scoped:

- Eyebrow, subheading, and button prefer `Helvetica Neue`, then Helvetica/Arial,
  then the theme body font.
- Heading prefers `Chronicle Display`, then Georgia/Times, then the theme
  heading font.
- Eyebrow uses `15px`, `400`, uppercase, `1.5` line-height, `0.05em` tracking.
- Heading uses `32px` desktop, `26px` mobile, `300`, `1.2` line-height.
- Subheading uses `16px`, `300`, `1.5` line-height.
- Button uses `13px`, `500`, uppercase, `1.1` line-height, `0.1em` tracking.

## Why This Works

The section already had the right merchant-facing data contract. Reusing it
keeps the theme editor workflow stable and avoids creating a new section whose
only difference is presentation.

The visible Figma geometry reduces cleanly to a two-column desktop layout:
`848px` copy, `32px` gap, and `200px` CTA. Centering that `1080px` frame inside
a full-width section reproduces the desktop coordinates exactly at the reference
width.

On mobile, the Figma stack is `129px` copy, `24px` gap, and a `42px` button.
With `32px` top and bottom padding, the total is `259px`, so the CSS maps the
node dimensions without hardcoded absolute positioning.

Explicit font stacks make the intended design visible in code while still
degrading gracefully if the licensed fonts are not present. Chronicle Display
and Helvetica Neue fidelity still depends on the live storefront loading those
fonts.

Keeping CTA routing through product, custom link, and fallback handle preserves
the existing merchant pattern. The implementation does not invent a subscription
URL that was absent from the Figma request.

## Prevention

- Inspect Figma hidden layers before translating them into production markup.
- Reuse the closest editable Shopify section when the data contract already
  matches the new design.
- Keep full-width backgrounds on full-width sections; center only the content
  frame.
- Derive desktop grid columns from visible Figma math before writing CSS.
- Derive mobile height from content stack plus padding, not viewport formulas.
- Put `min-width: 0` on copy lanes that can shrink.
- Prefer exact brand font names first, but do not assume theme font settings are
  already configured for a Figma file.
- Verify whether licensed fonts are available in Shopify settings or assets
  before treating typography as production-final.
- Do not silently reuse an old product fallback as a final subscription CTA.
  Confirm the subscription URL or product destination before launch.
- Validate Shopify templates with Shopify-aware tooling because generated
  comments and schema context can confuse strict generic parsers.
- Check desktop, tablet, and mobile geometry after changing a section from
  image-led to text-led.

## Related Docs

- [Subscription promo section](../../../sections/promotion-offer-banner.liquid)
- [Homepage template instance](../../../templates/index.json)
- [Figma announcement strip pattern](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)
- [Figma art-directed hero pattern](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Figma desktop frame](https://www.figma.com/design/7lVsU0OyhDBXpXaNCCWZFT/-Site-Redesign--Ogee-Homepage-High-Fidelity-Wireframe---Round-3?node-id=10023-2984)
- [Figma mobile frame](https://www.figma.com/design/7lVsU0OyhDBXpXaNCCWZFT/-Site-Redesign--Ogee-Homepage-High-Fidelity-Wireframe---Round-3?node-id=10029-4319)

## Reusable Insight

For small Figma promotional strips, separate the visible geometry from the
underlying merchant data model. A hidden media placeholder in Figma is not a
production requirement. If an existing section already owns the right text,
color, and CTA controls, restyle that section instead of creating a duplicate.

Typography fidelity also has two layers: code can express the intended font
stack, but production only matches Figma when the storefront actually loads the
licensed font files or matching Shopify font settings.

## Compound Summary

The subscription promo banner was implemented by refactoring the existing
`promotion-offer-banner` section into a full-width text-and-CTA strip and
updating the homepage instance to the Figma subscription content. Shopify
validation passed for both changed files.

Review found no schema or Liquid regressions. The remaining launch risks are
commercial/content decisions: confirm the real subscription CTA destination and
ensure Chronicle Display and Helvetica Neue are licensed and loaded in the live
storefront.
