---
title: Build a Figma Footer as a Dedicated Shopify Section
category: design-patterns
date: 2026-07-05
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - footer
  - newsletter
  - accessibility
---

# Build a Figma Footer as a Dedicated Shopify Section

## Problem

The Ogee homepage redesign required a footer that matched separate desktop and
mobile Figma frames while remaining editable in Shopify's theme editor. The
design combines a newsletter signup band, four footer link columns, legal
links, social icons, and a mobile accordion layout.

The footer also lives in the theme `footer` group, so the implementation needed
to be stable as global site chrome rather than a page-only section.

## Symptoms

- Desktop needs a short newsletter band with copy on the left and an inline
  email form on the right.
- Mobile stacks the newsletter copy and form, then shows footer columns as
  closed accordions.
- Desktop utility content places copyright at the left and legal/social links
  at the right.
- Mobile utility content places legal links first, social icons second, and the
  copyright below them.
- The column content must be merchant-editable without requiring custom
  templates.
- The Figma typography is only reliable when the theme font settings are
  configured to the same licensed fonts.

## What Didn't Work

### Reusing the existing footer group shape

The generated `sections/footer-group.json` used the theme's default footer
composition. That provided generic primitives, but it did not map cleanly to the
Figma structure, especially the newsletter band and mobile accordion behavior.

### Hardcoding all links in the group JSON

Putting every footer item only in `footer-group.json` would match one snapshot
but leave merchants without a section schema for later edits. The footer needs
section settings and blocks so content, URLs, colors, legal links, and social
links can be maintained through the theme editor.

### Treating mobile ordering as a flex reversal problem

During review, a `display: contents` plus reversed flex approach would have
made the social icons appear above legal links on mobile. That matched the
structure poorly and was easy to miss in code review because all the elements
were present. Use explicit mobile `order` values for the utility groups instead.

### Forcing fonts inside the section

The section should inherit the theme's heading and body font variables. If the
Figma file uses fonts that are not currently configured in the theme, set them
through theme settings or licensed font assets rather than hardcoding a fallback
inside the footer.

## Solution

Create a dedicated footer section in
[`sections/ogee-footer.liquid`](../../../sections/ogee-footer.liquid) and mount
it from [`sections/footer-group.json`](../../../sections/footer-group.json).

The section contains:

- A Shopify `{% form 'customer' %}` newsletter signup with hidden newsletter
  tags, success messaging, and error messaging.
- A `link_column` local block type that can use either a Shopify `link_list`
  menu or six fallback label/URL settings.
- Desktop footer columns and mobile `<details>` accordions rendered from the
  same captured link markup.
- Footer utility settings for copyright, legal links, cookie preferences, and
  Facebook, Instagram, TikTok, and YouTube links.
- Component-scoped CSS in `{% stylesheet %}` with desktop and mobile layouts
  tuned to the provided Figma screenshots.
- A small `{% javascript %}` handler that opens Shopify customer privacy
  preferences when the cookie button is used.

The footer group JSON then supplies the Ogee defaults:

- "Get 10% Off Your First Order" newsletter copy.
- Discover, Support, Programme, and Contact columns.
- Terms, privacy, and cookie settings labels.
- Social URL placeholders matching the previous footer defaults.

## Why This Works

The dedicated section keeps the Figma-specific layout isolated from the shared
theme footer primitives while still using standard Shopify theme editor
concepts. Link columns are blocks, one-off design values are section settings,
and repeated markup is generated once per column then reused for desktop and
mobile.

The mobile utility layout is controlled by explicit ordering:

- Legal/social wrapper first.
- Legal links inside that wrapper above social icons.
- Copyright second.

That makes the DOM easy to read and keeps the screenshot order from depending
on fragile flex reversal behavior.

The section also keeps URLs escaped consistently and guards the cookie-click
handler against non-element event targets, which makes the global footer safer
as shared site chrome.

## Prevention

- For Figma footers with materially different desktop and mobile structures,
  build a dedicated section instead of stretching the default footer primitives.
- Use section blocks for editable link groups, and support a menu setting when a
  site already maintains navigation through Shopify menus.
- Check mobile order visually and in code. Presence of all elements is not
  enough; utility and legal content often changes sequence between breakpoints.
- Avoid `display: contents` when later flex ordering matters. It removes the box
  that would otherwise be the ordering target.
- Keep footer fonts tied to theme font variables unless the brand has approved
  local font assets.
- Escape URL settings before writing them to `href` attributes, even when the
  setting type is `url`.
- Validate both the Liquid section and the generated group JSON after every
  schema or content-default revision.

## Review Findings

The Compound review found no remaining blocking issues after implementation.

One mobile mismatch was found and fixed: the original utility layout risked
placing social icons before legal links on mobile. The fix replaced the reversal
approach with explicit mobile order rules.

Two hardening fixes were also applied:

- Legal and social `href` values now use `| escape`.
- The cookie-preferences click handler now checks that the event target can be
  treated as an element before calling `closest()`.

## Verification

- Shopify Liquid validator passed for `sections/ogee-footer.liquid` and
  `sections/footer-group.json` on revision 3.
- `sections/footer-group.json` parses successfully after removing Shopify's
  generated file comment.
- `git diff --check` reported no whitespace errors. Git only warned that
  `sections/footer-group.json` will be normalized from LF to CRLF when touched.
- A non-ASCII scan returned no matches for the changed footer files.

Not verified locally:

- `shopify theme check`, because the `shopify` command is not installed in this
  environment.
- Browser preview against a Shopify dev server, for the same reason.
- Exact font parity with Figma, because that depends on the theme's configured
  font settings or licensed font assets.

## Related Docs

- [Build an Art-Directed Figma Hero on Horizon Slideshow Primitives](./2026-06-13-figma-art-directed-hero-slideshow.md)
- [Build a Figma Announcement Strip on Horizon Primitives](./2026-06-15-figma-announcement-strip-on-horizon-primitives.md)

## Reusable Insight

When a Figma component is both global site chrome and merchant-editable content,
model it as a dedicated section with focused blocks. Preserve Shopify-native
editing surfaces, but do not force a brand-specific layout through generic
theme primitives when the responsive structure is substantially different.

## Compound Summary

Documentation action: create

Reason: This footer work established a reusable pattern for converting a
desktop/mobile Figma footer into a dedicated Shopify section, and the review
found a mobile ordering trap worth preserving.

Saved to:
`docs/solutions/design-patterns/2026-07-05-figma-footer-on-dedicated-section.md`
