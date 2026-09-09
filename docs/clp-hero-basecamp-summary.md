# Basecamp Summary: CLP Hero

Completed the CLP intro hero implementation for the collection page and merged it into the main theme workflow.

## What Changed

- Added a dedicated `clp-intro` Shopify section for the collection landing page hero.
- Replaced the generic Horizon collection heading in `templates/collection.json` with the new CLP intro section.
- Matched the supplied Figma desktop and mobile typography:
  - 40px desktop heading
  - 28px mobile heading
  - 16px body copy
  - Chronicle Display / Helvetica Neue font stack
- Kept copy collection-backed by default:
  - heading uses `collection.title`
  - body uses `collection.description`
- Added merchant overrides for heading/body text and spacing.
- Added a guarded fallback description for the `all` collection so placeholder copy does not appear on unrelated collections.
- Wrote a compound implementation/review report and updated the compound changelog.

## Validation

- Shopify Liquid validation passed for `sections/clp-intro.liquid`.
- Shopify Liquid validation passed for `templates/collection.json`.
- Collection template body parsed successfully.
- Section schema JSON parsed successfully.
- Trailing whitespace check passed.

## Review Outcome

No outstanding issues remain from the compound review.

One review fix was made: fallback lorem copy is now limited to the `all` collection handle unless the merchant intentionally changes that setting.

## Task Distribution

Total work window: 3.5 hours.

| Task | Time |
| --- | ---: |
| Figma and current theme inspection | 0.45h |
| Implementation of scoped CLP intro section | 0.95h |
| Collection template wiring | 0.35h |
| Validation and schema checks | 0.45h |
| Compound review and fallback guard fix | 0.45h |
| Report, changelog, and Basecamp summary | 0.45h |
| Git push and merge workflow | 0.40h |

## Notes

- Shopify CLI preview was not available in the local workspace, so final pixel QA should be confirmed in a Shopify theme preview.
- Exact font fidelity depends on the storefront loading the licensed Chronicle Display and Helvetica Neue fonts.
