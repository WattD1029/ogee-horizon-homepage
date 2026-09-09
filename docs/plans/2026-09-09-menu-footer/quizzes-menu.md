---
title: "Quizzes mega menu"
date: 2026-09-09
status: implemented
branch: codex/menu-footer-quizzes-menu
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Quizzes mega menu

## Problem and target

Two promotions for Find Your Complexion and Find Your Contour and mobile quiz links.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `12904:953`, `12904:957`, `12877:2628`, `12855:3102`, `6057:1644`, `12342:1966`, `6074:2813`.

12904:957 candidate: 1920 x 414 panel with two 650px halves, each containing a 250 x 350 image and copy.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `12904:953` | Quizzes | 1920.000 x 1080.000 | Desktop full mockup |
| `12904:957` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `12877:2628` | Quizzes | 1920.000 x 1080.000 | Desktop full mockup |
| `12877:2632` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `12855:3102` | Quizzes | 1920.000 x 1080.000 | Desktop full mockup |
| `12855:3106` | Frame 103 | 1920.000 x 414.000 | Desktop menu panel |
| `6057:1644` | Quizzes | 1920.000 x 1080.000 | Desktop full mockup |
| `6057:1648` | Frame 103 | 1920.000 x 319.000 | Desktop menu panel |
| `12342:1966` | Quizzes | 1920.000 x 1080.000 | Desktop full mockup |
| `12342:1970` | Frame 103 | 1920.000 x 319.000 | Desktop menu panel |
| `6074:2813` | Drawer menu/ Level 2: Quizzes | 390.000 x 844.000 | Mobile full mockup |
| `6074:2814` | Frame 390 | 390.000 x 484.000 | Mobile content stack including children |

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

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. The implementation uses these integration points; new scoped snippets are listed in the branch diff.

## Shopify data and proposed schema

- Two image_picker fields with heading/body/button-label/URL settings connected to existing quiz destinations.
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

The checklist records the original acceptance scope. Completed checks and remaining external verification are distinguished in [implementation-report.md](implementation-report.md).

## Dependencies and integration

- Requires header shell and all-menu shared interface; mobile rendering requires mobile-menu.

Area branches are stacked in the order recorded in [branches.json](branches.json). Each includes its implemented prerequisites and a focused change for its own area. Shared review fixes were folded into the owning branch.

## Risks and decisions

- Earlier panels are 319px tall and later candidates 414px. Select a consistent revision; no quiz engine implementation belongs here.
- Shared settings/group JSON/locales can conflict; integrate all-menu first, then add only this panel’s configuration.
- Real store handles, approved assets and inherited typography still need verification.

## Completion boundary

Implementation is complete locally on the named branch. See [implementation report](implementation-report.md) for integrated verification, measured dimensions and remaining Shopify preview/configuration work. Publishing remains outside this task.

## Implementation — 2026-09-09

Implemented two editable quiz cards with original art: desktop 650px columns/250 × 350px images and mobile 120px image columns. Mobile actions use 44px touch targets. CTA links appear only when a destination is selected or the corresponding existing quiz page resolves; merchant quiz URLs still need confirmation.

Local Liquid/schema validation passed. Final responsive preview evidence is recorded in the integration report on the mobile-menu branch.
