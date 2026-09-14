# Ogee menu implementation and verification

All eleven remaining plans have implementations on separate branches pushed to GitHub. Branches are stacked in dependency order; `codex/menu-footer-mobile-menu` contains the combined result. The announcement bar and footer remain unchanged. The eleven implementation branches and shared planning branch are pushed to GitHub. No live theme was updated.

| Area | Branch | Implementation commit |
| --- | --- | --- |
| header | `codex/menu-footer-header` | `92117f07` |
| all-menu | `codex/menu-footer-all-menu` | `bf309124` |
| makeup-menu | `codex/menu-footer-makeup-menu` | `69ceef41` |
| skincare-menu | `codex/menu-footer-skincare-menu` | `cffd89e0` |
| accessories-menu | `codex/menu-footer-accessories-menu` | `ba1bc109` |
| bundles-menu | `codex/menu-footer-bundles-menu` | `4f05774f` |
| new-menu | `codex/menu-footer-new-menu` | `e1d9cf9f` |
| bestsellers-menu | `codex/menu-footer-bestsellers-menu` | `514b7321` |
| quizzes-menu | `codex/menu-footer-quizzes-menu` | `30bc9405` |
| about-menu | `codex/menu-footer-about-menu` | `5bb354c6` |
| mobile-menu | `codex/menu-footer-mobile-menu` | `8dcc81cc` |

## Desktop and mobile measurements

The supplied `.fig` archive and Figma design context were inspected for both devices. Chosen desktop nodes: All `6057:1468`; Makeup `6057:1584`; Skincare `6057:1676`; Accessories `6057:1629`; Bundles `6057:1611`; New `12904:921`; Bestsellers `12904:938`; Quizzes `12904:957`; About `12644:3326`. Mobile references include `6067:939`, `6073:1837`, `6073:1870`, and `6074:2813`.

| Component | Verified measurement | Verification environment |
| --- | --- | --- |
| Header rail, desktop | 68px plus existing 1px divider | Unpublished Shopify preview at 1920px |
| Header rail, mobile | 50px plus existing 1px divider | Unpublished Shopify preview at 390px |
| Desktop menu rail | 1300px, centered at x=310 in 1920px viewport | Local Chromium fixture |
| All panel | 1300 × 458px | Local Chromium fixture |
| Makeup / Skincare / Accessories | 1300 × 414px | Local Chromium fixture |
| Bundles | 1300 × 327px | Local Chromium fixture |
| New / Bestsellers / Quizzes | 1300 × 414px | Local Chromium fixture |
| About | 1300 × 319px | Local Chromium fixture |
| Mobile drawer | 390 × 844px; 50px control/back rails; 20px content gutters | Local Chromium fixture |
| Mobile product image | 100 × 100px at x=20; 16px image/text gap | Local Chromium fixture |
| Mobile quiz image column | 120px | Local Chromium fixture |

Desktop rail padding is 50px horizontally and 32px vertically. Promotion images are 250 × 350px. Mobile controls retain 44px touch targets; quiz card heights can exceed the artwork's 190px rows because of accessible buttons, real text and font metrics. The completed 68px desktop header intentionally takes precedence over the older 62.409px export.

## Checks completed

- Shopify Liquid skill validation passed for all new/changed Liquid, menu block schema, header group JSON and English locales. The mandatory `learn_shopify_api` step was completed through the official developer MCP.
- JavaScript syntax checks and `git diff --check` passed.
- Local Liquid rendering checked matching, unmatched, duplicate, disabled and locale-prefixed URL mappings.
- Every desktop panel passed hover, ArrowDown entry, Escape close and trigger-focus restoration.
- Every mobile panel passed the 390px overflow check. All → Makeup exercised a third drawer level with Back/Escape and focus restoration.
- Layout checks passed at 320, 390, 749, 750, 768, 1024, 1440 and 1920px. The tablet More menu exposed its overflow entries within the viewport. Tablet layouts are inferred because the export has no dedicated tablet frames.
- At 320 × 568px with reduced motion, Back/close and forward/reverse Tab cycling stayed on visible controls. Promotions are hidden on short screens to preserve navigation space.
- Review fixed inherited relative menu positioning, no-wrap inheritance, stylesheet-order conflicts, Bundles Shop All placement, and repeated Escape targeting a closed disclosure.

Local fixtures rendered the actual menu snippets and used Horizon's JavaScript components with deterministic resource fixtures. They are not a substitute for Shopify's renderer, production font loading, real resource data, section hydration or editor behavior. Product counts in the fixture followed the inspected development collections (4/3/3/1 for category panels); the implementation always reads live resources.

Review copies are committed in [docs/pr-assets/menu-footer](../../pr-assets/menu-footer). Original screenshots are saved in the original workspace's `output/playwright/`: `menu-desktop-all.png`, `menu-desktop-makeup.png`, `menu-desktop-quizzes.png`, `menu-mobile-root.png`, `menu-mobile-makeup.png`, and `menu-mobile-quizzes.png`. They are explicitly local fixture screenshots, not live storefront captures.

## Merchant settings and source choices

The existing static header menu block contains per-panel trigger URL, resource and content settings. Native navigation remains authoritative; the existing Home/Catalog/Contact development fallback is retained. Duplicate trigger URLs use Horizon fallback rather than selecting a panel arbitrarily. Unmatched menu entries keep native navigation behavior.

Collection panels use selected products or native collection order, real prices when enabled, and actual collection counts. Product second images are optional hover images. Figma sample counts, badges and repeated products were not copied as store facts.

Quiz destinations, About destinations and promotion destinations remain editable. Quiz CTAs appear only with a selected URL or a resolving existing quiz page. About destinations use selected menu links, individual URLs or resolving native pages/blogs; missing destinations render readable text. The first three About hover images were checker placeholders in the source and remain optional merchant images. No placeholder checker asset is shipped.

Original artwork was extracted from the supplied `.fig` image hashes after Figma download URLs returned empty files. Images were resized for theme use, not redrawn. No expiring Figma URLs or new parser dependencies were added to the theme.

## Remaining Shopify verification

The separate unpublished preview is **Codex menu plans verification**, ID **162340274281**, on **ogee-li63n1as.myshopify.com**. Header geometry was checked there, but the combined implementation has not been synced or verified there.

Automatic approval review rejected the final settings upload because it requires explicit authorization to send repository files to Shopify. The sync process was stopped and approval was requested. Local work continued without further uploads.

Readback confirmed that the preview's header group did not retain settings uploaded before their new schema was available. On approval, upload the changed blocks/snippets/assets/locales first, then upload `sections/header-group.json` in a second operation, using the explicit theme ID and `--nodelete`. This avoids the schema/settings race and preserves required remote files such as `layout/theme.liquid` and `config/settings_schema.json`.

After syncing, verify homepage, real collection/product/content routes, editor reload, section hydration, search/account/cart, scroll restoration and actual merchant destinations. Confirm real fonts/image crops against Figma. Publishing is a separate action.

## GitHub review handoff

The user clarified delivery is GitHub only. Twelve PRs cover the planning branch and eleven implementation branches in dependency order. See the [Basecamp summary and PR links](basecamp-summary.md) and [review screenshots](../../pr-assets/menu-footer/README.md). The combined Shopify upload remains outside this handoff.
