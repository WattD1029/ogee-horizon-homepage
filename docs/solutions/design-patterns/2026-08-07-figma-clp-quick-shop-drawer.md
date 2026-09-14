---
title: Build CLP Quick Shop Drawer with Section-Rendered Ogee Product Buy
category: design-patterns
date: 2026-08-07
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - quick-add
  - drawer
---

# Build CLP Quick Shop Drawer with Section-Rendered Ogee Product Buy

## Problem

The CLP quick-add flow needed to match the Figma quick-view drawer references
on desktop and mobile. The target was a right-side `Quick view` drawer with an
Ogee product summary, shade selection, shade family tabs, full-set tiles,
subscription pricing, paired-product add-ons, product accordions, sticky
add-to-cart pricing, and a `View details` link.

The theme already had Horizon quick-add triggers, a shared quick-add dialog,
variant-picker updates, product-form cart submission, and an Ogee-specific PDP
buy section. The implementation needed the richer drawer UI without replacing
the CLP product-card quick-add contract or depending on the disabled default
product-information section.

## Symptoms

- CLP product cards already render contextual quick-add buttons through
  `snippets/quick-add.liquid`.
- `assets/quick-add.js` fetched product-page markup and expected
  `[data-product-grid-content]`, which does not cover the active
  `sections/ogee-product-buy.liquid` PDP surface.
- The active product template uses the custom Ogee buy section, including shade
  swatches, subscription rows, paired products, accordions, and add-to-cart
  behavior.
- `assets/variant-picker.js` only mapped quick-add and product-card contexts to
  the existing `section-rendering-product-card` endpoint.
- The shared `quick-add-dialog` was styled as a modal/bottom sheet, not a
  persistent right-side quick-view drawer with a fixed header and sticky footer.

## What Didn't Work

### Fetching the current product-grid section

The existing quick-add fetch path looks for `[data-product-grid-content]`.
Because the live Ogee product page is not built on that default section, this
would either fail to populate the modal or omit the Ogee drawer-specific
purchase content.

### Splicing the full PDP into the modal

The Ogee PDP section includes large product media, custom layout behavior, and
inline section JavaScript. Pulling the full PDP into quick-add would overfetch,
create layout mismatches, and rely on section-local scripts executing inside
AJAX-inserted modal content.

### Forking CLP product-card actions

Hardcoding new product-card drawer buttons would bypass the existing quick-add
surface, product-card link selection, mobile Add/Select Shade contract, and
cart update behavior already wired into Horizon.

## Solution

Add a drawer-specific quick-add surface while preserving the existing quick-add
trigger API.

`snippets/quick-add.liquid` now accepts `quick_add_surface`, defaulting to the
original modal behavior. CLP gallery and mobile product-card quick-add calls
pass `quick_add_surface: 'quick-shop-drawer'`, while non-CLP callers continue
using the old product-grid modal path.

`assets/quick-add.js` now caches quick-add content by surface and product URL.
For the drawer surface it requests the product URL with
`section_id=quick-shop-drawer`, caches the rendered body fragment, morphs that
fragment into `#quick-add-modal-content`, and marks the dialog with
`data-quick-add-surface="quick-shop-drawer"`. Caching the body fragment matters
because `morph()` updates children only; the drawer custom element and any
section-rendered style nodes need to become children of the modal content.

`snippets/quick-add-modal.liquid` keeps the shared `quick-add-dialog` but adds a
small `Quick view` header and loads `assets/quick-shop-drawer.js`.
`snippets/quick-add-modal-styles.liquid` adds data-attribute drawer chrome:
420px desktop width, full viewport height, right-docked animation, visible
header, close control alignment, and a full-height scroll container. Default
quick-add styling is unchanged when the data attribute is absent or set to the
default modal surface.

`sections/quick-shop-drawer.liquid` is a section-rendering-only Ogee buy
surface. It reuses the same Shopify data concepts as `ogee-product-buy`:

- `product.selected_or_first_available_variant`
- subtitle and weight metafield fallbacks
- review rating fallback stars
- shade/color option detection
- `variant-picker` fieldsets with `option_values` IDs
- `product-form-component` with the standard product form
- selling plans or the 10% subscription promo row
- paired products from `custom.pairs_well_with` with collection fallback
- product detail, ingredient, usage, drug facts, and shipping accordion
  fallbacks
- sticky add-to-cart footer with current variant price

`assets/variant-picker.js` maps `quick-shop-drawer` to
`section_id=quick-shop-drawer`, so drawer shade changes request the same drawer
surface instead of the product-card rendering section.

`assets/quick-shop-drawer.js` owns only drawer-specific behavior:

- shade tab active states
- immediate shade label and image feedback while the server-rendered variant
  update is pending
- updating drawer image, full-set tiles, subscription price, footer price, and
  details link from the returned section HTML
- add-on checkbox total pricing
- batch cart add only when paired add-ons are selected
- standard `CartAddEvent` and `CartErrorEvent` dispatches so the existing cart
  drawer, cart icon, and quick-add dialog close behavior stay in the same event
  system

## Why This Works

The drawer is a new rendering surface, not a forked product-card or forked cart
workflow. Product cards still decide Add versus Select Shade through the shared
quick-add snippet. The quick-add dialog still owns focus, scroll lock, close on
cart update, and iOS close fixes. Product forms still update their hidden
variant input and button state from `VariantUpdateEvent`.

The section-rendered drawer keeps variant updates server-authoritative. The
client does not need to recalculate subscription price, unavailable state, or
product-form button markup from variant data; it refreshes specific UI pieces
from the same section HTML that the variant picker already requested.

The add-on cart path is intentionally narrow. If no paired add-ons are checked,
the standard `product-form-component` handles submission exactly as before. The
drawer intercepts submit only when add-ons are selected, posts Shopify's batch
`items` payload, then emits the same cart event type used by the standard
product form.

## Prevention

- Add new quick-add UI surfaces as explicit `quick_add_surface` values instead
  of changing the default quick-add behavior.
- When morphing section-rendered content into the quick-add modal, remember
  that the local `morph()` helper updates children only. Cache or wrap the
  fetched fragment so custom element roots and style nodes are inserted.
- Keep variant-picker section mappings in `assets/variant-picker.js` aligned
  with any new section-rendered product surfaces.
- Let `product-form-component` remain the default submission path, and intercept
  only for behavior that the standard form cannot express.
- For dynamic drawer content, put behavior in a globally loaded asset rather
  than relying on section `{% javascript %}` blocks executing after AJAX
  insertion.
- Verify desktop and mobile drawer dimensions separately because the same
  `quick-add-dialog` also serves legacy modal and mobile bottom-sheet surfaces.

## Review

Compound review found one implementation issue before finalization:
non-swatch option labels visually hid their radio inputs without a selected
state. The drawer option CSS now applies a selected label treatment for
non-swatch options and preserves the circular outline state for shade swatches.

No remaining blocking issues were found in the local review. Residual risk is
runtime validation: this workspace does not have the Shopify CLI on PATH, and
the bundled Shopify validator script cannot import its required
`@shopify/theme-check-common` dependency.

## Verification

Local checks passed:

- `node --check assets/quick-add.js`
- `node --check assets/variant-picker.js`
- `node --check assets/quick-shop-drawer.js`
- parsed the schema JSON from `sections/quick-shop-drawer.liquid`
- parsed `locales/en.default.json` after stripping the generated comment header
  and line comments
- confirmed `quick_shop_drawer` translation references resolve locally
- `git diff --check` passed with only Git line-ending warnings

The Shopify Liquid docs search script was run before implementation. It
returned an empty result set for the selected query after network approval.
The required repository `learn_shopify_api` instruction could not be completed
because no callable `learn_shopify_api` tool was exposed in this thread.

The Shopify validator was attempted with all touched theme files, but it failed
before validation with `ERR_MODULE_NOT_FOUND` for
`@shopify/theme-check-common`. `shopify theme check --version` also failed
because the Shopify CLI is not installed on PATH.

## Related Docs

- [CLP product grid product cards](2026-08-04-figma-clp-product-grid-product-cards.md)
- [CLP filter drawer](2026-08-04-figma-clp-filter-drawer.md)
- [Quick-add snippet](../../../snippets/quick-add.liquid)
- [Quick-add behavior](../../../assets/quick-add.js)
- [Quick-add modal shell](../../../snippets/quick-add-modal.liquid)
- [Variant picker behavior](../../../assets/variant-picker.js)
- [Ogee PDP buy section](../../../sections/ogee-product-buy.liquid)
- [Quick shop drawer section](../../../sections/quick-shop-drawer.liquid)
- [Quick shop drawer behavior](../../../assets/quick-shop-drawer.js)

## Reusable Insight

When a Shopify Horizon collection quick-add flow needs a Figma drawer that is
closer to a custom PDP buy module than to the default quick-add modal, create a
dedicated section-rendered product surface and route quick-add to it with a
surface flag. This preserves the product-card and cart contracts while letting
the drawer reuse server-rendered product, variant, selling plan, metafield, and
accordion data.

## Compound Summary

The CLP quick shop drawer now opens from existing CLP product-card quick-add
buttons, docks as a 420px right-side desktop drawer or full-width mobile drawer,
and renders a new Ogee section-rendered buy surface. It includes product
summary, shade controls, shade family tabs, full-set tiles, subscription offer,
paired-product add-ons, accordions, sticky add-to-cart with price, and a product
details link. Variant changes render through `section_id=quick-shop-drawer`,
and paired add-ons use a scoped batch-add submit path only when selected.

Overlap with prior solution docs is moderate: the work reuses the CLP
product-card quick-add extension pattern and the drawer-on-existing-Horizon
component pattern, but captures a new reusable pattern for section-rendered
custom buy drawers.
