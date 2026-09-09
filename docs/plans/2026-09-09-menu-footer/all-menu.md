---
title: "All products menu and shared panel contract"
date: 2026-09-09
status: implemented
branch: codex/menu-footer-all-menu
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# All products menu and shared panel contract

## Problem and target

Build the All catalog panel and a single rendering/configuration contract consumed by the other menu panels.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `6057:1464`, `6057:1522`, `12342:1633`, `6057:1468`.

Base panel 1920 x 458; 1300px outer rail, 1200px inner rail, 902px content and 250px promo. Compare both All variants and 12342:1633 before choosing a baseline.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `6057:1464` | All | 1920.000 x 1080.000 | Desktop full mockup |
| `6057:1468` | Frame 103 | 1920.000 x 458.000 | Desktop menu panel |
| `6057:1522` | All | 1920.000 x 1080.000 | Desktop full mockup |
| `6057:1526` | Frame 103 | 1920.000 x 458.000 | Desktop menu panel |
| `12342:1633` | All | 1920.000 x 1080.000 | Desktop full mockup |
| `12342:1637` | Frame 103 | 1920.000 x 458.000 | Desktop menu panel |
| `6073:1857` | Drawer menu/ Level 2: All | 390.000 x 844.000 | Mobile full mockup |
| `6073:1858` | Frame 390 | 390.000 x 312.000 | Mobile content stack including children |

- [ ] Compare desktop at 1920px and mobile at 390px: panel/component height, rail width, gutters, spacing, image dimensions/aspect ratio and typography.
- [ ] Verify expanded/active states at both sizes. Allow long-copy/error height growth; never use full-artboard height as fixed section height.
- [ ] Check 320px mobile, 768/1024px tablet and 749/750px transition. Tablet is inferred; record missing/conflicting source dimensions before implementation.

## Prior knowledge and repository findings

[Header solution](../../solutions/design-patterns/2026-08-10-figma-header-menu-on-horizon-primitives.md) informs shell reuse, native interactions, menu fallback and mobile targets. The August 10 changelog directly informs the height conflict and fallback behavior. No separate solution for this individual panel/drawer was found.

Read the [shared contract and verification plan](README.md#shared-implementation-contract). Existing code paths were inspected; no automated test/spec suite or package manifest was found in this checkout.

## Explicit file scope

- `blocks/_header-menu.liquid` — existing; modify only for this plan’s responsibilities.
- `snippets/mega-menu-list.liquid` — existing; modify only for this plan’s responsibilities.
- `sections/header-group.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.schema.json` — existing; modify only for this plan’s responsibilities.
- `assets/header-menu.js` — existing; modify only for this plan’s responsibilities.
- `snippets/resource-card.liquid` — existing; modify only for this plan’s responsibilities.

- `snippets/ogee-menu-panel.liquid` — proposed new shared snippet owned by this plan.
- `snippets/ogee-menu-promo.liquid` — proposed new shared snippet owned by this plan.
- `snippets/ogee-menu-product-card.liquid` — proposed new shared snippet owned by this plan.

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. This planning change does not modify any of these implementation files.

## Shopify data and proposed schema

- Keep main navigation as the link hierarchy. Proposed per-panel _header-menu settings: <key>_trigger_url (url), <key>_menu (link_list), <key>_collection (collection), <key>_products (product_list), plus only needed promo image_picker/heading/url fields.
- Dispatch by explicitly configured trigger URL, detect duplicate matches, and preserve Horizon fallback for unmatched entries. Do not dispatch by translated label or sibling index.
- The current static _header-menu has no repeatable child schema. Audit total Shopify setting limits before adding all panel groups; revise the proposed architecture if it exceeds valid limits.
- Read titles/counts/URLs from native resources. All Products (35) is sample content. Keep light/dark and slider/no-slider promo variants in the same reusable snippet.

Proposed setting IDs/types require validation against current Shopify schema limits before implementation. Keep merchant content editable; translate interface and editor strings. No custom data definitions are required for the initial approach.

## Smallest viable implementation

1. Define and document snippet parameters and unique trigger mapping before dependent panel work.
2. Render native menu groups for Makeup, Skincare, Accessories and Bundles inside the existing submenu container.
3. Add shared scoped promo/product-card snippets; avoid changing collection product cards. Use content-driven height at other widths.
4. Preserve initial lightweight output, Section Rendering API hydration, overflow refs and fallback links; reuse slideshow controls only for configured multiple promotions.

## Acceptance and verification

- [ ] Groups and nested links appear once, route correctly and use real resource counts.
- [ ] Hover, keyboard focus, Escape, pointer movement into the panel and overflow entries work.
- [ ] Missing promo/menu/image and deferred-render failure produce usable navigation.
- [ ] Panel settings do not leak to other menus or duplicate mobile navigation data.
- [ ] Run the shared schema/Theme Check, unpublished Shopify preview and desktop/tablet/mobile checks in the index. Record screenshots/videos and any unavailable checks.

These are planned acceptance checks, not claims of tested implementation.

## Dependencies and integration

- Depends on header shell. Owns shared interfaces for eight other panel plans and mobile-menu.

All area branches begin at the shared planning commit and contain the other plans for reference. Integrate the listed prerequisite implementations before coding; creating the branches does not create those future changes. Keep shared schema/group/locale edits focused and append an implementation changelog entry when work is delivered.

## Risks and decisions

- Other panels share schema/group JSON/locales; establish this interface first and integrate their edits in sequence.
- Alternative All layouts remain design decisions; content limits and performance require checking against real store data.

## Completion boundary

The current request is branches and plans. Future work should deliver this area and its relevant checks as a focused diff. Publishing, store-navigation mutations and external messages are outside this planning task.

## Implementation � 2026-09-09

Added URL-based dispatch with duplicate detection, native menu fallback, four collection groups, reusable product/promotion snippets, original Figma imagery, and Escape/ArrowDown keyboard behavior. Shared rail: 1300px with 50px horizontal/32px vertical padding; All panel minimum 458px. Visual preview configuration remains under verification.

Local Liquid/schema validation passed. Final responsive preview evidence is recorded in the integration report on the mobile-menu branch.
