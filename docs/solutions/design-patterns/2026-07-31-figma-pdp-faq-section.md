---
title: Build a Figma PDP FAQ as a Dedicated Shopify Section
category: design-patterns
date: 2026-07-31
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - product-page
  - faq
  - accordion
---

# Build a Figma PDP FAQ as a Dedicated Shopify Section

## Problem

The Ogee PDP redesign needed a FAQ section matching a desktop Figma node and
mobile screenshots while staying editable in Shopify. The target module is a
light full-width band with a centered FAQ list, a desktop `FAQ` heading, thin
light dividers, dark text, and mobile accordion behavior.

The product template already uses a custom `ogee-product-buy` section and keeps
the default `product-information` section disabled. The FAQ therefore needed to
be added as a sibling PDP section rather than another block inside the disabled
Horizon product information tree.

## Symptoms

- The existing generic `sections/section.liquid` FAQ preset can compose text
  plus shared accordion blocks, but it does not match the Ogee PDP visual
  treatment.
- The custom `sections/ogee-product-buy.liquid` already has product-detail
  accordions, but those are in-column product information disclosures, not a
  full-width FAQ band.
- The desktop Figma node uses a 1920px section with 64px vertical padding, a
  1200px content frame, a 32px serif heading, and six 72px rows.
- The mobile screenshot hides the heading and shows taller wrapped rows plus a
  bold expanded question and answer content.
- The FAQ content must remain merchant-editable without requiring template code
  changes for future question edits.

## What Didn't Work

### Reusing the generic FAQ preset

The generic FAQ preset is useful for default Horizon layouts, but matching the
Ogee screenshot through that preset would push art-directed PDP styling into
shared `accordion` and `_accordion-row` behavior. That risks changing other
accordion callers and still leaves the mobile heading treatment awkward.

### Extending `ogee-product-buy`

Adding the FAQ inside `ogee-product-buy` would couple a full-width PDP band to a
large product-purchase section that already owns media, variants, delivery,
trust copy, and product metadata accordions. Keeping FAQ separate preserves a
clean template order and avoids making the buy section even broader.

### Hardcoding the FAQ rows in Liquid only

Hardcoded Liquid would match one screenshot, but merchants would not be able to
edit questions, answers, or default open state from the theme editor. FAQ rows
need to be local section blocks.

## Solution

Create `sections/ogee-faq.liquid` as a dedicated, scoped PDP FAQ section and
mount it from `templates/product.json` immediately after `ogee_product_buy`.

The section includes:

- Section settings for heading, content width, desktop padding, mobile padding,
  background color, heading color, question color, answer color, and divider
  color.
- A local `faq_item` block with `question`, `answer`, and `open_by_default`
  settings.
- Semantic `<details>` and `<summary>` rows wrapped by the existing
  `accordion-custom-component` snippet for the theme's disclosure animation.
- Scoped `.ogee-faq` CSS for the Figma desktop frame: white background, 1200px content width,
  64px vertical padding, 32px Chronicle-style heading, 32px heading gap, 72px
  rows, and #dfdfdf dividers.
- Mobile CSS that hides the heading, uses 20px side gutters, increases the top
  padding to match the screenshot crop, supports two-line questions, and makes
  expanded questions bold.
- Accessibility hardening from review: if the heading is cleared, the section
  falls back to `aria-label="FAQ"`, and rows with empty questions do not render.

The product template supplies six default FAQ blocks with the placeholder copy
from the reference screenshots, all collapsed by default to match the desktop
Figma node. The expanded mobile state is styled for interaction or for any row
that a merchant marks as open by default.

## Why This Works

The section owns the art direction, while the theme's existing accordion custom
element continues to own disclosure animation. That keeps the new PDP FAQ
visually isolated under `.ogee-faq` without changing shared `accordion`,
`_accordion-row`, product buy accordions, footer accordions, or filter
accordions.

Local section blocks are the right editing surface: the number of rows, copy,
answer HTML, and default open state are merchant-managed, while the desktop and
mobile layout remains stable.

Mounting the section as a product-template sibling also matches the active PDP
architecture. The disabled `product-information` section remains untouched, and
the custom buy section does not absorb another responsibility.

## Prevention

- For Figma PDP bands with their own full-width rhythm, prefer a dedicated
  section over modifying product-buy or shared accordion primitives.
- Check which product section is actually active in `templates/product.json`
  before choosing a target. Disabled template sections should not receive new
  feature work.
- Use local section blocks when merchants need to edit repeated FAQ content.
- Keep art-directed accordion CSS under a section-specific parent class.
- Use the shared disclosure animation wrapper only when its generic behavior
  fits, and keep visual styling outside shared snippets.
- Review heading and blank-block accessibility states. `aria-labelledby` must
  point to a real node, and `<summary>` needs usable text.
- Validate both the new section and the JSON template together because template
  wiring and section schema issues often appear cross-file.

## Review Findings

Compound review found one implementation issue and fixed it before completion.

Medium: `sections/ogee-faq.liquid` initially always rendered
`aria-labelledby="{{ heading_id }}"`. If a merchant cleared the heading, the
section would reference a missing label. The fix conditionally renders
`aria-labelledby` only when a heading exists and otherwise uses
`aria-label="FAQ"`.

Low: Blank FAQ questions could render an accordion row with no usable summary
text. The fix skips rows whose question setting is blank.

No remaining blocking issues were found after the fixes. The main residual risk
is visual QA in a live Shopify preview because this local environment cannot
serve the theme through Shopify CLI.

## Verification

- Shopify Liquid validator passed in full-theme mode for
  `sections/ogee-faq.liquid` and `templates/product.json` on revision 2.
- `templates/product.json` parses successfully after stripping Shopify's
  generated file comment, includes `sections.ogee_faq`, and includes
  `ogee_faq` in template order.
- The `ogee-faq` section schema JSON parses successfully and exposes one
  `faq_item` block type with a 12-block maximum.
- `git diff --check` reported no whitespace errors. Git only warned that
  touched files will be normalized from LF to CRLF when Git rewrites them.
- `shopify theme check` could not run because the `shopify` CLI is not
  installed in this environment.

## Related Docs

- [Build a Figma Footer as a Dedicated Shopify Section](./2026-07-05-figma-footer-on-dedicated-section.md)
- [Build a Figma Collection Card Section for the Ogee Homepage](./2026-07-05-figma-collection-card-section.md)
- [Build Art-Directed Collection Carousels From Shared Product Cards](./2026-07-13-all-makeup-carousel-section.md)

## Reusable Insight

When a Figma module is a full-width product-page band with repeated editable
content, model the whole band as a focused section with local blocks. Reuse
shared behavior for generic mechanics such as disclosure animation, but keep
brand-specific spacing, colors, typography, and breakpoint decisions scoped to
the section.

## Compound Summary

Documentation action: create

Reason: This work established a reusable PDP pattern for converting a Figma FAQ
band into a merchant-editable, section-scoped Shopify accordion and captured a
reviewed accessibility guardrail for optional headings and blank FAQ rows.

Saved to:
`docs/solutions/design-patterns/2026-07-31-figma-pdp-faq-section.md`
