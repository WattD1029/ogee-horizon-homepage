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
[2026-07-31][PLAN] Planned an Ogee PDP FAQ section from the desktop Figma reference and mobile screenshots, targeting a dedicated merchant-editable Liquid section with exact light accordion styling and product-template placement.
[2026-07-31][IMPLEMENT] Added `sections/ogee-faq.liquid` with merchant-editable FAQ blocks, scoped light PDP styling, desktop Figma geometry, and mobile expanded-row styling.
[2026-07-31][FIX] Corrected the FAQ background default from black to white to match the actual Figma reference.
[2026-07-31][UPDATE] Wired the Ogee FAQ section into `templates/product.json` after `ogee_product_buy` with six default FAQ items.
[2026-07-31][FIX] Hardened the FAQ section review findings by falling back to `aria-label` when the heading is blank and skipping rows without question text.
[2026-07-31][VERIFY] Validated the FAQ section and product template with the Shopify Liquid validator, parsed section schema and product JSON locally, and ran `git diff --check`.
[2026-07-31][COMPOUND] Captured the reusable PDP FAQ section pattern in `docs/solutions/design-patterns/2026-07-31-figma-pdp-faq-section.md`.
