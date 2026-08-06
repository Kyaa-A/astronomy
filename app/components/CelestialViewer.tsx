"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircleDotDashed, Cloud, Gauge, Layers3, Lock, Minus, Orbit, Plus, RefreshCcw,
  Rotate3D, Sparkles, Tags, Telescope, Unlock, X, ZoomIn,
} from "lucide-react";
import type { CelestialHotspot, CelestialObject } from "../lib/celestial-data";
import type { AtmospherePosition, CelestialViewer as ViewerInstance, LabelPosition, LayerPosition, OrbitPlanetPosition } from "../lib/three/celestial-viewer";

type Props = {
  object: CelestialObject;
  autoRotate: boolean;
  onAutoRotate: (enabled: boolean) => void;
  comparing: boolean;
  onCompare: () => void;
  orbiting: boolean;
  onOrbiting: (enabled: boolean) => void;
  onResetState?: () => void;
};

export function CelestialViewer({ object, autoRotate, onAutoRotate, comparing, onCompare, orbiting, onOrbiting, onResetState }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ViewerInstance | null>(null);
  const objectRef = useRef(object);
  const autoRotateRef = useRef(autoRotate);
  const [selected, setSelected] = useState<CelestialHotspot | null>(null);
  const [ready, setReady] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [labels, setLabels] = useState(true);
  const [layers, setLayers] = useState(false);
  const [relativeScale, setRelativeScale] = useState(false);

  // New control states
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(43);
  const [atmosphere, setAtmosphere] = useState(false);
  const [labelPositions, setLabelPositions] = useState<LabelPosition[]>([]);
  const [layerPositions, setLayerPositions] = useState<LayerPosition[]>([]);
  const [orbitPlanetPositions, setOrbitPlanetPositions] = useState<OrbitPlanetPosition[]>([]);
  const [atmospherePositions, setAtmospherePositions] = useState<AtmospherePosition[]>([]);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { objectRef.current = object; }, [object]);
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);

  const showStatus = useCallback((msg: string) => {
    clearTimeout(statusTimer.current);
    setStatusMessage(msg);
    statusTimer.current = setTimeout(() => setStatusMessage(null), 1800);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let viewer: ViewerInstance | null = null;
    void import("../lib/three/celestial-viewer").then(({ CelestialViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      try {
        viewer = new Viewer(mountRef.current, {
          onSelect: (hotspot) => {
            setSelected(hotspot);
            if (hotspot?.id === "atmosphere") {
              setAtmosphere(true);
            } else if (!hotspot) {
              setAtmosphere(false);
            }
          },
          onReady: setReady,
          onWebGLError: () => setWebglError(true),
          onZoomChange: setZoomLevel,
          onLabelsUpdate: setLabelPositions,
          onLayersUpdate: setLayerPositions,
          onOrbitPlanetsUpdate: setOrbitPlanetPositions,
          onAtmosphereUpdate: setAtmospherePositions,
        });
        viewerRef.current = viewer;
        viewer.setAutoRotate(autoRotateRef.current);
        viewer.setObject(objectRef.current);
      } catch {
        setWebglError(true);
        setReady(true);
      }
    });
    return () => { cancelled = true; viewerRef.current = null; viewer?.dispose(); };
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setAtmosphere(false);
    });
    viewerRef.current?.setAtmosphere(false);
    viewerRef.current?.setObject(object);
  }, [object]);
  useEffect(() => viewerRef.current?.setAutoRotate(autoRotate), [autoRotate]);
  useEffect(() => viewerRef.current?.setOrbit(orbiting), [orbiting]);



  const toggleLabels = () => {
    const next = !labels;
    setLabels(next);
    viewerRef.current?.setLabels(next);
    showStatus(next ? `${object.hotspots.length} surface labels shown` : "Labels hidden");
  };
  const toggleAtmosphere = () => {
    const next = !atmosphere;
    setAtmosphere(next);
    viewerRef.current?.setAtmosphere(next);
    showStatus(next ? "3D Atmosphere Shells active" : "Surface view restored");
  };
  const toggleLayers = () => {
    const next = !layers;
    setLayers(next);
    viewerRef.current?.setLayers(next);
    showStatus(next ? "Internal structure revealed" : "Surface view restored");
  };
  const toggleScale = () => {
    const next = !relativeScale;
    setRelativeScale(next);
    viewerRef.current?.setRelativeScale(next);
  };

  const handleTool = (id: string) => {
    if (id === "rotate") {
      onAutoRotate(!autoRotate);
      showStatus(!autoRotate ? "Auto-rotation enabled" : "Auto-rotation locked");
    }
    if (id === "zoom") {
      setZoomOpen((prev) => !prev);
    }
    if (id === "orbit") {
      onOrbiting(!orbiting);
      showStatus(!orbiting ? "Orbit simulation active" : "Orbit simulation stopped");
    }
    if (id === "atmosphere") toggleAtmosphere();
    if (id === "labels") toggleLabels();
    if (id === "layers") toggleLayers();
    if (id === "scale") {
      toggleScale();
      if (!comparing) onCompare();
      showStatus(!relativeScale ? "Relative scale comparison active" : "Comparison closed");
    }
    if (id === "reset") {
      const state = viewerRef.current?.reset();
      if (state) {
        onAutoRotate(state.autoRotate);
        setLabels(state.labels);
        setLayers(state.layers);
        setAtmosphere(false);
        setRelativeScale(state.relativeScale);
        onOrbiting(state.orbit);
        setZoomOpen(false);
        setLabelPositions([]);
        setLayerPositions([]);
        onResetState?.();
      }
      showStatus("View reset to default");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA") return;
      if (e.key === "r" || e.key === "R") handleTool("rotate");
      if (e.key === "z" || e.key === "Z") handleTool("zoom");
      if (e.key === "o" || e.key === "O") handleTool("orbit");
      if (e.key === "a" || e.key === "A") handleTool("atmosphere");
      if (e.key === "l" || e.key === "L") handleTool("labels");
      if (e.key === "y" || e.key === "Y") handleTool("layers");
      if (e.key === "c" || e.key === "C") handleTool("scale");
      if (e.key === "Escape") handleTool("reset");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate, orbiting, labels, layers, relativeScale, comparing, object]);

  const hasAtmosphere = object.hotspots.some((h) => h.id === "atmosphere");

  const tools = [
    { id: "rotate", label: autoRotate ? "Rotating (R)" : "Locked (R)", icon: autoRotate ? Rotate3D : Lock, active: autoRotate },
    { id: "zoom", label: `Zoom ${zoomLevel}% (Z)`, icon: ZoomIn, active: zoomOpen },
    { id: "orbit", label: "Orbit view (O)", icon: Orbit, active: orbiting },
    ...(hasAtmosphere ? [{ id: "atmosphere", label: "3D Atmosphere (A)", icon: Cloud, active: atmosphere }] : []),
    { id: "labels", label: `Labels · ${object.hotspots.length} (L)`, icon: Tags, active: labels, badge: object.hotspots.length },
    { id: "layers", label: "Internal layers (Y)", icon: Layers3, active: layers },
    { id: "scale", label: "Compare scale (C)", icon: Gauge, active: relativeScale || comparing },
    { id: "reset", label: "Reset view (Esc)", icon: RefreshCcw, active: false },
  ];

  return (
    <section className="viewer-shell" aria-label={`${object.name} interactive space viewer`}>
      <div className="viewer-aurora" style={{ "--object-accent": object.accent } as React.CSSProperties} />
      <div className="orbital-etching" aria-hidden="true"><i /><i /><i /></div>
      <div ref={mountRef} className="three-mount" />

      {webglError && (
        <div className="space-fallback" role="img" aria-label={`Stylized ${object.name}`}>
          <span style={{ "--planet-base": object.visual.base, "--planet-light": object.visual.light } as React.CSSProperties}>{object.symbol}</span>
          <p>Interactive 3D is unavailable in this browser.</p>
        </div>
      )}

      <div className="viewer-tools" aria-label="Celestial viewer tools">
        {tools.map(({ id, label, icon: Icon, active, badge }) => (
          <button key={id} type="button" className={`${active ? "active" : ""} ${id === "rotate" && !autoRotate ? "locked" : ""}`} onClick={() => handleTool(id)} aria-pressed={active} title={label}>
            <Icon size={18} strokeWidth={1.65} />
            <span>{label}</span>
            {badge !== undefined && <em className="tool-badge">{badge}</em>}
          </button>
        ))}
      </div>

      {/* Zoom panel */}
      {zoomOpen && (
        <div className="zoom-panel" aria-label="Zoom controls">
          <button type="button" onClick={() => viewerRef.current?.zoom(-1)} aria-label="Zoom in"><Plus size={14} /></button>
          <div className="zoom-track">
            <input type="range" min={0} max={100} value={zoomLevel} onChange={(e) => viewerRef.current?.zoomTo(Number(e.target.value))} aria-label="Zoom level" />
          </div>
          <button type="button" onClick={() => viewerRef.current?.zoom(1)} aria-label="Zoom out"><Minus size={14} /></button>
          <strong>{zoomLevel}%</strong>
        </div>
      )}

      {/* Orbit readout */}
      {orbiting && (
        <div className="orbit-readout" aria-label="Orbital position">
          <Orbit size={12} /> <span>Solar System Orbits · Mercury (57.9M km) to Neptune (4.5B km)</span>
        </div>
      )}

      {/* Floating label tags */}
      {labels && !layers && labelPositions.length > 0 && (
        <div className="label-overlay" aria-hidden="true">
          {labelPositions.map((lp) => {
            const isSelected = selected?.id === lp.id;
            return (
              <button
                key={lp.id}
                type="button"
                className={`label-tag ${lp.behind ? "behind" : ""} ${isSelected ? "active" : ""}`}
                style={{ transform: `translate3d(${lp.x}px, ${lp.y}px, 0)` }}
                onClick={() => {
                  const hs = object.hotspots.find((h) => h.id === lp.id);
                  if (hs) viewerRef.current?.focusHotspot(hs);
                }}
              >
                <i /><span>{lp.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Floating layer labels */}
      {layers && layerPositions.length > 0 && (
        <div className="label-overlay" aria-hidden="true">
          {layerPositions.map((lp) => (
            <div key={lp.name} className="layer-label" style={{ transform: `translate3d(${lp.x}px, ${lp.y}px, 0)`, "--layer-color": lp.color } as React.CSSProperties}>
              {lp.name}
            </div>
          ))}
        </div>
      )}

      {/* Floating orbit planet tags */}
      {orbiting && orbitPlanetPositions.length > 0 && (
        <div className="label-overlay" aria-hidden="true">
          {orbitPlanetPositions.map((op) => (
            <div key={op.id} className={`orbit-planet-tag ${op.isCurrent ? "current" : ""}`} style={{ transform: `translate3d(${op.x}px, ${op.y}px, 0)`, "--planet-color": op.color } as React.CSSProperties}>
              <i />
              <span><b>{op.name}</b><small>{op.dist} · {op.rank}</small></span>
            </div>
          ))}
        </div>
      )}

      {/* Floating 3D atmosphere layer tags */}
      {atmosphere && atmospherePositions.length > 0 && (
        <div className="label-overlay" aria-hidden="true">
          {atmospherePositions.map((ap) => (
            <div
              key={ap.id}
              className="atmosphere-shell-tag"
              style={{
                left: `${ap.x}px`,
                top: `${ap.y}px`,
                transform: `translate(-50%, -50%) scale(${ap.scale})`,
                color: ap.color,
              } as React.CSSProperties}
            >
              {ap.name}
            </div>
          ))}
        </div>
      )}

      <aside className={`viewer-tip ${selected ? "active-feature" : ""}`} aria-label={selected ? `${selected.label} details` : "Viewer instructions"}>
        {selected ? (
          <div className="top-right-callout" style={{ "--marker": selected.color } as React.CSSProperties}>
            <button type="button" className="callout-close-btn" onClick={() => viewerRef.current?.clearSelection()} aria-label="Close feature details"><X size={13} /></button>
            <small>Surface feature · {selected.latitude}°N {selected.longitude}°E</small>
            <b>{selected.label}</b>
            <p>{selected.detail}</p>
          </div>
        ) : (
          <>
            <span><Sparkles size={14} />Navigation</span>
            <p>Drag to rotate<br />Scroll or pinch to zoom<br />Select a marker to learn</p>
          </>
        )}
      </aside>

      <ul className="sr-only">
        {object.hotspots.map((hotspot) => <li key={hotspot.id}>{hotspot.label}: {hotspot.detail}</li>)}
      </ul>

      {!ready && !webglError && (
        <div className="model-loader" role="status" aria-live="polite">
          <span><CircleDotDashed size={28} /></span><strong>Charting {object.name}</strong><small>Generating celestial model</small>
        </div>
      )}

      <button className="auto-rotate" type="button" onClick={() => { onAutoRotate(!autoRotate); showStatus(!autoRotate ? "Auto-rotation enabled" : "Auto-rotation locked"); }} aria-pressed={autoRotate}>
        {autoRotate ? <Unlock size={14} /> : <Lock size={14} />} Auto-rotate <span className={autoRotate ? "switch on" : "switch"}><i /></span>
      </button>

      {/* Status toast */}
      {statusMessage && (
        <div className="viewer-status" role="status" aria-live="polite" key={statusMessage}>
          {statusMessage}
        </div>
      )}

      <div className="view-caption">
        <span><Telescope size={13} /> 3D celestial model — select a marker to explore</span>
        <strong>{object.symbol} {object.category}</strong>
      </div>
    </section>
  );
}
