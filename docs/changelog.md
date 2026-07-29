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
[2026-07-29][PLAN] Planned the PDP Beyond clean certification section from Figma desktop node `11348:1388` and mobile node `11348:1809`, using Figma-exported media and certification seal assets in a dedicated Shopify section.
[2026-07-29][IMPLEMENT] Added `sections/beyond-clean-certification.liquid`, Figma-derived certification media assets, and PDP template placement before product recommendations.
[2026-07-29][FIX] Matched Figma typography metadata for the certification heading/body and made `aria-labelledby` conditional when merchants clear the heading.
[2026-07-29][FIX] Scoped the certification background to the centered Figma panel so the colored area is 1200px on desktop and 350px on mobile instead of full-bleed.
[2026-07-29][VERIFY] Validated the certification section and product template with the Shopify Liquid validator revision 5, parsed JSON/schema locally, ran `git diff --check`, and captured desktop/tablet/mobile Playwright screenshots.
[2026-07-29][COMPOUND] Captured the reusable PDP certification section pattern in `docs/solutions/design-patterns/2026-07-29-figma-pdp-certification-section.md`.
