---
title: Keep All Skincare Carousel CTAs Pointing To The All Skincare Collection
category: ui-bugs
date: 2026-07-13
type: bug
tags:
  - shopify
  - liquid
  - horizon
  - product-carousel
  - homepage
  - carousel
---

# Keep All Skincare Carousel CTAs Pointing To The All Skincare Collection

## Problem

The homepage `All Skincare` section was built as a tabbed, art-directed wrapper
around the shared carousel product card. Each tab represents a skincare
subcollection, but the visible section CTA says `All Skincare`.

The initial implementation let the CTA URL follow the active tab's
subcollection. That creates a contract mismatch: shoppers see an `All Skincare`
CTA while the link can route to `Advanced Anti-Aging`, `Timeless Beauty`,
`Targeted Radiance`, or `Age-Defying Essentials` instead of the all-skincare
collection.

The desktop background is white in the Figma treatment. That makes the color
contract part of the section: the desktop section instance and defaults should
stay on a white surface with dark text and neutral rules.

## Symptoms

- The section initializes `active_cta_url` from the first tab block when tabs
  exist.
- Tab buttons carry `data-tab-url` values derived from their subcollection
  when no explicit block link is provided.
- The custom element updates every section CTA from the active tab's dataset.
- The homepage template leaves each tab block `button_link` blank and sets the
  collection to a subcollection handle.
- The desktop section briefly defaulted to a black background, which mismatched
  the white Figma frame and made the module read as the wrong art direction.

## What Didn't Work

Reusing the tab block's collection URL as the CTA fallback conflates two jobs:
choosing which products appear in the rail and choosing where the global
section CTA goes.

That behavior is reasonable when each tab owns its own CTA label and target.
It is wrong for this Figma treatment because the CTA label is global:
`All Skincare`. A global label needs a global destination.

The desktop color pass briefly treated the dark screenshot preview as the
intended background. The higher-fidelity Figma reference shows the desktop
section on white, so tuning text for a black surface was the wrong fix.

## Solution

Keep the section CTA independent from tab state.

- Resolve a single section-level CTA URL from `section.settings.button_link`,
  then `collections.skincare.url`.
- Use tab block collection settings only for product sourcing and tab panels.
- Do not update section CTAs from `tab.dataset.tabUrl` when the CTA label is
  the global `All Skincare` label.
- If future designs need per-tab CTAs, require each tab to provide both a
  distinct label and link so label and destination remain aligned.
- Keep the desktop background white and configure text, muted text, and rule
  colors as dark neutral values on that surface.

## Why This Works

The tabbed product rail and the section CTA serve different user intents. Tabs
filter the visible products inside the section; the global CTA moves shoppers
to the broader skincare collection.

Keeping those responsibilities separate makes the Liquid easier to reason
about and keeps the front-end behavior honest. It also lets merchants keep
editing subcollection blocks without accidentally changing the meaning of the
global CTA.

The color fix keeps the art direction aligned with the Figma frame while
preserving readability. White section background, light product media tiles,
dark text, and neutral rules match the intended skincare carousel hierarchy.

## Prevention

- Treat carousel tab collection settings as product-source settings unless the
  design explicitly calls for per-tab navigation.
- When a CTA label names a broad collection, make the fallback URL match that
  broad collection.
- Avoid updating global CTAs from active-tab state unless both label and link
  come from the same active-tab contract.
- Verify the actual Figma frame background before wiring section color defaults
  into both the section schema and `templates/index.json`.
- Validate Shopify schema and Liquid after touching a section/template pair,
  then review the rendered interaction contract separately because schema
  validation will not catch misleading destinations.

## Related Docs

- [All Skincare carousel section](../../../sections/all-skincare-carousel.liquid)
- [Homepage template](../../../templates/index.json)
- [All Makeup carousel section pattern](../design-patterns/2026-07-13-all-makeup-carousel-section.md)
- [Product carousel shade preview contract](2026-06-28-product-carousel-shade-preview-contract.md)

## Reusable Insight

Tabbed homepage carousels have two independent contracts: product selection and
navigation. Product selection can follow the active tab. Navigation should only
follow the active tab when the visible CTA label also changes with that tab.

## Compound Summary

Review mode found no Shopify validation blockers for
`sections/all-skincare-carousel.liquid` or `templates/index.json`; the local
validator returned `VALID` for both files using cached Shopify schemas. A
follow-up fix pinned the global `All Skincare` CTA to the section-level
destination and removed active-tab CTA updates. A later correction restored the
desktop background to white and returned the desktop text, muted text, and rule
defaults to the dark neutral values shown in the Figma frame.
