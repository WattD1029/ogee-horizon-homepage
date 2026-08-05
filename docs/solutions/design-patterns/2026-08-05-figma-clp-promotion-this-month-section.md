---
title: Build an Upload-Safe Figma CLP Promotion This Month Module
category: design-patterns
date: 2026-08-05
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - promotion
  - accordion
  - upload-validation
---

# Build an Upload-Safe Figma CLP Promotion This Month Module

## Problem

The collection landing page needed a monthly promotion module matching the
desktop and mobile Figma references and the supplied screenshots. The design is
a single editorial promotion with product imagery, collapsible campaign rows,
and a desktop CTA.

The module also needed to be easy to find in Shopify Admin and safe to upload.
The first implementation used a new section type in `templates/collection.json`,
which failed when Shopify received the template before the new section file.

## Symptoms

- Shopify upload reported: `Section type 'clp-promotion-this-month' does not
  refer to an existing section file`.
- The current mobile preview used the desktop-scale accordion typography, making
  row labels and body text much larger than the Figma mobile schema.
- The current narrow preview was still using the wider tablet layout, so the
  module appeared as a large image band instead of a compact mobile card.
- The fallback image was square, so the wide mobile frame cropped out
  parts of the bowl and product composition.

## What Didn't Work

### Adding a New Collection Template Section

Adding `promotion_this_month` to `templates/collection.json` made the feature
immediately editable, but it also created an upload-order dependency. If the
template reached Shopify before `sections/clp-promotion-this-month.liquid`, the
theme upload failed.

### Reusing Desktop Typography on Mobile

Desktop row headings and body copy match the editorial split layout, but the
mobile Figma node uses 12px Helvetica Neue text, compact 8px row padding, and a
24px icon area. Reusing the desktop scale made the module too tall and caused
accordion labels to wrap.

### Using a Square Fallback Image

The mobile schema expects a wide image frame. A square
fallback forced object-cover cropping that cut away important product context.

## Solution

The final implementation keeps the promotion inside the existing collection
section:

- `sections/main-collection.liquid`
- `templates/collection.json`
- `assets/clp-promotion-this-month.png`

The promo renders after the product grid and load-more flow from
`main-collection`, so `templates/collection.json` only references existing
section types: `clp-intro` and `main-collection`.

The merchant-facing controls live in the `main-collection` section settings:

- Show or hide the promotion.
- Heading text.
- Optional mobile heading visibility.
- Image picker and alt text.
- CTA label, link, mobile visibility, and new-tab behavior.
- Three editable accordion rows with heading, body, and open-by-default state.
- Desktop width, height, copy width, gutters, and padding.
- Mobile width, image height, padding, module background, outer background,
  text, divider, and button colors.

The default collection template now stores the campaign content directly in the
`main` section settings. Mobile defaults match the full-page Figma schema:

- 430px module width.
- 250px image height.
- Visible mobile heading.
- White mobile section background.
- White `#fafafa` module background.
- 12px uppercase row labels.
- 12px body copy.
- 8px compact row spacing.
- CTA hidden on mobile.
- Compact card treatment applies through the tablet breakpoint so narrow theme
  preview widths still match the mobile schema.

The fallback image was replaced with the exact Figma-exported product image and
committed as a durable Shopify asset, avoiding dependence on an expiring Figma
asset URL.

## Review

Compound review found two upload and visual risks:

- High: `templates/collection.json` referenced a new section type. This caused
  Shopify upload validation to fail when the new section was missing from the
  upload batch. The fix was to remove the new section type and render the promo
  from `main-collection`.
- Medium: Mobile typography and spacing were inherited from desktop or tablet
  styles. This made the current preview materially larger than the Figma schema.
  The fix was a compact responsive override matching the Figma node values.

No remaining template-level missing-section reference exists after the fix.

## Verification

Available checks:

- Pulled Figma design context for desktop node `2:5003` and mobile node
  `35:12618`.
- Downloaded and committed the Figma promotion image asset locally.
- Confirmed the fallback asset is `3326x1562`.
- Confirmed `templates/collection.json` no longer contains
  `promotion_this_month` or `clp-promotion-this-month`.
- Parsed the collection template JSON after stripping the generated-file
  comment.
- Parsed the `main-collection` schema JSON.
- Checked promotion setting references against schema IDs.

Blocked checks:

- Shopify Liquid validation is blocked locally because the validator script is
  missing `@shopify/theme-check-common`.
- `shopify` CLI and `theme-check` are not available on PATH in this workspace.
- The repository instruction to call `learn_shopify_api` is not directly
  actionable because no callable `learn_shopify_api` tool is exposed in this
  thread; tool discovery returned Shopify and Figma tools instead.
- Live Shopify preview QA still needs to be run in the merchant preview.

## Why This Works

The promo is route-level CLP content, but the safest upload location is the
existing route section that Shopify already knows how to render. Keeping the
module in `main-collection` avoids the upload-order dependency while preserving
theme-editor access.

Native `<details>` and `<summary>` provide accessible disclosure behavior
without JavaScript. Scoped CSS keeps the promo from changing filters, product
cards, pagination, or other promotion modules.

Mobile-specific typography and spacing follow the actual Figma node instead of
scaling desktop rules down indirectly. Extending the compact card treatment
through tablet widths also keeps browser preview panes from showing an in-between
layout that does not exist in the supplied Figma schema.

## Prevention

- Do not add a new section type to a live template unless the deployment process
  guarantees the section file is uploaded in the same batch first.
- For upload-sensitive CLP work, prefer extending an existing section when the
  merchant editor can still expose the needed settings clearly.
- Pull Figma node context before final mobile tuning; screenshots alone can hide
  exact font sizes and spacing tokens.
- Confirm fallback asset aspect ratio against the target frame before shipping.
- Run schema parsing, template reference checks, and setting-reference checks
  before Shopify upload.

## Related Docs

- [CLP product grid product cards](2026-08-04-figma-clp-product-grid-product-cards.md)
- [CLP filter sort layout controls](2026-08-04-figma-clp-filter-sort-layout-controls.md)
- [Collection section](../../../sections/main-collection.liquid)
- [Promotion fallback image](../../../assets/clp-promotion-this-month.png)
- [Collection template](../../../templates/collection.json)

## Reusable Insight

When a Shopify theme upload rejects a JSON template because a new section type is
missing, remove the template dependency or make the deployment upload the section
first. If the feature can live inside an existing section with clear settings,
that is often the smallest reliable fix.

## Compound Summary

The CLP Promotion This Month module now renders from `main-collection` after the
product grid, with merchant-editable settings and an upload-safe collection
template. Mobile now follows the Figma schema with the heading inside the light
card, compact typography, a white section background, a fuller 430px default
card width, and a corrected product image fallback. The
desktop text scale has also been reduced for the product-grid-width banner. The
main remaining risk is live Shopify preview validation, because local Shopify
validation tooling is unavailable in this workspace.
