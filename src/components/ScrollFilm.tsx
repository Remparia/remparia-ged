"use client";

import { useEffect, useRef, useState } from "react";
import { getFilmProgress, getFilmTime } from "./filmTimeline";

const chaptersFr = [
  { label: "01 / CLASSER", title: "Vous déposez. Le classement se fait seul.", text: "Remparia reconnaît le document, le range et en extrait les informations utiles." },
  { label: "02 / DEMANDER", title: "Un agent qui connaît vos documents.", text: "Posez vos questions en français. Chaque réponse cite ses sources." },
  { label: "03 / RETROUVER", title: "En 15 secondes. Pas une matinée.", text: "Le bon document, dans sa dernière version, avec le dossier où il est rangé." },
];
const chaptersEn = [
  { label: "01 / FILE", title: "You upload. Filing happens on its own.", text: "Remparia recognizes the document, files it and extracts useful fields." },
  { label: "02 / ASK", title: "An agent that knows your documents.", text: "Ask in plain language. Every answer cites its sources." },
  { label: "03 / FIND", title: "In 15 seconds. Not a morning.", text: "The right document, in its latest version, with the folder where it lives." },
];

/** The film is paused: the page's scroll position, not a clock, controls its time. */
export function ScrollFilm({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const progressBar = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [manual, setManual] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  const chapters = lang === "fr" ? chaptersFr : chaptersEn;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = section.current;
    const film = video.current;
    if (!element || !film || manual || reducedMotion || failed) return;
    let frame = 0;
    let targetTime = 0;
    let currentChapter = -1;
    let active = true;
    const seek = () => {
      if (!active || film.seeking || !Number.isFinite(film.duration)) return;
      if (Math.abs(film.currentTime - targetTime) > 0.025) film.currentTime = targetTime;
    };
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const sticky = element.querySelector<HTMLElement>(".rg-film__sticky");
      const top = window.innerWidth <= 760 ? 68 : 80;
      const progress = getFilmProgress(rect.top, element.offsetHeight, sticky?.offsetHeight ?? window.innerHeight - top, top);
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${progress})`;
      const nextChapter = Math.min(2, Math.floor(progress * 3));
      if (nextChapter !== currentChapter) { currentChapter = nextChapter; setChapter(nextChapter); }
      if (Number.isFinite(film.duration)) { targetTime = getFilmTime(progress, film.duration); seek(); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    film.pause();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    film.addEventListener("loadedmetadata", schedule);
    film.addEventListener("loadeddata", schedule);
    film.addEventListener("seeked", seek);
    update();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      film.removeEventListener("loadedmetadata", schedule);
      film.removeEventListener("loadeddata", schedule);
      film.removeEventListener("seeked", seek);
    };
  }, [manual, reducedMotion, failed]);

  return (
    <section ref={section} id="experience" className={`rg-film ${manual || reducedMotion ? "rg-film--manual" : ""} ${reducedMotion || failed ? "rg-film--static" : ""}`} aria-label={lang === "fr" ? "L’expérience Remparia, animée au défilement" : "The Remparia experience, animated on scroll"}>
      <div className="rg-film__sticky">
        <div className="rg-film__topline"><span>{lang === "fr" ? "VOS DOCUMENTS. À PORTÉE DE QUESTION." : "YOUR DOCUMENTS. READY FOR QUESTIONS."}</span><span className="rg-film__hint">{manual || reducedMotion ? (lang === "fr" ? "LECTURE LIBRE" : "FREE PLAYBACK") : (lang === "fr" ? "LE FILM SUIT VOTRE SCROLL" : "THE FILM FOLLOWS YOUR SCROLL")} <span aria-hidden="true">↓</span></span></div>
        <div className="rg-film__stage">
          {failed ? <img src="/assets/ged/ged-scroll-poster.jpg" alt={lang === "fr" ? "Une professionnelle accède à son univers documentaire depuis son téléphone" : "A professional accesses her document workspace from her phone"} /> : (
            <video ref={video} src="/assets/ged/ged-scroll.mp4" poster="/assets/ged/ged-scroll-poster.jpg" muted playsInline preload="auto" controls={manual || reducedMotion} onError={() => setFailed(true)} aria-label={lang === "fr" ? "Une professionnelle interroge ses documents depuis son ordinateur" : "A professional asks questions of her documents from her computer"} />
          )}
          <div className={`rg-film__caption rg-film__caption--${chapter}`} key={chapter}><span className="rg-eyebrow">{chapters[chapter].label}</span><h2>{chapters[chapter].title}</h2><p>{chapters[chapter].text}</p></div>
          {!failed && !reducedMotion && <button className="rg-film__control" type="button" onClick={() => { video.current?.pause(); setManual(!manual); }}>{manual ? (lang === "fr" ? "Revenir au scroll ↕" : "Return to scroll ↕") : (lang === "fr" ? "Lecture libre ▷" : "Free playback ▷")}</button>}
        </div>
        <div className="rg-film__timeline" aria-hidden="true"><div ref={progressBar} /></div>
        <div className="rg-film__chapters" aria-hidden="true">{chapters.map((item, index) => <span key={item.label} className={index === chapter ? "is-current" : ""}>{item.label}</span>)}</div>
      </div>
    </section>
  );
}
