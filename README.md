# Celestial Atlas

An immersive digital observatory for exploring the Sun, planets, and Moon through procedural 3D models, scientific data, feature markers, lessons, quizzes, orbital motion, and relative-scale comparisons.

## Requirements

- Node.js `>=22.13.0`

## Local development

```bash
npm install
npm run dev -- --hostname 0.0.0.0
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npx tsc --noEmit
npm run lint
npm test
```

The application runs on Next App Router through [vinext](https://github.com/cloudflare/vinext). Planet surfaces are generated locally at runtime, so the interactive models do not depend on downloaded photographic textures.

## Optional workspace authentication

The helpers in `app/chatgpt-auth.ts` support optional or required ChatGPT sign-in for future user-specific features. The current observatory remains publicly accessible and stores session interactions only in browser memory.

Created by Asnari.
