# Celestial Atlas Design

## Product direction

Transform the existing interactive anatomy exhibit into an original digital observatory named **Celestial Atlas** with the tagline **Explore the universe up close**. The experience keeps the useful three-column learning structure while replacing the subject, visual language, content model, controls, and interactions with an astronomy-specific system.

## Experience

The desktop application uses a celestial-object library on the left, a large interactive Three.js viewer in the center, and a dynamically updated fact panel on the right. Earth is selected initially. Tablet and mobile layouts prioritize the viewer and expose the library through a drawer while stacking the object information and learning cards beneath it.

The interface uses near-black and midnight-blue surfaces, indigo and violet depth, restrained cyan highlights, warm-white primary text, and muted blue-gray secondary text. Subtle stars, atmospheric glows, orbit lines, glass panels, and slow motion establish a premium scientific mood without excessive neon or decorative clutter.

## Data architecture

Astronomy content lives in a presentation-independent celestial data module. Each object includes identity, category, visual parameters, scientific facts, description, significance, trivia, hotspots, comparison values, quiz content, and appearance settings. Components consume this normalized structure so selecting an object updates every dependent view and future objects can be added without component changes.

## Procedural 3D system

The current model-loading viewer becomes a procedural planetary renderer. Each body uses sphere geometry with deterministic shader or canvas-generated surface variation, physically plausible lighting, object-specific atmosphere, axial tilt, and optional rings. The viewer supports drag rotation, wheel or pinch zoom, auto-rotation, orbit mode, labels, hotspots, internal layers/cross-section, relative-scale comparison, and reset.

Procedural materials deliberately favor scientific recognizability and originality over photographic cartographic accuracy. They avoid unverified third-party textures and make all requested objects available without additional downloads.

## Functional behavior

- Selection updates the viewer, facts, learning content, quiz, and comparison state.
- Search filters the library and can restore the complete list.
- Favorites are toggleable per object during the session.
- Hotspots reveal concise feature cards and have a screen-reader equivalent.
- Orbit animation visibly moves the selected body around a stylized central star.
- The quiz provides an answer, immediate feedback, and a new question when available.
- Comparison shows at least two objects with relative visual scale and key measurements.
- All interactive controls expose hover, active, focus-visible, pressed, and disabled states.

## Accessibility and resilience

Use semantic landmarks, labelled controls, keyboard-operable tools, visible focus treatment, live regions for changing object state, reduced-motion handling, readable contrast, and responsive layouts without horizontal overflow. If WebGL initialization fails, render a designed CSS celestial fallback rather than an empty panel.

## Removal scope

Remove anatomy components, content, models, illustrations, metadata, tests, and references after their astronomy replacements are wired. Keep only genuinely generic infrastructure such as the framework configuration, database examples, and reusable Three.js disposal concepts. Vendored Draco/Basis decoders are removed if no longer imported by the procedural viewer.

## Verification

Add tests for celestial data integrity and server-rendered Celestial Atlas content. Run TypeScript, ESLint, Node tests, the vinext production build, and browser QA at desktop, tablet, and mobile widths. Search the repository for anatomy terminology and confirm no user-facing or dead-domain references remain.
