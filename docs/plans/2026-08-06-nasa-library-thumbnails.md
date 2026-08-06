# NASA Library Thumbnails Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace synthetic Celestial Library glyphs with authentic, locally hosted NASA/JPL portraits and provide transparent source attribution.

**Architecture:** Extend each catalog record with a local thumbnail path and source metadata. Download imagery only from official NASA domains, optimize it to WebP, render it through the existing reusable object glyph, and expose credits in an accessible panel.

**Tech Stack:** Next.js, React, TypeScript, CSS, Node tests, NASA/JPL public media.

---

### Task 1: Verify source rights and image provenance

1. Use NASA's official image/media guidance and NASA Science object pages.
2. Record the source page, credit line, and local output name for all ten objects.
3. Reject imagery marked as third-party copyrighted.

### Task 2: Add the thumbnail contract and regression coverage

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/lib/celestial-data.ts`

1. Add a failing catalog test requiring a local image, source label, and official source URL.
2. Add the typed `image` metadata to every object.
3. Run `npm test` and confirm the catalog test passes.

### Task 3: Download and optimize official portraits

**Files:**
- Create: `public/celestial/*.webp`

1. Download official NASA/JPL portrait assets.
2. Crop and resize consistently without misleading alterations.
3. Verify all ten local files decode successfully.

### Task 4: Render photographs and credits

**Files:**
- Modify: `app/components/CelestialApp.tsx`
- Modify: `app/globals.css`

1. Update the reusable object glyph to render the local image with descriptive alt text where meaningful.
2. Preserve the luminous selected-state treatment and add restrained photographic hover movement.
3. Add an accessible image-credit disclosure linking to each official source page.

### Task 5: Verify

1. Run `npx tsc --noEmit`.
2. Run `npm run lint`.
3. Run `npm test` for the production build and catalog/render tests.
4. Test selection and responsive layout at desktop and mobile widths in the browser.
5. Confirm no broken images, overflow, console errors, or anatomy remnants.
