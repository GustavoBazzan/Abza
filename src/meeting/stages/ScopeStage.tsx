import { useState } from 'react';
import type { Meeting, Stage } from '../../data/meeting';

interface ScopeStageProps {
  stage: Stage;
  meeting: Meeting;
  update: (patch: (m: Meeting) => Meeting) => void;
}

export function ScopeStage({ stage, meeting, update }: ScopeStageProps) {
  const [customDraft, setCustomDraft] = useState('');
  const items = stage.scopeItems ?? [];
  const { selectedItemIds, customItems, notes } = meeting.scope;

  function toggleItem(id: string) {
    update((m) => {
      const has = m.scope.selectedItemIds.includes(id);
      return {
        ...m,
        scope: {
          ...m.scope,
          selectedItemIds: has ? m.scope.selectedItemIds.filter((i) => i !== id) : [...m.scope.selectedItemIds, id],
        },
      };
    });
  }

  function selectRecommended() {
    const recommendedIds = items.filter((i) => i.recommended).map((i) => i.id);
    update((m) => ({
      ...m,
      scope: { ...m.scope, selectedItemIds: Array.from(new Set([...m.scope.selectedItemIds, ...recommendedIds])) },
    }));
  }

  function addCustom() {
    const v = customDraft.trim();
    if (!v) return;
    update((m) => ({ ...m, scope: { ...m.scope, customItems: [...m.scope.customItems, v] } }));
    setCustomDraft('');
  }

  function removeCustom(item: string) {
    update((m) => ({ ...m, scope: { ...m.scope, customItems: m.scope.customItems.filter((i) => i !== item) } }));
  }

  return (
    <>
      <div className="call-block">
        <div className="scope-head-row">
          <span className="call-block-label">Escopo recomendado</span>
          <button type="button" className="meeting-back-link" onClick={selectRecommended}>Selecionar recomendados</button>
        </div>
        <div className="scope-list">
          {items.map((item) => {
            const on = selectedItemIds.includes(item.id);
            return (
              <button key={item.id} type="button" className={`call-question${on ? ' checked' : ''}`} onClick={() => toggleItem(item.id)}>
                <span className="call-question-box">{on ? '✓' : ''}</span>
                <span>{item.label}{item.recommended && <span className="scope-recommended-tag">recomendado</span>}</span>
              </button>
            );
          })}
        </div>
      </div>

      {customItems.length > 0 && (
        <div className="scope-custom-list">
          {customItems.map((item) => (
            <span className="summary-pill" key={item}>
              {item} <button type="button" className="scope-remove-btn" onClick={() => removeCustom(item)} aria-label={`Remover ${item}`}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="scope-add-row">
        <input
          type="text"
          value={customDraft}
          onChange={(e) => setCustomDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Adicionar item personalizado…"
        />
        <button type="button" className="call-nav-btn" onClick={addCustom}>Adicionar</button>
      </div>

      <label className="notes-field full">
        <span>Observações de escopo</span>
        <textarea value={notes} onChange={(e) => update((m) => ({ ...m, scope: { ...m.scope, notes: e.target.value } }))} />
      </label>
    </>
  );
}
