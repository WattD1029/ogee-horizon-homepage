---
title: Build a PDP Positive Reviews Section From Product Metafields
category: design-patterns
date: 2026-08-01
type: knowledge
tags:
  - shopify
  - liquid
  - figma
  - pdp
  - metafields
  - reviews
---

# Build a PDP Positive Reviews Section From Product Metafields

## Problem

The Ogee PDP redesign needed a compact positive reviews section matching
desktop and mobile Figma frames while keeping review content easy to edit in
Shopify Admin. The section belongs on the product template, after the active
`ogee-product-buy` section and before product recommendations.

The desktop Figma node shows a metric and label on the left, then a beige
testimonial panel on the right. The mobile node stacks the metric, label, quote,
and author in one centered column. The user supplied screenshots as visual
references, and the Figma node added the full content model: `30,000+`,
`Positive reviews`, the review quote, and the attribution.

## Symptoms

- Hardcoded testimonial text would match the screenshot but would not be
  maintainable from Shopify Admin.
- A theme-editor-only section setting would be global to the template and would
  not support product-specific review content.
- A JSON template section reference must have a matching
  `sections/positive-reviews.liquid` file in the same upload package.
- Products without the new metafields still need a reviewable fallback state in
  theme preview.

## What Didn't Work

### Folding the quote into `ogee-product-buy`

`ogee-product-buy` already contains purchase, media, variant, trust, accordion,
and press-quote responsibilities. Adding the Figma positive reviews layout there
would make the buy box broader and harder to maintain.

### Reusing the homepage social proof section

The existing `social-proof` section is a carousel-like image rail. The PDP
positive reviews design is a static metric plus testimonial panel, so reusing
that section would bring along unrelated media and scroll behavior.

### Theme settings as the primary data model

Theme settings are useful fallbacks, but they are template-wide. Product
metafields are the right primary data source because the review metric, quote,
and author can vary by product while staying editable from Admin.

### Creating metafields in Liquid

Shopify documentation confirms Liquid can read metafields but cannot create
them. The metafield definitions and values need to exist in Shopify Admin or be
created through Admin/API tooling before Liquid can render product-specific
content.

## Solution

Create a dedicated section:

- `sections/positive-reviews.liquid`

Wire it into the product JSON template:

- `templates/product.json`

The section reads product metafields first:

- `product.metafields.custom.positive_reviews_metric.value`
- `product.metafields.custom.positive_reviews_label.value`
- `product.metafields.custom.positive_review_quote.value`
- `product.metafields.custom.positive_review_author.value`

If a metafield is blank, the section falls back to theme-editor settings:

- Metric fallback
- Label fallback
- Quote fallback
- Author fallback

The section suppresses itself only when all metafield and fallback values are
blank. This keeps fresh previews useful while letting merchants fully remove the
module by clearing all fallback content and product metafields.

The layout maps Figma to Shopify Liquid and CSS:

- Desktop: centered 1200px content width, 64px vertical padding, 80px gap,
  350px metric summary, and a flexible beige quote panel.
- Tablet: stack the summary and quote panel to avoid a cramped intermediate
  layout.
- Mobile: 20px side padding, 40px vertical padding, 24px gap, 32px metric,
  12px uppercase label, 14px quote text, and 16px card padding.

Use CSS variables for merchant-controlled single-property settings: width,
padding, label color, card background, and card text color.

Use semantic HTML:

- The label is an `h2` and the section uses `aria-labelledby` when that label
  exists.
- The testimonial uses `figure`, `blockquote`, and `figcaption`.
- Quote text is escaped before `newline_to_br` so multiline metafield values
  can render without allowing raw markup.

## Metafield Setup

Create Product metafield definitions in Shopify Admin or via Admin API:

| Namespace | Key | Type | Name |
| --- | --- | --- | --- |
| `custom` | `positive_reviews_metric` | `single_line_text_field` | Positive reviews metric |
| `custom` | `positive_reviews_label` | `single_line_text_field` | Positive reviews label |
| `custom` | `positive_review_quote` | `multi_line_text_field` | Positive review quote |
| `custom` | `positive_review_author` | `single_line_text_field` | Positive review author |

For storefront rendering, allow storefront/theme read access on these
definitions when configuring custom data.

Write values with `metafieldsSet` when managing data through the Admin API:

```graphql
mutation SetPositiveReviewMetafields($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      namespace
      key
      value
    }
    userErrors {
      field
      message
    }
  }
}
```

Example variables:

```json
{
  "metafields": [
    {
      "ownerId": "gid://shopify/Product/1234",
      "namespace": "custom",
      "key": "positive_reviews_metric",
      "type": "single_line_text_field",
      "value": "30,000+"
    },
    {
      "ownerId": "gid://shopify/Product/1234",
      "namespace": "custom",
      "key": "positive_reviews_label",
      "type": "single_line_text_field",
      "value": "Positive reviews"
    },
    {
      "ownerId": "gid://shopify/Product/1234",
      "namespace": "custom",
      "key": "positive_review_quote",
      "type": "multi_line_text_field",
      "value": "\"It evens out my skin tone and is so lightweight I forget I'm even wearing it. It stayed on all day.\""
    },
    {
      "ownerId": "gid://shopify/Product/1234",
      "namespace": "custom",
      "key": "positive_review_author",
      "type": "single_line_text_field",
      "value": "Katie F."
    }
  ]
}
```

Read values in Liquid through the product object:

```liquid
{{ product.metafields.custom.positive_reviews_metric.value }}
{{ product.metafields.custom.positive_reviews_label.value }}
{{ product.metafields.custom.positive_review_quote.value }}
{{ product.metafields.custom.positive_review_author.value }}
```

## Why This Works

The section boundary matches the design boundary. The module is not part of the
buy form and does not need carousel behavior, media assets, JavaScript, blocks,
or snippets.

Product metafields make the content product-specific and Admin-editable. Section
settings keep a safe preview and fallback path for products that have not been
enriched yet.

The JSON template change stays paired with the new section file, preserving the
Shopify upload contract that custom section types must resolve to a file in
`sections/`.

The responsive CSS follows the Figma node while keeping text robust: metric and
author values can wrap instead of overflowing if a merchant enters longer copy.

## Compound Review

No blocking implementation issues were found.

Reviewed guardrails:

- Section type `positive-reviews` has a matching
  `sections/positive-reviews.liquid` file.
- Product metafield reads are guarded by product presence and section
  fallbacks.
- User-entered quote, author, metric, and label text are escaped.
- Multiline quote values preserve line breaks with `newline_to_br`.
- The section does not render an empty shell when all values are blank.
- No JavaScript or external assets were introduced.

Residual risks:

- A real Shopify theme preview was not run, so final pixel tuning should be
  checked in desktop, tablet, and mobile storefront previews.
- Metafield definitions and values still need to be created in the store before
  product-specific content overrides the fallback copy.
- The required `learn_shopify_api` tool from `AGENTS.md` was not callable in
  this environment after tool discovery, so Shopify docs search and validator
  tooling were used instead.

## Verification

- Shopify Liquid docs search was run before coding and confirmed Liquid reads
  metafields but cannot create them.
- Figma `get_design_context` was run for desktop node `11348:1444` and mobile
  node `11348:1852`.
- Shopify Liquid validator passed:
  - `sections/positive-reviews.liquid`
  - `templates/product.json`
- `templates/product.json` parsed successfully after stripping the generated
  comment header.
- `git diff --check` completed with no whitespace errors. Git reported only
  existing line-ending normalization warnings for touched text files.

## Prevention

- For PDP proof modules, choose product metafields over template-wide settings
  when content can differ per product.
- Keep section settings as fallbacks so theme preview and incomplete product
  data remain nonblank.
- Document the metafield namespace, keys, and types inside the solution report
  so Admin setup does not drift from Liquid reads.
- Validate the new section and JSON template together.
- Add the new section file and template reference in the same commit/upload.
- Use semantic `figure` and `blockquote` markup for standalone testimonial
  content.
- Escape metafield text before rendering line breaks.
- Add tablet behavior even when Figma supplies only desktop and mobile frames.

## Related Docs

- [Positive reviews section](../../../sections/positive-reviews.liquid)
- [Product template](../../../templates/product.json)
- [Ogee product buy section](../../../sections/ogee-product-buy.liquid)
- [Figma social proof carousel section](2026-06-29-figma-social-proof-carousel-section.md)
- [Result proof section with slider fallback](2026-06-29-result-proof-section-composite-fallback.md)
- [Template section upload contract](../shopify-issues/2026-07-05-result-proof-template-section-upload-contract.md)

## Reusable Insight

For Shopify PDP proof content, separate the presentation module from the buy
box and let product metafields own product-specific copy. A small dedicated
section with section fallbacks is easier to preview, validate, and reuse than a
larger product-buy edit or a repurposed homepage proof section.

## Compound Summary

The PDP now has a dedicated positive reviews section placed after
`ogee-product-buy`. It renders the Figma metric, label, quote, and author from
product metafields when available and from section fallbacks otherwise. The
implementation uses only Liquid, HTML, and section-scoped CSS, validates with
the Shopify Liquid validator, and documents the Admin metafield definition,
write, and read contract for launch setup.
