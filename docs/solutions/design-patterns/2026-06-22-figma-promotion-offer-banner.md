---
title: Build a Responsive Figma Promotion Banner as a Shopify Section
category: design-patterns
date: 2026-06-22
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - responsive-design
  - playwright
---

# Build a Responsive Figma Promotion Banner as a Shopify Section

## Problem

The Ogee homepage redesign required a promotion banner with two distinct compositions. Desktop uses a cropped product image on the left, an editorial text group in the center, and a CTA on the right. Mobile stacks the image, copy, and CTA vertically. The banner must remain editable in Shopify's theme editor and route its CTA safely in development and production stores.

## Symptoms

- A three-column desktop grid can overflow tablet widths when its minimum tracks and horizontal padding exceed the viewport.
- A button label can be configured while the button silently disappears because no product, URL, or fallback handle resolves to an `href`.
- Activating the section in a JSON template with an empty image setting exposes a generic placeholder to shoppers.
- The store's default heading font can differ substantially from a Figma campaign's high-contrast serif.
- Wide editorial copy can wrap to three lines when the reference composition requires two.

## What Didn't Work

### Reusing the announcement bar

The shared announcement bar is designed for short rotating messages in the header. It does not support the image crop, editorial hierarchy, or desktop-to-mobile composition required by this campaign.

### Keeping the desktop grid active at tablet widths

The original breakpoint kept three columns active down to 990 pixels. The minimum column widths plus horizontal padding exceeded that space, creating a realistic horizontal overflow risk.

### Shipping a storefront placeholder

Theme-editor placeholders are useful while configuring a section, but a homepage template with an empty image picker should not show generic product artwork to customers. The placeholder should be limited to `request.design_mode`.

### Depending only on the global heading font

The development store's heading family was sans-serif, while the supplied design uses a high-contrast editorial serif. Using the global heading token produced a structurally correct but visibly inaccurate result.

## Solution

Create a dedicated `sections/ogee-promotion-offer-banner.liquid` section and add it to `templates/index.json` after the hero.

The section owns:

- Eyebrow, heading, subheading, and CTA settings.
- A merchant-selected decorative product image rendered with `image_url` and `image_tag`.
- Product-first CTA routing, followed by a custom URL and localized fallback product handle.
- Section-scoped color, height, image-size, and image-position CSS variables.
- A desktop three-column grid at 1200 pixels and wider.
- A stacked centered layout below 1200 pixels.
- An editor-only placeholder when no image has been selected.
- A campaign-specific serif fallback and constrained heading width to preserve the reference line breaks.

Set a real fallback product handle in the homepage JSON so the CTA remains visible and functional in the development store. Bundle the clean 440-by-440 transparent product-stack export as the default theme asset, render it at 220 pixels on desktop and 100 pixels on mobile, and retain the image picker as a merchant override.

## Why This Works

The dedicated section isolates campaign-specific composition from shared header and announcement behavior. Shopify settings keep the copy, CTA, media, colors, dimensions, and image crop merchant-editable without adding unnecessary blocks.

The 1200-pixel breakpoint is derived from the grid's actual minimum width and padding instead of a generic device label. Product-first routing preserves Shopify Markets and preview-store behavior, while the fallback handle keeps the CTA testable before the store resource is selected.

Restricting placeholders to design mode gives merchants a useful editor affordance without exposing provisional artwork to shoppers. Real browser screenshots at desktop and mobile widths verify the rendered typography, wrapping, height, and CTA alignment rather than relying on source inspection alone.

## Prevention

- Calculate grid minimum widths plus padding before choosing responsive breakpoints.
- Verify every configured CTA has a destination in the actual JSON template preset.
- Limit placeholder media to `request.design_mode` for sections activated on production templates.
- Treat Figma screenshots as references, not production assets.
- Use Shopify image pickers and responsive CDN variants for final artwork.
- Check campaign typography against the actual store font configuration, not only the theme variable name.
- Capture the isolated section at representative mobile and desktop viewports with Playwright.
- Inspect browser console errors and separate component failures from unrelated Shopify preview integrations.

## Related Docs

- [Build an Art-Directed Figma Hero on Horizon Slideshow Primitives](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Ogee promotion offer banner](../../../sections/ogee-promotion-offer-banner.liquid)
- [Homepage template](../../../templates/index.json)

## Reusable Insight

Responsive fidelity comes from modeling the composition change explicitly and selecting breakpoints from layout constraints. A clean desktop grid, a deliberate stacked mobile layout, valid CTA routing, and editor-only placeholders are more reliable than stretching one generic banner pattern across every viewport.

## Compound Summary

The promotion banner was implemented as a dedicated Shopify section, reviewed for routing and responsive failures, corrected to avoid tablet overflow, and verified in the real Shopify preview with Playwright screenshots at 2048 and 390 pixels wide. A clean transparent product-stack export is bundled as the default image at 220 pixels on desktop and 100 pixels on mobile, with a merchant image-picker override.
