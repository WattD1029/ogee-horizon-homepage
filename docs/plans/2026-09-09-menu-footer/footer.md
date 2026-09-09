---
title: "Footer, newsletter and regional states"
date: 2026-09-09
status: planned
branch: codex/menu-footer-footer
base_commit: b845ee7406af4fb33a0499230f1d274715ae107f
---

# Footer, newsletter and regional states

## Problem and target

Close gaps in the existing Ogee footer for US/non-US, desktop/mobile, newsletter active/completed and accordion states.

Shopify Horizon Liquid theme, global chrome mounted through `layout/theme.liquid` and `sections/footer-group.json`. Applies to homepage, collection, product and content routes using this layout. No new route templates are planned. Inspect alternate password/gift-card layouts separately; do not automatically add this chrome there.

## Figma source and states

Source: the supplied local export, exported July 14, 2026. Exact decoded node references: `6074:3027`, `6066:1604`, `6066:1780`, `6066:1776`, `12001:1802`, `12001:1818`, `6080:3996`, `6080:3279`, `6080:3471`, `6080:3535`, `6080:3653`, `6080:3739`, `6080:3803`, `12001:1931`, `12001:1946`.

Desktop US combined footer 1920 x 466; non-US 1920 x 378; newsletter 88px. Mobile newsletter default 390 x 160 and completed candidate 390 x 189.

Consult [source-inventory.json](source-inventory.json) for exact names, ancestry, text overrides and dimensions. These are design measurements, not unconditional CSS sizes. Instance inheritance and image crops are not fully resolved in this inventory; visually inspect the chosen frame before implementation.

## Measured desktop and mobile dimensions

Values are pixels from the exported schema, rounded to three decimals. Full mockup size is not section height. A content stack can include its own header and nested rows.

| Node | Exact source name | Width x height (px) | Measurement context |
| --- | --- | --- | --- |
| `6066:1604` | US Website | 1920.000 x 1080.000 | Desktop full mockup |
| `6066:1617` | Frame 103 | 1920.000 x 314.000 | Desktop menu panel |
| `6066:1780` | Non-US Website | 1920.000 x 1080.000 | Desktop full mockup |
| `6066:1797` | Frame 103 | 1920.000 x 314.000 | Desktop menu panel |
| `6066:1776` | Frame 401 | 1920.000 x 466.000 | Source frame/component |
| `12001:1802` | email - active | 1920.000 x 88.000 | Source frame/component |
| `12001:1818` | email - completed | 1920.000 x 88.000 | Source frame/component |
| `6080:3279` | US Website: default | 390.000 x 844.000 | Mobile full mockup |
| `6080:3280` | Frame 390 | 390.000 x 386.000 | Mobile content stack including children |
| `6080:3471` | Non-US Website | 390.000 x 844.000 | Mobile full mockup |
| `6080:3484` | Frame 390 | 390.000 x 386.000 | Mobile content stack including children |
| `6080:3535` | US Website: Discover | 390.000 x 818.000 | Mobile full mockup |
| `6080:3548` | Frame 390 | 390.000 x 658.000 | Mobile content stack including children |
| `6080:3653` | US Website: Support | 390.000 x 775.000 | Mobile full mockup |
| `6080:3666` | Frame 390 | 390.000 x 615.000 | Mobile content stack including children |
| `6080:3739` | US Website: Programme | 390.000 x 689.000 | Mobile full mockup |
| `6080:3752` | Frame 390 | 390.000 x 529.000 | Mobile content stack including children |
| `6080:3803` | US Website: Contact | 390.000 x 804.000 | Mobile full mockup |
| `6080:3816` | Frame 390 | 390.000 x 644.000 | Mobile content stack including children |
| `12001:1931` | Email - active | 390.000 x 160.000 | Source frame/component |
| `12001:1946` | Email - complated | 390.000 x 189.000 | Source frame/component |
| `6066:1784` | Frame 401 | 1920.000 x 378.000 | Source frame/component |
| `6080:3425` | Frame 402 | 390.000 x 160.000 | Source frame/component |

- [ ] Compare desktop at 1920px and mobile at 390px: panel/component height, rail width, gutters, spacing, image dimensions/aspect ratio and typography.
- [ ] Verify expanded/active states at both sizes. Allow long-copy/error height growth; never use full-artboard height as fixed section height.
- [ ] Check 320px mobile, 768/1024px tablet and 749/750px transition. Tablet is inferred; record missing/conflicting source dimensions before implementation.

## Prior knowledge and repository findings

[Footer solution](../../solutions/design-patterns/2026-07-05-figma-footer-on-dedicated-section.md) informs reuse of the dedicated section, newsletter form, editable columns, cookie handling and explicit mobile ordering. No footer entry appears in the current changelog; the solution supplies prior context.

Read the [shared contract and verification plan](README.md#shared-implementation-contract). Existing code paths were inspected; no automated test/spec suite or package manifest was found in this checkout.

## Explicit file scope

- `sections/ogee-footer.liquid` — existing; modify only for this plan’s responsibilities.
- `sections/footer-group.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.json` — existing; modify only for this plan’s responsibilities.
- `locales/en.default.schema.json` — existing; modify only for this plan’s responsibilities.

No new theme files are proposed. Shared snippets introduced by all-menu are dependencies, not duplicate files to create.

`layout/theme.liquid` is an inspection-only mount point. Route templates and global product-card behavior are outside scope. This planning change does not modify any of these implementation files.

## Shopify data and proposed schema

- Retain link_column blocks, menus/fallback links, legal/social settings, colors and native customer newsletter form.
- Propose newsletter_visibility select: all / US only / hidden; preserve all as the backward-compatible default. If enabled, US-only uses Shopify localization country, not browser language. Confirm whether the intended distinction is country or market.
- Optional newsletter image_picker supports the mobile artwork. Success/error messages must reflect the native form response.
- Discover/Support/Programme/Contact stay editable. Contact emails, chat/social destinations and 2024 copyright are sample content to reconcile with the store.

Proposed setting IDs/types require validation against current Shopify schema limits before implementation. Keep merchant content editable; translate interface and editor strings. No custom data definitions are required for the initial approach.

## Smallest viable implementation

1. Compare current dedicated section with all regional/newsletter/accordion frames. Preserve the existing footer-group mount.
2. Add optional visibility/image settings without replacing merchant link blocks; enable regional behavior only after the intended rule is established.
3. Tune four desktop columns, mobile accordions and legal/social/copyright ordering.
4. Implement visible email focus and native success/error layout; permit content-driven height.
5. Verify cookie-preferences integration and usable fallback URL when its API is unavailable.

## Acceptance and verification

- [ ] US/non-US configurations match respective frames with no empty newsletter gap.
- [ ] Empty/invalid/valid/server-error/success newsletter states are accessible; no false success or double submission.
- [ ] All four accordions work by keyboard/touch; long contact lines and utility ordering remain usable.
- [ ] Country change, editor reorder/remove, disabled links, missing image and privacy API failure have explicit outcomes.
- [ ] Run the shared schema/Theme Check, unpublished Shopify preview and desktop/tablet/mobile checks in the index. Record screenshots/videos and any unavailable checks.

These are planned acceptance checks, not claims of tested implementation.

## Dependencies and integration

- Independent of menu/header implementation except shared locale-file integration.

All area branches begin at the shared planning commit and contain the other plans for reference. Integrate the listed prerequisite implementations before coding; creating the branches does not create those future changes. Keep shared schema/group/locale edits focused and append an implementation changelog entry when work is delivered.

## Risks and decisions

- The current newsletter always renders; the export omits it outside the US. The exact country/market rule is unresolved.
- Existing privacy handler/social defaults need functional verification; appearance alone is insufficient.

## Completion boundary

The current request is branches and plans. Future work should deliver this area and its relevant checks as a focused diff. Publishing, store-navigation mutations and external messages are outside this planning task.
