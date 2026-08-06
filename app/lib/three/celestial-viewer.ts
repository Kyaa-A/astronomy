import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { CelestialHotspot, CelestialObject } from "../celestial-data";

export type LabelPosition = { id: string; name: string; x: number; y: number; behind: boolean };
export type LayerPosition = { name: string; color: string; x: number; y: number; scale?: number };

type ViewerCallbacks = {
  onSelect: (hotspot: CelestialHotspot | null) => void;
  onReady: (ready: boolean) => void;
  onWebGLError: () => void;
  onZoomChange?: (percent: number) => void;
  onLabelsUpdate?: (positions: LabelPosition[]) => void;
  onLayersUpdate?: (positions: LayerPosition[]) => void;
  onOrbitAngle?: (degrees: number) => void;
  onOrbitPlanetsUpdate?: (positions: OrbitPlanetPosition[]) => void;
  onAtmosphereUpdate?: (layers: AtmospherePosition[]) => void;
  onContinentsUpdate?: (continents: ContinentPosition[]) => void;
  onOceanSystemUpdate?: (oceans: OceanPosition[]) => void;
  onMagnetosphereUpdate?: (structures: MagnetospherePosition[]) => void;
};

const HOME_CAMERA = new THREE.Vector3(0, 0.3, 9.4);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const PLANET_RADIUS = 2;

export const PLANET_ORBITS = [
  { id: "mercury", radiusX: 3.2, radiusZ: 2.0, speed: 2.2, size: 0.18, color: "#b8c0c9", name: "Mercury", dist: "57.9M km · 1st from Sun", rank: "1st" },
  { id: "venus", radiusX: 5.0, radiusZ: 3.1, speed: 1.6, size: 0.24, color: "#f0b96b", name: "Venus", dist: "108.2M km · 2nd from Sun", rank: "2nd" },
  { id: "earth", radiusX: 7.0, radiusZ: 4.3, speed: 1.2, size: 0.26, color: "#64d8ff", name: "Earth", dist: "149.6M km · 3rd from Sun", rank: "3rd" },
  { id: "mars", radiusX: 9.2, radiusZ: 5.7, speed: 0.95, size: 0.20, color: "#f07b5d", name: "Mars", dist: "227.9M km · 4th from Sun", rank: "4th" },
  { id: "jupiter", radiusX: 12.0, radiusZ: 7.4, speed: 0.55, size: 0.58, color: "#e7ae83", name: "Jupiter", dist: "778.5M km · 5th from Sun", rank: "5th" },
  { id: "saturn", radiusX: 15.2, radiusZ: 9.4, speed: 0.40, size: 0.48, color: "#e9cf8d", name: "Saturn", dist: "1.43B km · 6th from Sun", rank: "6th" },
  { id: "uranus", radiusX: 18.5, radiusZ: 11.4, speed: 0.28, size: 0.38, color: "#86e6eb", name: "Uranus", dist: "2.87B km · 7th from Sun", rank: "7th" },
  { id: "neptune", radiusX: 22.0, radiusZ: 13.6, speed: 0.20, size: 0.36, color: "#557dff", name: "Neptune", dist: "4.50B km · 8th from Sun", rank: "8th" },
] as const;

export type OrbitPlanetPosition = {
  id: string;
  name: string;
  dist: string;
  rank: string;
  color: string;
  isCurrent: boolean;
  isInnerPlanet: boolean;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  zoomLevel: number;
};

export type AtmospherePosition = {
  id: string;
  name: string;
  range: string;
  temp: string;
  feature: string;
  color: string;
  x: number;
  y: number;
  scale: number;
  arcRadius: number;
  arcOffset: number;
};

export type ContinentPosition = {
  id: string;
  name: string;
  type: "continent" | "ocean";
  area: string;
  population?: string;
  color: string;
  x: number;
  y: number;
  behind: boolean;
  scale: number;
};

const CONTINENT_MARKERS = [
  { id: "africa", name: "Africa", type: "continent", latitude: 5, longitude: 20, area: "30.37M km²", population: "1.4B", color: "#74d39a" },
  { id: "antarctica", name: "Antarctica", type: "continent", latitude: -80, longitude: 0, area: "14.20M km²", population: "~1,000", color: "#a8d8ea" },
  { id: "asia", name: "Asia", type: "continent", latitude: 34, longitude: 100, area: "44.58M km²", population: "4.7B", color: "#f0b96b" },
  { id: "europe", name: "Europe", type: "continent", latitude: 50, longitude: 15, area: "10.18M km²", population: "750M", color: "#bd9cff" },
  { id: "north-america", name: "North America", type: "continent", latitude: 45, longitude: -100, area: "24.71M km²", population: "580M", color: "#64d8ff" },
  { id: "south-america", name: "South America", type: "continent", latitude: -15, longitude: -60, area: "17.84M km²", population: "430M", color: "#ff7eb3" },
  { id: "oceania", name: "Oceania", type: "continent", latitude: -25, longitude: 135, area: "8.53M km²", population: "45M", color: "#54d3ff" },
  { id: "pacific-ocean", name: "Pacific Ocean", type: "ocean", latitude: 0, longitude: -160, area: "165.25M km²", color: "#2bbcff" },
  { id: "atlantic-ocean", name: "Atlantic Ocean", type: "ocean", latitude: 0, longitude: -30, area: "106.46M km²", color: "#4488ff" },
  { id: "indian-ocean", name: "Indian Ocean", type: "ocean", latitude: -20, longitude: 80, area: "70.56M km²", color: "#22aadd" },
  { id: "arctic-ocean", name: "Arctic Ocean", type: "ocean", latitude: 85, longitude: 0, area: "14.06M km²", color: "#88ccee" },
  { id: "southern-ocean", name: "Southern Ocean", type: "ocean", latitude: -65, longitude: 0, area: "21.96M km²", color: "#66bbdd" },
] as const;

export type OceanPosition = {
  id: string;
  name: string;
  type: "basin" | "landmark";
  lat: number;
  lon: number;
  areaKm2?: string;
  avgDepthM?: string;
  deepestPoint?: string;
  climateRole: string;
  detail?: string;
  color: string;
  x: number;
  y: number;
  behind: boolean;
  scale: number;
};

export const OCEAN_SYSTEM_MARKERS = [
  { id: "pacific", name: "Pacific Ocean", type: "basin", lat: 0, lon: -160, areaKm2: "165.25M km²", avgDepthM: "4,280 m", deepestPoint: "Mariana Trench (10,994 m)", climateRole: "Largest heat reservoir on Earth, driving global weather patterns and El Niño cycles.", color: "#2bbcff" },
  { id: "atlantic", name: "Atlantic Ocean", type: "basin", lat: 10, lon: -30, areaKm2: "106.46M km²", avgDepthM: "3,646 m", deepestPoint: "Puerto Rico Trench (8,376 m)", climateRole: "Drives the Atlantic Meridional Overturning Circulation (AMOC) heat conveyor belt.", color: "#46c4ff" },
  { id: "indian", name: "Indian Ocean", type: "basin", lat: -20, lon: 80, areaKm2: "70.56M km²", avgDepthM: "3,741 m", deepestPoint: "Java Trench (7,258 m)", climateRole: "Powers Asian monsoon precipitation cycles and tropical thermal exchange.", color: "#00d5e8" },
  { id: "arctic", name: "Arctic Ocean", type: "basin", lat: 82, lon: 0, areaKm2: "14.06M km²", avgDepthM: "1,205 m", deepestPoint: "Molloy Hole (5,550 m)", climateRole: "Polar sea ice buffer regulating global planetary albedo and cold water sinking.", color: "#b0f0ff" },
  { id: "southern", name: "Southern Ocean", type: "basin", lat: -62, lon: 0, areaKm2: "21.96M km²", avgDepthM: "3,270 m", deepestPoint: "Factorian Deep (7,432 m)", climateRole: "Driven by circumpolar winds, storing up to 40% of anthropogenic carbon emissions.", color: "#6ce0ff" },
  { id: "mariana", name: "Mariana Trench", type: "landmark", lat: 11.35, lon: 142.2, deepestPoint: "Challenger Deep (10,994 m / 36,070 ft)", detail: "World's deepest oceanic trench.", climateRole: "Hadal subduction trench plunging nearly 11 km into Earth's crust.", color: "#72f7ff" },
  { id: "mid-atlantic", name: "Mid-Atlantic Ridge", type: "landmark", lat: 26, lon: -44, detail: "65,000 km volcanic underwater mountain belt.", climateRole: "Divergent seafloor spreading plate boundary continuously spawning new oceanic crust.", color: "#ffd15c" },
  { id: "pacific-gyre", name: "North Pacific Gyre", type: "landmark", lat: 28, lon: -170, detail: "Major ocean circulation system.", climateRole: "Clockwise wind-driven current system transferring equatorial heat across open Pacific.", color: "#5ce6ff" },
  { id: "atlantic-gyre", name: "North Atlantic Gyre", type: "landmark", lat: 30, lon: -40, detail: "Gulf Stream thermal engine.", climateRole: "Distributes tropical warmth northward to moderate North American & European climates.", color: "#7ae0ff" },
  { id: "circumpolar", name: "Antarctic Circumpolar Current", type: "landmark", lat: -55, lon: 0, detail: "Longest & strongest ocean current.", climateRole: "Massive uninhibited current delivering 135 million m³/s of ocean flow around Antarctica.", color: "#99ebff" },
] as const;

export type MagnetospherePosition = {
  id: string;
  name: string;
  role: string;
  detail: string;
  color: string;
  lat: number;
  lon: number;
  radiusOffset: number;
  x: number;
  y: number;
  behind: boolean;
  scale: number;
};

export const MAGNETOSPHERE_STRUCTURES = [
  { id: "bow-shock", name: "Bow Shock", role: "Supersonic Solar Wind Boundary", detail: "Curved shock wave formed where 400 km/s solar wind plasma abruptly decelerates upon hitting Earth's magnetic barrier.", color: "#ff6b8b", lat: 0, lon: 130, radiusOffset: 5.2 },
  { id: "magnetopause", name: "Magnetopause", role: "Outer Pressure Balance Barrier", detail: "Outer boundary of Earth's geomagnetic field where magnetic pressure balances inward solar wind dynamic pressure.", color: "#72f7ff", lat: 10, lon: 110, radiusOffset: 4.1 },
  { id: "van-allen", name: "Van Allen Belts", role: "Trapped Radiation Belts", detail: "Dual toroidal belts of high-energy protons and electrons captured from cosmic radiation by Earth's geomagnetic field.", color: "#c078ff", lat: 25, lon: -60, radiusOffset: 2.8 },
  { id: "auroral-oval", name: "Auroral Oval", role: "Polar Ionospheric Light Rings", detail: "Glowing polar rings produced when energetic solar particles funnel down geomagnetic lines into high atmospheric gases.", color: "#46ffb5", lat: 72, lon: 0, radiusOffset: 2.18 },
  { id: "magnetotail", name: "Magnetotail", role: "Nightside Magnetic Tail", detail: "Swept-back magnetic tail stretching millions of kilometers downwind away from the Sun on Earth's nightside.", color: "#5499ff", lat: -5, lon: -155, radiusOffset: 5.8 },
] as const;

const ATMOSPHERE_LAYERS_3D = [
  { id: "troposphere", name: "Troposphere", shellRadius: 2.22, labelRadius: 2.11, color: 0x5ee0a8, opacity: 0.38, range: "0–12 km (0–7.5 mi)", temp: "62°F to -60°F", feature: "Weather & Life Zone" },
  { id: "stratosphere", name: "Stratosphere", shellRadius: 2.48, labelRadius: 2.35, color: 0x48c9ff, opacity: 0.32, range: "12–50 km (7.5–31 mi)", temp: "-60°F to 5°F", feature: "Ozone Shield (O₃)" },
  { id: "mesosphere", name: "Mesosphere", shellRadius: 2.78, labelRadius: 2.63, color: 0x8668ff, opacity: 0.26, range: "50–85 km (31–53 mi)", temp: "5°F to -148°F", feature: "Coldest Layer (-90°C)" },
  { id: "thermosphere", name: "Thermosphere", shellRadius: 3.14, labelRadius: 2.96, color: 0x54d3ff, opacity: 0.20, range: "85–690 km (53–430 mi)", temp: "930°F to 3,600°F", feature: "Auroras & Kármán Line (100 km)" },
  { id: "exosphere", name: "Exosphere", shellRadius: 3.54, labelRadius: 3.34, color: 0x6174ff, opacity: 0.15, range: "690–10,000 km (430–6,200 mi)", temp: "Near Absolute Zero", feature: "Deep Space Fringe" },
] as const;



function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function hash(value: string) {
  return [...value].reduce((total, char) => ((total << 5) - total + char.charCodeAt(0)) | 0, 2166136261);
}

const fade = (value: number) => value * value * (3 - 2 * value);
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

function latticeNoise(x: number, y: number, seed: number) {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return value - Math.floor(value);
}

function smoothNoise(x: number, y: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = fade(x - x0);
  const ty = fade(y - y0);
  return mix(mix(latticeNoise(x0, y0, seed), latticeNoise(x0 + 1, y0, seed), tx), mix(latticeNoise(x0, y0 + 1, seed), latticeNoise(x0 + 1, y0 + 1, seed), tx), ty);
}

function fbm(x: number, y: number, seed: number, octaves = 5) {
  let total = 0;
  let amplitude = 0.54;
  let frequency = 1;
  let weight = 0;
  for (let index = 0; index < octaves; index += 1) {
    total += smoothNoise(x * frequency, y * frequency, seed + index * 17) * amplitude;
    weight += amplitude;
    frequency *= 2.03;
    amplitude *= 0.49;
  }
  return total / weight;
}

function colorMix(a: THREE.Color, b: THREE.Color, amount: number) {
  return a.clone().lerp(b, THREE.MathUtils.clamp(amount, 0, 1));
}

function createSurfaceTexture(object: CelestialObject) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  const image = context.createImageData(canvas.width, canvas.height);
  const base = new THREE.Color(object.visual.base);
  const light = new THREE.Color(object.visual.light);
  const dark = new THREE.Color(object.visual.dark);
  const seed = Math.abs(hash(object.id)) % 997;

  for (let y = 0; y < canvas.height; y += 1) {
    const v = y / canvas.height;
    const latitude = Math.abs(v * 2 - 1);
    for (let x = 0; x < canvas.width; x += 1) {
      const u = x / canvas.width;
      const warpX = fbm(u * 3.2, v * 3.2, seed + 41, 3) - 0.5;
      const warpY = fbm(u * 3.2, v * 3.2, seed + 79, 3) - 0.5;
      const detail = fbm(u * 5.1 + warpX * 1.4, v * 5.1 + warpY * 1.1, seed, 6);
      let color: THREE.Color;

      if (object.id === "earth") {
        const continental = fbm(u * 3.1 + warpX * 1.7, v * 3.25 + warpY * 1.5, seed + 12, 6);
        const polar = THREE.MathUtils.smoothstep(latitude, 0.76, 0.98);
        if (continental > 0.54 - Math.cos(v * Math.PI) * 0.015) {
          const elevation = THREE.MathUtils.smoothstep(continental, 0.54, 0.75);
          const dry = fbm(u * 7, v * 7, seed + 155, 4);
          const green = colorMix(new THREE.Color("#173f2f"), new THREE.Color("#66874a"), detail);
          const arid = colorMix(new THREE.Color("#755635"), new THREE.Color("#b29a68"), detail);
          color = colorMix(green, arid, THREE.MathUtils.smoothstep(dry + latitude * 0.08, 0.54, 0.7));
          color = colorMix(color, new THREE.Color("#aaa79c"), elevation * 0.42);
        } else {
          const depth = THREE.MathUtils.smoothstep(continental, 0.3, 0.54);
          color = colorMix(new THREE.Color("#041837"), new THREE.Color("#086f9a"), depth);
        }
        color = colorMix(color, new THREE.Color("#edf5fa"), polar);
      } else if (object.kind === "gas" || object.kind === "ice") {
        const bands = Math.sin(v * Math.PI * 2 * (object.visual.banding ?? 10) + warpX * 5);
        const fineBands = Math.sin(v * Math.PI * 52 + detail * 5);
        color = colorMix(dark, light, 0.5 + bands * 0.19 + fineBands * 0.07);
        color.lerp(base, 0.34);
      } else if (object.kind === "star") {
        const granule = fbm(u * 42, v * 22, seed, 4);
        color = colorMix(dark, light, THREE.MathUtils.smoothstep(granule, 0.28, 0.76));
        const magnetic = fbm(u * 8, v * 8, seed + 300, 5);
        if (magnetic > 0.7) color.lerp(new THREE.Color("#6e1708"), (magnetic - 0.7) * 2.4);
      } else {
        const terrain = detail * 0.72 + smoothNoise(u * 37, v * 19, seed + 9) * 0.28;
        color = colorMix(dark, light, THREE.MathUtils.smoothstep(terrain, 0.28, 0.74));
        color.lerp(base, 0.26);
        if (object.id === "mars") color.lerp(new THREE.Color("#a74725"), 0.32);
        if (object.id === "venus") color = colorMix(new THREE.Color("#8f4921"), new THREE.Color("#e2aa63"), detail);
      }

      const index = (y * canvas.width + x) * 4;
      image.data[index] = Math.round(color.r * 255);
      image.data[index + 1] = Math.round(color.g * 255);
      image.data[index + 2] = Math.round(color.b * 255);
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);

  const random = seededRandom(seed);
  if (object.kind === "rocky" || object.kind === "moon") {
    for (let index = 0; index < (object.visual.spots ?? 10); index += 1) {
      const radius = 2 + random() * (object.id === "earth" ? 4 : 18);
      const x = random() * canvas.width;
      const y = random() * canvas.height;
      const crater = context.createRadialGradient(x - radius * .22, y - radius * .22, radius * .08, x, y, radius);
      crater.addColorStop(0, "rgba(255,255,255,.18)"); crater.addColorStop(.22, "rgba(255,255,255,.05)"); crater.addColorStop(.52, "rgba(0,0,0,.22)"); crater.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = crater;
      context.beginPath(); context.ellipse(x, y, radius, radius * .72, random() * Math.PI, 0, Math.PI * 2); context.fill();
    }
  }

  if (object.id === "jupiter") {
    const storm = context.createRadialGradient(724, 330, 3, 724, 330, 66);
    storm.addColorStop(0, "#d58a68"); storm.addColorStop(.55, "#9d4735"); storm.addColorStop(1, "rgba(116,49,37,0)");
    context.fillStyle = storm; context.beginPath(); context.ellipse(724, 330, 70, 29, -.08, 0, Math.PI * 2); context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function createMarkerTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d")!;
  const glow = context.createRadialGradient(48, 48, 2, 48, 48, 45);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.14, "rgba(135,226,255,1)");
  glow.addColorStop(0.35, "rgba(99,102,241,.8)");
  glow.addColorStop(1, "rgba(99,102,241,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 96, 96);
  return new THREE.CanvasTexture(canvas);
}

function positionFromCoordinates(latitude: number, longitude: number, radius = PLANET_RADIUS * 1.035) {
  const phi = THREE.MathUtils.degToRad(90 - latitude);
  const theta = THREE.MathUtils.degToRad(longitude + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export class CelestialViewer {
  private container: HTMLElement;
  private callbacks: ViewerCallbacks;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private world = new THREE.Group();
  private body = new THREE.Group();
  private markerGroup = new THREE.Group();
  private layerGroup = new THREE.Group();
  private orbitGroup = new THREE.Group();
  private atmosphereGroup = new THREE.Group();
  private magnetosphereGroup = new THREE.Group();
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private frame = 0;
  private lastTime = performance.now();
  private current: CelestialObject | null = null;
  private markerTexture = createMarkerTexture();
  private textureLoader = new THREE.TextureLoader();
  private currentAlbedoMap: THREE.Texture | null = null;
  private currentNormalMap: THREE.Texture | null = null;
  private textureRequest = 0;
  private generatedTextures: THREE.Texture[] = [];
  private markerMap = new Map<THREE.Object3D, CelestialHotspot>();
  private selectedMarker: THREE.Sprite | null = null;
  private autoRotate = true;
  private labelsVisible = true;
  private orbiting = false;
  private layersVisible = false;
  private atmosphereVisible = false;
  private continentsVisible = false;
  private magnetosphereVisible = false;
  private oceanSystemVisible = false;
  private relativeScale = false;
  private visible = true;
  private disposed = false;
  private pointerStart = new THREE.Vector2();
  private dragged = false;
  private callout: HTMLElement | null = null;
  private lastZoomPercent = -1;
  private cameraTarget = { pos: HOME_CAMERA.clone(), target: HOME_TARGET.clone() };
  private cameraTweening = false;
  private layerMeshes: THREE.Mesh[] = [];
  private atmosphereMeshes: THREE.Mesh[] = [];
  private layerAnimFrame = 0;
  private rotAnimFrame = 0;
  private orbitPlanetMeshes: Map<string, THREE.Mesh> = new Map();
  private orbitLineMap: Map<string, THREE.LineLoop> = new Map();
  private selectionRingMesh: THREE.Mesh | null = null;
  private selectedOrbitPlanetId: string = "earth";
  private hoveredOrbitPlanetId: string | null = null;
  private oceanGroup = new THREE.Group();
  private currentLines: THREE.LineLoop[] = [];
  private surfaceMesh: THREE.Mesh | null = null;
  private cloudMesh: THREE.Mesh | null = null;
  private solarWindParticles: THREE.Points | null = null;
  private solarWindPositions: Float32Array = new Float32Array(0);
  private solarWindVelocities: Float32Array = new Float32Array(0);
  private auroralMeshes: THREE.Mesh[] = [];

  constructor(container: HTMLElement, callbacks: ViewerCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      callbacks.onWebGLError();
      throw new Error("WebGL is unavailable");
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.94;
    this.renderer.localClippingEnabled = true;
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute("aria-label", "Interactive celestial model. Drag to rotate, scroll to zoom, and select a marker to learn more.");
    container.appendChild(this.renderer.domElement);

    this.camera.position.copy(HOME_CAMERA);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enablePan = false;
    this.controls.zoomToCursor = true;
    this.controls.minDistance = 4.6;
    this.controls.maxDistance = 13;
    this.controls.target.copy(HOME_TARGET);
    this.controls.addEventListener("start", () => {
      this.cameraTweening = false;
    });

    this.scene.add(this.world);
    this.world.add(this.body, this.markerGroup, this.layerGroup, this.orbitGroup, this.atmosphereGroup);
    this.body.add(this.magnetosphereGroup, this.oceanGroup);
    this.buildEnvironment();
    this.createAtmosphereLayers();
    this.createMagnetosphere();
    this.createOceanGroup();

    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("keydown", this.onKeyDown);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    this.intersectionObserver = new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; }, { rootMargin: "120px" });
    this.intersectionObserver.observe(container);
    this.resize();
    this.animate();
  }

  private buildEnvironment() {
    this.scene.add(new THREE.AmbientLight(0x7b8cff, 0.52));
    const key = new THREE.DirectionalLight(0xfff4df, 4.4);
    key.position.set(4.5, 3.4, 5.8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x676dff, 2.1);
    rim.position.set(-5, 1.5, -4);
    this.scene.add(rim);

    const positions = new Float32Array(900 * 3);
    const random = seededRandom(7341);
    for (let index = 0; index < positions.length; index += 3) {
      const radius = 18 + random() * 42;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[index] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index + 1] = radius * Math.cos(phi);
      positions[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xb8ccff, size: 0.055, transparent: true, opacity: 0.72, sizeAttenuation: true });
    const stars = new THREE.Points(geometry, material);
    stars.name = "star-field";
    this.scene.add(stars);
  }

  setObject(object: CelestialObject) {
    void this.setTexturedObject(object);
  }

  private async setTexturedObject(object: CelestialObject) {
    const request = ++this.textureRequest;
    this.callbacks.onReady(false);
    this.clearObject();
    this.current = object;
    const entries = [
      ["albedo", object.texture.albedo],
      ["normal", object.texture.normal],
      ["emissive", object.texture.emissive],
      ["clouds", object.texture.clouds],
      ["atmosphere", object.texture.atmosphere],
      ["rings", object.texture.rings],
    ].filter((entry): entry is [string, string] => Boolean(entry[1]));
    let loaded: Record<string, THREE.Texture>;
    try {
      const textures = await Promise.all(entries.map(async ([key, path]) => {
        const texture = await this.textureLoader.loadAsync(path);
        texture.wrapS = THREE.RepeatWrapping;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        if (key !== "normal" && key !== "rings") texture.colorSpace = THREE.SRGBColorSpace;
        return [key, texture] as const;
      }));
      if (this.disposed || request !== this.textureRequest) {
        textures.forEach(([, texture]) => texture.dispose());
        return;
      }
      loaded = Object.fromEntries(textures);
      this.currentAlbedoMap = loaded.albedo ?? null;
      this.currentNormalMap = loaded.normal ?? null;
      this.generatedTextures.push(...textures.map(([, texture]) => texture));
    } catch {
      if (request !== this.textureRequest) return;
      const fallback = createSurfaceTexture(object);
      this.generatedTextures.push(fallback);
      loaded = { albedo: fallback };
      this.currentAlbedoMap = fallback;
      this.currentNormalMap = null;
    }

    const geometry = new THREE.SphereGeometry(PLANET_RADIUS, 96, 64);
    const material = new THREE.MeshStandardMaterial({
      map: loaded.albedo,
      normalMap: loaded.normal ?? null,
      normalScale: loaded.normal ? new THREE.Vector2(0.28, 0.28) : undefined,
      bumpMap: !loaded.normal && (object.kind === "rocky" || object.kind === "moon") ? loaded.albedo : null,
      bumpScale: object.id === "moon" ? 0.028 : 0.015,
      roughness: object.visual.roughness,
      metalness: 0.02,
      emissive: loaded.emissive ? new THREE.Color(0xffffff) : object.kind === "star" ? new THREE.Color(object.visual.base) : new THREE.Color(0x000000),
      emissiveMap: loaded.emissive ?? null,
      emissiveIntensity: loaded.emissive ? 0.2 : object.kind === "star" ? 1.15 : 0,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = "celestial-surface";
    this.surfaceMesh = sphere;
    this.body.add(sphere);
    this.body.rotation.z = THREE.MathUtils.degToRad(object.visual.tilt);
    this.markerGroup.rotation.z = this.body.rotation.z;

    const shellTexture = loaded.clouds ?? loaded.atmosphere;
    if (shellTexture) {
      const cloudShell = new THREE.Mesh(
        new THREE.SphereGeometry(PLANET_RADIUS * 1.012, 80, 56),
        new THREE.MeshStandardMaterial({
          map: shellTexture,
          transparent: true,
          opacity: loaded.clouds ? 0.48 : 0.32,
          depthWrite: false,
          roughness: 1,
          metalness: 0,
          blending: THREE.AdditiveBlending,
        }),
      );
      cloudShell.name = "cloud-shell";
      cloudShell.rotation.y = 0.18;
      this.cloudMesh = cloudShell;
      this.body.add(cloudShell);
    }

    if (object.visual.atmosphere) {
      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(PLANET_RADIUS * 1.055, 64, 48),
        new THREE.ShaderMaterial({
          uniforms: { glowColor: { value: new THREE.Color(object.visual.atmosphere) } },
          vertexShader: "varying vec3 vNormal; varying vec3 vWorldPosition; void main(){vNormal=normalize(normalMatrix*normal); vec4 world=modelMatrix*vec4(position,1.0); vWorldPosition=world.xyz; gl_Position=projectionMatrix*viewMatrix*world;}",
          fragmentShader: "uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vWorldPosition; void main(){vec3 viewDir=normalize(cameraPosition-vWorldPosition); float rim=pow(1.0-max(dot(vNormal,viewDir),0.0),2.3); gl_FragColor=vec4(glowColor,rim*.48);}",
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.FrontSide,
        }),
      );
      atmosphere.name = "atmosphere";
      this.body.add(atmosphere);
    }

    if (object.visual.rings) this.addRings(object.visual.rings, loaded.rings);
    this.addHotspots(object.hotspots);
    this.createInternalLayers(object);
    this.createOrbitScene(object);
    this.applyModes();
    this.reset();
    window.requestAnimationFrame(() => this.callbacks.onReady(true));
  }

  private addRings(colors: [string, string], sourceTexture?: THREE.Texture) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 32;
    const context = canvas.getContext("2d")!;
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, `${colors[1]}00`);
    gradient.addColorStop(0.12, colors[0]);
    gradient.addColorStop(0.28, colors[1]);
    gradient.addColorStop(0.42, colors[0]);
    gradient.addColorStop(0.48, `${colors[1]}33`);
    gradient.addColorStop(0.58, colors[0]);
    gradient.addColorStop(0.82, colors[1]);
    gradient.addColorStop(1, `${colors[0]}00`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = sourceTexture ?? new THREE.CanvasTexture(canvas);
    if (!sourceTexture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      this.generatedTextures.push(texture);
    }
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.55, 4.05, 160),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: 0.82 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.name = "rings";
    this.body.add(ring);
  }

  private addHotspots(hotspots: CelestialHotspot[]) {
    this.markerMap.clear();
    for (const hotspot of hotspots) {
      const material = new THREE.SpriteMaterial({ map: this.markerTexture, color: hotspot.color, transparent: true, depthWrite: false });
      const marker = new THREE.Sprite(material);
      marker.position.copy(positionFromCoordinates(hotspot.latitude, hotspot.longitude));
      marker.scale.setScalar(0.28);
      marker.userData.baseScale = 0.28;
      this.markerGroup.add(marker);
      this.markerMap.set(marker, hotspot);
    }
  }

  private createAtmosphereLayers() {
    this.atmosphereMeshes = [];
    ATMOSPHERE_LAYERS_3D.forEach((layer) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(layer.shellRadius, 48, 36),
        new THREE.MeshStandardMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
          roughness: 0.15,
        }),
      );
      mesh.userData = { ...layer, baseOpacity: layer.opacity };
      this.atmosphereGroup.add(mesh);
      this.atmosphereMeshes.push(mesh);
    });
  }

  private createMagnetosphere() {
    this.magnetosphereGroup.clear();
    this.auroralMeshes = [];
    const loops = 18;
    const pointsPerLoop = 64;

    // 1. Curved Cyan-Violet Dipole Field Lines (S to N loops)
    for (let i = 0; i < loops; i += 1) {
      const angle = (i / loops) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      for (let j = 0; j <= pointsPerLoop; j += 1) {
        const t = (j / pointsPerLoop) * Math.PI;
        const r = PLANET_RADIUS * (1.1 + 2.1 * Math.pow(Math.sin(t), 2));
        const x = r * Math.sin(t) * Math.cos(angle);
        const z = r * Math.sin(t) * Math.sin(angle);
        const y = PLANET_RADIUS * 1.65 * Math.cos(t);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x5ce6ff : 0xa664ff,
        transparent: true,
        opacity: 0.7,
      });
      const line = new THREE.Line(geometry, material);
      this.magnetosphereGroup.add(line);
    }

    // 2. Translucent Asymmetric Teardrop Magnetosphere Shell
    const shellGeom = new THREE.SphereGeometry(PLANET_RADIUS * 1.75, 64, 48);
    const posAttr = shellGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i += 1) {
      let x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      if (x > 0) {
        x *= 0.78; // Compressed dayside facing Sun
      } else {
        x *= 2.3;  // Extended magnetotail
      }
      posAttr.setXYZ(i, x, y, z);
    }
    shellGeom.computeVertexNormals();

    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x5c42ff,
      emissive: 0x2e18aa,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const shellMesh = new THREE.Mesh(shellGeom, shellMat);
    this.magnetosphereGroup.add(shellMesh);

    // 3. Thin Pulsing Green/Purple Auroral Rings (North & South Ovals)
    const northAuroralPos = positionFromCoordinates(72, 0, PLANET_RADIUS * 1.016);
    const southAuroralPos = positionFromCoordinates(-72, 0, PLANET_RADIUS * 1.016);
    const auroralRingGeom = new THREE.RingGeometry(0.32, 0.55, 36);
    const auroralMat = new THREE.MeshBasicMaterial({
      color: 0x46ffb5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const northAuroral = new THREE.Mesh(auroralRingGeom, auroralMat.clone());
    northAuroral.position.copy(northAuroralPos);
    northAuroral.lookAt(northAuroralPos.clone().multiplyScalar(2));
    this.magnetosphereGroup.add(northAuroral);
    this.auroralMeshes.push(northAuroral);

    const southAuroral = new THREE.Mesh(auroralRingGeom, auroralMat.clone());
    southAuroral.position.copy(southAuroralPos);
    southAuroral.lookAt(southAuroralPos.clone().multiplyScalar(2));
    this.magnetosphereGroup.add(southAuroral);
    this.auroralMeshes.push(southAuroral);

    // 4. Solar Wind Particle Stream (streaming along -X toward Earth)
    const particleCount = 180;
    this.solarWindPositions = new Float32Array(particleCount * 3);
    this.solarWindVelocities = new Float32Array(particleCount * 3);
    const seedRnd = seededRandom(9281);
    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3;
      this.solarWindPositions[index] = 10 + seedRnd() * 6; // Start on Sun side (+X)
      this.solarWindPositions[index + 1] = (seedRnd() - 0.5) * 6;
      this.solarWindPositions[index + 2] = (seedRnd() - 0.5) * 6;

      this.solarWindVelocities[index] = -0.07 - seedRnd() * 0.05;
      this.solarWindVelocities[index + 1] = 0;
      this.solarWindVelocities[index + 2] = 0;
    }

    const windGeom = new THREE.BufferGeometry();
    windGeom.setAttribute("position", new THREE.BufferAttribute(this.solarWindPositions, 3));
    const windMat = new THREE.PointsMaterial({
      color: 0x88eeff,
      size: 0.085,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    this.solarWindParticles = new THREE.Points(windGeom, windMat);
    this.magnetosphereGroup.add(this.solarWindParticles);

    this.magnetosphereGroup.visible = false;
  }

  private createOceanGroup() {
    this.oceanGroup.clear();
    this.currentLines = [];

    const geom = new THREE.SphereGeometry(PLANET_RADIUS * 1.008, 64, 48);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x11ccff,
      emissive: 0x085588,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.32,
      roughness: 0.1,
      metalness: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shell = new THREE.Mesh(geom, mat);
    this.oceanGroup.add(shell);

    const currentSpecs = [
      { lat: 28, lon: -170, radius: 0.6, color: 0x5ce6ff },
      { lat: 30, lon: -40, radius: 0.45, color: 0x7ae0ff },
      { lat: -55, lon: 0, radius: 1.75, color: 0x99ebff },
    ];

    currentSpecs.forEach((spec) => {
      const points: THREE.Vector3[] = [];
      const segments = 48;
      const center = positionFromCoordinates(spec.lat, spec.lon, PLANET_RADIUS * 1.012);
      for (let i = 0; i <= segments; i += 1) {
        const theta = (i / segments) * Math.PI * 2;
        const offset = new THREE.Vector3(
          Math.cos(theta) * spec.radius * 0.35,
          Math.sin(theta) * spec.radius * 0.35,
          0
        );
        const p = center.clone().add(offset).normalize().multiplyScalar(PLANET_RADIUS * 1.014);
        points.push(p);
      }
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: 0.65,
      });
      const line = new THREE.LineLoop(lineGeom, lineMat);
      this.currentLines.push(line);
      this.oceanGroup.add(line);
    });

    this.oceanGroup.visible = false;
  }

  private createInternalLayers(object: CelestialObject) {
    this.layerMeshes = [];
    this.layerGroup.clear();

    const isEarth = object.id === "earth";
    const layerDefs = isEarth ? [
      { name: "Crust", radius: 2.0, color: "#54b8ff", emissive: 0x000000, roughness: 0.78, useTexture: true },
      { name: "Mantle", radius: 1.65, color: "#b86a28", emissive: 0x000000, roughness: 0.7, useTexture: false },
      { name: "Liquid Outer Core", radius: 1.15, color: "#ff4400", emissive: 0xaa2200, roughness: 0.3, useTexture: false },
      { name: "Solid Inner Core", radius: 0.58, color: "#fff4ad", emissive: 0xffaa00, roughness: 0.2, useTexture: false },
    ] : [
      { name: "Crust", radius: 2.0, color: "#8c5828", emissive: 0x000000, roughness: 0.8, useTexture: true },
      { name: "Mantle", radius: 1.45, color: "#cc7733", emissive: 0x000000, roughness: 0.7, useTexture: false },
      { name: "Core", radius: 0.75, color: "#ffaa00", emissive: 0x663300, roughness: 0.3, useTexture: false },
    ];

    layerDefs.forEach((def, index) => {
      const isInnerMost = index === layerDefs.length - 1;
      const geom = isInnerMost
        ? new THREE.SphereGeometry(def.radius, 48, 36)
        : new THREE.SphereGeometry(def.radius, 64, 48, 0, Math.PI * 1.5);

      const mat = new THREE.MeshStandardMaterial({
        map: def.useTexture && this.currentAlbedoMap ? this.currentAlbedoMap : null,
        normalMap: def.useTexture && this.currentNormalMap ? this.currentNormalMap : null,
        color: def.useTexture && this.currentAlbedoMap ? 0xffffff : def.color,
        emissive: def.emissive,
        emissiveIntensity: def.emissive ? 0.6 : 0,
        roughness: def.roughness,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.userData = { layerName: def.name, layerColor: def.color, radius: def.radius, index };
      this.layerGroup.add(mesh);
      this.layerMeshes.push(mesh);
    });
  }

  private createOrbitScene(object: CelestialObject) {
    this.orbitPlanetMeshes.clear();
    this.orbitLineMap.clear();
    this.orbitGroup.clear();

    this.selectedOrbitPlanetId = object.id === "sun" ? "earth" : object.id === "moon" ? "earth" : object.id;

    // 1. Directional Sun Point Light & Central Sun Mesh
    const sunLight = new THREE.PointLight(0xfffaea, 3.8, 45);
    sunLight.position.set(0, 0, 0);
    this.orbitGroup.add(sunLight);

    const sunGeom = new THREE.SphereGeometry(0.72, 32, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffc15b });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunMesh.name = "orbit-sun";
    this.orbitGroup.add(sunMesh);

    // Subtle Sun Corona Glow Ring
    const coronaGeom = new THREE.RingGeometry(0.76, 1.25, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const coronaMesh = new THREE.Mesh(coronaGeom, coronaMat);
    coronaMesh.rotation.x = Math.PI * 0.5;
    this.orbitGroup.add(coronaMesh);

    // 2. Elliptical Orbit Rings and Planet Nodes for all 8 planets
    PLANET_ORBITS.forEach((p) => {
      const isSelected = p.id === this.selectedOrbitPlanetId;
      const curve = new THREE.EllipseCurve(0, 0, p.radiusX, p.radiusZ, 0, Math.PI * 2);
      const points = curve.getPoints(160).map((pt) => new THREE.Vector3(pt.x, 0, pt.y));
      const orbitLine = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: isSelected ? 0x70dcff : new THREE.Color(p.color),
          transparent: true,
          opacity: isSelected ? 0.95 : 0.28,
          linewidth: isSelected ? 2 : 1,
        }),
      );
      this.orbitGroup.add(orbitLine);
      this.orbitLineMap.set(p.id, orbitLine);

      // Planet sphere with directional shading
      const pMesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.size, 24, 18),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(p.color),
          roughness: 0.6,
          metalness: 0.05,
        }),
      );
      pMesh.userData = { id: p.id, name: p.name, dist: p.dist, rank: p.rank, color: p.color, radiusX: p.radiusX, radiusZ: p.radiusZ, speed: p.speed, isCurrent: isSelected, size: p.size };
      this.orbitGroup.add(pMesh);
      this.orbitPlanetMeshes.set(p.id, pMesh);
    });

    // 3. Selection Ring Mesh around active planet
    const selRingGeom = new THREE.RingGeometry(0.38, 0.54, 32);
    const selRingMat = new THREE.MeshBasicMaterial({
      color: 0x70dcff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    this.selectionRingMesh = new THREE.Mesh(selRingGeom, selRingMat);
    this.selectionRingMesh.rotation.x = Math.PI * 0.5;
    this.orbitGroup.add(this.selectionRingMesh);

    this.orbitGroup.rotation.x = Math.PI * 0.42;
    this.updateOrbitHighlighting();
  }

  private updateOrbitHighlighting() {
    PLANET_ORBITS.forEach((p) => {
      const line = this.orbitLineMap.get(p.id);
      if (!line) return;
      const isSelected = p.id === this.selectedOrbitPlanetId;
      const isHovered = p.id === this.hoveredOrbitPlanetId;

      const mat = line.material as THREE.LineBasicMaterial;
      if (isSelected) {
        mat.color.setHex(0x70dcff);
        mat.opacity = 0.95;
      } else if (isHovered) {
        mat.color.setHex(0x90e8ff);
        mat.opacity = 0.75;
      } else {
        mat.color.set(p.color);
        mat.opacity = 0.28; // Dimmed to 35-45%
      }
    });

    const activeMesh = this.orbitPlanetMeshes.get(this.selectedOrbitPlanetId);
    if (activeMesh && this.selectionRingMesh) {
      this.selectionRingMesh.position.copy(activeMesh.position);
      const size = (activeMesh.userData as { size: number }).size ?? 0.26;
      this.selectionRingMesh.scale.setScalar(size * 4.2);
    }
  }

  private applyModes() {
    this.markerGroup.visible = this.labelsVisible && !this.layersVisible && !this.orbiting && !this.atmosphereVisible && !this.continentsVisible && !this.magnetosphereVisible && !this.oceanSystemVisible;
    this.layerGroup.visible = this.layersVisible && !this.orbiting;
    this.orbitGroup.visible = this.orbiting;
    this.atmosphereGroup.visible = this.atmosphereVisible && !this.orbiting;
    this.magnetosphereGroup.visible = this.magnetosphereVisible && !this.orbiting;
    this.oceanGroup.visible = this.oceanSystemVisible && !this.orbiting;
    this.body.visible = !this.layersVisible && !this.orbiting;

    if (this.surfaceMesh) {
      const mat = this.surfaceMesh.material as THREE.MeshStandardMaterial;
      mat.color.setHex(this.magnetosphereVisible ? 0x445577 : 0xffffff);
      mat.emissiveIntensity = this.magnetosphereVisible ? 0.05 : 0.2;
    }
    if (this.cloudMesh) {
      const mat = this.cloudMesh.material as THREE.MeshStandardMaterial;
      mat.opacity = this.magnetosphereVisible ? 0.18 : 0.48;
    }

    const scale = this.relativeScale && this.current
      ? THREE.MathUtils.clamp(0.58 + Math.log10(this.current.diameterKm / 3_475) * 0.24, 0.52, 1.38)
      : 1;
    this.body.scale.setScalar(scale);
    this.markerGroup.scale.setScalar(scale);
    if (!this.labelsVisible) this.clearSelection();
  }

  setAutoRotate(enabled: boolean) { this.autoRotate = enabled; }
  setLabels(visible: boolean) { this.labelsVisible = visible; this.applyModes(); }
  setOrbit(enabled: boolean) {
    this.orbiting = enabled;
    if (enabled) {
      this.atmosphereVisible = false;
      this.continentsVisible = false;
      this.oceanSystemVisible = false;
      this.magnetosphereVisible = false;
      this.layersVisible = false;
      this.controls.maxDistance = 85;
      this.controls.minDistance = 2.5;
      this.applyModes();
      this.tweenCamera(new THREE.Vector3(0, 0.4, 13.5), HOME_TARGET);
    } else {
      this.controls.maxDistance = 13;
      this.controls.minDistance = 4.6;
      this.applyModes();
      const ringDist = this.current?.visual.rings ? 12.6 : HOME_CAMERA.z;
      const dist = this.container.clientWidth < 600 ? Math.max(11.35, ringDist) : ringDist;
      this.tweenCamera(new THREE.Vector3(HOME_CAMERA.x, HOME_CAMERA.y, dist), HOME_TARGET);
    }
  }

  selectOrbitPlanet(planetId: string) {
    this.selectedOrbitPlanetId = planetId;
    this.updateOrbitHighlighting();

    const mesh = this.orbitPlanetMeshes.get(planetId);
    if (mesh) {
      const worldPos = mesh.getWorldPosition(new THREE.Vector3());
      const camPos = new THREE.Vector3(worldPos.x * 0.65, 0.8, Math.max(8.5, worldPos.z * 0.65 + 6.0));
      this.tweenCamera(camPos, new THREE.Vector3(worldPos.x * 0.35, 0, worldPos.z * 0.35));
    }
  }

  setHoveredOrbitPlanet(planetId: string | null) {
    this.hoveredOrbitPlanetId = planetId;
    this.updateOrbitHighlighting();
  }

  focusInnerPlanets() {
    if (!this.orbiting) return;
    this.tweenCamera(new THREE.Vector3(0, 0.5, 6.2), HOME_TARGET);
  }

  resetOrbitView() {
    if (!this.orbiting) return;
    this.tweenCamera(new THREE.Vector3(0, 0.4, 13.5), HOME_TARGET);
  }
  setAtmosphere(enabled: boolean) {
    this.atmosphereVisible = enabled;
    if (enabled) {
      this.autoRotate = false;
      this.controls.enableRotate = false;
      this.controls.maxDistance = 15;
      this.controls.minDistance = 3.6;
      this.applyModes();
      // Position Earth top limb in bottom half of screen, centered at X = 0
      const topTarget = new THREE.Vector3(0, 1.6, 0);
      const topCamera = new THREE.Vector3(0, 2.2, 6.2);
      this.tweenCamera(topCamera, topTarget);
    } else {
      this.controls.enableRotate = true;
      this.controls.maxDistance = 13;
      this.controls.minDistance = 4.6;
      this.applyModes();
      this.tweenCamera(new THREE.Vector3(HOME_CAMERA.x, HOME_CAMERA.y, HOME_CAMERA.z), HOME_TARGET);
    }
  }

  setContinents(enabled: boolean) {
    this.continentsVisible = enabled;
    if (enabled) {
      this.autoRotate = true;
    }
    this.applyModes();
  }

  setMagnetosphere(enabled: boolean) {
    this.magnetosphereVisible = enabled;
    this.magnetosphereGroup.visible = enabled;
    if (enabled) {
      this.autoRotate = true;
      this.controls.enableRotate = true;
      this.controls.maxDistance = 18;
      const target = new THREE.Vector3(0, 0, 0);
      const cam = new THREE.Vector3(0, 0.4, 11.8);
      this.tweenCamera(cam, target);
    } else {
      this.controls.maxDistance = 13;
      this.tweenCamera(HOME_CAMERA.clone(), HOME_TARGET.clone());
    }
    this.applyModes();
  }

  setOceanSystem(enabled: boolean) {
    this.oceanSystemVisible = enabled;
    this.oceanGroup.visible = enabled;
    if (enabled) {
      this.autoRotate = true;
      // Modest rotation toward the Pacific Ocean (-150°) at normal scale
      this.body.rotation.x = THREE.MathUtils.degToRad(12);
      this.body.rotation.y = THREE.MathUtils.degToRad(-150);
      this.tweenCamera(HOME_CAMERA.clone(), HOME_TARGET.clone());
    }
    this.applyModes();
  }

  setLayers(enabled: boolean) {
    this.layersVisible = enabled;
    if (enabled) {
      this.autoRotate = true;
      this.controls.enableRotate = true;
      const target = new THREE.Vector3(0, 0, 0);
      const cam = new THREE.Vector3(0, 0, 7.5);
      this.tweenCamera(cam, target);
      this.body.rotation.x = 0;
      this.body.rotation.y = THREE.MathUtils.degToRad(90);
      this.layerGroup.rotation.x = 0;
      this.layerGroup.rotation.y = THREE.MathUtils.degToRad(90);
    } else {
      this.controls.enableRotate = true;
      this.tweenCamera(HOME_CAMERA.clone(), HOME_TARGET.clone());
    }
    this.applyModes();
  }
  setRelativeScale(enabled: boolean) { this.relativeScale = enabled; this.applyModes(); }

  zoom(direction: number) {
    this.cameraTweening = false;
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.multiplyScalar(direction > 0 ? 1.14 : 0.86);
    const distance = THREE.MathUtils.clamp(offset.length(), this.controls.minDistance, this.controls.maxDistance);
    offset.setLength(distance);
    this.camera.position.copy(this.controls.target).add(offset);
  }

  zoomTo(percent: number) {
    this.cameraTweening = false;
    const clamped = THREE.MathUtils.clamp(percent, 0, 100);
    const distance = this.controls.maxDistance - (clamped / 100) * (this.controls.maxDistance - this.controls.minDistance);
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.setLength(distance);
    this.camera.position.copy(this.controls.target).add(offset);
  }

  getZoomPercent(): number {
    const distance = this.camera.position.distanceTo(this.controls.target);
    return Math.round(((this.controls.maxDistance - distance) / (this.controls.maxDistance - this.controls.minDistance)) * 100);
  }

  getOrbitAngle(): number {
    if (!this.orbiting) return 0;
    const pos = this.body.position;
    return Math.round(((Math.atan2(pos.z, pos.x) * 180 / Math.PI) + 360) % 360);
  }

  getLabelPositions(): LabelPosition[] {
    if (!this.labelsVisible || this.layersVisible || this.atmosphereVisible) return [];
    const results: LabelPosition[] = [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    for (const [obj, hotspot] of this.markerMap) {
      const worldPos = obj.getWorldPosition(new THREE.Vector3());
      const camDir = worldPos.clone().sub(this.camera.position).normalize();
      const bodyCenter = this.body.getWorldPosition(new THREE.Vector3());
      const toCenter = bodyCenter.clone().sub(this.camera.position).normalize();
      const behind = camDir.dot(toCenter) > 0 && worldPos.distanceTo(this.camera.position) > bodyCenter.distanceTo(this.camera.position);
      const projected = worldPos.clone().project(this.camera);
      results.push({
        id: hotspot.id,
        name: hotspot.label,
        x: (projected.x * 0.5 + 0.5) * w,
        y: (-projected.y * 0.5 + 0.5) * h,
        behind,
      });
    }
    return results;
  }

  getLayerPositions(): LayerPosition[] {
    if (!this.layersVisible) return [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const distance = this.camera.position.distanceTo(this.controls.target);
    const scale = THREE.MathUtils.clamp(7.5 / distance, 0.65, 2.0);

    // Exact positions radiating out along the top-left 45° angle over each cutaway ring
    const labelOffsets = [
      new THREE.Vector3(-0.08, 1.38, -1.38), // Crust (thin outermost edge)
      new THREE.Vector3(-0.08, 1.02, -1.02), // Mantle (slowly convecting solid rock)
      new THREE.Vector3(-0.08, 0.64, -0.64), // Liquid Outer Core (bright red-orange ring)
      new THREE.Vector3(-0.08, 0.22, -0.22), // Solid Inner Core (pale yellow/white central sphere)
    ];

    return this.layerMeshes.map((mesh, index) => {
      const offset = labelOffsets[index] ?? new THREE.Vector3(0.0, 0.0, 0.4);
      const localPos = offset.clone();
      localPos.applyEuler(this.layerGroup.rotation);
      const worldPos = this.body.getWorldPosition(new THREE.Vector3()).add(localPos);
      const projected = worldPos.project(this.camera);
      return {
        name: mesh.userData.layerName as string,
        color: mesh.userData.layerColor as string,
        x: (projected.x * 0.5 + 0.5) * w,
        y: (-projected.y * 0.5 + 0.5) * h,
        scale,
      };
    });
  }

  getOrbitPlanetPositions(): OrbitPlanetPosition[] {
    if (!this.orbiting) return [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const distanceToTarget = this.camera.position.distanceTo(this.controls.target);
    const zoomLevel = distanceToTarget;
    const rawProjections: { id: string; name: string; dist: string; rank: string; color: string; isCurrent: boolean; isInnerPlanet: boolean; projX: number; projY: number }[] = [];

    this.orbitPlanetMeshes.forEach((mesh) => {
      const worldPos = mesh.getWorldPosition(new THREE.Vector3());
      const projected = worldPos.clone().project(this.camera);
      const data = mesh.userData as { id: string; name: string; dist: string; rank: string; color: string; isCurrent: boolean };
      const isInner = ["mercury", "venus", "earth", "mars"].includes(data.id);

      rawProjections.push({
        id: data.id,
        name: data.name,
        dist: data.dist,
        rank: data.rank,
        color: data.color,
        isCurrent: data.id === this.selectedOrbitPlanetId,
        isInnerPlanet: isInner,
        projX: (projected.x * 0.5 + 0.5) * w,
        projY: (-projected.y * 0.5 + 0.5) * h,
      });
    });

    // Collision-avoidance & vertical/horizontal staggering calculation
    const results: OrbitPlanetPosition[] = [];
    rawProjections.forEach((p, idx) => {
      let offsetX = 0;
      let offsetY = 0;

      // Stagger inner planets when zoomed far out
      if (zoomLevel > 9.5 && p.isInnerPlanet) {
        if (p.id === "mercury") { offsetY = -28; offsetX = -18; }
        else if (p.id === "venus") { offsetY = 28; offsetX = 18; }
        else if (p.id === "earth") { offsetY = -34; offsetX = 24; }
        else if (p.id === "mars") { offsetY = 34; offsetX = -24; }
      }

      // Check collision against previous processed planet labels
      for (let j = 0; j < idx; j += 1) {
        const prev = results[j];
        const dx = Math.abs((p.projX + offsetX) - (prev.x + prev.offsetX));
        const dy = Math.abs((p.projY + offsetY) - (prev.y + prev.offsetY));
        if (dx < 75 && dy < 32) {
          offsetY += (p.projY >= prev.y ? 32 : -32);
          offsetX += (p.projX >= prev.x ? 25 : -25);
        }
      }

      results.push({
        id: p.id,
        name: p.name,
        dist: p.dist,
        rank: p.rank,
        color: p.color,
        isCurrent: p.isCurrent,
        isInnerPlanet: p.isInnerPlanet,
        x: p.projX,
        y: p.projY,
        offsetX,
        offsetY,
        zoomLevel,
      });
    });

    return results;
  }

  getAtmospherePositions(): AtmospherePosition[] {
    if (!this.atmosphereVisible) return [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const distance = this.camera.position.distanceTo(this.controls.target);
    const scale = THREE.MathUtils.clamp(7.5 / distance, 0.65, 2.0);

    // Project a point directly above the camera target to find the screen-center X.
    // This compensates for zoomToCursor and any camera drift away from X = 0.
    const centerProbe = new THREE.Vector3(this.controls.target.x, 0, this.controls.target.z).project(this.camera);
    const screenCenterX = (centerProbe.x * 0.5 + 0.5) * w;

    return this.atmosphereMeshes.map((mesh) => {
      const data = mesh.userData as { id: string; name: string; labelRadius: number; range: string; temp: string; feature: string; color: number };
      const r = data.labelRadius;
      const worldPos = new THREE.Vector3(this.controls.target.x, r, this.controls.target.z);
      const projected = worldPos.project(this.camera);
      return {
        id: data.id,
        name: data.name,
        range: data.range,
        temp: data.temp,
        feature: data.feature,
        color: `#${data.color.toString(16).padStart(6, "0")}`,
        x: screenCenterX,
        y: (-projected.y * 0.5 + 0.5) * h,
        scale,
        arcRadius: 0,
        arcOffset: 0,
      };
    });
  }

  getContinentPositions(): ContinentPosition[] {
    if (!this.continentsVisible) return [];
    const results: ContinentPosition[] = [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const distance = this.camera.position.distanceTo(this.controls.target);
    const scale = THREE.MathUtils.clamp(8.0 / distance, 0.7, 1.8);
    const bodyCenter = this.body.getWorldPosition(new THREE.Vector3());

    for (const marker of CONTINENT_MARKERS) {
      const localPos = positionFromCoordinates(marker.latitude, marker.longitude, PLANET_RADIUS * 1.04);
      localPos.applyEuler(this.body.rotation);
      const worldPos = bodyCenter.clone().add(localPos);

      const camDir = worldPos.clone().sub(this.camera.position).normalize();
      const toCenter = bodyCenter.clone().sub(this.camera.position).normalize();
      const behind = camDir.dot(toCenter) > 0 && worldPos.distanceTo(this.camera.position) > bodyCenter.distanceTo(this.camera.position);

      const projected = worldPos.clone().project(this.camera);
      results.push({
        id: marker.id,
        name: marker.name,
        type: marker.type,
        area: marker.area,
        population: "population" in marker ? marker.population : undefined,
        color: marker.color,
        x: (projected.x * 0.5 + 0.5) * w,
        y: (-projected.y * 0.5 + 0.5) * h,
        behind,
        scale,
      });
    }
    return results;
  }

  getOceanPositions(): OceanPosition[] {
    if (!this.oceanSystemVisible) return [];
    const results: OceanPosition[] = [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const distance = this.camera.position.distanceTo(this.controls.target);
    const scale = THREE.MathUtils.clamp(8.0 / distance, 0.7, 1.8);
    const bodyCenter = this.body.getWorldPosition(new THREE.Vector3());

    for (const marker of OCEAN_SYSTEM_MARKERS) {
      const localPos = positionFromCoordinates(marker.lat, marker.lon, PLANET_RADIUS * 1.04);
      localPos.applyEuler(this.body.rotation);
      const worldPos = bodyCenter.clone().add(localPos);

      const camDir = worldPos.clone().sub(this.camera.position).normalize();
      const toCenter = bodyCenter.clone().sub(this.camera.position).normalize();
      const behind = camDir.dot(toCenter) > 0 && worldPos.distanceTo(this.camera.position) > bodyCenter.distanceTo(this.camera.position);

      const projected = worldPos.clone().project(this.camera);
      results.push({
        id: marker.id,
        name: marker.name,
        type: marker.type,
        lat: marker.lat,
        lon: marker.lon,
        areaKm2: "areaKm2" in marker ? marker.areaKm2 : undefined,
        avgDepthM: "avgDepthM" in marker ? marker.avgDepthM : undefined,
        deepestPoint: "deepestPoint" in marker ? marker.deepestPoint : undefined,
        climateRole: marker.climateRole,
        detail: "detail" in marker ? marker.detail : undefined,
        color: marker.color,
        x: (projected.x * 0.5 + 0.5) * w,
        y: (-projected.y * 0.5 + 0.5) * h,
        behind,
        scale,
      });
    }
    return results;
  }

  getMagnetospherePositions(): MagnetospherePosition[] {
    if (!this.magnetosphereVisible) return [];
    const results: MagnetospherePosition[] = [];
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const distance = this.camera.position.distanceTo(this.controls.target);
    const scale = THREE.MathUtils.clamp(8.0 / distance, 0.7, 1.8);
    const bodyCenter = this.body.getWorldPosition(new THREE.Vector3());

    for (const marker of MAGNETOSPHERE_STRUCTURES) {
      const localPos = positionFromCoordinates(marker.lat, marker.lon, PLANET_RADIUS * marker.radiusOffset);
      localPos.applyEuler(this.body.rotation);
      const worldPos = bodyCenter.clone().add(localPos);

      const camDir = worldPos.clone().sub(this.camera.position).normalize();
      const toCenter = bodyCenter.clone().sub(this.camera.position).normalize();
      const behind = camDir.dot(toCenter) > 0 && worldPos.distanceTo(this.camera.position) > bodyCenter.distanceTo(this.camera.position);

      const projected = worldPos.clone().project(this.camera);
      results.push({
        id: marker.id,
        name: marker.name,
        role: marker.role,
        detail: marker.detail,
        color: marker.color,
        lat: marker.lat,
        lon: marker.lon,
        radiusOffset: marker.radiusOffset,
        x: (projected.x * 0.5 + 0.5) * w,
        y: (-projected.y * 0.5 + 0.5) * h,
        behind,
        scale,
      });
    }
    return results;
  }

  private cameraTweenStartTime = 0;

  private tweenCamera(pos: THREE.Vector3, target: THREE.Vector3) {
    this.cameraTarget = { pos: pos.clone(), target: target.clone() };
    this.cameraTweening = true;
    this.cameraTweenStartTime = performance.now();
  }

  private updateCameraTween(delta: number) {
    if (!this.cameraTweening) return;
    const elapsed = performance.now() - this.cameraTweenStartTime;
    if (elapsed > 900 || this.camera.position.distanceTo(this.cameraTarget.pos) < 0.05) {
      this.camera.position.copy(this.cameraTarget.pos);
      this.controls.target.copy(this.cameraTarget.target);
      this.cameraTweening = false;
      return;
    }
    const speed = 4.5 * delta;
    this.camera.position.lerp(this.cameraTarget.pos, speed);
    this.controls.target.lerp(this.cameraTarget.target, speed);
  }

  reset(): { autoRotate: boolean; labels: boolean; layers: boolean; orbit: boolean; relativeScale: boolean } {
    this.autoRotate = true;
    this.labelsVisible = true;
    this.layersVisible = false;
    this.orbiting = false;
    this.atmosphereVisible = false;
    this.controls.enableRotate = true;
    this.relativeScale = false;
    this.controls.maxDistance = 13;
    this.controls.minDistance = 4.6;
    this.applyModes();
    const ringDistance = this.current?.visual.rings ? 12.6 : HOME_CAMERA.z;
    const distance = this.container.clientWidth < 600 ? Math.max(11.35, ringDistance) : ringDistance;
    this.tweenCamera(new THREE.Vector3(HOME_CAMERA.x, HOME_CAMERA.y, distance), HOME_TARGET);
    this.body.rotation.y = 0;
    this.body.rotation.x = 0;
    this.clearSelection();
    return { autoRotate: true, labels: true, layers: false, orbit: false, relativeScale: false };
  }

  attachCallout(element: HTMLElement | null) { this.callout = element; }

  clearSelection() {
    if (this.selectedMarker) this.selectedMarker.scale.setScalar(this.selectedMarker.userData.baseScale ?? 0.28);
    this.selectedMarker = null;
    this.callbacks.onSelect(null);
  }

  private updateCallout() {
    if (!this.callout || !this.selectedMarker) return;
    const position = this.selectedMarker.getWorldPosition(new THREE.Vector3()).project(this.camera);
    const x = (position.x * 0.5 + 0.5) * this.container.clientWidth;
    const y = (-position.y * 0.5 + 0.5) * this.container.clientHeight;
    this.callout.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  private onPointerDown = (event: PointerEvent) => {
    this.cameraTweening = false;
    this.pointerStart.set(event.clientX, event.clientY);
    this.dragged = false;
  };

  focusHotspot(hotspot: CelestialHotspot) {
    let targetSprite: THREE.Sprite | null = null;
    for (const [sprite, data] of this.markerMap) {
      if (data.id === hotspot.id) {
        targetSprite = sprite as THREE.Sprite;
        break;
      }
    }

    this.clearSelection();
    if (targetSprite) {
      this.selectedMarker = targetSprite;
      targetSprite.scale.setScalar(0.48);
    }
    this.callbacks.onSelect(hotspot);

    if (hotspot.id === "atmosphere") {
      this.setAtmosphere(true);
      return;
    }
    if (hotspot.id === "continents") {
      this.setContinents(true);
      return;
    }
    if (hotspot.id === "magnetosphere") {
      this.setMagnetosphere(true);
      return;
    }
    if (hotspot.id === "core") {
      this.setLayers(true);
      return;
    }

    // Zoom camera in close for feature inspection
    const focusDistance = this.container.clientWidth < 600 ? 7.2 : 5.6;
    const currentTarget = this.controls.target.clone();
    const offset = this.camera.position.clone().sub(currentTarget).normalize().multiplyScalar(focusDistance);
    this.tweenCamera(currentTarget.clone().add(offset), currentTarget);

    // Smoothly rotate the planet so the feature directly faces front
    const targetRotY = THREE.MathUtils.degToRad(-hotspot.longitude - 90);
    const targetRotX = THREE.MathUtils.degToRad(hotspot.latitude * 0.7);
    this.animateBodyRotation(targetRotY, targetRotX);
  }

  focusHotspotById(id: string) {
    if (!this.current) return;
    const hs = this.current.hotspots.find((h) => h.id === id);
    if (hs) this.focusHotspot(hs);
  }

  private animateBodyRotation(targetY: number, targetX: number) {
    cancelAnimationFrame(this.rotAnimFrame);
    const start = performance.now();
    const duration = 750;
    const startY = this.body.rotation.y;
    const startX = this.body.rotation.x;
    const step = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / duration);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      this.body.rotation.y = startY + (targetY - startY) * ease;
      this.body.rotation.x = startX + (targetX - startX) * ease;
      this.markerGroup.rotation.y = this.body.rotation.y;
      this.markerGroup.rotation.x = this.body.rotation.x;
      if (t < 1) this.rotAnimFrame = requestAnimationFrame(step);
    };
    this.rotAnimFrame = requestAnimationFrame(step);
  }

  private onPointerUp = (event: PointerEvent) => {
    if (this.pointerStart.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 5 || this.dragged) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects([...this.markerMap.keys()], false)[0]?.object as THREE.Sprite | undefined;
    if (!hit) {
      this.clearSelection();
      if (this.atmosphereVisible) {
        this.setAtmosphere(false);
      }
      return;
    }
    const hotspot = this.markerMap.get(hit);
    if (hotspot) {
      this.focusHotspot(hotspot);
    } else {
      this.clearSelection();
      this.selectedMarker = hit;
      hit.scale.setScalar(0.48);
    }
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") this.clearSelection();
    if (event.key === "+" || event.key === "=") this.zoom(-1);
    if (event.key === "-") this.zoom(1);
    if (event.key.startsWith("Arrow")) {
      event.preventDefault();
      const amount = 0.08;
      if (event.key === "ArrowLeft") this.body.rotation.y -= amount;
      if (event.key === "ArrowRight") this.body.rotation.y += amount;
      if (event.key === "ArrowUp") this.body.rotation.x -= amount;
      if (event.key === "ArrowDown") this.body.rotation.x += amount;
    }
  };

  private resize = () => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private animate = (time = performance.now()) => {
    if (this.disposed) return;
    this.frame = window.requestAnimationFrame(this.animate);
    if (!this.visible) return;
    const delta = Math.min(0.05, (time - this.lastTime) / 1000);
    this.lastTime = time;
    this.updateCameraTween(delta);
    if (this.autoRotate && !this.layersVisible) this.body.rotation.y += delta * (this.current?.kind === "star" ? 0.12 : 0.19);
    const cloudShell = this.body.getObjectByName("cloud-shell");
    if (cloudShell && this.autoRotate) cloudShell.rotation.y += delta * 0.025;
    if (this.autoRotate) this.markerGroup.rotation.y = this.body.rotation.y;
    if (this.orbiting) {
      const timeSec = time * 0.0003;
      this.orbitPlanetMeshes.forEach((mesh) => {
        const u = mesh.userData as { radiusX: number; radiusZ: number; speed: number };
        const angle = timeSec * u.speed;
        mesh.position.set(Math.cos(angle) * u.radiusX, 0, Math.sin(angle) * u.radiusZ);
      });
      // Move body to 0 for overall view
      this.body.position.set(0, 0, 0);
      this.markerGroup.position.set(0, 0, 0);
      this.callbacks.onOrbitAngle?.(this.getOrbitAngle());
      this.callbacks.onOrbitPlanetsUpdate?.(this.getOrbitPlanetPositions());
    } else {
      this.body.position.set(0, 0, 0);
      this.markerGroup.position.set(0, 0, 0);
    }
    // Zoom change callback
    const zp = this.getZoomPercent();
    if (zp !== this.lastZoomPercent) {
      this.lastZoomPercent = zp;
      this.callbacks.onZoomChange?.(zp);
    }
    // Label position callback
    if (this.labelsVisible && !this.layersVisible) {
      this.callbacks.onLabelsUpdate?.(this.getLabelPositions());
    }
    // Layer position callback
    if (this.layersVisible) {
      this.callbacks.onLayersUpdate?.(this.getLayerPositions());
    }
    // Atmosphere position callback
    if (this.atmosphereVisible) {
      this.atmosphereGroup.rotation.y += delta * 0.05;
      this.callbacks.onAtmosphereUpdate?.(this.getAtmospherePositions());
    }
    // Continent position callback
    if (this.continentsVisible) {
      this.callbacks.onContinentsUpdate?.(this.getContinentPositions());
    }
    // Ocean system position callback
    if (this.oceanSystemVisible) {
      this.currentLines.forEach((line, idx) => {
        line.rotation.z += delta * (0.15 + idx * 0.05);
      });
      this.callbacks.onOceanSystemUpdate?.(this.getOceanPositions());
    }
    // Magnetosphere position callback & animations
    if (this.magnetosphereVisible) {
      const pulse = 0.55 + 0.35 * Math.sin(time * 0.0035);
      this.auroralMeshes.forEach((m) => {
        (m.material as THREE.MeshBasicMaterial).opacity = pulse;
      });

      if (this.solarWindParticles) {
        const positions = this.solarWindParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += this.solarWindVelocities[i]; // Stream toward -X
          const y = positions[i + 1];
          const z = positions[i + 2];
          const distToAxis = Math.sqrt(y * y + z * z);
          const x = positions[i];

          // Deflect around bow shock / magnetopause when approaching dayside (+X ~ 3.5)
          if (x > -3.0 && x < 4.8 && distToAxis < 3.2) {
            const factor = 1.035;
            positions[i + 1] *= factor;
            positions[i + 2] *= factor;
          }

          // Reset particle to Sun side (+X) when past magnetotail (-10)
          if (positions[i] < -10) {
            positions[i] = 11 + Math.random() * 4;
            positions[i + 1] = (Math.random() - 0.5) * 6;
            positions[i + 2] = (Math.random() - 0.5) * 6;
          }
        }
        this.solarWindParticles.geometry.attributes.position.needsUpdate = true;
      }

      this.callbacks.onMagnetosphereUpdate?.(this.getMagnetospherePositions());
    }
    this.controls.update(delta);
    this.updateCallout();
    this.renderer.render(this.scene, this.camera);
  };

  private clearObject() {
    this.clearSelection();
    for (const group of [this.body, this.markerGroup, this.layerGroup, this.orbitGroup]) {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
          child.geometry?.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
        if (child instanceof THREE.Sprite) child.material.dispose();
      });
      group.clear();
      group.position.set(0, 0, 0);
      group.scale.setScalar(1);
    }
    this.generatedTextures.forEach((texture) => texture.dispose());
    this.generatedTextures = [];
    this.markerMap.clear();
  }

  dispose() {
    this.disposed = true;
    this.textureRequest += 1;
    window.cancelAnimationFrame(this.frame);
    this.clearObject();
    this.markerTexture.dispose();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.controls.dispose();
    this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.removeEventListener("keydown", this.onKeyDown);
    this.scene.traverse((child) => {
      if (child instanceof THREE.Points) { child.geometry.dispose(); child.material.dispose(); }
    });
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
