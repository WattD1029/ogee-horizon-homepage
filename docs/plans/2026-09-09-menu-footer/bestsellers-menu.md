---
title: "Bestsellers mega menu"
date: 2026-09-09
status: planned
branch: codex/menu-footer-bestsellers-menu
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Bestsellers mega menu

## Problem and target

Bestsellers Favourites/Collections panel and matching mobile state.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `12904:934`, `12904:938`, `12877:2609`, `12855:2439`, `12644:2912`, `12644:2570`.

12904:934 candidate: 1920 x 414 panel and 515 x 200 favourites group.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `12904:934` | Bestsellers | 1920.000 x 1080.000 | Desktop full mockup |
| `12904:938` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `12877:2609` | Bestsellers | 1920.000 x 1080.000 | Desktop full mockup |
| `12877:2613` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `12855:2439` | Bestsellers | 1920.000 x 1080.000 | Desktop full mockup |
| `12855:2443` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `12644:2912` | Bestsellers | 1920.000 x 1080.000 | Desktop full mockup |
| `12644:2916` | Frame 103 | 1920.000 x 364.000 | Desktop menu panel |
| `12644:2570` | Drawer menu/ Level 2: All | 390.000 x 844.000 | Mobile full mockup |
| `12644:2571` | Frame 390 | 390.000 x 375.000 | Mobile content stack including children |

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

No new theme files are proposed. Shared snippets introduced by all-menu are dependencies, not duplicate files to create.

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. This planning change does not modify any of these implementation files.

## Shopify data and proposed schema

- Configured bestseller collection and up to five selected products; merchants own ranking and ordering.
- Consume the all-menu settings/rendering contract; add only this panel’s prefixed settings. No standalone section or duplicate data model.
- Prices/counts/URLs use Shopify resources or explicit merchant settings; artwork strings are reference content.

Proposed setting IDs/types require validation against current Shopify schema limits before implementation. Keep merchant content editable; translate interface and editor strings. No custom data definitions are required for the initial approach.

## Smallest viable implementation

1. Compare the listed desktop/mobile frames and record the chosen revision.
2. Configure this panel using the all-menu renderer and scoped promo/product-card snippets where appropriate.
3. Apply the smallest layout variant while preserving hydration, overflow references, focus and pointer transitions.
4. Connect the mobile counterpart through mobile-menu using shared resources and its own mobile layout.

## Acceptance and verification

- [ ] Chosen desktop frame matches at 1920px and remains usable at 768/1024px; mobile counterpart is reachable at 320/390px.
- [ ] CTAs resolve to configured destinations; missing images/resources, empty selections and long titles remain usable.
- [ ] Switching panels clears stale expanded state; keyboard entry, Escape and editor reload work.
- [ ] Other panels and collection product-card/quick-add behavior remain unaffected.
- [ ] Run the shared schema/Theme Check, unpublished Shopify preview and desktop/tablet/mobile checks in the index. Record screenshots/videos and any unavailable checks.

These are planned acceptance checks, not claims of tested implementation.

## Dependencies and integration

- Requires header shell and all-menu shared interface; mobile rendering requires mobile-menu.

All area branches begin at the shared planning commit and contain the other plans for reference. Integrate the listed prerequisite implementations before coding; creating the branches does not create those future changes. Keep shared schema/group/locale edits focused and append an implementation changelog entry when work is delivered.

## Risks and decisions

- The artwork repeats Sculpted Skin-Perfecting Powder and varies singular/plural labels. Deduplicate selected products by ID and use actual collection title/count.
- Shared settings/group JSON/locales can conflict; integrate all-menu first, then add only this panel’s configuration.
- Real store handles, approved assets and inherited typography still need verification.

## Completion boundary

The current request is branches and plans. Future work should deliver this area and its relevant checks as a focused diff. Publishing, store-navigation mutations and external messages are outside this planning task.
