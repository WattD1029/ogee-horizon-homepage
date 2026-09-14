---
title: "Mobile menu drawer"
date: 2026-09-09
status: implemented
branch: codex/menu-footer-mobile-menu
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Mobile menu drawer

## Problem and target

Match the three-level drawer, one/two banner states, product rows, Back navigation and bottom Shop All rows.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `6074:3022`, `6073:1837`, `6073:1903`, `6073:1857`, `6073:1870`, `6073:1885`, `6073:2162`, `6073:2490`, `6073:2261`, `6073:2609`, `6073:2371`, `6073:2718`, `6074:2813`, `12644:2547`, `12644:2570`, `12644:2673`, `12644:2863`.

390 x 844 references; 50px top rail, 20px gutters, 350px link rail and 50px primary rows. Allow content scrolling at short heights.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `6073:1837` | Drawer menu/ Level 1: 2 banners | 390.000 x 844.000 | Mobile full mockup |
| `6073:1838` | Frame 390 | 390.000 x 512.000 | Mobile content stack including children |
| `6073:1903` | Drawer menu/ Level 1: 1 banner | 390.000 x 844.000 | Mobile full mockup |
| `6073:1904` | Frame 390 | 390.000 x 524.000 | Mobile content stack including children |
| `6073:1857` | Drawer menu/ Level 2: All | 390.000 x 844.000 | Mobile full mockup |
| `6073:1858` | Frame 390 | 390.000 x 312.000 | Mobile content stack including children |
| `6073:1870` | Drawer menu/ Level 2: Makeup | 390.000 x 844.000 | Mobile full mockup |
| `6073:1871` | Frame 390 | 390.000 x 792.000 | Mobile content stack including children |
| `6073:1885` | Drawer menu/ Level 3: Makeup | 390.000 x 844.000 | Mobile full mockup |
| `6073:1886` | Frame 390 | 390.000 x 541.000 | Mobile content stack including children |
| `6073:2162` | Drawer menu/ Level 2: Skincare | 390.000 x 844.000 | Mobile full mockup |
| `6073:2163` | Frame 390 | 390.000 x 792.000 | Mobile content stack including children |
| `6073:2490` | Drawer menu/ Level 3: Skincare | 390.000 x 844.000 | Mobile full mockup |
| `6073:2491` | Frame 390 | 390.000 x 627.000 | Mobile content stack including children |
| `6073:2261` | Drawer menu/ Level 2: Accessories | 390.000 x 844.000 | Mobile full mockup |
| `6073:2262` | Frame 390 | 390.000 x 792.000 | Mobile content stack including children |
| `6073:2609` | Drawer menu/ Level 3: Accessories | 390.000 x 844.000 | Mobile full mockup |
| `6073:2610` | Frame 390 | 390.000 x 541.000 | Mobile content stack including children |
| `6073:2371` | Drawer menu/ Level 2: Bundles | 390.000 x 844.000 | Mobile full mockup |
| `6073:2372` | Frame 390 | 390.000 x 770.000 | Mobile content stack including children |
| `6073:2718` | Drawer menu/ Level 3: Bundles | 390.000 x 844.000 | Mobile full mockup |
| `6073:2719` | Frame 390 | 390.000 x 498.000 | Mobile content stack including children |
| `6074:2813` | Drawer menu/ Level 2: Quizzes | 390.000 x 844.000 | Mobile full mockup |
| `6074:2814` | Frame 390 | 390.000 x 484.000 | Mobile content stack including children |
| `12644:2547` | Drawer menu/ Level 1: 2 banners | 390.000 x 844.000 | Mobile full mockup |
| `12644:2548` | Frame 390 | 390.000 x 512.000 | Mobile content stack including children |
| `12644:2570` | Drawer menu/ Level 2: All | 390.000 x 844.000 | Mobile full mockup |
| `12644:2571` | Frame 390 | 390.000 x 375.000 | Mobile content stack including children |
| `12644:2673` | Drawer menu/ Level 2: All | 390.000 x 844.000 | Mobile full mockup |
| `12644:2674` | Frame 390 | 390.000 x 312.000 | Mobile content stack including children |
| `12644:2863` | Drawer menu/ Level 2: All | 390.000 x 844.000 | Mobile full mockup |
| `12644:2864` | Frame 390 | 390.000 x 291.000 | Mobile content stack including children |
| `6054:521` | Property 1=DT | 1920.000 x 62.409 | Source frame/component |

The desktop header row is the responsive counterpart, not a desktop drawer design. Drawer-specific desktop dimensions do not exist in this export; test the transition to the desktop mega menu.

- [ ] Compare desktop at 1920px and mobile at 390px: panel/component height, rail width, gutters, spacing, image dimensions/aspect ratio and typography.
- [ ] Verify expanded/active states at both sizes. Allow long-copy/error height growth; never use full-artboard height as fixed section height.
- [ ] Check 320px mobile, 768/1024px tablet and 749/750px transition. Tablet is inferred; record missing/conflicting source dimensions before implementation.

## Prior knowledge and repository findings

[Header solution](../../solutions/design-patterns/2026-08-10-figma-header-menu-on-horizon-primitives.md) informs shell reuse, native interactions, menu fallback and mobile targets. The August 10 changelog directly informs the height conflict and fallback behavior. No separate solution for this individual panel/drawer was found.

Read the [shared contract and verification plan](README.md#shared-implementation-contract). Existing code paths were inspected; no automated test/spec suite or package manifest was found in this checkout.

## Explicit file scope

- `snippets/header-drawer.liquid` — existing; modify only for this plan’s responsibilities.
- `assets/header-drawer.js` — existing; modify only for this plan’s responsibilities.
- `blocks/_header-menu.liquid` — existing; modify only for this plan’s responsibilities.
- `sections/header-group.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.schema.json` — existing; modify only for this plan’s responsibilities.

No new theme files are proposed. Shared snippets introduced by all-menu are dependencies, not duplicate files to create.

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. The implementation uses these integration points; new scoped snippets are listed in the branch diff.

## Shopify data and proposed schema

- Use the same main navigation and panel resource configuration as desktop. Existing shallow and three-level tree rendering paths both need coverage.
- Use shared product/promo resources for nested lists and up to two optional root promotions. Avoid a duplicate mobile URL list.
- Native search/account/cart integrations and resource-backed category totals remain authoritative.

Proposed setting IDs/types require validation against current Shopify schema limits before implementation. Keep merchant content editable; translate interface and editor strings. No custom data definitions are required for the initial approach.

## Smallest viable implementation

1. Map all level transitions; preserve details/summary, component refs, focus trap and scroll-lock ownership.
2. Implement root one/two-banner states and nested rows with shared snippets adapted to mobile.
3. Keep bottom CTAs reachable without overlapping long content. Use current back/close APIs and synchronize expanded state.
4. Check close during animation, rapid Back, reopen after submenu, editor reload, reduced motion and resize to desktop.

## Acceptance and verification

- [ ] Traverse all nine root destinations and supplied third levels, then return with Back.
- [ ] Focus stays in the active drawer/submenu; Escape/close return focus correctly and restore body scroll.
- [ ] Zero/one/two promotions, missing image, empty nested menu and long localized labels remain usable.
- [ ] Short landscape screens and desktop resize leave no clipped CTA, stale overlay or scroll lock.
- [ ] Run the shared schema/Theme Check, unpublished Shopify preview and desktop/tablet/mobile checks in the index. Record screenshots/videos and any unavailable checks.

The checklist records the original acceptance scope. Completed checks and remaining external verification are distinguished in [implementation-report.md](implementation-report.md).

## Dependencies and integration

- Requires header shell and all-menu configuration contract. Coordinate data with individual panel branches.

Area branches are stacked in the order recorded in [branches.json](branches.json). Each includes its implemented prerequisites and a focused change for its own area. Shared review fixes were folded into the owning branch.

## Risks and decisions

- Fixes limited to only the shallow or three-level path will miss another supported state.
- Figma connectors/animation annotations are design evidence, not instructions to visit demos or add external libraries.

## Completion boundary

Implementation is complete locally on the named branch. See [implementation report](implementation-report.md) for integrated verification, measured dimensions and remaining Shopify preview/configuration work. Publishing remains outside this task.

## Implementation — 2026-09-09

Implemented the shared three-level drawer with 50px rails, 20px gutters, 50px link rows, 100px product images, one/two promotion states, and existing Horizon disclosure/scroll-lock controls. Fixed repeated Escape, restored focus on Back/close, and restricted Tab cycling to visible controls. Local Chromium tests passed at 320/390/749px and short-height reduced-motion settings. Shopify preview verification remains pending explicit sync approval.

Local Liquid/schema validation passed. Final responsive preview evidence is recorded in the integration report on the mobile-menu branch.
