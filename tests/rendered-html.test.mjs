import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

const requiredIds = [
  "sun", "mercury", "venus", "earth", "mars",
  "jupiter", "saturn", "uranus", "neptune", "moon",
];

test("catalog contains complete celestial learning data", async () => {
  const { celestialObjects, celestialById, DEFAULT_OBJECT_ID } = await import("../app/lib/celestial-data.ts");

  assert.equal(DEFAULT_OBJECT_ID, "earth");
  assert.deepEqual(celestialObjects.map((object) => object.id), requiredIds);
  assert.equal(new Set(celestialObjects.map((object) => object.id)).size, requiredIds.length);
  assert.equal(celestialById.earth.subtitle, "Our Ocean World");

  for (const object of celestialObjects) {
    assert.ok(object.name && object.category && object.description);
    assert.ok(object.diameterKm > 0 && object.massKg > 0 && object.gravity >= 0);
    assert.ok(object.facts.distance && object.facts.orbitalPeriod && object.facts.dayLength);
    assert.ok(object.significance && object.didYouKnow);
    assert.ok(object.hotspots.length >= 3);
    assert.ok(object.quiz.options.includes(object.quiz.answer));
    assert.match(object.image.src, /^\/celestial\/[a-z-]+\.webp$/);
    assert.match(object.image.sourceUrl, /^https:\/\/(science|images-assets|assets\.science)\.nasa\.gov\//);
    assert.match(object.image.credit, /^NASA(?:\/JPL(?:-Caltech)?)?/);
    assert.match(object.texture.albedo, /^\/celestial\/textures\/[a-z-]+\.webp$/);
    assert.equal(object.texture.credit, "Solar System Scope");
    assert.equal(object.texture.license, "CC BY 4.0");
    await access(new URL(`../public${object.texture.albedo}`, import.meta.url));
  }
});

test("catalog contains no legacy subject language", async () => {
  const { celestialObjects } = await import("../app/lib/celestial-data.ts");
  assert.doesNotMatch(JSON.stringify(celestialObjects), /anatom|\borgan\b|medical|cardiovascular|tissue/i);
});

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the Celestial Atlas experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Celestial Atlas — Explore the universe up close<\/title>/i);
  assert.match(html, /Celestial Atlas/);
  assert.match(html, /Explore the universe up close/);
  assert.match(html, /Celestial Library/);
  assert.match(html, /Our Ocean World/);
  assert.match(html, /\/celestial\/earth\.webp/);
  assert.match(html, /Image and 3D sources/);
  assert.match(html, /https:\/\/science\.nasa\.gov\/earth\//);
  assert.doesNotMatch(html, /anatom|organ library|medical importance|tissue/i);
});
