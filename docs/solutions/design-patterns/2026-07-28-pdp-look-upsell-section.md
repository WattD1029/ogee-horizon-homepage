---
title: Build PDP Look Upsells as Dedicated Bundle Sections
category: design-patterns
date: 2026-07-28
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - pdp
  - upsell
  - figma
---

# Build PDP Look Upsells as Dedicated Bundle Sections

## Problem

The PDP redesign needed a high-fidelity `Complete The Look` module from Figma
nodes `11348:1357` and `11348:1780`. The module is not a normal related
products grid: it presents up to four complementary products, desktop checkbox
selection, mobile item-level actions, a displayed bundle discount subtotal, and
a single `Add all` cart action.

The current product template already uses `sections/ogee-product-buy.liquid` as
the active PDP buy section, with the generic Horizon `product-information`
section disabled. The existing `product-recommendations` section can show
related products, but it does not own subtotal math or multi-item cart add.

## Symptoms

- Figma desktop shows a centered 588px stack, four 96px product rows,
  checkbox-style selectors, a divider, discounted subtotal, compare total, and
  a black full-width CTA.
- Figma mobile shows a 350px stack with four product rows, per-item outline
  CTAs, no visible checkboxes, a divider, the same offer summary, and a black
  full-width CTA.
- Product data must come from Shopify products, not the short-lived Figma asset
  URLs returned by `get_design_context`.
- The displayed discount is a presentation concern unless Shopify discount
  logic separately enforces the actual cart discount.

## What Didn't Work

Using `sections/product-recommendations.liquid` would have coupled two
different responsibilities. Recommendations owns related/complementary product
loading and card grids. The Figma module owns bundle-style selection,
subtotal state, and multi-item add behavior.

Reusing the full product carousel card stack would also be too heavy. The
upsell rows need compact 96px media, short metadata, desktop checkboxes, and
mobile outline actions. Pulling in carousel cards would bring unrelated
wishlist, swatch preview, rating, slideshow, and hover action behavior.

Changing the existing `ogee-product-buy` pairs-well-with mini module would
also overreach. That section is already a complex PDP buy surface, and the new
Figma module is a standalone section in the verified PDP section map.

## Solution

Create `sections/ogee-look-upsell.liquid` as a dedicated PDP sibling section
and wire it into `templates/product.json` immediately after `ogee_product_buy`.

The section:

- Reads product-specific metafield lists first:
  `product.metafields.custom.complete_the_look_products.value`, then
  `product.metafields.custom.look_upsell_products.value`.
- Falls back to a merchant-editable `product_list` section setting limited to
  four products.
- Renders live Shopify product images, titles, subtitle metafields/type
  fallback, selected/first-available variant prices, and availability state.
- Uses scoped CSS under `.ogee-look-upsell` to match the desktop and mobile
  Figma dimensions, typography, spacing, colors, and CTA treatment.
- Keeps desktop checkbox selection active and hides those controls on mobile,
  where row-level outline buttons match the Figma node.
- Shows `Select shade` links for multi-variant mobile rows and direct add
  buttons for single-variant mobile rows.
- Adds a small `ogee-look-upsell` custom element for checkbox subtotal updates,
  bundle button labels, direct mobile add buttons, and batch `/cart/add`
  payloads.
- Dispatches the existing `cart:update` event shape with
  `source: 'product-form-component'` so cart drawer and cart icon listeners
  behave like existing product-form adds.
- Keeps the displayed discount configurable but does not claim to enforce the
  discount in checkout.

Review fixed two server-rendered fallback states: equal compare totals are
hidden when the displayed discount is zero, and the bundle CTA is disabled
when no configured product is addable.

## Why This Works

The section boundary matches the PDP section map and keeps the implementation
small. The product buy section, disabled Horizon product-information section,
and recommendations grid remain untouched.

Using product metafields before section settings supports product-specific
merchandising without creating separate templates for every PDP. The section
setting remains a practical fallback for theme-editor setup and visual review.

The custom element owns only the interaction the Figma module needs:
selection state, subtotal text, and cart add. It does not alter shared
`product-form-component` internals, but it mirrors the same cart event contract
after successful batch adds so global cart UI keeps working.

## Prevention

- Treat PDP upsell bundle modules as their own sections when they need subtotal
  state or multi-item cart actions.
- Do not force product recommendations or carousel cards to become bundle
  modules when the visual and interaction contracts diverge.
- Source Figma imagery from Shopify product data unless the design explicitly
  requires committed fallback assets.
- Keep displayed discount copy separate from actual Shopify discount
  enforcement.
- Verify both JavaScript and no-JavaScript server states for totals, compare
  prices, empty products, sold-out products, and disabled buttons.
- Check cart drawer, cart item hydration, and cart icon listeners when a custom
  add-to-cart component dispatches cart events.

## Related Docs

- [Ogee look upsell section](../../../sections/ogee-look-upsell.liquid)
- [Product template](../../../templates/product.json)
- [PDP R5 section map](../../design-references/pdp-ui-r5/README.md)
- [All Makeup carousel section pattern](2026-07-13-all-makeup-carousel-section.md)
- [Product carousel shade preview contract](../ui-bugs/2026-06-28-product-carousel-shade-preview-contract.md)

## Reusable Insight

In Shopify themes, product upsells can look similar to recommendations while
needing a different contract. Recommendations choose products; bundle upsells
coordinate products. When a module needs coordinated selection, subtotal
display, and batch cart add, keep it as a dedicated section with a narrow custom
element rather than expanding shared card or recommendation systems.

## Compound Summary

Work mode added `sections/ogee-look-upsell.liquid` and inserted it into
`templates/product.json` after `ogee_product_buy`. The new section matches the
Figma desktop and mobile structure with live product data, configurable copy
and colors, product-specific metafield sourcing, a fallback product list,
desktop checkbox selection, mobile item CTAs, displayed bundle subtotal, and
batch add-to-cart behavior.

After the refreshed `origin/main` merged the PDP buy section, the feature
branch was fast-forwarded to `d50ea19` so this implementation now sits on the
new main baseline while preserving the same upsell placement.

Upload testing also exposed a Liquid parser edge case: literal `{{ product }}`
and `{{ count }}` placeholders inside `replace` filter string arguments caused
Shopify to reject the section before the template could resolve the new section
type. The placeholders were replaced with bracket tokens and passed to
`replace` as variables.

Template upload validation then exposed the related saved-setting issue:
Shopify treats `{{ product }}` in `templates/product.json` as a dynamic source
binding to the Product object, which is not valid for the text setting. The
merchant placeholder tokens are now `[product]` and `[count]` in both the
section schema defaults and the product template settings.

Visibility testing on PDPs without dedicated Complete The Look data showed the
section could render nothing even though the product-buy section had `Pair it
with` products. The source chain now falls back to
`product.metafields.custom.pairs_well_with.value` and supplements with
same-collection products so the module can reach four rows without duplicating
the current product. When automatic fallback data still has fewer than four
items, the section uses an editable comma-separated handle list as the final
fallback so the Figma four-row layout is preserved.

Review found no major implementation blockers. It fixed two no-JavaScript
fallback details before completion. Verification covered section schema JSON,
embedded JavaScript syntax, product template JSON parsing after removing the
Shopify-generated file header, and `git diff --check`. Shopify's validator
script could not run because `@shopify/theme-check-common` is missing from the
local skill package, and Shopify CLI theme check could not run because the
`shopify` command is not installed.
