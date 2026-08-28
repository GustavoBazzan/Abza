import { useEffect, useState } from 'react';
import { getProduct } from '../data/products';
import { useActiveMeeting } from './useMeetingStore';
import { TechniqueCallout } from './TechniqueCallout';
import { ObjectionOverlay } from './ObjectionOverlay';
import { CopilotPanel } from './CopilotPanel';
import { IntroStage } from './stages/IntroStage';
import { QuestionsStage } from './stages/QuestionsStage';
import { QualificationStage } from './stages/QualificationStage';
import { DiagnosisStage } from './stages/DiagnosisStage';
import { DiagnosisReturnStage } from './stages/DiagnosisReturnStage';
import { AbzaIntroStage } from './stages/AbzaIntroStage';
import { SolutionStage } from './stages/SolutionStage';
import { ScopeStage } from './stages/ScopeStage';
import { PricingStage } from './stages/PricingStage';
import { ClosingStage } from './stages/ClosingStage';

interface CallModeProps {
  productId: string;
  meetingId: string;
  navigate: (path: string) => void;
}

export function CallMode({ productId, meetingId, navigate }: CallModeProps) {
  const product = getProduct(productId);
  const { meeting, loading, saveStatus, update, flush } = useActiveMeeting(meetingId);

  const [objectionOpen, setObjectionOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const anyOverlayOpen = objectionOpen || copilotOpen;
  useEffect(() => {
    if (!anyOverlayOpen) return;
    const scrollY = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, [anyOverlayOpen]);

  function onViewTechnique(num: string) {
    update((m) => (m.techniquesViewed.includes(num) ? m : { ...m, techniquesViewed: [...m.techniquesViewed, num] }));
  }

  if (!product || product.comingSoon) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Roteiro não encontrado.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate('/scripts')}>← Scripts de Reunião</button>
      </div>
    );
  }

  if (loading) return null;

  if (!meeting) {
    return (
      <div className="meeting-shell">
        <p className="meeting-empty-state">Essa reunião não foi encontrada — pode já ter sido encerrada em outro dispositivo, ou o link expirou.</p>
        <button type="button" className="meeting-back-link" onClick={() => navigate(`/scripts/${productId}`)}>← Iniciar nova reunião</button>
      </div>
    );
  }

  const stages = product.stages;
  const stageIndex = Math.min(meeting.currentStageIndex, stages.length - 1);
  const stage = stages[stageIndex];
  const total = stages.length;
  const isLast = stageIndex === total - 1;

  function goTo(index: number) {
    update((m) => ({ ...m, currentStageIndex: index }));
  }
  function goNext() {
    if (!isLast) goTo(stageIndex + 1);
  }
  function goPrev() {
    if (stageIndex > 0) goTo(stageIndex - 1);
  }

  async function endMeeting() {
    update((m) => ({ ...m, endedAt: new Date().toISOString() }));
    await flush();
    navigate(`/reunioes/${meeting!.id}`);
  }

  const diagnosisIndex = stages.findIndex((s) => s.kind === 'diagnosis');

  return (
    <div className="call-mode">
      <header className="call-topbar">
        <button type="button" className="call-exit-btn" aria-label="Sair da reunião" onClick={() => navigate(`/scripts/${productId}`)}>✕</button>
        <div className="call-progress-wrap">
          <div className="call-progress-label">
            Etapa {stageIndex + 1} de {total}
            <span className="call-save-status">{saveStatus === 'saving' ? ' · Salvando…' : saveStatus === 'saved' ? ' · Salvo' : ''}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((stageIndex + 1) / total) * 100}%` }} />
          </div>
        </div>
        <div className="call-topbar-actions">
          <button type="button" className="call-tool-btn objection-btn" onClick={() => setObjectionOpen(true)}>Objeção</button>
          <button type="button" className="call-tool-btn" onClick={() => setCopilotOpen(true)}>Copilot</button>
        </div>
      </header>

      <main className="call-body">
        <div className="call-step-kicker">{product.title}</div>
        <h2 className="call-step-title">{stage.title}</h2>
        <div className="call-block">
          <span className="call-block-label">Objetivo desta etapa</span>
          <p className="call-objective-text">{stage.objective}</p>
        </div>

        {stage.kind === 'intro' && <IntroStage stage={stage} />}
        {stage.kind === 'questions' && (
          <QuestionsStage stage={stage} meeting={meeting} update={update} navigate={navigate} onViewTechnique={onViewTechnique} />
        )}
        {stage.kind === 'qualification' && (
          <QualificationStage stage={stage} meeting={meeting} update={update} navigate={navigate} onViewTechnique={onViewTechnique} />
        )}
        {stage.kind === 'diagnosis' && <DiagnosisStage meeting={meeting} update={update} />}
        {stage.kind === 'diagnosisReturn' && (
          <DiagnosisReturnStage meeting={meeting} update={update} onEditDiagnosis={() => diagnosisIndex >= 0 && goTo(diagnosisIndex)} />
        )}
        {stage.kind === 'abzaIntro' && <AbzaIntroStage meeting={meeting} />}
        {stage.kind === 'solution' && <SolutionStage stage={stage} meeting={meeting} update={update} />}
        {stage.kind === 'scope' && <ScopeStage stage={stage} meeting={meeting} update={update} />}
        {stage.kind === 'pricing' && <PricingStage stage={stage} meeting={meeting} update={update} />}
        {stage.kind === 'closing' && (
          <ClosingStage stage={stage} meeting={meeting} update={update} navigate={navigate} onViewTechnique={onViewTechnique} />
        )}

        {stage.kind !== 'questions' && stage.kind !== 'qualification' && stage.kind !== 'closing' && stage.technique && (
          <TechniqueCallout technique={stage.technique} navigate={navigate} onView={onViewTechnique} />
        )}
      </main>

      <footer className="call-footer">
        <button type="button" className="call-nav-btn" onClick={goPrev} disabled={stageIndex === 0}>← Etapa anterior</button>
        {isLast ? (
          <button type="button" className="call-nav-btn primary" onClick={endMeeting}>Encerrar reunião →</button>
        ) : (
          <button type="button" className="call-nav-btn primary" onClick={goNext}>Próxima etapa →</button>
        )}
      </footer>

      {objectionOpen && (
        <ObjectionOverlay
          currentStageId={stage.id}
          update={update}
          navigate={navigate}
          onViewTechnique={onViewTechnique}
          onClose={() => setObjectionOpen(false)}
        />
      )}
      {copilotOpen && <CopilotPanel meeting={meeting} onClose={() => setCopilotOpen(false)} />}
    </div>
  );
}
