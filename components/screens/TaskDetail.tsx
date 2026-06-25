'use client';
import { useState } from 'react';
import type { Task } from '@/lib/types';

interface Props {
  task: Task;
  isStreaming?: boolean;
  onBack: () => void;
  onToggleStep: (stepId: string) => void;
  onStartFocus: (stepId: string) => void;
  onAddStep: (text: string) => void;
}

const ENCOURAGEMENTS = [
  'Three down already. Keep the momentum gentle.',
  "You're making real progress. One step at a time.",
  'Nice pace. The next step is small enough to just start.',
  'Keep going — each small step adds up.',
  "You've got this. One thing at a time.",
];

export default function TaskDetail({ task, isStreaming, onBack, onToggleStep, onStartFocus, onAddStep }: Props) {
  const [addingStep, setAddingStep] = useState(false);
  const [newStepText, setNewStepText] = useState('');

  const done = task.steps.filter(s => s.done).length;
  const total = task.steps.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const encouragement = ENCOURAGEMENTS[done % ENCOURAGEMENTS.length];

  const handleAddStep = () => {
    const text = newStepText.trim();
    if (!text) return;
    onAddStep(text);
    setNewStepText('');
    setAddingStep(false);
  };

  const sorted = [...task.steps].sort((a, b) => a.order - b.order);

  return (
    <div
      className="max-w-[720px] mx-auto px-6 animate-fade"
      style={{ paddingTop: 40, paddingBottom: 140 }}
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 bg-transparent border-none text-[#8a7f70] text-[15px] font-semibold cursor-pointer px-1 py-2 hover:text-[#2d2825] transition-colors"
        style={{ marginBottom: 28 }}
      >
        <span className="text-[18px]">←</span> All tasks
      </button>

      <h1
        className="font-serif font-medium text-[#2d2825] leading-tight"
        style={{ fontSize: 'clamp(28px, 4.5vw, 38px)', marginBottom: 18 }}
      >
        {task.title}
      </h1>

      {/* progress bar */}
      <div className="flex items-center gap-3.5" style={{ marginBottom: 8 }}>
        <div className="flex-1 h-2 bg-[#ece4d8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#5b9182] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[14px] font-bold text-[#5b9182] whitespace-nowrap">
          {done} of {total} done
        </span>
      </div>
      <p className="text-[15px] text-[#a89d8e]" style={{ marginBottom: 36 }}>
        {encouragement}
      </p>

      {/* steps list */}
      <div className="flex flex-col" style={{ gap: 10 }}>
        {isStreaming && sorted.length === 0 && (
          <>
            {[140, 110, 160].map(w => (
              <div
                key={w}
                className="flex items-center rounded-[14px]"
                style={{ gap: 16, padding: '16px 18px', background: '#fff', border: '1px solid #efe7da' }}
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#ece4d8]" style={{ animation: 'ff-breathe 1.4s ease-in-out infinite' }} />
                <div className="rounded-full bg-[#ece4d8] h-4" style={{ width: w, animation: 'ff-breathe 1.4s ease-in-out infinite' }} />
              </div>
            ))}
          </>
        )}
        {isStreaming && sorted.length > 0 && (
          <div className="flex items-center gap-2 px-1 py-1" style={{ marginBottom: 2 }}>
            <div className="w-2 h-2 rounded-full bg-[#5b9182]" style={{ animation: 'ff-breathe 1s ease-in-out infinite' }} />
            <span className="text-[13px] font-semibold text-[#a89d8e]">Generating steps…</span>
          </div>
        )}
        {sorted.map(step => (
          <div
            key={step.id}
            className="flex items-center rounded-[14px] transition-colors duration-200"
            style={{
              gap: 16,
              padding: '16px 18px',
              background: step.done ? '#f3efe7' : '#fff',
              border: `1px solid ${step.done ? '#ece4d8' : '#efe7da'}`,
            }}
          >
            {/* checkbox */}
            <button
              onClick={() => onToggleStep(step.id)}
              aria-label={step.done ? 'Mark incomplete' : 'Mark complete'}
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold cursor-pointer transition-all duration-150"
              style={{
                border: `2px solid ${step.done ? '#5b9182' : '#d8cdbb'}`,
                background: step.done ? '#5b9182' : 'transparent',
                color: '#fff',
              }}
            >
              {step.done ? '✓' : ''}
            </button>

            {/* text */}
            <span
              className="flex-1 text-[17px] font-semibold leading-snug"
              style={{
                color: step.done ? '#b3a899' : '#2d2825',
                textDecoration: step.done ? 'line-through' : 'none',
              }}
            >
              {step.text}
            </span>

            {/* start focus */}
            {!step.done && (
              <button
                onClick={() => onStartFocus(step.id)}
                className="flex-shrink-0 min-h-[40px] px-4 bg-[#eaf1ee] text-[#2f7261] border-none rounded-[10px] text-[14px] font-bold cursor-pointer transition-colors duration-150 hover:bg-[#dbe9e3]"
              >
                Start focus
              </button>
            )}
          </div>
        ))}
      </div>

      {/* add step */}
      {addingStep ? (
        <div className="flex gap-2 mt-4">
          <input
            autoFocus
            value={newStepText}
            onChange={e => setNewStepText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAddStep();
              if (e.key === 'Escape') setAddingStep(false);
            }}
            placeholder="Describe the step…"
            className="flex-1 text-[16px] text-[#2d2825] bg-white border border-[#e7dfd3] rounded-[12px] px-4 py-3"
            style={{ outline: 'none' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6fa496')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e7dfd3')}
          />
          <button
            onClick={handleAddStep}
            disabled={!newStepText.trim()}
            className="px-4 py-3 bg-[#2f7261] text-white border-none rounded-[12px] text-[14px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <button
            onClick={() => { setAddingStep(false); setNewStepText(''); }}
            className="px-3 py-3 bg-transparent border-none text-[#8a7f70] text-[14px] font-semibold cursor-pointer hover:text-[#2d2825] transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAddingStep(true)}
          className="inline-flex items-center gap-2 bg-transparent border-none text-[#a89d8e] text-[15px] font-semibold cursor-pointer px-1 py-2.5 hover:text-[#2d2825] transition-colors mt-4"
        >
          + Add a step
        </button>
      )}
    </div>
  );
}
