---
title: Build a Figma PDP Certification Section
category: design-patterns
date: 2026-07-29
type: knowledge
tags:
  - shopify
  - liquid
  - figma
  - pdp
  - responsive-layout
  - image-assets
---

# Build a Figma PDP Certification Section

## Problem

The PDP redesign needed the "Beyond clean certification" section from the Ogee
PDP UI R5 Figma file implemented as a Shopify theme section. The desktop node
`11348:1388` shows a `1200px` wide section with a `516px` media image on the
left and certification copy on the right. The mobile node `11348:1809` removes
the media image entirely and renders only the headline, four certification seals,
and paragraph inside a `350px` frame.

The section needed to use the Figma-provided imagery while still behaving like a
theme component merchants can edit in the Shopify theme editor.

## Symptoms

- `templates/product.json` had no PDP body section for the certification module.
- The existing `story-split` section had overlapping certification content, but
  it is a homepage video/story module and does not match this PDP section's
  image-hidden mobile behavior or four-seal row.
- The Figma section combines raster imagery, transparent certification seals,
  exact typography values, and intentional desktop/mobile structural differences.
- A first visual approximation can easily over-size the heading because browser
  fallback fonts wrap differently than Chronicle Display.
- If a JSON template references a new section file, the section and its image
  assets must be present in the same upload artifact.

## What Didn't Work

### Reusing `story-split`

`story-split` solves a different layout: video media, CTAs, an optional NSF badge,
and a tablet stacking breakpoint for button safety. Reusing it here would either
add PDP-specific seal-strip behavior to a homepage module or fail to match the
mobile Figma design where the media image is absent.

### Treating screenshot scale as typography truth

The supplied screenshots are useful visual references, but the Figma metadata is
more reliable for typography. The desktop title is `32px` Chronicle Display Light
at `110%` line height, mobile title is `20px` at `150%`, desktop body is `16px`
at `150%`, and mobile body is `14px` at `150%`. Using visual estimation alone
made the headline too large and caused an incorrect three-line wrap.

### Depending on temporary Figma output

Figma connector image output is useful for inspection, but theme code should not
depend on temporary connector URLs. The production-safe pattern is to commit
stable fallback assets and expose `image_picker` overrides for Shopify-hosted
replacement images.

## Solution

Create a dedicated section:

- `sections/beyond-clean-certification.liquid`

Add the Figma-derived fallback assets:

- `assets/ogee-certification-media.png`
- `assets/ogee-certification-seals.png`

Place the section in the PDP template:

- `templates/product.json`

The section owns this composition:

- Desktop grid with `516px` media, `40px` gap, and `516px` content column inside
  a `1200px` content width.
- Mobile content-only layout with a `350px` outer frame and `310px` content.
- Beige background scoped to the centered frame rather than the full browser
  width, matching the Figma desktop and mobile artboards.
- Merchant-editable heading, paragraph, image-picker media, fallback asset
  filenames, alt text, colors, content width, and desktop/mobile padding.
- `newline_to_br` heading output so the intended Figma line break remains
  editable.
- Conditional `aria-labelledby` so clearing the heading does not leave a broken
  accessibility reference.
- Fallback image rendering with `asset_url`, and merchant-selected images with
  `image_url` / `image_tag` so Shopify focal points and responsive image delivery
  still work.

## Why This Works

The dedicated section keeps a highly art-directed PDP module isolated from shared
homepage/story components. It still follows Shopify theme conventions by exposing
editable settings and using Shopify's image filters when merchants select their
own media.

Using Figma node metadata for typography prevents false matches caused by visual
inspection at screenshot scale. In this section, matching the Figma text sizes
also solves the headline wrapping issue on desktop and mobile.

Committing the two fallback assets with the section and template satisfies the
Shopify upload contract: the JSON template references a section file that exists,
and the section references assets that exist in the same theme package.

## Prevention

- Inspect Figma node dimensions and text metadata before tuning CSS by eye.
- Treat Figma connector exports and clipboard captures as source material; commit
  stable theme assets or use Shopify `image_picker` settings for production.
- For PDP JSON-template changes, keep `templates/product.json`,
  `sections/*.liquid`, and every referenced `asset_url` fallback together.
- Validate the section and JSON template together with Shopify's validator.
- Browser-check desktop, tablet, and mobile, even when Figma only gives desktop
  and mobile frames.
- Make accessibility references conditional when merchant settings can remove the
  referenced element.
- Use a dedicated section when desktop and mobile intentionally render different
  structures, such as hiding media on mobile.

## Related Docs

- [Story split video section](2026-06-29-figma-story-split-video-section.md)
- [Template and section upload contract](../shopify-issues/2026-07-05-result-proof-template-section-upload-contract.md)
- [Art-directed Figma hero](2026-06-13-figma-art-directed-hero-slideshow.md)

## Reusable Insight

For Figma-to-Shopify PDP sections, use Figma as the geometry and typography
source, not just as a screenshot. A section can preserve exact art direction
while remaining merchant-editable by pairing committed fallback assets with
`image_picker` overrides and by keeping responsive structural differences local
to the section.

When a Figma module is simple visually but has different desktop/mobile
structure, a dedicated section is often safer than expanding a generic primitive.

## Compound Summary

Implemented a new PDP certification section from Figma desktop node `11348:1388`
and mobile node `11348:1809`. The build added a dedicated Liquid section,
Figma-derived fallback image assets, and PDP template placement before product
recommendations. Review found and fixed two issues: the schema name exceeded
Shopify's 25-character limit, and `aria-labelledby` could point to a missing
heading if a merchant cleared the heading text. Visual review also corrected the
initial typography approximation to match Figma metadata, then scoped the beige
background to the inner Figma frame after screenshot review showed it rendering
full-bleed. Verification included local JSON/schema parsing, `git diff --check`,
Shopify Liquid validator revision 5, and Playwright screenshots at desktop,
tablet, and mobile sizes.

Overlap classification: moderate. The existing story-split report covers a
certification-themed Figma section, but this PDP module uses static media,
certification seal imagery, and hidden mobile media. The upload-contract note is
related because this work also depends on keeping template, section, and assets
together. A new design-pattern report is warranted.
