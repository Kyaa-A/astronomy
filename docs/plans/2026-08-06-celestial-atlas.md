# Celestial Atlas Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the anatomy application with an original, responsive, interactive astronomy observatory built around procedural Three.js celestial bodies.

**Architecture:** A typed celestial catalog drives a React application shell and an imperative Three.js planet viewer. The viewer generates each object from object-specific visual parameters, while React owns navigation, search, favorites, comparison, quiz, orbit, and responsive UI state.

**Tech Stack:** Vinext/Next App Router, React 19, strict TypeScript, Three.js r185, GSAP, Lucide React, CSS/Tailwind import, Node test runner.

---

## Phase 0: Allowed APIs and constraints

**Local documentation read:** `package.json`, `node_modules/@types/three/src/geometries/SphereGeometry.d.ts`, `RingGeometry.d.ts`, `CanvasTexture.d.ts`, `Raycaster.d.ts`, `node_modules/@types/three/examples/jsm/controls/OrbitControls.d.ts`, and the current `app/lib/three/*.ts` implementation.

**Allowed APIs:** `THREE.SphereGeometry`, `THREE.RingGeometry`, `THREE.CanvasTexture`, `THREE.MeshStandardMaterial`, `THREE.ShaderMaterial`, `THREE.Raycaster.setFromCamera`, `Raycaster.intersectObjects`, `OrbitControls.update(delta)`, `WebGLRenderer` color-space/tone-mapping/resize/dispose methods, `ResizeObserver`, and `IntersectionObserver`.

**Guards:** Keep procedural color textures in `SRGBColorSpace`; explicitly dispose generated textures, sprites, lines, geometries, and materials; use `OrbitControls.update(delta)` for frame-independent auto-rotation; avoid the deprecated `THREE.Clock` warning by tracking time with `performance.now()`; do not retain GLTF/Draco/Basis loaders.

### Task 1: Establish celestial domain tests and data

**Files:**
- Replace: `tests/rendered-html.test.mjs`
- Create: `app/lib/celestial-data.ts`
- Delete after replacement: `app/lib/anatomy-data.ts`

**Steps:**
1. Write a Node test that imports the catalog and asserts the ten required unique objects, Earth defaults, complete fact fields, hotspot content, quiz answers, and absence of anatomy terminology.
2. Run `node --test tests/rendered-html.test.mjs` and confirm it fails before the new module exists.
3. Implement typed `CelestialObject`, `CelestialHotspot`, visual configuration, comparison values, facts, and quizzes for Sun through Moon.
4. Re-run the focused test and confirm the catalog assertions pass.

### Task 2: Build the procedural planet viewer

**Files:**
- Create: `app/lib/three/celestial-viewer.ts`
- Create: `app/components/CelestialViewer.tsx`
- Reuse: `app/lib/three/dispose.ts`
- Delete after replacement: `app/lib/three/viewer.ts`, `loaders.ts`, `hotspots.ts`, `tsl-materials.ts`, `app/components/OrganViewer.tsx`

**Steps:**
1. Implement a strict-mode-safe React bridge that lazy-loads the client viewer and forwards selected object and tool state.
2. Generate sphere surfaces with deterministic canvas textures, object-specific colors/bands/spots, atmosphere shells, axial tilt, directional lighting, and optional rings.
3. Add a procedural star field, orbital guides, responsive camera, drag/zoom, auto-rotation, keyboard input, reset, and complete disposal.
4. Add sprite hotspots with raycast selection, accessible equivalents, projected callout placement, labels, and selection clearing.
5. Add orbit mode, internal layers/cross-section, relative-scale mode, loading state, and WebGL fallback visual.
6. Run `npx tsc --noEmit` and resolve viewer type errors before UI integration.

### Task 3: Replace the application experience

**Files:**
- Create: `app/components/CelestialApp.tsx`
- Modify: `app/page.tsx`
- Delete after replacement: `app/components/AnatomyApp.tsx`

**Steps:**
1. Build the header with Celestial Atlas branding, astronomy navigation, search, avatar menu, and responsive library trigger.
2. Build the searchable celestial library with thumbnails, categories, selection, per-object favorite toggles, and view-all behavior.
3. Build the dynamic information panel with all requested measurements, scientific significance, trivia, and selected-object content.
4. Add functional lesson, orbit animation, quiz feedback, and two-object comparison interactions.
5. Add keyboard-friendly modal behavior, Escape handling, semantic labels, live selection announcements, and focus management.
6. Run `npx tsc --noEmit` and the catalog tests.

### Task 4: Create the visual system and responsive layouts

**Files:**
- Replace: `app/globals.css`

**Steps:**
1. Define deep-space tokens, display/interface typography, base focus treatment, star/glow backgrounds, and glass surfaces.
2. Implement the premium three-column desktop layout and luminous selected states.
3. Style the viewer toolbar, onboarding note, labels, callouts, loading/fallback state, orbit visuals, comparison, quiz, cards, and modals.
4. Add tablet two-column behavior, mobile viewer-first layout, bottom drawer library, compact horizontal tool strip, and single-column content.
5. Add reduced-motion behavior and verify no horizontal overflow at 1440, 1024, 768, 390, and 320 CSS pixels.

### Task 5: Replace metadata and branding assets

**Files:**
- Modify: `app/layout.tsx`, `package.json`, `README.md`, `worker/index.ts`
- Replace: `public/favicon.svg`
- Remove: old raster icons/OG image unless replaced with astronomy-safe generated assets

**Steps:**
1. Replace title, descriptions, keywords, social metadata, application name, site URL fallback, and accessible image descriptions with Celestial Atlas branding.
2. Rename the package and starter descriptions without changing the framework.
3. Provide an original vector astronomy favicon and avoid metadata references to deleted images.
4. Search user-facing source for old project branding and correct remaining references.

### Task 6: Remove anatomy and unused binary assets

**Files:**
- Remove: `public/anatomy/**`, `public/models/**`, `public/draco/**`, `public/basis/**`
- Remove: all `*:Zone.Identifier`, generated `dist`, `.vinext`, `.wrangler`, `.gstack`, and `tsconfig.tsbuildinfo` before fresh verification

**Steps:**
1. Verify no source import references the deletion targets.
2. Delete only the audited anatomy and now-unused decoder assets plus generated caches.
3. Run an exhaustive case-insensitive repository search excluding dependencies and planning documents; require no anatomy-domain strings or assets in application, test, README, or public output.

### Task 7: Verification and browser QA

**Files:**
- Modify as needed: `eslint.config.mjs`, `tests/rendered-html.test.mjs`, implementation files touched above

**Steps:**
1. Update the rendered HTML test to build/fetch the worker and assert Celestial Atlas metadata/content with no anatomy terms.
2. Run `npx tsc --noEmit` and require exit 0.
3. Run `npm run lint` and fix redesign-introduced and existing in-scope errors.
4. Run `npm test` and require the production build plus all tests to pass.
5. Start `npm run dev -- --hostname 0.0.0.0` and verify HTTP 200.
6. Use browser QA to test selection, search, favorites, auto-rotate, hotspot, orbit, quiz, comparison, console errors, failed network requests, and responsive layouts.
7. Repeat the anatomy-reference search against source and fresh `dist` output, then report any procedural rendering limitations.
