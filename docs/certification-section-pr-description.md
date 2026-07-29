## Summary

Adds the PDP "Beyond clean certification" section from the Ogee PDP UI R5 Figma desktop and mobile references.

The section introduces a dedicated Shopify theme section with Figma-derived fallback media, a responsive certification seal strip, merchant-editable content/settings, and PDP template placement before product recommendations.

## What Changed

- Added `sections/beyond-clean-certification.liquid`.
- Added bundled Figma-derived fallback assets:
  - `assets/ogee-certification-media.png`
  - `assets/ogee-certification-seals.png`
- Wired the section into `templates/product.json` before product recommendations.
- Scoped the beige background to the centered Figma panel:
  - Desktop panel: `1200px`
  - Mobile panel: `350px`
- Matched Figma typography metadata for heading and body copy.
- Hid the media image on mobile to match the Figma mobile node.
- Added `.shopifyignore` wildcard directory patterns to remove Shopify CLI warnings.
- Added compound implementation notes to `docs/changelog.md`.
- Added reusable implementation report:
  - `docs/solutions/design-patterns/2026-07-29-figma-pdp-certification-section.md`

## Task Breakdown

Total active implementation duration: **6 hours**

| Task | Duration |
| --- | ---: |
| Figma node review, desktop/mobile geometry mapping, and asset extraction | 1.00h |
| Shopify section implementation, schema settings, fallback image handling, and PDP template wiring | 1.50h |
| Responsive layout and styling for desktop/tablet/mobile certification panels | 1.25h |
| Visual QA against supplied screenshots, including beige panel width correction | 0.75h |
| Shopify Liquid validation, JSON/schema checks, and screenshot verification | 0.75h |
| PR/Basecamp documentation and final branch hygiene | 0.75h |

## Visuals

### Desktop

![Desktop certification section](pr-assets/certification-section/desktop.png)

### Tablet

![Tablet certification section](pr-assets/certification-section/tablet.png)

### Mobile

![Mobile certification section](pr-assets/certification-section/mobile.png)

## Theme Editor Controls

The section can be edited in Shopify Theme Editor.

- Heading and paragraph copy
- Main media image override
- Certification seals image override
- Fallback asset filenames
- Media and seal alt text
- Desktop content width
- Desktop and mobile padding
- Background, heading, and body text colors

## Testing

- Parsed `templates/product.json` with JSON comment handling.
- Parsed the section schema JSON from `sections/beyond-clean-certification.liquid`.
- Ran `git diff --check` successfully.
- Ran Shopify Liquid validator revision 5 successfully for:
  - `sections/beyond-clean-certification.liquid`
  - `templates/product.json`
- Captured desktop, tablet, and mobile Playwright screenshots.

## Notes

- The `learn_shopify_api` helper required by repo instructions was not exposed in the active Codex tool session, so validation used the available Shopify Liquid validator path.
- `shopify theme dev` could not be rerun from Codex because Shopify CLI is not installed on this shell's PATH. The CLI warning source was still fixed directly in `.shopifyignore`.
