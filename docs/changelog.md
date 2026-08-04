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
[2026-08-03][PLAN] Planned the CLP intro hero from Figma desktop and mobile nodes, targeting the collection template heading above `main-collection` with responsive Ogee typography, collection-backed title/description content, and preview verification across desktop, tablet, and mobile.
[2026-08-03][IMPLEMENT] Added `sections/clp-intro.liquid` and wired it into `templates/collection.json` above `main-collection` so the collection page shows the Figma CLP intro with scoped Ogee typography.
[2026-08-03][REVIEW] Compound review tightened the placeholder description fallback to the `all` collection handle so lorem copy does not leak to other blank-description collection pages.
[2026-08-03][VERIFY] Validated `sections/clp-intro.liquid` and `templates/collection.json` with the Shopify Liquid validator, parsed the collection template body and section schema JSON, and checked for trailing whitespace.
[2026-08-03][PLAN] Planned a dedicated CLP subcollection navigation section from the Figma desktop/mobile nodes, targeting the collection template between `clp-intro` and `main-collection` with collection-backed links, fixed active-page state, and mobile horizontal overflow verification.
[2026-08-03][IMPLEMENT] Added `sections/subcollection-navigation.liquid` and wired it into `templates/collection.json` between `clp-intro` and `main-collection` with collection-backed links and Figma desktop/mobile spacing.
[2026-08-03][REVIEW] Reviewed the CLP subcollection navigation for active-page state, mobile overflow behavior, template placement, and accidental coupling to `collection-links`; no actionable issues were found.
[2026-08-03][VERIFY] Ran Shopify Liquid docs search, validated `sections/subcollection-navigation.liquid` and `templates/collection.json`, parsed the section schema and collection template JSON, and ran `git diff --check`.
[2026-08-03][COMPOUND] Captured the route-oriented CLP subcollection navigation pattern in `docs/solutions/design-patterns/2026-08-03-figma-clp-subcollection-navigation.md`.
[2026-08-03][FIX] Resolved the Shopify upload error by moving the subcollection navigation into the existing `clp-intro` section and removing the `subcollection-navigation` template section dependency.
[2026-08-03][VERIFY] Revalidated `sections/clp-intro.liquid` and `templates/collection.json`, parsed both JSON bodies, and confirmed no template references remain to the missing `subcollection-navigation` section type.
[2026-08-03][COMPOUND] Updated `docs/solutions/design-patterns/2026-08-03-figma-clp-subcollection-navigation.md` with the upload-safe implementation lesson.
[2026-08-03][UPDATE] Hardened the CLP subcollection navigation defaults so `templates/collection.json` no longer depends on new `navigation_link` block entries.
[2026-08-04][PLAN] Planned the CLP filter, sort, and layout controls from Figma desktop/mobile nodes, targeting the existing `filters` block and product grid layout behavior while preserving Horizon facets AJAX updates.
[2026-08-04][IMPLEMENT] Added collection-scoped CLP toolbar rendering in `blocks/filters.liquid` for desktop Filter/Sort controls and mobile Refine/product-count/View controls.
[2026-08-04][UPDATE] Added an optional `show_sort_prefix` sort snippet variant, a scoped mobile grid `View` label, and matching locale keys for the CLP controls.
[2026-08-04][REVIEW] Compound review found no behavioral regressions; tightened active filter count bubble typography so uppercase control letter spacing does not affect count text.
[2026-08-04][VERIFY] Validated the changed filters, sorting, grid-density, and locale files with the Shopify Liquid validator and ran `git diff --check` with only line-ending warnings.
[2026-08-04][COMPOUND] Captured the reusable CLP toolbar-on-Horizon-facets pattern in `docs/solutions/design-patterns/2026-08-04-figma-clp-filter-sort-layout-controls.md`.
[2026-08-04][FIX] Tightened the CLP toolbar cascade so base Horizon facets styles no longer push product count to the right, stack sort controls, or show default mobile grid chips.
[2026-08-04][VERIFY] Revalidated the visual-fix files with the Shopify Liquid validator and reran `git diff --check` with only line-ending warnings.
[2026-08-04][UPDATE] Added a desktop-only sticky floating state for the CLP toolbar so scrolled collection pages show subcollection navigation plus Filter/Sort in a compact bar.
[2026-08-04][REVIEW] Compound review found the floating behavior remains scoped to horizontal collection facets, clones the existing CLP intro navigation instead of duplicating URLs, and leaves mobile Refine/View controls unchanged.
[2026-08-04][VERIFY] Revalidated `blocks/filters.liquid` and `locales/en.default.json` with the Shopify Liquid validator, parsed the locale JSON, and reran `git diff --check` with only line-ending warnings.
[2026-08-04][UPDATE] Tuned the desktop floating CLP bar to the Figma dimension node: 54px bar height, 16px nav/action gaps, 13px uppercase navigation labels, and 8px product-grid gutters.
[2026-08-04][UPDATE] Added the mobile floating subcollection rail using the mobile Figma dimensions: 20px gutters, 16px gaps, compact category-only labels, active-state underline, product-grid clearance, and source navigation thumbnail fallbacks for the non-floating intro rail.
[2026-08-04][VERIFY] Revalidated `blocks/filters.liquid`, `sections/clp-intro.liquid`, and `templates/collection.json` with the Shopify Liquid validator, parsed the collection template JSON, and reran `git diff --check` with only line-ending warnings.
[2026-08-04][FIX] Added mobile floating-rail grid clearance so sticky category labels no longer crop the first visible product row.
[2026-08-04][VERIFY] Revalidated `blocks/filters.liquid` with the Shopify Liquid validator and reran `git diff --check` with only line-ending warnings.
