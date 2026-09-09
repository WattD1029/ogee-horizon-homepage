---
title: "Accessories mega menu"
date: 2026-09-09
status: implemented
branch: codex/menu-footer-accessories-menu
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Accessories mega menu

## Problem and target

Accessories cards, category links and brush-bundle promotion.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `6057:1625`, `6057:1629`, `6073:2261`, `6073:2609`.

1920 x 414 panel, 1300px outer rail and 250px promo.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `6057:1625` | Accessories | 1920.000 x 1080.000 | Desktop full mockup |
| `6057:1629` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `6073:2261` | Drawer menu/ Level 2: Accessories | 390.000 x 844.000 | Mobile full mockup |
| `6073:2262` | Frame 390 | 390.000 x 792.000 | Mobile content stack including children |
| `6073:2609` | Drawer menu/ Level 3: Accessories | 390.000 x 844.000 | Mobile full mockup |
| `6073:2610` | Frame 390 | 390.000 x 541.000 | Mobile content stack including children |

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

- Accessories collection, up to five products and optional promo image/heading/link.
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

- New/Limited Edition labels and prices are sample content; verify merchant labels and crops.
- Shared settings/group JSON/locales can conflict; integrate all-menu first, then add only this panel’s configuration.
- Real store handles, approved assets and inherited typography still need verification.

## Completion boundary

The current request is branches and plans. Future work should deliver this area and its relevant checks as a focused diff. Publishing, store-navigation mutations and external messages are outside this planning task.

## Implementation � 2026-09-09

Implemented accessories navigation using selected products or the native collection, live counts, optional prices, and a five-card desktop rail with an editable 250 � 350px promotion. Mobile cards use 100px images with 16px text gaps. Empty collections do not create duplicate products.

Local Liquid/schema validation passed. Final responsive preview evidence is recorded in the integration report on the mobile-menu branch.
