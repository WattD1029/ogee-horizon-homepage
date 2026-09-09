# Ogee menu plans and implementation

Status: all eleven remaining plans are implemented on separate local branches. Local Liquid/schema and browser checks passed. Final combined Shopify preview verification awaits explicit upload approval. See the [implementation report](implementation-report.md) for exact evidence and remaining checks.

The completed announcement bar and footer are excluded and unchanged. The original working checkout is preserved; implementation lives in the isolated `.tmp/menu-footer-work` worktree.

## Section coverage and branches

Branches are stacked in the order below. Each contains its prerequisites. `codex/menu-footer-mobile-menu` contains the combined implementation. [branches.json](branches.json) records commits, source nodes and stack bases.

| Area | Local branch | Plan |
| --- | --- | --- |
| header | `codex/menu-footer-header` | [header](header.md) |
| all-menu | `codex/menu-footer-all-menu` | [all-menu](all-menu.md) |
| makeup-menu | `codex/menu-footer-makeup-menu` | [makeup-menu](makeup-menu.md) |
| skincare-menu | `codex/menu-footer-skincare-menu` | [skincare-menu](skincare-menu.md) |
| accessories-menu | `codex/menu-footer-accessories-menu` | [accessories-menu](accessories-menu.md) |
| bundles-menu | `codex/menu-footer-bundles-menu` | [bundles-menu](bundles-menu.md) |
| new-menu | `codex/menu-footer-new-menu` | [new-menu](new-menu.md) |
| bestsellers-menu | `codex/menu-footer-bestsellers-menu` | [bestsellers-menu](bestsellers-menu.md) |
| quizzes-menu | `codex/menu-footer-quizzes-menu` | [quizzes-menu](quizzes-menu.md) |
| about-menu | `codex/menu-footer-about-menu` | [about-menu](about-menu.md) |
| mobile-menu | `codex/menu-footer-mobile-menu` | [mobile-menu](mobile-menu.md) |

## Source and provenance

The supplied `[Site Redesign] Ogee- Menu & footer-Dev.fig` export contains 1,796 decoded nodes and 70 embedded images. [source-inventory.json](source-inventory.json) preserves exact source references and dimensions. Real-node Figma design-context calls succeeded during implementation, despite an earlier metadata lookup at `0:1` failing. The selected nodes and differences are documented in the implementation report. Artwork annotations are design evidence, not extra user instructions.

## Shared implementation contract

- Header owns its existing shell and utilities. All-menu owns URL dispatch, shared product/promotion snippets and menu-item integration. Category/editorial panels consume this interface. Mobile-menu reuses the same settings through Horizon's drawer component.
- Native menu/resource data provides titles, URLs, prices and counts. Explicit URL mapping avoids translated-title dispatch; duplicate mappings fall back to native behavior.
- Focused `_header-menu` settings passed Shopify schema validation. New snippets include LiquidDoc and scoped stylesheet/JavaScript tags.
- The mandatory Shopify API learning step and changed-file validation were completed. Temporary tooling remains outside theme dependencies.
- Original design images are included as local theme assets. Preserve the completed announcement/footer and the existing 68px desktop header rail.

## Verification

Desktop at 1920px and mobile at 390px were checked, together with 320, 749, 750, 768, 1024 and 1440px widths. The report distinguishes actual unpublished-header measurements from local fixture measurements and lists remaining Shopify/editor checks. See it before treating this as ready to publish.
