---
title: Build a Figma Announcement Strip on Horizon Primitives
category: design-patterns
date: 2026-06-15
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - announcement-bar
  - accessibility
---

# Build a Figma Announcement Strip on Horizon Primitives

## Problem

The Ogee homepage redesign required a 44px announcement strip matching a Figma
component while remaining editable through Shopify's theme editor. The design
uses a black background, centered copy, and low-opacity arrow icons inside a
630px composition.

The theme already contained an announcement section, announcement theme block,
shared slideshow arrows, and a small custom-element runtime. The implementation
needed to reuse those primitives without adding a second carousel system.

## Symptoms

- The original section spacing made the strip taller than the 44px Figma frame.
- Shared text styles overrode `white-space`, causing long mobile announcements
  to wrap and consume two lines.
- Figma's 32px visible arrows were smaller than the required interactive target.
- Adding multiple blocks automatically enabled endless rotation without a
  visible pause control.
- Blank theme blocks could be omitted by Liquid while still being counted by
  section-level logic, leaving the wrong slide visible or unnecessary controls.
- Promotional copy was not consistent across sources. On June 15, 2026, the
  Figma frame showed free shipping at `$30+`, while the live Ogee storefront and
  cart showed `$75+`.

## What Didn't Work

### Treating arrows as proof of autoplay

The Figma component defines arrow placement but does not define automatic
rotation. Enabling autoplay from the presence of multiple blocks creates
continuous motion without a pause mechanism. Keep navigation manual unless a
visible pause/play control is designed and implemented.

### Counting rendered announcements from the section

Trying to inspect nested theme-block text from the parent section did not
produce reliable rendered counts in this Horizon `content_for 'blocks'`
workflow. The result suppressed the arrows and exposed every message to
assistive technology.

The component runtime already has authoritative references to the slides that
Liquid actually rendered. Use `this.refs.slides` for initialization and
one-slide control handling.

### Relying only on the source block index

`section.blocks` includes blank blocks, while `_announcement.liquid` omits blank
text. If the first configured block is blank, the first rendered slide can
inherit `aria-hidden="true"`. Reapply the current index after component refs are
initialized so the first rendered slide becomes visible.

### Using a 32px interaction target

The icon frame in Figma is 32px, but the control still needs a minimum 44px
interactive area. Preserve the smaller visible icon inside the larger button.

### Assuming promotional thresholds are design-only data

Shipping thresholds affect checkout expectations and customer trust. A Figma
value can represent a future campaign, while the live storefront reflects the
current offer. Do not silently reconcile the difference in code. Record the
conflict and require commercial approval before launch.

## Solution

Reuse the existing Horizon implementation:

- `sections/header-announcements.liquid`
- `blocks/_announcement.liquid`
- `snippets/slideshow-arrows.liquid`
- `assets/announcement-bar.js`
- `sections/header-group.json`

Match the Figma geometry:

- Set the strip and slider minimum height to 44px.
- Constrain the arrow composition to 630px.
- Constrain the desktop text lane to 566px.
- Render 20px arrow graphics at 70% opacity inside 44px buttons.
- Use the configured 14px, weight 300 typography with a 1.5 line height.
- Reserve 88px for controls on mobile and ellipsize the remaining single line.
- Add `min-width: 0` to the grid lane and slide so text can shrink correctly.

Preserve merchant control:

- Keep typography on each announcement block rather than overriding it in the
  section.
- Expose exact background and foreground color settings.
- Keep announcement links optional.

Keep motion accessible:

- Show previous and next controls for multiple rendered slides.
- Do not pass an `autoplay` attribute from the section.
- Keep `aria-live="polite"` for user-initiated message changes.
- Respect reduced motion if autoplay is introduced later.
- Add a visible pause/play control before enabling automatic rotation.

Harden the component lifecycle:

- Reapply `current` after refs initialize so rendered slides receive a single
  authoritative `aria-hidden` state.
- Hide both arrow buttons when fewer than two rendered slides exist.
- Guard zero-slide modulo calculations.
- Avoid duplicate intervals.
- Remove listeners and clear intervals in `disconnectedCallback`.
- Suspend on document hide and resume only when autoplay is both available and
  not deliberately paused.

## Why This Works

The section remains a normal Shopify header-group component, and merchants can
continue adding, removing, reordering, styling, and linking announcement blocks.
The implementation only specializes the presentation required by Figma.

Using rendered component refs for visibility avoids assumptions about which
theme blocks emitted markup. This is particularly important with
`content_for 'blocks'`, where a child block can decide to render nothing.

Separating the 44px touch target from the smaller visible icon preserves the
design while meeting keyboard and pointer usability requirements. Manual
navigation avoids introducing a new pause control that is absent from the
design.

## Prevention

- Treat Figma arrows as navigation geometry, not an autoplay requirement.
- Do not enable perpetual motion without a visible pause, stop, or hide control.
- Validate `aria-hidden` states from the rendered DOM, not only configured block
  order.
- Test zero, one, multiple, and blank-first block combinations.
- Use `min-width: 0` when ellipsis is expected inside grid or flex children.
- Inspect computed styles because later theme rules can override section CSS.
- Keep visible icons independent from minimum touch-target dimensions.
- Verify desktop, tablet, and mobile heights and horizontal overflow.
- Test real keyboard focus rather than only calling `.focus()`.
- Confirm promotional copy, thresholds, dates, links, and eligible products
  with the business owner immediately before launch.
- Record the date when comparing a redesign file with the live storefront.
- Validate section schema, generated header JSON, and Liquid with Theme Check.

## Related Docs

- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Announcement section](../../../sections/header-announcements.liquid)
- [Announcement block](../../../blocks/_announcement.liquid)
- [Announcement runtime](../../../assets/announcement-bar.js)
- [Figma announcement component](https://www.figma.com/design/7lVsU0OyhDBXpXaNCCWZFT/-Site-Redesign--Ogee-Homepage-High-Fidelity-Wireframe---Round-3?node-id=12002-4395)
- [Ogee live storefront](https://ogee.com/)

## Reusable Insight

For small Figma carousels in Shopify, reuse the theme's navigation and block
primitives, but let the rendered DOM determine slide state. Design files define
visual composition; they do not automatically authorize motion or production
promotional claims.

## Compound Summary

The Ogee announcement strip was implemented on Horizon's existing announcement
section, theme block, arrows, and runtime. It matches the 44px Figma frame,
preserves 44px controls, keeps long mobile copy to one ellipsized line, and
retains merchant typography and color controls. Review removed unpausable
autoplay and hardened rendered-slide initialization, empty-state handling,
listener cleanup, and interval safety. The remaining launch decision is
commercial: confirm whether the redesign's `$30+` shipping threshold should
replace the live storefront's `$75+` offer.
