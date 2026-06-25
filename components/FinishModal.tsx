'use client';

interface Props {
  currentStep: string;
  onMarkDone: () => void;
  onKeepGoing: () => void;
}

export default function FinishModal({ currentStep, onMarkDone, onKeepGoing }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade"
      style={{ background: 'rgba(45,40,37,0.32)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="rounded-[24px] w-full text-center"
        style={{
          background: '#f7f4ef',
          maxWidth: 420,
          padding: '40px 36px',
          boxShadow: '0 24px 60px rgba(45,40,37,0.24)',
        }}
      >
        <div className="text-[38px]" style={{ marginBottom: 8 }}>🌿</div>
        <h2
          className="font-serif font-medium text-[#2d2825]"
          style={{ fontSize: 27, marginBottom: 10 }}
        >
          Nice work showing up.
        </h2>
        <p className="text-[16px] text-[#8a7f70]" style={{ marginBottom: 8 }}>
          Did you finish this step?
        </p>
        <p
          className="text-[15px] font-semibold text-[#2d2825] leading-snug"
          style={{ marginBottom: 32 }}
        >
          {currentStep}
        </p>
        <div className="flex flex-col" style={{ gap: 12 }}>
          <button
            onClick={onMarkDone}
            className="min-h-[56px] bg-[#2f7261] text-white border-none rounded-[14px] text-[16px] font-bold cursor-pointer transition-colors duration-150 hover:bg-[#265e50]"
          >
            Yes — mark it done
          </button>
          <button
            onClick={onKeepGoing}
            className="min-h-[56px] bg-transparent text-[#8a7f70] border border-[#e2d6c4] rounded-[14px] text-[16px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#efe7da]"
          >
            Not yet — a little more
          </button>
        </div>
      </div>
    </div>
  );
}
