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
[2026-07-31][PLAN] Planned a PDP Shop @Ogee social media carousel section from the desktop and mobile Figma nodes, using exported Figma imagery and the existing social proof carousel pattern.
[2026-07-31][IMPLEMENT] Added `sections/shop-social-media.liquid` with editable social post blocks, Figma fallback assets, mobile overlay treatment, desktop arrows, and scroll progress behavior.
[2026-07-31][IMPLEMENT] Wired the Shop @Ogee social media section into `templates/product.json` before product recommendations with five alternating Figma fallback cards.
[2026-07-31][FIX] Adjusted the Shop @Ogee progress rail from viewport-scrollbar math to the one-third Figma segment start used in the reference frames.
[2026-07-31][REVIEW] Compound review found no remaining actionable implementation issues after the progress rail fix; residual risk is live Shopify visual preview because Shopify CLI is unavailable.
[2026-07-31][VERIFY] Ran Shopify Liquid validation for `sections/shop-social-media.liquid` and `templates/product.json`, parsed section schema and product template JSON, checked JS syntax, confirmed assets, and ran `git diff --check`.
[2026-07-31][COMPOUND] Captured the PDP Shop @Ogee social media carousel pattern in `docs/solutions/design-patterns/2026-07-31-pdp-shop-social-media-carousel.md`.
[2026-07-31][FIX] Updated the PDP Shop @Ogee cards to link through the product `custom.social_media_url` metafield before falling back to the section Instagram URL.
[2026-07-31][UPDATE] Changed Shop @Ogee desktop arrows to loop from the end back to the beginning and kept arrows enabled while overflow exists.
[2026-07-31][VERIFY] Created the Shopify Product metafield definition `custom.social_media_url` with Admin GraphQL, read back product metafield availability, and revalidated the updated Liquid section and product template.
[2026-07-31][FIX] Replaced the Shop @Ogee eye balm fallback with the user-provided Shopify CDN image so the default social card image loads reliably.
[2026-07-31][FIX] Corrected the Shop @Ogee eye balm CDN fallback from the layout screenshot upload to the actual product close-up upload.
