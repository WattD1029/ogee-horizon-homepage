---
title: Build a Figma CLP Subcollection Navigation Section
category: design-patterns
date: 2026-08-03
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - collection-page
  - navigation
  - mobile-scroll
---

# Build a Figma CLP Subcollection Navigation Section

## Problem

The collection landing page redesign needed a compact subcollection navigation
row between the CLP intro and the product grid. The Figma desktop node shows a
single row of outlined category links with `16px` gaps, `32px` horizontal
padding, and uppercase Helvetica Neue Medium labels. The mobile node keeps the
same navigation but uses `8px` gaps, `16px` horizontal padding, `12px` vertical
padding, and horizontal overflow.

The theme already had a `collection-links` section, but that component is built
for spotlight/image collection linking and hover or scroll-driven selected
state. This CLP navigation needed normal page links with a current-page state
derived from the actual collection page.

## Symptoms

- `sections/collection-links.liquid` renders `_collection-link` blocks and can
  pair links with image slides.
- `assets/collection-links.js` changes selected state as users scroll or hover,
  which is useful for spotlight previews but wrong for page navigation.
- The CLP template already had `clp-intro` above `main-collection`, leaving a
  clean insertion point for navigation.
- The desktop and mobile Figma nodes disagree on one label: desktop uses
  `Bestseller`, while mobile uses `Bestsellers`.
- The mobile screenshot is intentionally scrollable, so the section must allow
  overflow instead of wrapping or shrinking labels.

## What Didn't Work

### Reusing `collection-links`

The existing component owns richer behavior than this design needs. It can
change `aria-current` while scrolling, select spotlight images, and dim links
on hover. A page-navigation row should not let scroll position change the
meaning of the active collection.

### Styling the main collection filters

The nav belongs above the product grid and routes to different collection
pages. The filter block inside `main-collection` controls facets and sort
state, so restyling it would couple category navigation to filtering behavior.

### Hardcoding a single label variant

The references use different desktop and mobile text for the bestseller link.
Hardcoding one value would miss one viewport. Duplicating the whole block would
create two links to the same destination and confuse keyboard users.

## Solution

Create a dedicated Shopify section:

- `sections/subcollection-navigation.liquid`

Wire it into:

- `templates/collection.json`

The section renders merchant-managed `link` blocks with:

- desktop label
- optional mobile label
- collection resource
- optional URL override

Resolve each link URL in this order:

1. block link override
2. selected collection URL
3. disabled visual item when neither exists

Set active state only when the block's collection resource matches the current
collection page:

- render `aria-current="page"` on that link
- style the current link with the active border color
- do not let JavaScript change active state

Match the Figma geometry:

- desktop gap `16px`
- desktop item padding `16px 32px`
- mobile gap `8px`
- mobile item padding `12px 16px`
- Helvetica Neue Medium, `13px`, `1.1` line-height, `1.3px` letter spacing
- inactive border `#dfdfdf`
- active border `#000000`
- text `#333333`

Use a tiny custom element only to reveal the current link inside an overflowing
horizontal scroller:

- find `[aria-current="page"]`
- if the list overflows, call `scrollIntoView({ block: 'nearest', inline:
  'center' })`
- leave active state untouched

The collection template instance adds seven blocks:

- All
- Bestseller / Bestsellers on mobile
- New
- Makeup
- Skincare
- Bundles
- Accessories

## Why This Works

The section matches the Figma composition while keeping the interaction model
simple: every visible item is a normal link to a collection page. Liquid owns
the current-page state because Liquid has access to the active `collection`
object.

Separating desktop and mobile label settings solves the one copy mismatch
without duplicating links or adding viewport-specific markup in the template.

Keeping the overflow as native horizontal scrolling avoids importing carousel
controls for a navigation row. The JavaScript enhancement is deliberately
small: it improves initial mobile positioning for deeper categories such as
Bundles and Accessories, but cannot change destinations or selected state.

## Prevention

- Do not reuse scroll-selected spotlight components for page navigation unless
  their selected-state behavior is disabled.
- Keep navigation active state tied to route/resource identity, not hover,
  scroll, or carousel state.
- When Figma has viewport-specific copy, add one optional viewport-specific
  label rather than duplicating links.
- Let mobile nav rows overflow horizontally when the design shows clipping.
- Validate both the section schema and the JSON template after adding a new
  section type.
- Review template placement so the nav belongs to the CLP hierarchy, not the
  filter/facet hierarchy.
- Verify active-page behavior with at least the first, middle, and last
  configured collections.

## Related Docs

- [Subcollection navigation section](../../../sections/subcollection-navigation.liquid)
- [Collection template](../../../templates/collection.json)
- [CLP intro section](../../../sections/clp-intro.liquid)
- [Collection card mobile scroll pattern](2026-07-05-figma-collection-card-section.md)
- [Skincare carousel navigation contract](../ui-bugs/2026-07-13-all-skincare-carousel-cta-contract.md)

## Reusable Insight

For Shopify collection page navigation, use a dedicated section when the design
is route-oriented. Reuse collection resource settings and simple links, but do
not inherit carousel or spotlight selected-state behavior that can decouple
visual active state from the current page.

## Compound Summary

The CLP subcollection navigation was implemented as a focused Shopify section
and inserted between `clp-intro` and `main-collection` in the collection
template. It matches the Figma desktop and mobile spacing, typography, border,
and overflow behavior; supports a mobile-specific label for the bestseller
copy mismatch; and keeps active state server-rendered from the current
collection. Review found no actionable implementation issues. Verification
passed with the Shopify Liquid validator for `sections/subcollection-navigation.liquid`
and `templates/collection.json`, section schema JSON parsing, collection
template JSON parsing, and `git diff --check`. The remaining launch dependency
is visual QA in a Shopify preview because the local Shopify CLI is not
available in this workspace.
