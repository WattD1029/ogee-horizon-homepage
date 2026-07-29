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
[2026-07-29][PLAN] Planned the PDP plant-derived ingredients carousel from Figma nodes `11348:1376` and `11348:1797`, including extracted ingredient photos, editable ingredient blocks, scrollable mobile behavior, progress controls, and product template wiring.
[2026-07-29][IMPLEMENT] Added the `plant-derived-ingredients` PDP section and `_plant-ingredient-card` block with extracted Figma ingredient image assets, editable card content, scroll arrows, segmented progress, and responsive desktop/mobile sizing.
[2026-07-29][UPDATE] Wired the plant-derived ingredients section into `templates/product.json` after `ogee_product_buy` with three default ingredient cards matching the Figma reference content.
[2026-07-29][FIX] Corrected ingredient carousel scroll targeting to account for mobile track padding and replaced anonymous progress click listeners with a removable delegated handler.
[2026-07-29][VERIFY] Parsed the new section schema, block schema, embedded JavaScript, and PDP template JSON; checked touched files for trailing whitespace; ran `git diff --check` with no whitespace errors.
[2026-07-29][REVIEW] Compound review found no remaining actionable implementation issues; remaining risk is visual Shopify preview with production replacement images because the extracted Figma photos are watermarked stock comps.
[2026-07-29][COMPOUND] Captured the reusable Figma PDP plant ingredient carousel pattern in `docs/solutions/design-patterns/2026-07-29-figma-pdp-plant-ingredient-carousel.md`.
