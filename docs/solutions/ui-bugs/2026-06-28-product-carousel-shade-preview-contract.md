---
title: Keep Product Carousel Desktop Shade Swatches On-Card
category: ui-bugs
date: 2026-06-28
type: bug
tags:
  - shopify
  - liquid
  - horizon
  - product-carousel
  - swatches
  - quick-add
---

# Keep Product Carousel Desktop Shade Swatches On-Card

## Problem

The homepage product carousel needs desktop shade dots for products with
multiple cosmetic shades. Those dots should sit in the card details, like the
Figma reference, instead of forcing desktop shoppers into a `Select Shade`
hover action.

The first implementation reused Horizon's shared `variant-swatches` snippet.
That snippet is a full variant picker: it renders radio inputs, dispatches
variant-selection events, and is connected to quick-add behavior. That was too
heavy for the carousel and still did not match the Figma desktop card, where
the shade controls are displayed directly beneath the product metadata.

## Symptoms

- Desktop shade products showed a black `Select Shade` hover action instead of
  relying on the visible shade dots in the product details.
- Products whose option was named `Shade`, `Color`, or `Colour` could miss the
  desktop row if Shopify saved swatch metadata was not present yet.
- The carousel inherited picker behavior that belongs in product forms, product
  pages, and quick-add modals.
- The Figma reference shows a compact swatch strip and shade label beneath one
  product, not a full embedded variant picker.

## What Didn't Work

### Reusing `variant-swatches`

`snippets/variant-swatches.liquid` is correct for contexts that need variant
selection. It renders inputs with variant IDs and option value IDs, previews
media on hover, and participates in the `VariantSelectedEvent` flow.

For the product carousel, that contract is too broad. The shade strip should
select the shade for the card and update the visible shade label, but it should
not pull the full product-form picker UI into the carousel details.

### Treating all one-option products as direct add candidates

One-option non-shade products can move to direct add after a variant is already
selected. Shade products are different in this design: the card still needs to
show the shade choice on the desktop card. Mobile keeps the explicit selection
flow because the shade row is hidden there.

## Solution

Render a carousel-local shade preview element in
`snippets/product-carousel-card.liquid`.

- Detect the first product option with multiple values that either has saved
  swatches or is named like a shade/color option.
- Store that option's real `product_option.position`.
- Render shade buttons from `product_option.values` instead of the shared
  `variant-swatches` picker.
- Use `product_option_value.swatch` for the swatch visual.
- Use `product_option_value.variant.featured_media` for the best media preview.
- Fall back to the first matching variant media when the option value's variant
  does not directly expose media.
- Provide a small fallback shade palette when Shopify swatch metadata and
  variant images are missing.
- On desktop, let one-option shade products show the normal add-to-cart hover
  action because the on-card shade row now selects the hidden variant ID.
- On mobile, keep the shade strip hidden and keep `Select Shade`.
- Do not render the shared variant picker in the carousel details.

The custom `product-carousel-shades` element owns the tiny interaction layer:
hover and focus preview a shade image, click marks the displayed swatch, updates
the label, and writes the selected variant ID into the product form's hidden
input. Arrow buttons scroll the swatch row. If a shade has no media, the
component asks `product-card` to reset to its initial image.

## Why This Works

The carousel keeps the part of the shared system that is safe to reuse:
Shopify's native swatch data, variant media, the existing `swatch` snippet, and
`product-card.previewVariant`.

It avoids the part that is wrong for this surface: variant picker inputs and
unnecessary product-form picker UI. This preserves the Figma desktop
interaction model while still giving the product form the selected one-option
shade variant.

Keeping `quick_add_button = 'choose'` as the underlying state preserves the
mobile flow. A desktop-only class reveals add-to-cart for one-option shade
products because the card now exposes the shade choice directly.

## Prevention

- Decide whether swatches are preview controls or selection controls before
  choosing a shared snippet.
- Do not reuse a variant picker inside a card when the design asks for on-card
  shade dots.
- Keep carousel shade buttons outside the shared picker UI unless the full
  picker is visually designed for that surface.
- Verify the hidden variant ID and add-to-cart state after clicking a desktop
  shade swatch on a one-option product.
- Verify hover, focus, click, and pointer-leave media behavior on desktop.
- Verify mobile still hides swatches and shows the `Select Shade` CTA.
- Verify products whose shade option lacks saved Shopify swatches still display
  dots through variant media or the fallback palette.
- Check products with missing shade media so the card can reset cleanly.
- Guard custom elements against duplicate listener registration on reconnect.

## Related Docs

- [Product carousel card](../../../snippets/product-carousel-card.liquid)
- [Product carousel section](../../../sections/product-carousel.liquid)
- [Shared variant swatches](../../../snippets/variant-swatches.liquid)
- [Swatch primitive](../../../snippets/swatch.liquid)

## Reusable Insight

In Shopify themes, swatch UI often bundles three different jobs: shade
visibility, variant selection, and full product-form state. A homepage carousel
can need the first two jobs on desktop while still avoiding the full picker UI.
Keep that contract narrow and responsive: desktop dots can select a one-option
shade, while mobile can continue through the dedicated selection modal.

## Compound Summary

The product carousel now uses a carousel-local shade strip for desktop products
with saved swatches or shade/color option values. The strip renders native
Shopify swatch values when present, falls back to variant media or a small shade
palette, previews variant media through the existing product-card slideshow, and
updates the hidden form variant ID on click. One-option shade products show the
normal desktop add-to-cart hover action because the shade dots are visible on
the card. Mobile remains unchanged: the shade strip is hidden and the card
action stays as `Select Shade`.

Review found no remaining code-level blockers in the changed snippet. Local
checks covered whitespace, tag presence, removal of the shared
`variant-swatches` reference, and JavaScript syntax for the new custom element.
The Shopify validator script was not run because its escalation was rejected:
it can transmit theme code to Shopify for instrumentation. Shopify CLI theme
check also could not run because the `shopify` command is not installed in this
workspace.
