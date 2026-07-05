---
title: Build a Figma Result Proof Section With a Two-Image Slider Fallback
category: design-patterns
date: 2026-06-29
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - comparison-slider
  - homepage
---

# Build a Figma Result Proof Section With a Two-Image Slider Fallback

## Problem

The Ogee homepage redesign needed a result proof section matching desktop and
mobile Figma frames. The section combines a before/after face visual, clinical
stats, editorial copy, and a testimonial. The first implementation shipped from
a single composite PNG, while the Figma frame described an interactive
comparison-style composition.

After matching standalone Week 1 and Week 12 images became available, the
section needed to default to a real two-image comparison slider while preserving
merchant-editable image settings and an explicit static composite override.

## Symptoms

- The design shows a center divider and handle, and the final asset contract now
  includes separate Week 1 and Week 12 source images.
- A true range comparison requires separate before and after images with
  matching crop, scale, and subject alignment.
- The default theme output should behave like the Figma slider without requiring
  merchants to upload the initial two images manually.
- The older static composite remains useful only when a merchant explicitly
  chooses a composite override.
- Mobile reorders the content: copy and stats first, image second, testimonial
  last.

## What Didn't Work

### Treating the original composite as the permanent fallback

Using the single supplied PNG as both comparison layers would create a range
input that visually changes nothing. Overlaying another divider and handle on
top of the baked divider would also double the visual affordance.

That was a safe first MVP when only the composite existed. Once aligned source
images exist, the better fallback is a true comparison using the two theme
assets, with the composite path reserved for explicit merchant overrides.

### Editing the shared comparison slider block

`blocks/comparison-slider.liquid` is a reusable block. Extending it with the
Ogee result proof copy, stats, testimonial, and responsive order would broaden
a shared primitive for a single homepage composition.

The section can instead reuse the existing `comparison-slider.js` runtime only
when it has the correct two-image data contract.

### Adding decorative inactive arrows

The Figma desktop visual includes small arrows near the progress rule, but the
implemented section does not yet have multiple proof slides. Rendering
clickable-looking arrows without a carousel would add a false affordance, so
the section keeps a passive progress rule only.

## Solution

Create a dedicated section:

- `sections/result-proof.liquid`
- `templates/index.json`
- `assets/result-proof-before-after.png`
- `assets/result-proof-week-1.png`
- `assets/result-proof-week-12.png`

The section owns the full editorial composition:

- Eyebrow, heading, description, quote, attribution, labels, colors, spacing,
  and max width as section settings.
- Three section-local `stat` blocks with value, caption, and progress settings.
- Desktop grid with media on the left and copy/stats on the right.
- Mobile stack with copy/stats first, image second, and testimonial last.
- Horizontal stat overflow on mobile to match the Figma partial second-card
  view.
- List semantics for stats so assistive technology gets a structured group.

For media:

- If `before_image` and `after_image` are both configured, render a real
  comparison using the existing `comparison-slider.js` custom element runtime.
- If a merchant-selected composite image exists and the comparison pair is not
  complete, render that static composite image.
- Otherwise fall back to the bundled two-image comparison using
  `assets/result-proof-week-1.png` and `assets/result-proof-week-12.png`.
- Do not render overlay Week labels for the bundled fallback images because the
  labels are already baked into those source assets.

For validation:

- `learn_shopify_api` was required by AGENTS.md but not callable in this
  environment after tool discovery.
- The Shopify Liquid docs search was run before coding.
- The newer local validator could not run because its dependencies were not
  installed in `.agents/skills/shopify-liquid`.
- The dependency-complete bundled validator was run with
  `OPT_OUT_INSTRUMENTATION=true` and cached Shopify schemas. It passed both
  `sections/result-proof.liquid` and `templates/index.json`.

## Why This Works

The implementation separates visual content readiness from interaction
readiness. A single composite asset is valid as static proof imagery, but not
as a true slider input. The section makes that difference explicit in Liquid:
the range control exists when both merchant images are present or when the
bundled two-image fallback can satisfy the slider contract.

Keeping this as a section matches the theme architecture. Merchants can place
and edit it from the homepage template, while the existing comparison block
remains reusable elsewhere.

Local stat blocks provide the right customization level for the design: they
are merchant-editable and reorderable, but constrained to the small proof
module instead of becoming global theme blocks.

## Prevention

- Confirm whether a before/after visual is a single composite or two aligned
  source images before adding range interaction.
- Do not create a range input unless dragging changes the visual state.
- When generated source images include baked labels, avoid duplicating those
  labels in the theme overlay.
- For square source images displayed in a 600:500 Figma frame, use top-centered
  cropping so top labels and hairline details are not clipped.
- Keep visual-only carousel controls out of static sections.
- Reuse shared runtimes only when the section can satisfy their data contract.
- Use a dedicated section when Figma combines multiple editorial concerns:
  media, claims, stats, testimonial, and responsive order.
- Give mobile horizontally scrolling stats explicit item widths, scroll
  padding, and snap behavior.
- Add `role="list"` and `role="listitem"` when repeated proof stats need
  meaningful structure.
- Validate Liquid and schema with telemetry disabled when private theme code
  should not be sent off-machine.
- Record when required platform tools are unavailable, especially when repo
  instructions mandate them.

## Related Docs

- [Result proof section](../../../sections/result-proof.liquid)
- [Homepage template](../../../templates/index.json)
- [Result proof fallback image](../../../assets/result-proof-before-after.png)
- [Result proof week 1 image](../../../assets/result-proof-week-1.png)
- [Result proof week 12 image](../../../assets/result-proof-week-12.png)
- [Shared comparison slider block](../../../blocks/comparison-slider.liquid)
- [Comparison slider runtime](../../../assets/comparison-slider.js)
- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Figma announcement strip on Horizon primitives](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)

## Reusable Insight

For Figma before/after designs, choose the interaction from the available asset
contract, not from the visual affordance alone. A range slider needs two
matching source images. When those source images are bundled in the theme, they
can serve as the default interactive fallback while merchant-selected images
continue to override them.

## Compound Summary

The homepage has a dedicated result proof section placed after the product
carousel and before the promotion offer banner. It matches the Figma structure
with a 600:500 proof image area, editorial result copy, three editable stat
blocks, testimonial copy, desktop side-by-side layout, and mobile reordered
stack. The bundled Week 1 and Week 12 images now render as the default
interactive comparison slider. Merchants can still supply their own before and
after images, or use a custom composite image when they need a static visual.

Review found one accessibility improvement: expose the repeated stats as a
list. That fix was applied before the final validation pass. Remaining launch
risk is visual rather than syntactic: a Shopify preview was not run in a real
storefront session, so final desktop/tablet/mobile pixel tuning should be
confirmed in theme preview.
