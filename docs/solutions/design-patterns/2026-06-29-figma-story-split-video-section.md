---
title: Build a Figma Story Split Video Section
category: design-patterns
date: 2026-06-29
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - video
  - responsive-layout
  - native-controls
---

# Build a Figma Story Split Video Section

## Problem

The Ogee homepage redesign needed a "story split" section from Figma with a
desktop two-panel layout and a mobile stacked layout. The section combines a
user-controlled video, editorial copy, an NSF certification badge, and two CTAs
for the story and ingredients destinations. The media title remains optional in
the section, but the homepage placement clears it so the video is not covered by
the "Beyond Clean Beauty" text from the reference.

The design needed to stay merchant-editable through the Shopify theme editor
without modifying broad Horizon primitives. The first implementation kept the
section unplaced until requested; the follow-up added it to the homepage with the
provided local MP4 copied into theme assets for preview.

## Symptoms

- Desktop and mobile have different visual order: desktop shows copy left and
  media right, while mobile shows media first.
- The media title needs to be optional because this homepage placement should
  show only the video.
- The NSF badge is centered below copy on desktop but sits beside paragraph
  text on mobile.
- The two equal CTAs can overflow a 50/50 desktop panel at tablet widths if the
  split layout starts too early.
- Native video controls need pointer access, so overlays must not intercept
  clicks or taps.
- Figma MCP asset URLs are temporary and cannot be used as production media; a
  local MP4 can be committed as a theme asset only when it is intentionally part
  of the theme.
- The repository had no `docs/changelog.md` and no installed Shopify CLI, so
  planning and verification had to use local solution notes and the Shopify
  Liquid validator script.

## What Didn't Work

### Reusing `media-with-content`

The existing `media-with-content` section handles generic split content, but the
Figma composition has custom media-title overlay behavior, video poster handling,
the NSF badge layout, and two fixed CTAs. Bending the generic section would add
campaign-specific assumptions to a shared primitive.

### Shipping temporary Figma media

The Figma node returned temporary asset URLs. Those are useful as visual
references but expire and should not be committed or used in Liquid. The final
section supports Shopify `video` media for merchant-managed content, and also
accepts a theme asset filename for this preview build.

### Starting the split at the standard mobile breakpoint

At widths just above 749px, each half of a 50/50 split is too narrow for the
80px desktop padding plus two 200px CTA buttons. The layout needs a tablet
stacking range before desktop split behavior begins.

## Solution

Create a dedicated section:

- `sections/story-split.liquid`

The section owns the complete composition:

- Shopify `video` setting or a theme asset filename for the video source.
- Desktop and mobile poster image settings, falling back to the video's preview
  image when available.
- Optional media title, headline, body copy, NSF badge image and alt text.
- Two editable CTA labels and URL settings.
- Desktop height, mobile media height, color scheme, custom colors, and overlay
  color.

Render the media before the content in markup so mobile visual order and source
order match. On desktop, use CSS ordering to place copy left and media right.

Use section-scoped CSS variables for single-property merchant settings such as
height and color. Keep structural differences in responsive CSS:

- Desktop split: two equal columns above 1099px.
- Tablet stack: media first and centered copy, preventing CTA overflow.
- Mobile stack: media first, left-aligned copy, paragraph plus badge row, and
  equal-width buttons.

Treat the video as user-controlled media:

- Render it with native controls, `loop`, `playsinline`, and
  `preload="metadata"`.
- Do not set `muted`, so audio is available when the shopper starts playback.
- Avoid autoplay JavaScript; pressing play starts the browser-controlled loop.
- Keep any overlay non-interactive with `pointer-events: none`.

Keep accessibility guardrails:

- The visible media title is an `h2` by default.
- If the media title is removed, the body headline becomes the `h2`.
- The video receives an accessible label and keeps native controls available.
- Poster imagery is decorative with empty alt text.
- The certification badge receives merchant-editable alt text.
- Disabled placeholder links follow the local Horizon button pattern with
  `role="link"` and `aria-disabled="true"`.

## Why This Works

The dedicated section isolates a highly specific Figma composition while still
using Shopify's native media settings, image CDN filters, and section schema.
It avoids changing shared Horizon primitives, and the homepage template can
place it with placeholder-safe settings while final video, poster, badge, and
URL choices remain merchant-editable.

The tablet stacking breakpoint handles the awkward range between mobile and
desktop, where a literal 50/50 split would pass validation but produce cramped
or overflowing CTAs. This catches a responsive problem that a desktop and mobile
Figma pair alone does not reveal.

Using native controls also removes the need for a custom playback controller.
That matches the final requirement more closely: shoppers can pause or play, the
video is not muted by the theme, and loop behavior starts once playback begins.

## Prevention

- Inspect desktop, tablet, and mobile widths even when Figma only provides two
  frames.
- Do not push a 50/50 split down to tablet widths without checking button,
  padding, and headline fit.
- Keep Figma-specific story compositions in dedicated sections unless a shared
  primitive already matches the behavior.
- Use Shopify `video` and `image_picker` settings instead of temporary Figma
  asset URLs.
- Use native controls for user-controlled video instead of autoplay JavaScript.
- Ensure overlays do not block browser video controls.
- Keep media wrappers explicitly full-size so video visibility does not depend
  on intrinsic media height.
- Include a semantic heading fallback when merchants can clear the primary
  media title.
- Validate the section schema and Liquid after each structural change.
- Verify real Shopify preview rendering before placing the section into the
  homepage template, or place it with placeholder-safe media settings when
  preview access is the immediate goal.

## Related Docs

- [Story split section](../../../sections/story-split.liquid)
- [Homepage template placement](../../../templates/index.json)
- [Figma art-directed hero slideshow](2026-06-13-figma-art-directed-hero-slideshow.md)
- [Figma announcement strip](2026-06-15-figma-announcement-strip-on-horizon-primitives.md)

## Reusable Insight

When translating a Figma desktop/mobile pair into a Shopify section, design the
missing tablet behavior explicitly. The "in between" viewport is often where
fixed CTA widths, generous desktop padding, and split panels collide.

For video sections, decide early whether the media is decorative or
user-controlled. Decorative video needs autoplay guardrails; user-controlled
video should lean on native controls, clear labels, and simple loop attributes.

## Compound Summary

The story split was implemented as a new, self-contained Shopify section with
editable video, poster, copy, NSF badge, two CTAs, responsive heights, and color
settings. A review pass added tablet stacking to prevent CTA overflow and a
semantic heading fallback for merchants who remove the media title. A follow-up
placed the section in `templates/index.json` between the hero and product
carousel, copied the provided MP4 into `assets/ogee-storefront-explanation.mp4`,
cleared the homepage media title, and switched playback to native controls with
loop enabled. The section/template pair passed the Shopify Liquid validator as
`story-split-native-video` revision 1.

Overlap with the existing hero video solution is moderate: both support video in
homepage storytelling, but this section is not a carousel and its final playback
behavior is native and user-controlled. A new design-pattern note is more useful
than expanding the older slideshow-specific documentation.
