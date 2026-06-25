'use client';

const RADIUS = 138;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 867.08

interface Props {
  currentStep: string;
  timeLeft: number;
  totalSec: number;
  selectedMinutes: number;
  isRunning: boolean;
  hasStarted: boolean;
  onTogglePlay: () => void;
  onEndSession: () => void;
  onSetPreset: (min: number) => void;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function remain(sec: number): string {
  if (sec <= 0) return 'Done';
  const m = Math.ceil(sec / 60);
  if (m <= 1) return 'Under a minute left';
  return `${m} minutes left`;
}

export default function FocusSession({
  currentStep,
  timeLeft,
  totalSec,
  selectedMinutes,
  isRunning,
  hasStarted,
  onTogglePlay,
  onEndSession,
  onSetPreset,
}: Props) {
  const frac = totalSec > 0 ? timeLeft / totalSec : 0;
  const offset = CIRCUMFERENCE * (1 - frac);
  const showPresets = !isRunning && !hasStarted;
  const playLabel = isRunning ? 'Pause' : hasStarted ? 'Resume' : 'Start focus';

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade"
      style={{ paddingTop: 56, paddingBottom: 100 }}
    >
      <div className="relative flex flex-col items-center w-full" style={{ maxWidth: 640 }}>

        {/* current step */}
        <div className="text-center" style={{ marginBottom: 52 }}>
          <p className="text-[13px] tracking-[1.5px] text-[#a89d8e] uppercase font-semibold" style={{ marginBottom: 18 }}>
            Right now, just this
          </p>
          <h1
            className="font-serif font-medium text-[#2d2825] leading-tight mx-auto"
            style={{ fontSize: 'clamp(28px, 5.2vw, 46px)', maxWidth: '18ch' }}
          >
            {currentStep}
          </h1>
        </div>

        {/* timer ring */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: 300, height: 300, marginBottom: 28 }}
        >
          {/* breathing glow */}
          <div
            className={isRunning ? 'absolute rounded-full animate-breathe' : 'absolute rounded-full opacity-50'}
            style={{
              width: 252,
              height: 252,
              background: 'radial-gradient(circle, #eaf1ee 0%, rgba(234,241,238,0) 70%)',
            }}
          />

          {/* progress ring */}
          <svg
            width={300}
            height={300}
            viewBox="0 0 300 300"
            className="absolute inset-0"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* track */}
            <circle
              cx={150}
              cy={150}
              r={RADIUS}
              fill="none"
              stroke="#ece4d8"
              strokeWidth={6}
            />
            {/* progress */}
            <circle
              cx={150}
              cy={150}
              r={RADIUS}
              fill="none"
              stroke="#5b9182"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 980ms linear' }}
            />
          </svg>

          {/* time display */}
          <div className="relative flex flex-col items-center z-10">
            <div
              className="font-serif text-[#2d2825] font-normal"
              style={{
                fontSize: 'clamp(56px, 13vw, 78px)',
                lineHeight: 1,
                letterSpacing: '0.01em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmt(timeLeft)}
            </div>
            <div className="text-[14px] text-[#a89d8e] font-semibold" style={{ marginTop: 12 }}>
              {remain(timeLeft)}
            </div>
          </div>
        </div>

        {/* time presets */}
        {showPresets && (
          <div className="flex gap-2" style={{ marginBottom: 36 }}>
            {[15, 25, 45].map(m => (
              <button
                key={m}
                onClick={() => onSetPreset(m)}
                className="min-h-[44px] px-5 rounded-[12px] text-[15px] font-bold cursor-pointer transition-all duration-150"
                style={{
                  border: `1px solid ${selectedMinutes === m ? '#5b9182' : '#e7dfd3'}`,
                  background: selectedMinutes === m ? '#eaf1ee' : '#fff',
                  color: selectedMinutes === m ? '#2f7261' : '#8a7f70',
                }}
              >
                {m} min
              </button>
            ))}
          </div>
        )}

        {/* controls */}
        <div className="flex items-center" style={{ gap: 14 }}>
          <button
            onClick={onTogglePlay}
            className="inline-flex items-center gap-2.5 min-h-[56px] px-9 bg-[#2f7261] text-white border-none rounded-2xl text-[17px] font-bold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(47,114,97,0.28)]"
            style={{ boxShadow: '0 6px 18px rgba(47,114,97,0.22)' }}
          >
            {playLabel}
          </button>
          <button
            onClick={onEndSession}
            className="min-h-[56px] px-6 bg-transparent border-none text-[#8a7f70] rounded-2xl text-[16px] font-semibold cursor-pointer transition-colors duration-150 hover:text-[#b06a5a]"
          >
            End session
          </button>
        </div>

      </div>
    </div>
  );
}
