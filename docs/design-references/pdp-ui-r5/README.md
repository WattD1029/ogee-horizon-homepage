# Ogee PDP UI R5 Figma-Verified Section Map

Figma node:

`https://www.figma.com/design/JmK3iquj6j0Z2W4Ofa1pKU/-Site-Redesign--Ogee-PDP-UI-R5?node-id=11348-1230`

Source node:

- Root section: `11348:1230`, `26Feb 2025`
- Desktop artboard: `11348:1231`, `PDP-UI`, `1920 x 9165`
- Mobile artboard: `11348:1662`, `PDP-UI`, `390 x 8705`

## Correction

The first map was a theme-based scaffold from the local `.fig` archive and was not reliable enough. This file is the corrected map from the live Figma node metadata.

## Basecamp Card Rule

Create one Basecamp card per numbered section below. Each card should include:

- Scope and acceptance criteria.
- Figma node IDs for desktop and mobile.
- Desktop image export path.
- Mobile image export path.
- Shopify theme target files.
- QA notes for desktop and mobile.
- Active development hours logged daily in the project tracking Excel sheet.

## Numbered Sections

| Card | Section | Desktop node | Mobile node | Image folder | Scope |
| --- | --- | --- | --- | --- | --- |
| 01 | Global header + announcement | `11348:1232` | `11348:1663` | `section-images/01-global-header-announcement` | Announcement bar and header/navigation. Global scope; only include in PDP branch if header changes are required. |
| 02 | Product buy section | `11348:1235` | `11348:1666` | `section-images/02-product-buy-section` | Gallery, product title, subtitle, rating, price, shade picker, subscription selector, ATC, mini trust bullets, pairs-well-with mini carousel, cert icons, accordions, press quote. |
| 03 | Complete the look upsell | `11348:1357` | `11348:1780` | `section-images/03-complete-the-look-upsell` | Multi-item upsell list/cards, subtotal/compare price area, section CTA. |
| 04 | Plant-derived ingredients | `11348:1376` | `11348:1797` | `section-images/04-plant-derived-ingredients` | Ingredient carousel with heading, supporting copy, ingredient cards, arrows/slider. |
| 05 | Beyond clean certification | `11348:1388` | `11348:1809` | `section-images/05-beyond-clean-certification` | Certification media plus copy, organic standard icons/seals. |
| 06 | Results stats | `11348:1398` | `11348:1817` | `section-images/06-results-stats` | Results heading, description, stat cards, carousel/slider behavior. |
| 07 | How to use | `11348:1413` | `11348:1828` | `section-images/07-how-to-use` | Media/video panel, play control, how-to heading and instructional copy. |
| 08 | FAQ | `11348:1420` | `11348:1834` | `section-images/08-faq` | FAQ accordion list and expanded mobile/desktop states. |
| 09 | Shop @ogee Instagram | `11348:1430` | `11348:1844` | `section-images/09-shop-ogee-instagram` | Instagram/UGC rail, heading, hashtag/subcopy, slider, optional mobile CTA. |
| 10 | Positive reviews quote | `11348:1444` | `11348:1852` | `section-images/10-positive-reviews-quote` | Reviews count strip and featured customer quote. |
| 11 | Full customer reviews widget | `11348:1451` + `11348:1452` child `11348:1453` | `11348:1859` | `section-images/11-full-customer-reviews-widget` | Full reviews summary, rating distribution, filters, customer review list, and show-more behavior. |
| 12 | Beauty picks recommendations | Inside `11348:1452` | `11348:1863` | `section-images/12-beauty-picks-recommendations` | "Beauty Picks Just for You" recommendations/media card area. Desktop is nested in the bottom `review` group. |
| 13 | Global footer + newsletter | Inside `11348:1452` | `11348:1866` | `section-images/13-global-footer-newsletter` | Newsletter and footer. Global scope; only include in PDP branch if footer changes are required. |

## Folder Contract

Each numbered folder contains:

- `desktop/`
- `mobile/`

Recommended export names:

- `desktop/default.png`
- `mobile/default.png`

For interactive states:

- `desktop/expanded.png`
- `mobile/expanded.png`
- `mobile/sticky-atc.png`

## Current Theme Fit

Current `templates/product.json` only has:

1. `product-information`
2. `product-recommendations`

The live Figma design is much broader. Implementation should be split into Basecamp cards from this verified list, with global header/footer cards treated separately from PDP body work.
