---
title: Build an Art-Directed Figma Hero on Horizon Slideshow Primitives
category: design-patterns
date: 2026-06-13
type: knowledge
tags:
  - shopify
  - liquid
  - horizon
  - figma
  - slideshow
  - responsive-images
  - video
  - reduced-motion
---

# Build an Art-Directed Figma Hero on Horizon Slideshow Primitives

## Problem

The Ogee homepage redesign required a responsive hero carousel whose desktop and
mobile layouts use different copy placement, image crops, and navigation styles.
Each slide combines two transparent image layers: a model image and a product
image. The section also needs to remain editable through Shopify's theme editor.

The existing Horizon `hero` section supports static media compositions, while
the existing `slideshow` section supports carousel behavior but only one
background media item per standard slide.

The carousel later needed a Shopify-hosted video slide with the same editable
copy and CTA model. The video had to play only while selected, loop muted,
respect reduced-motion preferences, omit visible native or custom playback
controls, and keep the original image slide as the initial LCP candidate.

## Symptoms

- A single background image cannot preserve the independent model and product
  positions from Figma.
- Desktop uses numbered navigation while mobile uses segmented progress lines.
- The mobile layout hides the description and places copy above the imagery.
- Global theme typography and button radius do not exactly match the Figma file.
- Editing the shared `_slide` block would affect every standard slideshow.
- A video that plays outside its selected slide wastes bandwidth and creates
  motion the visitor cannot see.
- Removing native video controls means playback must be treated as decorative
  campaign motion and reduced-motion visitors must receive the poster instead.

## What Didn't Work

### Extending the shared slide block

Adding Ogee-specific fields and CSS to `blocks/_slide.liquid` would broaden a
shared component for one homepage design and create regression risk for existing
slideshows.

### Using the static hero section

`sections/hero.liquid` handles multiple media slots and mobile art direction,
but it does not provide the required multi-slide navigation and swipe behavior.

### Treating a flattened image as the primary component model

Flattening copy and imagery into one asset would reduce accessibility, prevent
merchant editing, and produce poor responsive text and image loading behavior.
It can be used as a temporary campaign fallback when clean source layers are
unavailable, but only with separate desktop and mobile artwork, equivalent
semantic copy, an accessible CTA, and explicit aspect-ratio constraints.

### Setting both percentage width and height

The Figma export reports percentage bounds at a specific frame size. Applying
both values directly to an image can distort it at other aspect ratios. Scale
the transparent cutout by height, keep `width: auto`, and position it from its
center so the source aspect ratio is preserved.

### Making the whole campaign image clickable

A full-slide anchor makes decorative artwork outside the visible CTA behave like
a button. That creates an unexpectedly large interaction target and does not
match the campaign design.

### Hardcoding the production domain

An absolute production URL sends theme-preview visitors away from the current
store and can bypass localized Shopify Markets routing. A product picker is the
preferred destination. When a preview store does not contain the product, store
only the product handle and build the fallback from `routes.root_url`.

### Treating video autoplay as a one-time attribute

An `autoplay` attribute cannot express slideshow selection, hidden-tab state,
reduced-motion preferences, or autoplay rejection. Playback needs a small
controller tied to the carousel's selection event.

### Loading the MP4 from the theme repository

Committing campaign MP4 files bypasses Shopify's media management and
transcoding workflow and increases repository weight. Use a Shopify `video`
setting and upload the production file through Content > Files.

## Solution

Create a dedicated section and dedicated theme block:

- `sections/ogee-hero-slideshow.liquid`
- `blocks/_ogee-hero-slide.liquid`

Reuse Horizon's existing slideshow primitives:

- `snippets/slideshow.liquid`
- `snippets/slideshow-slide.liquid`
- `snippets/slideshow-controls.liquid`
- `assets/slideshow.js`

The section owns:

- Desktop and mobile heights.
- Shared colors.
- Maximum slide count.
- Numbered desktop navigation.
- Segmented mobile navigation.
- Carousel assembly and one-slide control handling.

The block owns:

- Desktop model and product images.
- Optional mobile image replacements through `<picture>`.
- An optional full-bleed campaign fallback for precomposed artwork.
- Eyebrow, heading, description, CTA, and link settings.
- First-slide image loading priority.
- Independent image layer positioning.
- Desktop and mobile content layout.
- Product-first CTA routing with a localized product-handle fallback.
- Separate desktop and mobile button hotspot coordinates.
- Shopify video plus optional desktop and mobile poster images.
- A visible HTML copy and CTA overlay for video campaigns.

Add a narrow `assets/ogee-hero-video.js` component that consumes the shared
`slideshow:select` event. Track whether the slide is selected, whether the
document is visible, and whether reduced motion is requested.

Render the video muted, looping, inline, without native controls, and with
`preload="metadata"`. Keep the poster visible until playback actually starts.
Pause immediately when another slide is selected or the document becomes
hidden. Resume only when the slide is selected and motion is allowed. With
reduced motion enabled, keep the poster visible and do not autoplay. Catch
rejected `video.play()` promises and retain the poster state.

Keep the first image slide in the homepage template and let merchants add the
Shopify-hosted video as a separate later slide. Do not commit the MP4.

Use section-scoped CSS variables for merchant-editable single-property values.
Keep structural differences in responsive CSS classes.

For Figma image geometry:

1. Convert the desired image height to a percentage of the reference frame.
2. Preserve the image aspect ratio with `width: auto`.
3. Convert the Figma left edge into a horizontal center coordinate.
4. Set that center as `left: <percentage>` with `translateX(-50%)`.
5. Verify the resulting pixel bounds at the original desktop and mobile frame
   sizes.

Do not use temporary Figma MCP asset URLs in production. Upload final images to
Shopify and render responsive CDN variants with `image_url` and `image_tag`.

## Why This Works

The custom block contains the design-specific composition while the shared
Horizon runtime continues to provide swipe, keyboard selection, selected-state
updates, reduced-motion handling, and viewport-aware scrolling.

Separating the section and block also keeps merchant responsibilities clear:
the section configures carousel-wide presentation, and each block configures a
single campaign slide.

The two-layer image model preserves the Figma composition without baking text
into imagery. Mobile `<source>` elements allow true art direction when desktop
assets cannot crop cleanly.

When only precomposed campaign artwork exists, render it decoratively and expose
the same campaign message as visually hidden semantic HTML. Provide a real link
with a descriptive accessible name. Use explicit desktop and mobile
aspect-ratio presets so merchant-selected artwork does not silently inherit one
campaign's geometry.

If the artwork contains a baked-in CTA, position a transparent link over only
the visible button rather than making the entire hero clickable. Store the
button bounds as percentages only when the rendered container preserves the
source artwork ratio. `object-fit: cover` changes the image coordinate system
when the container ratio differs, so a fixed-height layout can make a
percentage-based hotspot drift away from the visible button.

Resolve CTA destinations in this order:

1. Selected Shopify product URL.
2. Localized `routes.root_url` plus a sanitized fallback product handle.
3. Generic fallback URL.

Build the accessible name from the configured button label and heading. If
merchants clear both values, fall back to the selected product title or a stable
`Shop product` label.

When any slide uses full-bleed artwork, make the section's effective height mode
`image-ratio`, even if the stored section setting is `fixed`. This keeps the
artwork and transparent hotspot in the same coordinate system. Layered-only
slides can continue using fixed height.

Apply the same ratio rule to campaign video slides when the video and posters
use a known artwork ratio. Use `object-fit: cover` for desktop campaign framing
and `contain` on mobile when preserving the entire frame is more important than
filling the container.

The video controller remains independent of slideshow autoplay. Model playback
as derived state: selected slide, visible document, and motion allowed. This
prevents background playback without adding visible video controls to the
campaign artwork.

## Prevention

- Inspect existing theme primitives before creating carousel JavaScript.
- Do not modify shared blocks for campaign-specific layouts without confirming
  all callers.
- Validate every `{% schema %}` object and all translation keys with Theme Check.
- Preserve transparent image aspect ratios when translating Figma bounds.
- Give controls at least a 44px interactive area even when the visible progress
  indicator is only 1px high.
- Keep campaign CTA hit targets at least 44px tall even when the visual button
  in the reference is shorter.
- If a campaign intentionally omits visible video controls, treat the video as
  decorative muted motion, keep it selected-slide-only, and provide a poster for
  reduced-motion users. Confirm the accessibility trade-off before launch.
- Do not inherit mobile copy visibility blindly from another media layout. If a
  video reference includes description text, explicitly override shared mobile
  rules that hide descriptions.
- White copy over moving video needs a stable contrast treatment. A text shadow
  alone is not sufficient across bright frames; use a tested scrim, gradient,
  or per-campaign overlay.
- Pause video when its slide is deselected or the document becomes hidden.
- Treat reduced motion as poster-first.
- Catch rejected playback promises and leave the poster visible.
- Keep campaign video muted.
- Keep the first image slide as the LCP candidate and avoid eager-loading later
  video assets.
- Do not commit production campaign MP4 files to the theme repository.
- Hide or omit controls when the section contains only one slide.
- Keep the homepage JSON unchanged until production assets and links are ready.
- Verify desktop, tablet, and mobile in a Shopify preview before activating the
  section.
- Confirm every campaign CTA resolves to a published, purchasable product or
  collection. Do not use `/collections/all` as a campaign placeholder in a
  launch-ready template.
- Prefer a Shopify product picker over an absolute production-domain fallback.
  Absolute links bypass the preview store and can bypass Shopify Markets domain
  and locale routing.
- Sanitize fallback product handles with `handleize` and construct their URL
  from `routes.root_url`.
- Build the transparent CTA's accessible name from a required label, product
  title, or stable fallback. Do not allow editable copy to produce an unnamed
  anchor.
- Use percentage hotspots only with an enforced matching artwork ratio. If the
  section supports arbitrary fixed heights or `object-fit: cover`, use a real
  HTML CTA or calculate the rendered image bounds before positioning the link.
- Restrict mobile artwork to the mobile breakpoint unless a tablet-resolution
  portrait source is available. Portrait tablets should use the higher
  resolution desktop artwork.
- Expose explicit desktop and mobile ratio presets for full-bleed artwork rather
  than hardcoded viewport-height formulas.
- Provide a visible placeholder and suppress the CTA when full-bleed mode has
  neither merchant media nor a bundled fallback. If only mobile media is
  supplied, reuse it as the desktop fallback instead of showing an empty state.
- Verify newly added static assets through their rendered CDN URLs. The Shopify
  development watcher can occasionally require an explicit asset push.

## Related Docs

- [Ogee hero slideshow section](../../../sections/ogee-hero-slideshow.liquid)
- [Ogee hero slide block](../../../blocks/_ogee-hero-slide.liquid)
- [Ogee hero video controller](../../../assets/ogee-hero-video.js)
- [Shared slideshow section](../../../sections/slideshow.liquid)
- [Shared slideshow runtime](../../../assets/slideshow.js)

## Reusable Insight

When a Figma hero combines campaign-specific art direction with standard
carousel behavior, build a narrow presentation block on top of the theme's
existing interaction primitive. Reuse behavior; isolate composition.

For video slides, model autoplay as derived state rather than an HTML attribute:
selected slide + visible document + motion allowed. Only show the moving frame
after playback succeeds.

## Compound Summary

The Ogee hero was implemented as a dedicated section and theme block over
Horizon's slideshow runtime, with a constrained full-bleed fallback for the
available precomposed campaign artwork. Desktop and mobile ratios are explicit
presets, mobile artwork is limited to the mobile breakpoint, and empty
full-bleed blocks render a non-clickable placeholder. The baked-in Shop Now
button uses a button-sized transparent hotspot and a verified production URL
handle fallback while the development store has no matching product. Full-bleed
slides now enforce the source artwork ratio, and CTA labels have a stable
accessible fallback. Before launch, select the local Shopify product so Shopify
owns the destination object rather than relying on the handle fallback. Exact
Chronicle Display and Helvetica Neue fidelity also depends on the store having
licensed fonts configured.

The same dedicated block can support Shopify-hosted video without changing the
shared slideshow runtime. A small controller coordinates selection, document
visibility, reduced motion, and autoplay rejection.
Review of the first overlay revision added three launch guardrails: explicitly
show reference-required mobile description text, retain 44px CTA hit targets,
and provide stable contrast for white copy over changing video frames.
