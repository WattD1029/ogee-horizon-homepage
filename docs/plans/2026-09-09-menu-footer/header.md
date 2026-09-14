---
title: "Header and utility actions"
date: 2026-09-09
status: implemented
branch: codex/menu-footer-header
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Header and utility actions

## Problem and target

Reconcile the implemented header with the exported desktop/mobile composition while retaining native search, account and cart behavior.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `6054:521`, `6067:939`, `12644:2195`, `6054:355`, `6073:1833`, `6073:1924`.

The export desktop header is 1920 x 62.409 with 32px horizontal padding; mobile is 390 x 50 with 20px padding. Current desktop code deliberately uses 68px.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `6054:521` | Property 1=DT | 1920.000 x 62.409 | Source frame/component |
| `6067:939` | Property 1=MB | 390.000 x 50.000 | Source frame/component |
| `12644:2195` | Frame 98 | 1920.000 x 62.409 | Source frame/component |
| `6054:329` | Property 1=search | 24.000 x 24.000 | Icon glyph component |
| `6054:327` | Property 1=filled bag | 24.000 x 24.000 | Icon glyph component |
| `6073:1833` | Header/ Announcement bar: Multi-Message | 390.000 x 844.000 | Mobile full mockup |
| `6073:1924` | Header/ Announcement bar: Single Message | 390.000 x 844.000 | Mobile full mockup |

- [ ] Compare desktop at 1920px and mobile at 390px: panel/component height, rail width, gutters, spacing, image dimensions/aspect ratio and typography.
- [ ] Verify expanded/active states at both sizes. Allow long-copy/error height growth; never use full-artboard height as fixed section height.
- [ ] Check 320px mobile, 768/1024px tablet and 749/750px transition. Tablet is inferred; record missing/conflicting source dimensions before implementation.

## Prior knowledge and repository findings

[Header solution](../../solutions/design-patterns/2026-08-10-figma-header-menu-on-horizon-primitives.md) informs shell reuse, native interactions, menu fallback and mobile targets. The August 10 changelog directly informs the height conflict and fallback behavior. No separate solution for this individual panel/drawer was found.

Read the [shared contract and verification plan](README.md#shared-implementation-contract). Existing code paths were inspected; no automated test/spec suite or package manifest was found in this checkout.

## Explicit file scope

- `sections/header.liquid` — existing; modify only for this plan’s responsibilities.
- `sections/header-group.json` — existing; modify only for this plan’s responsibilities.
- `blocks/_header-logo.liquid` — existing; modify only for this plan’s responsibilities.
- `blocks/_header-menu.liquid` — existing; modify only for this plan’s responsibilities.
- `snippets/header-actions.liquid` — existing; modify only for this plan’s responsibilities.
- `snippets/header-drawer.liquid` — existing; modify only for this plan’s responsibilities.
- `assets/header.js` — existing; modify only for this plan’s responsibilities.
- `assets/ogee-header-logo.png` — existing; modify only for this plan’s responsibilities.

No new theme files are proposed. Shared snippets introduced by all-menu are dependencies, not duplicate files to create.

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. The implementation uses these integration points; new scoped snippets are listed in the branch diff.

The announcement bar and footer are completed and excluded. Header acceptance checks verify compatibility with their existing output; they do not authorize changes to those completed sections.

## Shopify data and proposed schema

- Keep existing static header-logo/header-menu blocks, menu link_list, search and sticky/transparent settings.
- Reuse the committed logo after visual comparison; cart count/empty state and account availability use Shopify objects and routes.
- Shopify navigation supplies labels and URLs. The existing Home/Catalog/Contact fallback is a development compatibility path.

Proposed setting IDs/types require validation against current Shopify schema limits before implementation. Keep merchant content editable; translate interface and editor strings. No custom data definitions are required for the initial approach.

## Smallest viable implementation

1. Preserve the implemented 68px desktop header and completed announcement-bar dimensions. Use the export to identify remaining mobile/menu integration gaps; do not repeat the delivered desktop header work.
2. Tune mobile rails/logo/action placement using the newly available mobile frame, retaining adequate touch targets.
3. Check all menu entries and overflow behavior at intermediate widths; preserve header event/component references.

## Acceptance and verification

- [ ] Search, account enabled/disabled and cart empty/populated work across widths.
- [ ] Sticky/transparent transitions, announcement offsets and collection floating controls agree.
- [ ] No logo/action collisions, unreachable overflow links or focus loss on resize.
- [ ] Run the shared schema/Theme Check, unpublished Shopify preview and desktop/tablet/mobile checks in the index. Record screenshots/videos and any unavailable checks.

The checklist records the original acceptance scope. Completed checks and remaining external verification are distinguished in [implementation-report.md](implementation-report.md).

## Dependencies and integration

- Use the completed announcement bar unchanged; coordinate mobile-menu and settle remaining shell integration before all-menu.

Area branches are stacked in the order recorded in [branches.json](branches.json). Each includes its implemented prerequisites and a focused change for its own area. Shared review fixes were folded into the owning branch.

## Risks and decisions

- Changes affect every theme-layout route and may conflict with collection floating navigation.
- Glyph dimensions must not shrink mobile interactive targets.

## Completion boundary

Implementation is complete locally on the named branch. See [implementation report](implementation-report.md) for integrated verification, measured dimensions and remaining Shopify preview/configuration work. Publishing remains outside this task.

## Implementation — 2026-09-09

Implemented on `codex/menu-footer-header`. Mobile rail is 50px plus the existing 1px divider; desktop remains 68px plus divider. Fallback logo is 100 × 27.007px mobile and 120 × 32.4px desktop. Merchant logo settings remain authoritative. Shopify Liquid validation passed. Browser measurements at 390 and 1920px confirmed rail dimensions and no horizontal overflow. Announcement and footer are unchanged.
