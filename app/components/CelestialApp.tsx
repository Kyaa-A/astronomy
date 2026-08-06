"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Compass,
  FileText, Heart, LibraryBig, Menu, NotebookPen, Orbit, Play, Rocket,
  Search, Sparkles, Telescope, X,
} from "lucide-react";
import { CelestialViewer } from "./CelestialViewer";
import { celestialById, celestialObjects, DEFAULT_OBJECT_ID, type CelestialId, type CelestialObject } from "../lib/celestial-data";

type Modal = "lesson" | "quiz" | "missions" | null;

function ObjectGlyph({ object, small = false }: { object: CelestialObject; small?: boolean }) {
  return (
    <span
      className={`object-glyph ${object.visual.rings ? "ringed" : ""} ${small ? "small" : ""}`}
      style={{
        "--planet-base": object.visual.base,
        "--planet-light": object.visual.light,
        "--planet-dark": object.visual.dark,
        "--planet-accent": object.accent,
      } as React.CSSProperties}
      aria-hidden="true"
    ><span className="object-photo" style={{ backgroundImage: `url(${object.image.src})` }} /><i /></span>
  );
}

export function CelestialApp() {
  const [objectId, setObjectId] = useState<CelestialId>(DEFAULT_OBJECT_ID);
  const [autoRotate, setAutoRotate] = useState(true);
  const [orbiting, setOrbiting] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<CelestialId>>(() => new Set(["earth"]));
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [compareId, setCompareId] = useState<CelestialId>("jupiter");
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Explore");
  const contentRef = useRef<HTMLElement>(null);
  const object = celestialById[objectId];
  const comparison = celestialById[compareId === objectId ? (objectId === "earth" ? "jupiter" : "earth") : compareId];
  const filteredObjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return celestialObjects;
    return celestialObjects.filter((item) => `${item.name} ${item.category} ${item.subtitle}`.toLowerCase().includes(term));
  }, [query]);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.42, stagger: 0.025, ease: "power2.out", overwrite: true },
    );
  }, [objectId]);

  const selectObject = (id: CelestialId) => {
    setObjectId(id);
    setLibraryOpen(false);
    setOrbiting(false);
  };

  const toggleFavorite = (id: CelestialId) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <main className="atlas-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => selectObject("earth")} aria-label="Celestial Atlas home">
          <span className="brand-mark"><Orbit size={24} /><i /></span>
          <span><strong>Celestial Atlas</strong><em>Explore the universe up close</em></span>
        </button>
        <nav className="main-nav" aria-label="Primary navigation">
          {[
            ["Explore", Compass], ["Solar System", Orbit], ["Missions", Rocket], ["Library", LibraryBig], ["Notes", NotebookPen],
          ].map(([label, Icon]) => (
            <button key={label as string} className={activeNav === label ? "active" : ""} onClick={() => { setActiveNav(label as string); if (label === "Missions") setModal("missions"); if (label === "Library") setLibraryOpen(true); }}>
              <Icon size={16} /> {label as string}
            </button>
          ))}
        </nav>
        <label className="search-box">
          <Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search planets, moons, stars…" aria-label="Search celestial objects" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
        </label>
        <div className="profile-wrap">
          <button className="profile" type="button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-label="Open observer profile"><span>AS</span><ChevronDown size={14} /></button>
          {profileOpen && <div className="profile-menu"><b>Asnari</b><small>Deep-space observer</small><button onClick={() => setProfileOpen(false)}>Observer settings</button></div>}
        </div>
        <button className="mobile-menu" type="button" onClick={() => setLibraryOpen(true)} aria-label="Open Celestial Library"><Menu size={21} /></button>
      </header>

      <div className="atlas-grid">
        <aside className={`celestial-library ${libraryOpen ? "open" : ""}`} aria-label="Celestial Library">
          <div className="panel-heading"><span><Telescope size={14} /> Celestial Library</span><b>{celestialObjects.length} objects</b><button className="drawer-close" onClick={() => setLibraryOpen(false)} aria-label="Close library"><X size={17} /></button></div>
          <div className="library-list">
            {filteredObjects.length ? filteredObjects.map((item) => (
              <div key={item.id} className={`library-row ${objectId === item.id ? "active" : ""}`} style={{ "--object-accent": item.accent } as React.CSSProperties}>
                <button type="button" className="object-select" onClick={() => selectObject(item.id)} aria-current={objectId === item.id ? "true" : undefined}>
                  <ObjectGlyph object={item} small />
                  <span><b>{item.name}</b><small>{item.category}</small></span>
                </button>
                <button type="button" className="favorite-button" onClick={() => toggleFavorite(item.id)} aria-pressed={favorites.has(item.id)} aria-label={`${favorites.has(item.id) ? "Remove" : "Add"} ${item.name} ${favorites.has(item.id) ? "from" : "to"} favorites`}>
                  <Heart size={14} fill={favorites.has(item.id) ? "currentColor" : "none"} />
                </button>
              </div>
            )) : <div className="empty-search"><Search size={22} /><b>No objects found</b><button onClick={() => setQuery("")}>Clear search</button></div>}
          </div>
          <button className="view-all" onClick={() => setQuery("")}>View all objects <ArrowRight size={14} /></button>
          <blockquote className="observatory-note"><Sparkles size={17} /><p>Somewhere,<br />something incredible<br />is waiting.</p><em>Keep looking up.</em></blockquote>
        </aside>

        <CelestialViewer
          object={object}
          autoRotate={autoRotate}
          onAutoRotate={setAutoRotate}
          comparing={compareOpen}
          onCompare={() => setCompareOpen(!compareOpen)}
          orbiting={orbiting}
          onOrbiting={setOrbiting}
          onResetState={() => setCompareOpen(false)}
          onSelectPlanet={(id) => {
            const item = celestialObjects.find((c) => c.id === id);
            if (item) selectObject(item.id);
          }}
          onExplorePlanet={(id) => {
            const item = celestialObjects.find((c) => c.id === id);
            if (item) {
              selectObject(item.id);
              setOrbiting(false);
            }
          }}
        />

        <aside className="info-panel" ref={contentRef} aria-live="polite">
          <div className="info-kicker" data-reveal><span style={{ background: object.accent }} /> {object.category} · selected object</div>
          <div className="info-title" data-reveal>
            <div><h1>{object.name}</h1><em>{object.subtitle}</em></div>
            <ObjectGlyph object={object} />
          </div>
          <p className="description" data-reveal>{object.description}</p>
          
          <details className="image-credit" data-reveal>
            <summary>Image and 3D sources</summary>
            <a href={object.image.sourceUrl} target="_blank" rel="noreferrer">Portrait · {object.image.credit}</a>
            <a href={object.texture.sourceUrl} target="_blank" rel="noreferrer">3D map · {object.texture.credit}</a>
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">Texture license · {object.texture.license}</a>
          </details>

          <div className="divider" />

          <h2 data-reveal>Orbit characteristics</h2>
          <dl className="fact-grid">
            <div data-reveal><dt>Average distance from Sun</dt><dd>{object.facts.avgDistance ?? object.facts.distance}</dd></div>
            <div data-reveal><dt>Orbital period</dt><dd>{object.facts.orbitalPeriod}</dd></div>
            {object.facts.orbitalSpeed && <div data-reveal><dt>Orbital speed</dt><dd>{object.facts.orbitalSpeed}</dd></div>}
            {object.facts.eccentricity && <div data-reveal><dt>Eccentricity</dt><dd>{object.facts.eccentricity}</dd></div>}
          </dl>

          <div className="divider" />

          <h2 data-reveal>Physical properties</h2>
          <dl className="fact-grid">
            <div data-reveal><dt>Diameter</dt><dd>{object.facts.diameter}</dd></div>
            <div data-reveal><dt>Mass</dt><dd>{object.facts.mass}</dd></div>
            <div data-reveal><dt>Day length</dt><dd>{object.facts.dayLength}</dd></div>
            <div data-reveal><dt>Moons</dt><dd>{object.facts.moons}</dd></div>
            <div data-reveal><dt>Surface gravity</dt><dd>{object.facts.gravity}</dd></div>
            <div data-reveal><dt>Avg. temperature</dt><dd>{object.facts.temperature}</dd></div>
          </dl>

          <div className="composition" data-reveal><small>Composition</small><p>{object.facts.composition}</p></div>
          <div className="science-note" data-reveal><Telescope size={17} /><p><b>Scientific significance</b>{object.significance}</p></div>
          <div className="discovery-note" data-reveal><Sparkles size={16} /><p><b>Did you know?</b>{object.didYouKnow}</p></div>
          <button className="primary-action" data-reveal onClick={() => setModal("lesson")}><BookOpen size={16} /> View lesson <ArrowRight size={15} /></button>
          <div className="action-grid" data-reveal>
            <button className={orbiting ? "active" : ""} onClick={() => setOrbiting(!orbiting)}><Play size={15} /> {orbiting ? "Surface view" : "Animate orbit"}</button>
            <button onClick={() => setModal("quiz")}><CircleHelp size={15} /> Take quiz</button>
            <button className={compareOpen ? "active" : ""} onClick={() => setCompareOpen(!compareOpen)}><Orbit size={15} /> Compare</button>
          </div>
        </aside>
      </div>

      {compareOpen && <ComparisonPanel current={object} comparison={comparison} compareId={compareId} onCompareId={setCompareId} onClose={() => { setCompareOpen(false); }} />}

      <section className="learning-deck" aria-label={`${object.name} learning resources`}>
        <article className="feature-card sky-map-card"><header><em>Observation guide</em><h3>Find {object.name} in the sky</h3></header><div className="mini-sky"><span /><span /><span /><i /></div><button onClick={() => setModal("lesson")}>Open sky guide <ArrowRight size={14} /></button></article>
        <article className="feature-card"><header><em>Deep dive</em><h3>{object.subtitle}</h3><BookOpen size={17} /></header><ObjectGlyph object={object} /><p>{object.description}</p><button onClick={() => setModal("lesson")}>Start lesson <ArrowRight size={14} /></button></article>
        <article className="feature-card orbit-card"><header><em>Orbital motion</em><h3>{object.facts.orbitalPeriod}</h3><Orbit size={17} /></header><div className="mini-orbit"><i /><span /></div><button onClick={() => setOrbiting(true)}>Animate orbit <ArrowRight size={14} /></button></article>
        <article className="feature-card"><header><em>Field notes</em><h3>Key features</h3><FileText size={17} /></header><ul>{object.hotspots.slice(0, 3).map((hotspot) => <li key={hotspot.id}>{hotspot.label}</li>)}</ul><button onClick={() => setModal("lesson")}>Explore features <ArrowRight size={14} /></button></article>
      </section>

      {modal && <LearningModal type={modal} object={object} onClose={() => setModal(null)} />}
      {libraryOpen && <button className="drawer-backdrop" onClick={() => setLibraryOpen(false)} aria-label="Close library" />}
    </main>
  );
}

function ComparisonPanel({ current, comparison, compareId, onCompareId, onClose }: { current: CelestialObject; comparison: CelestialObject; compareId: CelestialId; onCompareId: (id: CelestialId) => void; onClose: () => void }) {
  const maxDiameter = Math.max(current.diameterKm, comparison.diameterKm);
  return (
    <section className="comparison-panel" aria-label="Celestial object comparison">
      <div className="comparison-object"><ObjectGlyph object={current} /><span><small>Selected</small><b>{current.name}</b><em>{current.facts.diameter}</em></span></div>
      <div className="scale-stage" aria-label="Relative diameter visualization">
        {[current, comparison].map((item) => <span key={item.id} style={{ width: `${Math.max(18, Math.sqrt(item.diameterKm / maxDiameter) * 74)}px`, height: `${Math.max(18, Math.sqrt(item.diameterKm / maxDiameter) * 74)}px`, background: `radial-gradient(circle at 35% 30%, ${item.visual.light}, ${item.visual.base} 48%, ${item.visual.dark})` }} title={`${item.name}: ${item.facts.diameter}`} />)}
      </div>
      <div className="comparison-object choose"><ObjectGlyph object={comparison} /><span><small>Compare with</small><select value={compareId} onChange={(event) => onCompareId(event.target.value as CelestialId)}>{celestialObjects.filter((item) => item.id !== current.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><em>{comparison.facts.diameter}</em></span></div>
      <dl><div><dt>Gravity</dt><dd>{current.facts.gravity}</dd><dd>{comparison.facts.gravity}</dd></div><div><dt>Temperature</dt><dd>{current.facts.temperature}</dd><dd>{comparison.facts.temperature}</dd></div></dl>
      <button className="comparison-close" onClick={onClose} aria-label="Close comparison"><X size={17} /></button>
    </section>
  );
}

function LearningModal({ type, object, onClose }: { type: Exclude<Modal, null>; object: CelestialObject; onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [onClose]);
  const correct = answer === object.quiz.answer;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={dialogRef} tabIndex={-1} className="learning-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <span className="modal-symbol">{type === "quiz" ? "?" : type === "missions" ? "↗" : object.symbol}</span>
        <em className="modal-eyebrow">{type === "quiz" ? "Knowledge check" : type === "missions" ? "Exploration log" : "Guided observation"}</em>
        <h2 id="modal-title" className="modal-main-title">{type === "quiz" ? `${object.name} quick quiz` : type === "missions" ? "Missions beyond Earth" : `A closer look at ${object.name}`}</h2>
        {type === "quiz" ? <div className="quiz-content"><p>{object.quiz.question}</p>{object.quiz.options.map((option) => <button key={option} disabled={answer !== null} className={answer === option ? (correct ? "correct" : "incorrect") : ""} onClick={() => setAnswer(option)}>{answer === option && (correct ? <Check size={16} /> : <X size={16} />)}{option}</button>)}{answer && <div role="status" className={correct ? "quiz-feedback correct" : "quiz-feedback"}><b>{correct ? "Correct observation" : `The answer is ${object.quiz.answer}`}</b><span>{object.quiz.explanation}</span></div>}</div>
        : type === "missions" ? <div className="mission-list"><article><Rocket size={20} /><span><b>Voyager Grand Tour</b><small>Revealed the outer planets in unprecedented detail.</small></span></article><article><Telescope size={20} /><span><b>James Webb Space Telescope</b><small>Observes early galaxies and distant planetary atmospheres.</small></span></article><article><Orbit size={20} /><span><b>Europa Clipper</b><small>Investigates a potentially habitable ocean world.</small></span></article></div>
        : <div className="lesson-content"><p className="lesson-intro">{object.description}</p><div className="lesson-hero"><ObjectGlyph object={object} /><span><small>Composition</small><b>{object.facts.composition}</b></span></div><h3 className="lesson-section-heading">What scientists study</h3><p className="lesson-section-intro">{object.significance}</p><ul className="lesson-study-list">{object.hotspots.map((hotspot) => <li key={hotspot.id} className="lesson-study-item"><b className="study-item-title">{hotspot.label}</b><span className="study-item-description">{hotspot.detail}</span></li>)}</ul></div>}
      </section>
    </div>
  );
}
