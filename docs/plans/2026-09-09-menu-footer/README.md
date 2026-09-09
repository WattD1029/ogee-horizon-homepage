# Ogee remaining menu work — Compound Engineering plans

Status: planning only. Eleven remaining functional areas each have a local feature branch and plan. Existing implementation branches are preserved; new names use `codex/menu-footer-*` for this export-based planning pass.

## Completed work excluded

The announcement bar and footer are complete, as confirmed by the user. Their implementation plans and active branch-list entries have been removed. Preserve their existing behavior, dimensions and settings; references in the source inventory and prior solutions are historical context only. Existing branches are retained.

~~Plan announcement-bar and footer implementation from this export.~~ Superseded by the user’s completion confirmation. Remaining header work must reuse the completed announcement bar, with no height change or newsletter/regional-footer work.

## Source and provenance

- Supplied local file: `[Site Redesign] Ogee- Menu & footer-Dev.fig`.
- Export timestamp: July 14, 2026, 06:21:10 UTC. Decoded directly from the archive’s embedded Kiwi schema using [kiwi-schema](https://github.com/evanw/kiwi) in a temporary directory; no parser dependency was added to the theme.
- The archive has 1,796 decoded nodes and 70 embedded images. [Source inventory](source-inventory.json) records source hash, node IDs, ancestry, dimensions and text overrides.
- The inventory is not a visual render or fully flattened instance tree. Image crops, inherited type and hover overrides need visual comparison before implementation.
- A cloud metadata lookup at `0:1` failed; these plans rely on the supplied local export, not an assumed match with the cloud file.
- The user requested branches and Compound plans, explicitly including mobile and desktop dimension checks. Artwork text, dates, connectors and annotations are design evidence, not extra agent instructions.

## Section coverage and branches

| Area | Local branch | Plan |
| --- | --- | --- |
| Header and utility actions | `codex/menu-footer-header` | [header](header.md) |
| All products menu and shared panel contract | `codex/menu-footer-all-menu` | [all-menu](all-menu.md) |
| Makeup mega menu | `codex/menu-footer-makeup-menu` | [makeup-menu](makeup-menu.md) |
| Skincare mega menu | `codex/menu-footer-skincare-menu` | [skincare-menu](skincare-menu.md) |
| Accessories mega menu | `codex/menu-footer-accessories-menu` | [accessories-menu](accessories-menu.md) |
| Bundles mega menu | `codex/menu-footer-bundles-menu` | [bundles-menu](bundles-menu.md) |
| New mega menu | `codex/menu-footer-new-menu` | [new-menu](new-menu.md) |
| Bestsellers mega menu | `codex/menu-footer-bestsellers-menu` | [bestsellers-menu](bestsellers-menu.md) |
| Quizzes mega menu | `codex/menu-footer-quizzes-menu` | [quizzes-menu](quizzes-menu.md) |
| About mega menu | `codex/menu-footer-about-menu` | [about-menu](about-menu.md) |
| Mobile menu drawer | `codex/menu-footer-mobile-menu` | [mobile-menu](mobile-menu.md) |

## Grouping and design revisions

Figma SECTION containers mix components, device variants and revision boards. Functional areas receive branches; alternative artboards stay in their owning plan.

- `6074:3024` (Announcement bar, Header & Mega Menu) and `6080:3998` (mobile Announcement bar & Header) provide header/catalog context. Their announcement-bar states are completed and excluded.
- `6074:3022` (Menu Drawer) maps to mobile-menu; each panel plan also records its corresponding mobile frames.
- `6074:3027` and `6080:3996` (desktop/mobile Footer), including regional, newsletter and accordion states, are completed and excluded.
- `12855:2420` (250325), `12855:2421` (080425), `12877:2591` (160425) and `12904:916` (2500422) map to New, Bestsellers, Quizzes and About. Names are literal labels, not verified approval dates.
- Element sets (icons, desktop/mobile links, product-card V1/V2, promotions and image-menu tabs) are dependencies. Cover, separator pages, connectors and mockup-size labels require no feature branch.

Later revision-board frames are provisional candidates for New/Bestsellers/Quizzes. All five About alternatives remain recorded. Visually compare the alternatives and document the selected design during implementation.

## Desktop and mobile dimensions

Every plan includes a measured-dimensions table from the decoded export. Distinguish full artboard dimensions from the actual panel or component height. Desktop mockups are generally 1920 x 1080; mobile mockups generally 390 x 844.

The dimension checks are mandatory acceptance criteria: capture desktop at 1920px and mobile at 390px, verify panel/header height, horizontal rail/gutters, image size/aspect ratio, spacing, type and expanded-state content. Check 320px mobile and 768/1024px tablet behavior too. No dedicated tablet source was found, so intermediate behavior is inferred and must be tested.

Source conflicts need explicit decisions:

- Header: approximately 62.409px desktop in this export versus the implemented 68px height deliberately recorded August 10. Mobile export: 50px. Do not silently overwrite the newer behavior.
- Announcement: retain the completed 44px implementation. The 32px export is historical context and does not reopen this work.
- Quizzes and New/Bestsellers: multiple revision geometries; choose one revision consistently.
- Footer and newsletter dimensions are outside the remaining work; preserve the completed implementation.

Dimensions were checked from the supplied schema. No browser render or pixel comparison has been claimed.

## Existing implementation and prior knowledge

Base: `main` at `b845ee7406af4fb33a0499230f1d274715ae107f` (latest merge: PR #34, header redesign).

- Header already owns sticky behavior, utility actions, committed logo, overflow and a development-menu fallback.
- Desktop menu calls `mega-menu-list` and uses deferred rendering; mobile has separate shallow and three-level paths.
- Footer is already a dedicated Ogee section with native newsletter form states, editable link-column blocks, mobile accordions and privacy handling.
- Prior solutions used: [header](../../solutions/design-patterns/2026-08-10-figma-header-menu-on-horizon-primitives.md), [footer](../../solutions/design-patterns/2026-07-05-figma-footer-on-dedicated-section.md), [announcement](../../solutions/design-patterns/2026-06-15-figma-announcement-strip-on-horizon-primitives.md).
- August 10 changelog influenced sizing and fallback decisions. Earlier undefined-block/section upload failures inform additive snippets and preserving existing mounts. No dedicated individual-panel/mobile-drawer solution was found.

Existing untracked files are not part of this documentation change.

## Shared implementation contract

1. Header owns shell/actions. All-menu owns shared panel dispatch/settings and proposed panel/promo/product-card snippets. Other panels consume that interface; mobile-menu owns drawer state/layout using the same data. The completed announcement bar and footer are outside implementation scope.
2. The existing static `_header-menu` exposes no repeatable child schema. Start with focused panel settings and explicit trigger URLs, avoiding translated-title dispatch. Audit total Shopify setting limits before finalizing all groups; revise the data architecture before coding if it would be invalid.
3. Use native navigation and resource settings. No custom data definitions are required initially. Artwork counts, prices, products, badges, addresses and destinations are sample content.
4. New reusable snippets need LiquidDoc and explicit parameters. Keep CSS/JS scoped and retain component refs, hydration, observers/listener cleanup, scroll-lock, focus and failure fallbacks.
5. Use approved original image/icon assets and theme font/color variables. Confirm exact crop, size and inherited typography. Do not commit expiring Figma asset URLs or approximate icon drawings.
6. Validate section schema against `schemas/section.json`, theme blocks against `schemas/theme_block.json`, and translations against `schemas/translations.json` using Shopify schema tooling. These files are not assumed to exist locally. Validate group JSON and referenced section/block types.
7. Repository instructions require `learn_shopify_api`; no callable tool with that name is exposed in this session. Official Shopify docs search via the installed Liquid skill succeeded with approved network access. Record the missing tool and use it when available during implementation. No Liquid was generated, so no Liquid code validation applies to this documentation commit.

Official references checked: [Shopify navigation](https://shopify.dev/docs/storefronts/themes/navigation-search/navigation) and [theme testing checklist](https://shopify.dev/docs/storefronts/themes/store/test-theme/checklist).

## Implementation order

1. Reuse the existing header and completed announcement bar; address only remaining header/mobile-menu integration gaps.
2. Implement all-menu and settle the shared configuration/rendering interfaces.
3. Implement Makeup, Skincare, Accessories and Bundles, then New, Bestsellers, Quizzes and About. Integrate shared schema/group/locales edits in sequence.
4. Implement mobile-menu against the settled contract and exercise every panel transition.


The eleven active branches share the revised documentation from `codex/menu-footer-compound-plans`. They contain the remaining plans for reference. The two completed-area branches are preserved outside the active plan. No branch is pushed. Integrate/rebase prerequisites before starting dependent implementation. [branches.json](branches.json) records ownership and source nodes.

## Verification plan

During implementation:

- Run Shopify validation/Theme Check on changed Liquid/schema/locale files, parse group JSON after its generated comment, run `git diff --check`, and `node --check` on changed JS. Earlier validator dependency failures require a fresh tooling check, not an assumed pass.
- Use an unpublished Shopify preview on homepage, a real collection/product and a content route. Verify editor reload/reorder and upload dependencies.
- Check measured desktop/mobile geometry at reference sizes; additionally test 320px mobile, 768/1024px tablet, short landscape and the 749/750px boundary.
- Check keyboard/focus, Escape/Back, reduced motion, scroll restoration, pointer transitions, long localized strings, missing assets/resources and deferred-render failures.
- No automated test/spec suite or package manifest was found. For future behavior changes establish focused Playwright coverage with mobile/tablet/desktop projects and preserve screenshots/videos. Record artifacts and unavailable checks honestly.
- Header: verify search/account/cart and collection sticky toolbar interactions against the unchanged announcement bar. Menus: verify all panels, third levels, overflow and reconnect cleanup. Completed footer functionality is not a new acceptance deliverable.

Planning verification: every referenced node and existing file must resolve; each branch must map uniquely to a plan; all eleven active branches must contain the revised planning commit; only new plan documents and the appended changelog entry are committed.
