import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './sections/Sidebar';
import { Hero } from './sections/Hero';
import { Philosophy } from './sections/Philosophy';
import { Anatomy } from './sections/Anatomy';
import { Techniques } from './sections/Techniques';
import { TechModal } from './sections/TechModal';
import { Objections } from './sections/Objections';
import { ObjModal } from './sections/ObjModal';
import { HighTicket } from './sections/HighTicket';
import { Questions } from './sections/Questions';
import { Roleplay } from './sections/Roleplay';
import { Checklist } from './sections/Checklist';
import { Diagnostic } from './sections/Diagnostic';
import { NextSteps } from './sections/NextSteps';
import { NAV, TECH, OBJ } from './data/content';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
}

export default function App() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [techIdx, setTechIdx] = useState<number | null>(null);
  const [objIdx, setObjIdx] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
        let nextActive = 0;
        NAV.forEach((n, i) => {
          const el = document.getElementById(n.id);
          if (el && el.getBoundingClientRect().top <= 140) nextActive = i;
        });
        setProgress(p);
        setActive(nextActive);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setTechIdx(null); setObjIdx(null); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goTechniques = () => scrollToId('s03');
  const goExplore = () => scrollToId('s01');

  return (
    <div className="app">
      <Sidebar active={active} progress={progress} onNavigate={scrollToId} />

      <main className="main">
        <Hero onExplore={goExplore} onTechniques={goTechniques} />
        <Philosophy />
        <Anatomy />
        <Techniques showStars onOpen={setTechIdx} />
        <Objections step={step} onHoverStep={setStep} onOpenObjection={setObjIdx} />
        <HighTicket />
        <Questions />
        <Roleplay />
        <Checklist />
        <Diagnostic />
        <NextSteps onTechniques={goTechniques} onTop={goTop} />
      </main>

      {techIdx !== null && (
        <TechModal
          tech={TECH[techIdx]}
          showScripts
          onClose={() => setTechIdx(null)}
          onPrev={() => setTechIdx((i) => (i === null ? null : (i + 9) % 10))}
          onNext={() => setTechIdx((i) => (i === null ? null : (i + 1) % 10))}
        />
      )}

      {objIdx !== null && (
        <ObjModal obj={OBJ[objIdx]} index={objIdx} onClose={() => setObjIdx(null)} />
      )}
    </div>
  );
}
