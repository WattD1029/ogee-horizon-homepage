---
title: Keep Result Proof Template and Section Files in the Same Upload
category: shopify-issues
date: 2026-07-05
type: bug
tags:
  - shopify
  - liquid
  - theme-upload
  - json-templates
  - result-proof
---

# Keep Result Proof Template and Section Files in the Same Upload

## Problem

Shopify rejected the homepage theme upload with:

`templates/index.json: Section type 'result-proof' does not refer to an existing section file`

The homepage JSON template contains a section entry with `"type": "result-proof"`.
For that template to upload, the same theme package must also include
`sections/result-proof.liquid`.

## Symptoms

- Shopify upload fails before the theme can be previewed or published.
- The error points at `templates/index.json`, even though the missing contract is
  the paired section file.
- The local feature branch contains `sections/result-proof.liquid`, but
  `origin/main` does not.
- Uploading from `main`, a partial ZIP, or a branch/package that includes the
  template without the section produces the same failure.

## What Didn't Work

### Checking only the template JSON

The template JSON can be valid JSON and still fail Shopify upload if the
referenced section file is absent from the uploaded package.

### Treating assets as separate from section readiness

The result-proof section now references bundled fallback images:

- `assets/result-proof-week-1.png`
- `assets/result-proof-week-12.png`

Those assets need to be committed and uploaded with the section, or the section
can validate but still render broken images.

### Uploading from a branch that is not the feature branch

`origin/main` was checked and did not contain `sections/result-proof.liquid`.
The result-proof work lives on `codex/result-proof-section`, so the upload needs
to come from that branch or after that branch is merged.

## Solution

Keep these files together in the same commit and upload artifact:

- `templates/index.json`
- `sections/result-proof.liquid`
- `assets/result-proof-week-1.png`
- `assets/result-proof-week-12.png`
- `assets/result-proof-before-after.png`
- `assets/comparison-slider.js`
- `assets/icon-double-chevron.svg`

The fix path is:

1. Fetch and merge latest `origin/main` into `codex/result-proof-section`.
2. Keep `templates/index.json` referencing `"type": "result-proof"`.
3. Ensure `sections/result-proof.liquid` is tracked and staged.
4. Stage the two new result-proof fallback image assets.
5. Validate `sections/result-proof.liquid` and `templates/index.json`.
6. Commit and push the feature branch.
7. Upload from the pushed feature branch, or merge the branch before uploading
   from `main`.

## Why This Works

Shopify resolves JSON template section types by filename. A section entry with
`"type": "result-proof"` maps to `sections/result-proof.liquid`. When both are
present in the same upload package, the template can resolve the section and the
upload contract is satisfied.

The fallback image assets are not part of that specific Shopify schema error,
but they are part of the runtime contract for the section. Tracking them in the
same change prevents a second pass where the upload succeeds but the slider
renders missing image URLs.

## Prevention

- Before uploading a JSON-template change, grep every custom section type and
  confirm a matching file exists under `sections/`.
- Before committing a section that references theme assets through `asset_url`,
  confirm those assets are tracked by git.
- Do not upload a partial ZIP after copying only `templates/index.json`.
- Treat template, section, runtime JavaScript, inline SVG dependencies, and
  theme image assets as one upload unit.
- Run the Shopify Liquid validator against the section and template together.

## Related Docs

- [Result proof section](../../../sections/result-proof.liquid)
- [Homepage template](../../../templates/index.json)
- [Two-image result proof fallback note](../design-patterns/2026-06-29-result-proof-section-composite-fallback.md)

## Reusable Insight

For Shopify JSON templates, a valid section reference is a package-level
contract, not just a file-level schema check. If a template references a custom
section, the matching `sections/*.liquid` file and any assets used by that
section must be present in the same upload artifact.

## Compound Summary

The upload failure was traced to a branch/package mismatch: the feature branch
contains `sections/result-proof.liquid`, while `origin/main` does not. The
current result-proof branch has been updated from latest `main`, and the
remaining work is to commit and push the section, template, documentation, and
new fallback image assets together so Shopify receives a complete theme
package.
