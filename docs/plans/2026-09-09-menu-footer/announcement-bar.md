---
title: "Announcement bar"
date: 2026-09-09
status: planned
branch: codex/menu-footer-announcement-bar
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Announcement bar

## Problem and target

Match single-message, multi-message and promo-code states on the existing global announcement strip.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/header-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `6054:506`, `6054:504`, `6054:505`, `6067:812`, `6067:819`, `6074:3019`, `6074:3020`.

The export uses 1920 x 32 desktop and 390 x 32 mobile variants. Current code and the June solution use a 44px strip.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `6054:506` | Accnoucement bar | 1960.000 x 240.000 | Component-set canvas; not strip dimensions |
| `6054:504` | Property 1=DT, promocode=yes | 1920.000 x 32.000 | Source frame/component |
| `6054:505` | Property 1=DT, promocode=no | 1920.000 x 32.000 | Source frame/component |
| `6067:812` | Property 1=MB, promocode=no | 390.000 x 32.000 | Source frame/component |
| `6067:819` | Property 1=MB, promocode=yes | 390.000 x 32.000 | Source frame/component |
| `6073:1833` | Header/ Announcement bar: Multi-Message | 390.000 x 844.000 | Mobile full mockup |
| `6073:1920` | Header/ Announcement bar: Multi-Message | 390.000 x 844.000 | Mobile full mockup |
| `6073:1924` | Header/ Announcement bar: Single Message | 390.000 x 844.000 | Mobile full mockup |
| `6073:1928` | Header/ Announcement bar: Single Message | 390.000 x 844.000 | Mobile full mockup |

- [ ] Compare desktop at 1920px and mobile at 390px: panel/component height, rail width, gutters, spacing, image dimensions/aspect ratio and typography.
- [ ] Verify expanded/active states at both sizes. Allow long-copy/error height growth; never use full-artboard height as fixed section height.
- [ ] Check 320px mobile, 768/1024px tablet and 749/750px transition. Tablet is inferred; record missing/conflicting source dimensions before implementation.

## Prior knowledge and repository findings

[Announcement solution](../../solutions/design-patterns/2026-06-15-figma-announcement-strip-on-horizon-primitives.md) informs rendered-slide counting, manual rotation, blank blocks and touch targets. Its 44px design is a different reference. The changelog and header group confirm existing integration.

Read the [shared contract and verification plan](README.md#shared-implementation-contract). Existing code paths were inspected; no automated test/spec suite or package manifest was found in this checkout.

## Explicit file scope

- `sections/header-announcements.liquid` — existing; modify only for this plan’s responsibilities.
- `blocks/_announcement.liquid` — existing; modify only for this plan’s responsibilities.
- `assets/announcement-bar.js` — existing; modify only for this plan’s responsibilities.
- `sections/header-group.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.schema.json` — existing; modify only for this plan’s responsibilities.

No new theme files are proposed. Shared snippets introduced by all-menu are dependencies, not duplicate files to create.

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. This planning change does not modify any of these implementation files.

## Shopify data and proposed schema

- Keep text/link and section colors. Propose optional promo_code and copy_label text settings on _announcement; translate copy feedback.
- Use rendered nonblank slides for active state and controls. Zero messages omit empty chrome, one message hides arrows. Sample offers are merchant content, not verified current discounts.

Proposed setting IDs/types require validation against current Shopify schema limits before implementation. Keep merchant content editable; translate interface and editor strings. No custom data definitions are required for the initial approach.

## Smallest viable implementation

1. Reconcile the 32px export with the current 44px strip and touch-target needs before adjusting shared height.
2. Reuse manual navigation and rendered-slide counting; retain reduced-motion/disconnect behavior.
3. Add promo code and copy UI without putting the button beneath the current full-slide link overlay. Provide selectable text and error feedback when clipboard access fails.

## Acceptance and verification

- [ ] Zero/one/multiple messages, blank first block and theme-editor reorder work; only the active message is focusable.
- [ ] Single/multi-message and promo yes/no match their selected frames; long translated text does not overlap controls.
- [ ] Copy success/denial remains usable and does not activate the slide link.
- [ ] Run the shared schema/Theme Check, unpublished Shopify preview and desktop/tablet/mobile checks in the index. Record screenshots/videos and any unavailable checks.

These are planned acceptance checks, not claims of tested implementation.

## Dependencies and integration

- Coordinate height and sticky offsets with header.

All area branches begin at the shared planning commit and contain the other plans for reference. Integrate the listed prerequisite implementations before coding; creating the branches does not create those future changes. Keep shared schema/group/locale edits focused and append an implementation changelog entry when work is delivered.

## Risks and decisions

- The 32px/44px mismatch is a source conflict, not evidence that the current theme is broken.
- Autoplay is not implied by arrow controls. No discount creation belongs to this plan.

## Completion boundary

The current request is branches and plans. Future work should deliver this area and its relevant checks as a focused diff. Publishing, store-navigation mutations and external messages are outside this planning task.
