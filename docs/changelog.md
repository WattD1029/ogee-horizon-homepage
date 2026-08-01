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
[2026-08-01][PLAN] Planned a full PDP customer reviews widget section matching the Ogee desktop and mobile Figma review layouts, with summary metrics, filters, sorting, review rows, and Shopify-safe fallback content.
[2026-08-01][IMPLEMENT] Added `sections/ogee-customer-reviews.liquid` with aggregate review summary, rating histogram, effect scale, filter/sort controls, seeded review blocks, and show-more behavior.
[2026-08-01][IMPLEMENT] Wired the Ogee customer reviews section into `templates/product.json` after the custom product buy section with six PDP review blocks matching the Figma reference content.
[2026-08-01][FIX] Added a hidden fallback heading and synchronized dynamic aggregate counts so blank visual headings and product review metafields remain accessible and internally consistent.
[2026-08-01][REVIEW] Compound review found no remaining blocking issues after the hidden-heading and dynamic-count fixes; residual risk is live Shopify preview/pixel tuning and real reviews-provider integration.
[2026-08-01][VERIFY] Ran Shopify Liquid validation on the reviews section and product template, embedded JavaScript syntax check, and `git diff --check`; all passed, with validator docs loaded from cache after a network fetch miss.
[2026-08-01][COMPOUND] Captured the reusable Figma PDP reviews widget pattern in `docs/solutions/design-patterns/2026-08-01-figma-pdp-customer-reviews-widget-section.md`.
[2026-08-01][FIX] Changed the reviews section fallback review count from a 0-5000 range setting to text so Shopify upload accepts the schema's 101-step range limit.
