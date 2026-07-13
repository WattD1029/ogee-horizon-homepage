---
title: Build a Figma Promotion Block Carousel on Horizon Primitives
category: design-patterns
date: 2026-06-28
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - promotion-blocks
  - carousel
---

# Build a Figma Promotion Block Carousel on Horizon Primitives

## Problem

The Ogee homepage redesign needed a promotion block carousel that matched the Figma desktop and mobile wireframes while remaining editable in Shopify's theme editor. The immediate build request was to create one reusable promotion block type first, then create the section that can carousel those blocks.

The desktop Figma node shows two 536px cream promotion cards in a 1080px row with an 8px gap, 205px card height, 32px desktop card padding, a 24px line icon, uppercase 16px heading text, 14px body copy, and a compact outlined CTA. The mobile node shows horizontally scrolling 250px by 289px cards with 16px gaps, 24px card padding, stacked icon and heading, full-width CTA, and a thin segmented progress indicator.

## Symptoms

- A generic card block could approximate the content but would not capture the Figma-specific icon, typography, CTA, mobile stacking, or progress indicator.
- A new JavaScript carousel would duplicate Horizon's existing `slideshow-component` behavior.
- The Figma icon assets are temporary MCP URLs and are not production-safe theme assets.
- The shared slideshow dot controls apply `mix-blend-mode: difference`, which can distort a thin dark progress indicator unless the section overrides it with enough specificity.
- The section needs to behave sensibly with one block, multiple blocks, and zero blocks.
- The visual CTA is compact in the wireframe, with a 30px visual height on both desktop and mobile.

## What Didn't Work

### Using temporary Figma image assets

The Figma MCP output exposed remote icon URLs for gift and calendar icons, but those URLs expire. Production Liquid should not depend on them. The promotion block instead renders small inline SVGs for the gift and calendar options.

### Reusing a generic card block

The stock `_card` block is useful for flexible content, but this design has a narrow, repeated promotional content model. A dedicated block keeps merchant settings concise and avoids making a broad card abstraction carry one homepage-specific layout.

### Adding a second carousel runtime

The theme already includes slideshow snippets, controls, custom elements, drag handling, selected state, and mobile-friendly scroll behavior. Reusing those primitives avoids another lifecycle path to test.

### Trusting a low-specificity progress override

`snippets/slideshow-controls.liquid` sets `mix-blend-mode: difference` for dot controls. A plain class selector is not enough of a guard. Use a section-scoped `slideshow-controls.promotion-blocks__controls` selector so the mobile progress bar keeps its configured color.

## Solution

Create a dedicated promotion block:

- `blocks/_promotion-block.liquid`
- Includes a LiquidDoc header.
- Renders a `slideshow-slide` with `ref="slides[]"`, `slide-id`, `aria-hidden`, and `block.shopify_attributes`.
- Exposes only essential merchant settings: icon, heading, body, button label, button link, and new-tab behavior.
- Uses inline SVG for `gift` and `calendar` icons.
- Escapes merchant-provided text and keeps the CTA disabled when no link is configured.
- Matches Figma typography using theme font variables, fixed font sizes, uppercase headings, and section-scoped CSS variables for colors.

Create a dedicated section:

- `sections/promotion-blocks.liquid`
- Allows `_promotion-block` blocks, with a two-block preset matching the gift and try-before-you-buy Figma cards.
- Captures `{% content_for 'blocks' %}` and passes the rendered slides to `snippets/slideshow.liquid`.
- Uses `slideshow-controls` dots only when more than one block exists.
- Uses two visible 536px slides on desktop by default, with an 8px gap in a 1080px carousel lane.
- Uses 250px by 289px mobile slides, 15px section-side scroll padding, 16px slide gaps, and a segmented 1px mobile progress line.
- Hides desktop controls because the supplied desktop wireframe does not show carousel controls.
- Avoids invoking the slideshow snippet with zero blocks.
- Keeps colors, gaps, width mode, and section padding editable from the section schema.

Verification performed:

- Parsed both new `{% schema %}` JSON payloads successfully with PowerShell `ConvertFrom-Json`.
- Ran `git diff --check` successfully.
- Retried the Shopify Liquid validator on the final files, but it could not run because `@shopify/theme-check-common` is missing from the plugin cache.
- Checked for Shopify CLI and Theme Check binaries; neither is available in this environment.

## Why This Works

The block and section separation follows Horizon's theme-block model. The section owns carousel behavior and spacing, while the block owns the repeated promotion card composition. Merchants can add, remove, reorder, and edit promotion cards without code changes.

Using existing slideshow primitives keeps selection state, scroll behavior, control button wiring, and responsive carousel mechanics consistent with the rest of the theme. The section only specializes slide widths and the mobile progress presentation.

Inline SVG icons avoid expiring design-tool asset URLs while keeping the icon geometry simple and theme-color driven. Section-scoped CSS variables keep single-property design controls editable without requiring multiple modifier classes.

The one-block and zero-block guards prevent unnecessary controls and avoid passing an empty slide count into the shared slideshow snippet. The CTA keeps the compact 30px visual height from the wireframe.

## Prevention

- Inspect existing Horizon slideshow primitives before creating carousel JavaScript.
- Keep campaign or homepage-specific compositions in dedicated blocks instead of broadening shared generic blocks.
- Do not use Figma MCP asset URLs as production theme assets.
- For mobile segmented progress, account for shared slideshow dot styles such as `mix-blend-mode`.
- Test one, two, three, and zero block configurations.
- Verify mobile drag/swipe, keyboard focus, and button disabled states in a Shopify preview.
- Keep visible desktop controls absent unless the desktop Figma file or stakeholder explicitly calls for them.
- Confirm promotion thresholds, eligible products, dates, and links before launch.
- Run Shopify Theme Check when CLI tooling is available.

## Related Docs

- [Figma announcement strip on Horizon primitives](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)
- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Promotion block](../../../blocks/_promotion-block.liquid)
- [Promotion blocks section](../../../sections/promotion-blocks.liquid)
- [Shared slideshow snippet](../../../snippets/slideshow.liquid)
- [Shared slideshow controls](../../../snippets/slideshow-controls.liquid)

## Reusable Insight

Small editorial or promotional carousels should reuse Horizon's slideshow behavior and isolate the Figma-specific card composition in a dedicated theme block. Treat Figma as the geometry and content source, not as a source for production assets or motion decisions.

## Compound Summary

The promotion block carousel was implemented as a dedicated `_promotion-block` theme block and `promotion-blocks` section over the existing slideshow runtime. It matches the supplied desktop and mobile Figma structure, includes a two-card default promotion block preset, supports multiple merchant-added blocks, avoids temporary Figma assets, and documents the mobile progress-specific cascade guard. Local schema and whitespace checks passed; full Shopify validation remains blocked by missing validator dependencies in the local plugin cache.
