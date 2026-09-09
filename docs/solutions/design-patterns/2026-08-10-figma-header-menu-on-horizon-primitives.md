---
title: Build a Figma Header Menu on Horizon Primitives
category: design-patterns
date: 2026-08-10
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - header
  - menu
  - logo
---

# Build a Figma Header Menu on Horizon Primitives

## Problem

The Ogee redesign required the global header to match a desktop Figma node while
continuing to use the existing Horizon header, menu, search, account, cart, and
drawer primitives. The Figma file supplied a specific image logo asset, but no
mobile frame dimensions were available.

The implementation needed to make the desktop header visually specific without
breaking Horizon's responsive drawer behavior or merchant-editable navigation.

## Symptoms

- Desktop header geometry needs a white 68px bar, 32px page-edge padding, a
  120px Ogee image logo, centered navigation, and 24px action icons.
- Desktop navigation needs 32px item gaps, 13px uppercase labels, and an active
  underline state.
- The header needs a 1px `#dfdfdf` bottom border.
- Search, account, and cart actions need to sit tightly in the right rail
  without locale selectors crowding the Figma composition.
- The dev theme can show Shopify's default `Home / Catalog / Contact` menu
  even when the header styling is otherwise correct.
- Mobile dimensions are not available, so mobile should preserve the existing
  Horizon drawer contract with only conservative logo/header sizing.
- Figma asset URLs expire, so the logo should be committed as a theme asset
  rather than fetched at runtime.

## What Didn't Work

### Treating the Figma logo as an external URL

Using the Figma MCP asset URL directly in Liquid would be brittle because those
URLs are temporary. Download the asset into `assets/` and reference it with
Shopify's `asset_url` filter.

### Applying 24px action controls globally

The desktop Figma actions are 24px, but applying those dimensions outside a
desktop media query shrinks mobile interaction targets. Keep the precise 24px
visual treatment to `min-width: 750px` and let mobile keep Horizon's existing
touch-friendly sizing.

### Replacing the header section wholesale

The existing Horizon header already owns sticky behavior, menu placement,
search, account, localization, and cart drawer integration. A separate header
section would duplicate those contracts and increase upload risk. Scope the
Figma styling to the existing header instead.

### Assuming the visible menu labels are CSS-only

The second screenshot showed `Home / Catalog / Contact` because the selected
Shopify menu was still the default development menu. Since store navigation is
admin-managed data, changing only `sections/header-group.json` cannot create
new menu items.

## Solution

Reuse the existing Horizon header and specialize it with a Figma-specific scope:

- Add `data-ogee-header-menu` to `sections/header.liquid`.
- Add scoped header variables and layout rules for the 68px desktop bar, 32px
  desktop padding, 24px action gaps, balanced center-menu rails, and the
  `#dfdfdf` divider.
- In `blocks/_header-menu.liquid`, scope desktop menu typography, 32px gaps,
  stretch alignment, active link weight, and the active underline to the Ogee
  header attribute.
- In `blocks/_header-menu.liquid`, render a narrow Ogee fallback menu only when
  the selected menu is still Shopify's default `Home|Catalog|Contact|` menu.
  The fallback labels are New, Bestsellers, All, Makeup, Skincare,
  Accessories, Bundles, Quizzes, and About.
- In `blocks/_header-logo.liquid`, use `assets/ogee-header-logo.png` as the
  fallback logo with Figma-derived 120px desktop and 96px mobile sizing.
- In `snippets/header-actions.liquid`, constrain the 24px account/cart action
  sizing to desktop/tablet media queries.
- In `snippets/search.liquid`, remove the right-column search margin inside the
  Ogee header scope.
- Update `sections/header-group.json` defaults so the header is full-width,
  centered, icon-only for actions, bordered, and not crowded by country/language
  selectors.

## Why This Works

The implementation keeps all behavior inside Horizon primitives. Navigation
still comes from Shopify menus when a real menu is configured, active state
still comes from `link.active`, search and cart drawer components keep their
existing scripts, and theme editor settings continue to drive the header group.
The fallback exists only for the default dev-menu state, so it does not prevent
a merchant-managed Ogee menu from taking over later.

The `data-ogee-header-menu` attribute provides a narrow cascade boundary. That
lets the Figma-specific desktop geometry override shared header defaults
without changing unrelated sections or component behavior.

The mobile treatment is intentionally conservative because no mobile Figma
dimensions were provided. It preserves the existing drawer/header structure and
only adjusts the fallback logo and header minimum height.

## Prevention

- Persist Figma image assets into Shopify `assets/` when the design-provided
  image must render in production.
- Check whether a mismatch is content data before treating it as styling.
  Shopify menu labels are store-admin data, not section JSON defaults.
- Scope brand-specific header styles behind a header attribute instead of
  broadly changing shared menu, search, account, or cart selectors.
- Keep desktop icon visual sizes separate from mobile touch target sizes.
- Use `link.active` for active menu styling instead of hardcoding a navigation
  label from a snapshot.
- Preserve existing header primitives unless the Figma structure requires new
  behavior.
- When mobile dimensions are missing, document the inference and keep mobile
  changes minimal.
- Validate generated group JSON after changing header defaults.

## Review Findings

The Compound review found and fixed one issue before finalization: the first
action icon sizing pass applied 24px controls at all breakpoints, which could
reduce mobile touch targets. The sizing rules now live inside a desktop/tablet
media query.

After screenshot comparison, the header rail was updated from 64px to the 68px
visible Figma frame and the default dev menu was given a scoped Ogee fallback.

No remaining blocking issues were found in the changed files. Residual risk is
visual: exact production parity still needs a live Shopify preview because this
environment does not have Shopify CLI or Theme Check available.

## Verification

- Parsed `sections/header-group.json` successfully after removing Shopify's
  generated-file comment.
- Parsed all Liquid `{% schema %}` JSON blocks in the changed Liquid files.
- Verified `assets/ogee-header-logo.png` exists at `1370x370`.
- Ran `git diff --check`; it reported no whitespace errors, only Windows
  line-ending normalization warnings.
- Attempted the local Shopify Liquid validator script twice. It could not run
  because `@shopify/theme-check-common` is missing from the local environment.
- Confirmed `shopify` and `theme-check` commands are not available on PATH.

Not verified locally:

- Browser preview against a Shopify dev server.
- Pixel-perfect desktop comparison in a rendered storefront.
- Mobile visual comparison, because no mobile Figma dimensions were provided.

## Related Docs

- [Build a Figma Announcement Strip on Horizon Primitives](./2026-06-15-figma-announcement-strip-on-horizon-primitives.md)
- [Build a Figma Footer as a Dedicated Shopify Section](./2026-07-05-figma-footer-on-dedicated-section.md)
- [Header section](../../../sections/header.liquid)
- [Header menu block](../../../blocks/_header-menu.liquid)
- [Header logo block](../../../blocks/_header-logo.liquid)
- [Figma desktop header node](https://www.figma.com/design/4zi20NmlimjxvrMANmylgj/-Site-Redesign--Ogee--Menu---footer-Dev?node-id=12644-2195)

## Reusable Insight

For Figma-driven global headers on Horizon themes, preserve the theme's header
section and component contracts, then create a narrow brand scope for visual
geometry. Commit volatile Figma assets into the theme, use Shopify menu state
for active styling, and protect mobile touch targets when desktop specs call
for small icon frames.

## Compound Summary

Documentation action: create

Reason: This header work captured a reusable pattern for implementing a
Figma-specific global menu on Horizon primitives, including the Figma asset
handling and the mobile touch-target review trap.

Saved to:
`docs/solutions/design-patterns/2026-08-10-figma-header-menu-on-horizon-primitives.md`
