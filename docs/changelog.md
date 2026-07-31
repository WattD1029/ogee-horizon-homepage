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
[2026-07-31][PLAN] Planned the PDP Result Stats section from Figma nodes 11348:1398 and 11348:1817 as a dedicated card carousel section with merchant-editable stat blocks, Figma-derived fallback imagery, and PDP template wiring.
[2026-07-31][IMPLEMENT] Added `sections/result-stats.liquid`, a compressed Figma-derived fallback model image, and PDP template wiring for five editable result statistic cards.
[2026-07-31][FIX] Guarded the Result Stats section aria label fallback when merchants blank the visible heading.
[2026-07-31][VERIFY] Shopify Liquid validation passed for `sections/result-stats.liquid` and `templates/product.json`; `git diff --check` and JSONC parsing also passed.
[2026-07-31][COMPOUND] Captured the reusable PDP Result Stats card carousel pattern in `docs/solutions/design-patterns/2026-07-31-figma-pdp-result-stats-carousel.md`.
[2026-07-31][UPDATE] Made Result Stats product-dynamic with `custom.result_stats_heading`, `custom.result_stats_description`, and `custom.result_stats` metafield overrides before section block fallback.
[2026-07-31][IMPLEMENT] Created the Shopify Admin custom-data definitions for `Result statistic` metaobjects and pinned product Result Stats metafields in the connected store.
[2026-07-31][FIX] Replaced the Result Stats dot-styled progress line with a scroll-position thumb that updates from the carousel scroller on desktop and mobile.
