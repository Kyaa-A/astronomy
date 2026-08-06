export const celestialIds = [
  "sun", "mercury", "venus", "earth", "mars",
  "jupiter", "saturn", "uranus", "neptune", "moon",
] as const;

export type CelestialId = (typeof celestialIds)[number];
export type CelestialKind = "star" | "rocky" | "gas" | "ice" | "moon";

export type CelestialHotspot = {
  id: string;
  label: string;
  detail: string;
  latitude: number;
  longitude: number;
  color: string;
};

export type CelestialQuiz = {
  question: string;
  options: [string, string, string];
  answer: string;
  explanation: string;
};

export type CelestialObject = {
  id: CelestialId;
  name: string;
  symbol: string;
  category: string;
  kind: CelestialKind;
  subtitle: string;
  description: string;
  diameterKm: number;
  massKg: number;
  gravity: number;
  temperatureC: number;
  moons: number;
  facts: {
    diameter: string;
    mass: string;
    distance: string;
    avgDistance?: string;
    orbitalPeriod: string;
    orbitalSpeed?: string;
    eccentricity?: string;
    orderFromSun?: string;
    dayLength: string;
    moons: string;
    gravity: string;
    temperature: string;
    composition: string;
  };
  significance: string;
  didYouKnow: string;
  accent: string;
  secondary: string;
  image: {
    src: string;
    sourceUrl: string;
    credit: string;
  };
  texture: {
    albedo: string;
    clouds?: string;
    atmosphere?: string;
    normal?: string;
    emissive?: string;
    rings?: string;
    sourceUrl: string;
    credit: string;
    license: string;
  };
  visual: {
    base: string;
    light: string;
    dark: string;
    atmosphere?: string;
    rings?: [string, string];
    tilt: number;
    roughness: number;
    banding?: number;
    spots?: number;
  };
  hotspots: CelestialHotspot[];
  quiz: CelestialQuiz;
};

const fact = (
  diameter: string,
  mass: string,
  distance: string,
  orbitalPeriod: string,
  dayLength: string,
  moons: string,
  gravity: string,
  temperature: string,
  composition: string,
  extra: {
    avgDistance?: string;
    orbitalSpeed?: string;
    eccentricity?: string;
    orderFromSun?: string;
  } = {},
) => ({
  diameter,
  mass,
  distance,
  avgDistance: extra.avgDistance ?? distance,
  orbitalPeriod,
  orbitalSpeed: extra.orbitalSpeed,
  eccentricity: extra.eccentricity,
  orderFromSun: extra.orderFromSun,
  dayLength,
  moons,
  gravity,
  temperature,
  composition,
});

const surfaceTexture = (
  id: CelestialId,
  extras: Partial<CelestialObject["texture"]> = {},
): CelestialObject["texture"] => ({
  albedo: `/celestial/textures/${id}.webp`,
  sourceUrl: "https://www.solarsystemscope.com/textures/",
  credit: "Solar System Scope",
  license: "CC BY 4.0",
  ...extras,
});

export const celestialObjects: CelestialObject[] = [
  {
    id: "sun", name: "Sun", symbol: "☉", category: "Star", kind: "star",
    image: { src: "/celestial/sun.webp", sourceUrl: "https://science.nasa.gov/sun/", credit: "NASA/SOHO" },
    texture: surfaceTexture("sun"),
    subtitle: "The Star That Sustains Us",
    description: "A vast sphere of plasma whose light and gravity define our planetary system.",
    diameterKm: 1_392_700, massKg: 1.989e30, gravity: 274, temperatureC: 5_500, moons: 0,
    facts: fact("1,392,700 km", "1.989 × 10³⁰ kg", "System center", "~225 million years around the galaxy", "~25–35 Earth days", "0", "274 m/s²", "~5,500°C at the surface", "Hydrogen and helium plasma"),
    significance: "Solar energy drives Earth's climate and nearly every surface ecosystem, while solar activity shapes space weather.",
    didYouKnow: "Sunlight takes about 8 minutes 20 seconds to reach Earth.",
    accent: "#ffbd66", secondary: "#fff0bd",
    visual: { base: "#f48b22", light: "#fff0a8", dark: "#b72d0d", atmosphere: "#ff9d2e", tilt: 7.25, roughness: 0.5, banding: 5, spots: 15 },
    hotspots: [
      { id: "photosphere", label: "Photosphere", detail: "The bright visible layer from which most sunlight escapes.", latitude: 18, longitude: 25, color: "#fff0a8" },
      { id: "sunspots", label: "Sunspots", detail: "Cooler magnetic regions that appear dark against the surface.", latitude: -14, longitude: -34, color: "#8e240d" },
      { id: "corona", label: "Corona", detail: "A million-degree outer atmosphere extending far into space.", latitude: 48, longitude: 112, color: "#ffd48a" },
    ],
    quiz: { question: "What powers the Sun?", options: ["Nuclear fusion", "Chemical fire", "Gravitational friction alone"], answer: "Nuclear fusion", explanation: "Hydrogen nuclei fuse into helium in the core, releasing enormous energy." },
  },
  {
    id: "mercury", name: "Mercury", symbol: "☿", category: "Terrestrial planet", kind: "rocky",
    image: { src: "/celestial/mercury.webp", sourceUrl: "https://science.nasa.gov/mercury/", credit: "NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington" },
    texture: surfaceTexture("mercury"),
    subtitle: "The Swiftest World", description: "A cratered, metal-rich planet racing through the Sun's intense inner realm.",
    diameterKm: 4_879, massKg: 3.301e23, gravity: 3.7, temperatureC: 167, moons: 0,
    facts: fact("4,879 km", "3.301 × 10²³ kg", "57.9 million km", "88 Earth days", "58.6 Earth days", "0", "3.70 m/s²", "~167°C average", "Silicate crust over a large iron core", { avgDistance: "57.9 million km (0.39 AU)", orbitalSpeed: "47.36 km/s", eccentricity: "0.2056", orderFromSun: "1st from Sun" }),
    significance: "Its oversized core preserves evidence of violent conditions during the formation of the inner planets.",
    didYouKnow: "A solar day on Mercury lasts about 176 Earth days—twice its year.",
    accent: "#b8c0c9", secondary: "#e5e8eb", visual: { base: "#817f7d", light: "#d5d0c8", dark: "#373a3d", tilt: 0.03, roughness: 1, spots: 35 },
    hotspots: [
      { id: "caloris", label: "Caloris Basin", detail: "One of the Solar System's largest impact basins.", latitude: 31, longitude: 162, color: "#ded6c9" },
      { id: "scarps", label: "Lobate Scarps", detail: "Cliffs formed as the cooling planet contracted.", latitude: -12, longitude: 48, color: "#aab0b6" },
      { id: "ice", label: "Polar Ice", detail: "Water ice survives inside permanently shadowed craters.", latitude: 75, longitude: -25, color: "#e7f7ff" },
    ],
    quiz: { question: "Why can ice survive on Mercury?", options: ["Shadowed polar craters stay cold", "Its atmosphere makes snow", "Ice covers its night side"], answer: "Shadowed polar craters stay cold", explanation: "Some polar crater floors never receive direct sunlight." },
  },
  {
    id: "venus", name: "Venus", symbol: "♀", category: "Terrestrial planet", kind: "rocky",
    image: { src: "/celestial/venus.webp", sourceUrl: "https://science.nasa.gov/image-detail/pia00159-venus/", credit: "NASA/JPL-Caltech" },
    texture: surfaceTexture("venus", { atmosphere: "/celestial/textures/venus-atmosphere.webp" }),
    subtitle: "The Veiled Furnace", description: "A world wrapped in brilliant clouds and a crushing greenhouse atmosphere.",
    diameterKm: 12_104, massKg: 4.867e24, gravity: 8.87, temperatureC: 464, moons: 0,
    facts: fact("12,104 km", "4.867 × 10²⁴ kg", "108.2 million km", "224.7 Earth days", "243 Earth days", "0", "8.87 m/s²", "~464°C", "Rocky world beneath carbon-dioxide clouds", { avgDistance: "108.2 million km (0.72 AU)", orbitalSpeed: "35.02 km/s", eccentricity: "0.0067", orderFromSun: "2nd from Sun" }),
    significance: "Venus is a natural laboratory for understanding runaway greenhouse warming and terrestrial planet evolution.",
    didYouKnow: "Venus rotates backward compared with most planets, and its day is longer than its year.",
    accent: "#f0b96b", secondary: "#ffe5ad", visual: { base: "#bd6c2c", light: "#f8d997", dark: "#713115", atmosphere: "#d9903d", tilt: 177.4, roughness: 0.72, banding: 14 },
    hotspots: [
      { id: "clouds", label: "Sulfuric Clouds", detail: "Reflective cloud decks hide the surface from visible light.", latitude: 24, longitude: 20, color: "#ffe3a5" },
      { id: "maxwell", label: "Maxwell Montes", detail: "The tallest mountain range on Venus.", latitude: 65, longitude: 4, color: "#cf8851" },
      { id: "volcanoes", label: "Volcanic Plains", detail: "Lava-built plains cover much of the planet.", latitude: -22, longitude: -86, color: "#e56f32" },
    ],
    quiz: { question: "What makes Venus so hot?", options: ["A powerful greenhouse effect", "It is closest to the Sun", "Constant volcanic fire"], answer: "A powerful greenhouse effect", explanation: "Its dense carbon-dioxide atmosphere traps heat exceptionally well." },
  },
  {
    id: "earth", name: "Earth", symbol: "⊕", category: "Terrestrial planet", kind: "rocky",
    image: { src: "/celestial/earth.webp", sourceUrl: "https://science.nasa.gov/earth/", credit: "NASA" },
    texture: surfaceTexture("earth", { clouds: "/celestial/textures/earth-clouds.webp", normal: "/celestial/textures/earth-normal.webp", emissive: "/celestial/textures/earth-night.webp" }),
    subtitle: "Our Ocean World", description: "The third planet from the Sun and the only known world to support life.",
    diameterKm: 12_742, massKg: 5.972e24, gravity: 9.81, temperatureC: 15, moons: 1,
    facts: fact("12,742 km", "5.972 × 10²⁴ kg", "149.6 million km", "365.25 days", "23 hours 56 minutes", "1", "9.81 m/s²", "~15°C average", "Rocky planet with an iron-rich core", { avgDistance: "149.6 million km (1.00 AU)", orbitalSpeed: "29.78 km/s", eccentricity: "0.0167", orderFromSun: "3rd from Sun" }),
    significance: "Earth's liquid oceans, active geology, protective magnetic field, and stable atmosphere create the only confirmed biosphere.",
    didYouKnow: "About 71% of Earth's surface is covered by ocean, yet most of it remains unexplored.",
    accent: "#64d8ff", secondary: "#9ee7c2", visual: { base: "#1266a8", light: "#62c6ef", dark: "#092e5b", atmosphere: "#4cb8ff", tilt: 23.44, roughness: 0.78, spots: 20 },
    hotspots: [
      { id: "atmosphere", label: "Atmosphere", detail: "A protective envelope dominated by nitrogen and oxygen.", latitude: 43, longitude: 12, color: "#8de7ff" },
      { id: "oceans", label: "Ocean System", detail: "One connected body of salt water covering 71% of Earth and regulating climate through heat and carbon circulation.", latitude: -18, longitude: -145, color: "#2bbcff" },
      { id: "continents", label: "Continents", detail: "Moving plates continually reshape Earth's land.", latitude: 18, longitude: 34, color: "#74d39a" },
      { id: "magnetosphere", label: "Magnetic Field", detail: "Generated mainly by motion in Earth’s liquid outer core, this magnetic envelope deflects much of the solar wind and helps protect the atmosphere.", latitude: 68, longitude: 112, color: "#bd9cff" },
      { id: "core", label: "Iron Core", detail: "A solid inner core within a flowing liquid-metal outer core.", latitude: -42, longitude: 58, color: "#ffb05e" },
    ],
    quiz: { question: "What creates Earth's global magnetic field?", options: ["Motion in its liquid outer core", "The Moon's gravity", "Charged clouds"], answer: "Motion in its liquid outer core", explanation: "Convecting conductive iron in the outer core powers the geodynamo." },
  },
  {
    id: "mars", name: "Mars", symbol: "♂", category: "Terrestrial planet", kind: "rocky",
    image: { src: "/celestial/mars.webp", sourceUrl: "https://science.nasa.gov/mars/", credit: "NASA/JPL/USGS" },
    texture: surfaceTexture("mars"),
    subtitle: "The Rusted Frontier", description: "A cold desert world marked by ancient rivers, giant volcanoes, and polar ice.",
    diameterKm: 6_779, massKg: 6.417e23, gravity: 3.71, temperatureC: -63, moons: 2,
    facts: fact("6,779 km", "6.417 × 10²³ kg", "227.9 million km", "687 Earth days", "24 hours 37 minutes", "2", "3.71 m/s²", "~-63°C average", "Iron-rich basaltic rock and a metal core", { avgDistance: "227.9 million km (1.52 AU)", orbitalSpeed: "24.07 km/s", eccentricity: "0.0934", orderFromSun: "4th from Sun" }),
    significance: "Mars preserves accessible evidence of a warmer, wetter past and is the leading target in the search for ancient extraterrestrial life.",
    didYouKnow: "Olympus Mons rises about 22 km, making it the tallest known volcano in the Solar System.",
    accent: "#f07b5d", secondary: "#ffc09c", visual: { base: "#a93f26", light: "#e99062", dark: "#4e1e18", atmosphere: "#db7a54", tilt: 25.19, roughness: 0.96, spots: 32 },
    hotspots: [
      { id: "olympus", label: "Olympus Mons", detail: "A shield volcano nearly three times Everest's height.", latitude: 18.65, longitude: -133.8, color: "#ffc07b" },
      { id: "valles", label: "Valles Marineris", detail: "A canyon system stretching more than 4,000 km.", latitude: -14, longitude: -65, color: "#d75439" },
      { id: "polar", label: "Polar Caps", detail: "Seasonal carbon-dioxide frost overlays water ice.", latitude: 76, longitude: 20, color: "#eaf6ff" },
    ],
    quiz: { question: "Why does Mars look red?", options: ["Iron minerals have oxidized", "Its surface is molten", "Red clouds cover it"], answer: "Iron minerals have oxidized", explanation: "Iron-bearing dust reacts with oxygen, producing rust-colored oxides." },
  },
  {
    id: "jupiter", name: "Jupiter", symbol: "♃", category: "Gas giant", kind: "gas",
    image: { src: "/celestial/jupiter.webp", sourceUrl: "https://science.nasa.gov/jupiter/", credit: "NASA/JPL-Caltech/SwRI/MSSS" },
    texture: surfaceTexture("jupiter"),
    subtitle: "The Giant of Storms", description: "The largest planet, wrapped in turbulent cloud bands and immense magnetic fields.",
    diameterKm: 139_820, massKg: 1.898e27, gravity: 24.79, temperatureC: -110, moons: 95,
    facts: fact("139,820 km", "1.898 × 10²⁷ kg", "778.5 million km", "11.86 Earth years", "9 hours 56 minutes", "95 confirmed", "24.79 m/s²", "~-110°C at cloud tops", "Hydrogen and helium around a dense interior", { avgDistance: "778.5 million km (5.20 AU)", orbitalSpeed: "13.07 km/s", eccentricity: "0.0489", orderFromSun: "5th from Sun" }),
    significance: "Its gravity shaped the architecture of the Solar System, while its moons host some of the most promising environments beyond Earth.",
    didYouKnow: "The Great Red Spot is a storm wider than Earth that has persisted for centuries.",
    accent: "#e7ae83", secondary: "#fff0d4", visual: { base: "#a76d4e", light: "#ead1aa", dark: "#5c3329", atmosphere: "#d49d72", tilt: 3.13, roughness: 0.62, banding: 22, spots: 5 },
    hotspots: [
      { id: "redspot", label: "Great Red Spot", detail: "A vast anticyclonic storm with winds exceeding 400 km/h.", latitude: -22, longitude: 34, color: "#e76d51" },
      { id: "belts", label: "Cloud Belts", detail: "Alternating jet streams organize bright zones and dark belts.", latitude: 12, longitude: -60, color: "#f1d1a2" },
      { id: "aurora", label: "Polar Aurora", detail: "Powerful magnetic fields create intense polar lights.", latitude: 72, longitude: 95, color: "#7ee8ff" },
    ],
    quiz: { question: "What is Jupiter mostly made of?", options: ["Hydrogen and helium", "Solid granite", "Water ice"], answer: "Hydrogen and helium", explanation: "Its bulk composition resembles that of the Sun." },
  },
  {
    id: "saturn", name: "Saturn", symbol: "♄", category: "Gas giant", kind: "gas",
    image: { src: "/celestial/saturn.webp", sourceUrl: "https://science.nasa.gov/saturn/", credit: "NASA/JPL-Caltech/Space Science Institute" },
    texture: surfaceTexture("saturn", { rings: "/celestial/textures/saturn-rings.webp" }),
    subtitle: "The Ringed World", description: "A low-density giant encircled by an intricate system of ice and rock.",
    diameterKm: 116_460, massKg: 5.683e26, gravity: 10.44, temperatureC: -140, moons: 146,
    facts: fact("116,460 km", "5.683 × 10²⁶ kg", "1.434 billion km", "29.45 Earth years", "10 hours 42 minutes", "146 confirmed", "10.44 m/s²", "~-140°C at cloud tops", "Hydrogen and helium with an icy-rocky core", { avgDistance: "1.434 billion km (9.58 AU)", orbitalSpeed: "9.68 km/s", eccentricity: "0.0565", orderFromSun: "6th from Sun" }),
    significance: "Saturn's rings reveal disk dynamics in exquisite detail, while moons such as Enceladus and Titan are major astrobiology targets.",
    didYouKnow: "Saturn's average density is lower than water, though no ocean could hold it.",
    accent: "#e9cf8d", secondary: "#fff4c9", visual: { base: "#b79b64", light: "#f2dfaa", dark: "#655438", atmosphere: "#cfb67d", rings: ["#d8c394", "#887963"], tilt: 26.73, roughness: 0.64, banding: 18 },
    hotspots: [
      { id: "rings", label: "Main Rings", detail: "Countless particles form a disk only tens of metres thick in places.", latitude: 4, longitude: 36, color: "#fff0bd" },
      { id: "hexagon", label: "North Polar Hexagon", detail: "A persistent six-sided atmospheric jet stream.", latitude: 78, longitude: -20, color: "#d8eaff" },
      { id: "storms", label: "Cloud Bands", detail: "Fast winds sculpt subtle bands and periodic global storms.", latitude: -28, longitude: -92, color: "#e5c985" },
    ],
    quiz: { question: "What are Saturn's rings primarily made of?", options: ["Water ice particles", "Hot gas", "A single solid disk"], answer: "Water ice particles", explanation: "The rings contain icy fragments ranging from dust grains to house-sized pieces." },
  },
  {
    id: "uranus", name: "Uranus", symbol: "♅", category: "Ice giant", kind: "ice",
    image: { src: "/celestial/uranus.webp", sourceUrl: "https://science.nasa.gov/uranus/", credit: "NASA/JPL-Caltech" },
    texture: surfaceTexture("uranus"),
    subtitle: "The Sideways Ice Giant", description: "A pale cyan world rotating nearly on its side through the outer system.",
    diameterKm: 50_724, massKg: 8.681e25, gravity: 8.69, temperatureC: -195, moons: 28,
    facts: fact("50,724 km", "8.681 × 10²⁵ kg", "2.871 billion km", "84 Earth years", "17 hours 14 minutes", "28 confirmed", "8.69 m/s²", "~-195°C", "Hydrogen-helium atmosphere over icy fluids and rock", { avgDistance: "2.871 billion km (19.22 AU)", orbitalSpeed: "6.80 km/s", eccentricity: "0.0463", orderFromSun: "7th from Sun" }),
    significance: "Its extreme tilt and unusual magnetic field test theories of giant-planet formation and catastrophic early collisions.",
    didYouKnow: "Each pole experiences roughly 42 years of continuous sunlight followed by 42 years of darkness.",
    accent: "#86e6eb", secondary: "#c9fbff", visual: { base: "#58aeb8", light: "#a8edf0", dark: "#275b6a", atmosphere: "#68d6df", rings: ["#96bec5", "#476b72"], tilt: 97.77, roughness: 0.56, banding: 6 },
    hotspots: [
      { id: "tilt", label: "Extreme Tilt", detail: "The rotation axis lies almost within its orbital plane.", latitude: 68, longitude: 8, color: "#d6ffff" },
      { id: "methane", label: "Methane Haze", detail: "Methane absorbs red light, contributing to the cyan appearance.", latitude: 20, longitude: 96, color: "#83f5f3" },
      { id: "rings", label: "Dark Rings", detail: "Thirteen narrow, dusty rings encircle the planet.", latitude: -8, longitude: -42, color: "#a9c9d1" },
    ],
    quiz: { question: "What makes Uranus appear cyan?", options: ["Methane in its atmosphere", "A global ocean", "Blue surface minerals"], answer: "Methane in its atmosphere", explanation: "Atmospheric methane absorbs red wavelengths and leaves blue-green light." },
  },
  {
    id: "neptune", name: "Neptune", symbol: "♆", category: "Ice giant", kind: "ice",
    image: { src: "/celestial/neptune.webp", sourceUrl: "https://science.nasa.gov/neptune/", credit: "NASA/JPL" },
    texture: surfaceTexture("neptune"),
    subtitle: "The Wind-Swept Blue", description: "A distant cobalt world with the fastest measured winds in the Solar System.",
    diameterKm: 49_244, massKg: 1.024e26, gravity: 11.15, temperatureC: -200, moons: 16,
    facts: fact("49,244 km", "1.024 × 10²⁶ kg", "4.495 billion km", "164.8 Earth years", "16 hours 6 minutes", "16 confirmed", "11.15 m/s²", "~-200°C", "Icy mantle beneath hydrogen, helium, and methane", { avgDistance: "4.495 billion km (30.05 AU)", orbitalSpeed: "5.43 km/s", eccentricity: "0.0095", orderFromSun: "8th from Sun" }),
    significance: "Neptune reveals how internal heat can power extreme weather far from strong sunlight.",
    didYouKnow: "Its winds can exceed 2,000 km/h—faster than the speed of sound on Earth.",
    accent: "#557dff", secondary: "#98bcff", visual: { base: "#234cbb", light: "#4d86ed", dark: "#0b1d66", atmosphere: "#336dff", tilt: 28.32, roughness: 0.54, banding: 11, spots: 4 },
    hotspots: [
      { id: "winds", label: "Supersonic Winds", detail: "Atmospheric jets race around the planet at extreme speeds.", latitude: 18, longitude: 55, color: "#8dbbff" },
      { id: "storm", label: "Dark Vortices", detail: "Large storms appear and disappear over a few years.", latitude: -23, longitude: -35, color: "#14255f" },
      { id: "triton", label: "Triton's Orbit", detail: "The largest moon travels backward, suggesting it was captured.", latitude: 58, longitude: 130, color: "#c5d9ff" },
    ],
    quiz: { question: "What helps power Neptune's violent weather?", options: ["Heat escaping from its interior", "Nearby solar flares", "Tides from Earth"], answer: "Heat escaping from its interior", explanation: "Neptune emits more energy than it receives from the distant Sun." },
  },
  {
    id: "moon", name: "Moon", symbol: "☾", category: "Natural satellite", kind: "moon",
    image: { src: "/celestial/moon.webp", sourceUrl: "https://science.nasa.gov/resource/moon-mosaic/", credit: "NASA/GSFC/Arizona State University" },
    texture: surfaceTexture("moon"),
    subtitle: "Earth's Ancient Companion", description: "A familiar cratered world that stabilizes Earth's tilt and raises its tides.",
    diameterKm: 3_475, massKg: 7.342e22, gravity: 1.62, temperatureC: -20, moons: 0,
    facts: fact("3,475 km", "7.342 × 10²² kg", "384,400 km from Earth", "27.3 Earth days", "27.3 Earth days", "0", "1.62 m/s²", "~-20°C average", "Silicate crust and mantle around a small iron core"),
    significance: "Lunar rocks preserve early Solar System history erased on geologically active Earth, and its surface is a platform for future exploration.",
    didYouKnow: "The Moon is moving away from Earth by about 3.8 centimetres each year.",
    accent: "#cbd4e0", secondary: "#f3f6fa", visual: { base: "#787f89", light: "#d5d8dd", dark: "#2d333c", tilt: 6.68, roughness: 1, spots: 40 },
    hotspots: [
      { id: "tranquility", label: "Sea of Tranquility", detail: "A dark basaltic plain and the landing site of Apollo 11.", latitude: 8.5, longitude: 31.4, color: "#77808c" },
      { id: "tycho", label: "Tycho Crater", detail: "A young impact crater surrounded by bright rays.", latitude: -43.3, longitude: -11.2, color: "#eef2f6" },
      { id: "far", label: "Far Side", detail: "A rugged hemisphere with fewer dark volcanic plains.", latitude: 20, longitude: 160, color: "#aeb5bd" },
    ],
    quiz: { question: "Why does the same lunar face usually point toward Earth?", options: ["It is tidally locked", "It does not rotate", "Earth's shadow holds it"], answer: "It is tidally locked", explanation: "The Moon rotates once during each orbit, keeping one hemisphere Earth-facing." },
  },
];

export const DEFAULT_OBJECT_ID: CelestialId = "earth";

export const celestialById = Object.fromEntries(
  celestialObjects.map((object) => [object.id, object]),
) as Record<CelestialId, CelestialObject>;
