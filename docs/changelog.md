# Compound Changelog

[2026-06-28][PLAN] Planned a reusable Ogee promotion block plus promotion carousel section from the desktop and mobile Figma wireframes, using Horizon slideshow primitives and one default promotion block preset.
[2026-06-28][IMPLEMENT] Added `blocks/_promotion-block.liquid` with editable icon, heading, body, CTA label, CTA link, and new-tab settings, matching the Figma gift promotion card layout.
[2026-06-28][IMPLEMENT] Added `sections/promotion-blocks.liquid` with merchant-managed `_promotion-block` blocks, two-up desktop slide sizing, 250px mobile slides, and mobile segmented progress controls.
[2026-06-28][FIX] Guarded the section against zero-block slideshow rendering and increased mobile CTA hit targets while preserving the compact desktop button treatment.
[2026-06-28][FIX] Strengthened the mobile progress control selector so the shared slideshow `mix-blend-mode` rule cannot override the intended progress color.
[2026-06-28][REVIEW] Compound review found no remaining actionable implementation issues after the progress selector fix; residual risk is visual verification in a Shopify preview because local Shopify CLI and Theme Check are unavailable.
[2026-06-28][VERIFY] Parsed the new block and section schema JSON successfully and ran `git diff --check` with no whitespace errors; Shopify validator could not run because `@shopify/theme-check-common` is missing from the plugin cache.
[2026-06-28][COMPOUND] Captured the reusable promotion-block carousel pattern in `docs/solutions/design-patterns/2026-06-28-figma-promotion-block-carousel.md`.
[2026-06-28][IMPLEMENT] Added the second `Try Before You Buy` promotion block to the homepage section and section preset, then aligned desktop and mobile block dimensions to the Figma metadata.
[2026-07-28][PLAN] Planned the Figma PDP Complete the Look upsell as a dedicated merchant-editable section after `ogee_product_buy`, with four product rows, responsive desktop checkbox/mobile item CTA behavior, bundle subtotal display, and multi-item cart add.
[2026-07-28][IMPLEMENT] Added `sections/ogee-look-upsell.liquid` with Figma-matched desktop/mobile layout, product-list/metafield sourcing, subtotal display, checkbox selection, per-item mobile CTAs, and batch cart add behavior.
[2026-07-28][UPDATE] Wired the Ogee look upsell section into `templates/product.json` immediately after `ogee_product_buy`.
[2026-07-28][FIX] Review tightened no-JS/server fallback states by hiding equal compare totals and disabling the bundle CTA when no configured products are addable.
[2026-07-28][VERIFY] Parsed the new section schema and JavaScript, parsed the product template JSON after stripping Shopify's generated header, and ran `git diff --check`; Shopify validator and CLI theme check are unavailable because `@shopify/theme-check-common` and `shopify` are missing locally.
[2026-07-28][COMPOUND] Captured the PDP look upsell implementation pattern in `docs/solutions/design-patterns/2026-07-28-pdp-look-upsell-section.md`.
[2026-07-28][UPDATE] Fast-forwarded `codex/look-upsell-section` onto the refreshed `origin/main` baseline at `d50ea19`, keeping the look upsell wired after `ogee_product_buy` from the merged PDP buy section.
[2026-07-28][FIX] Fixed the look upsell upload syntax error by replacing literal `{{ product }}` and `{{ count }}` filter arguments with raw-captured placeholder variables.
[2026-07-28][FIX] Replaced saved setting placeholders `{{ product }}` and `{{ count }}` with `[product]` and `[count]` so Shopify does not treat them as invalid dynamic sources in `templates/product.json`.
[2026-07-28][FIX] Made the look upsell visible without extra setup by falling back to `pairs_well_with` and same-collection products, then removed the default top padding so it starts directly under the product buy section.
[2026-07-28][TUNE] Tuned the look upsell toward the Figma desktop: combined fallback products to fill four rows, restored desktop/mobile top spacing, and replaced the checked X control with the subtle square checkbox treatment.
[2026-07-28][FIX] Added explicit automatic fallback product handles so PDPs with fewer than four automatic upsells still render the four-row Figma layout.
