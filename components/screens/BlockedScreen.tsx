'use client';

interface Props {
  currentStep: string;
  onGoFocus: () => void;
  onEndAndContinue: () => void;
}

export default function BlockedScreen({ currentStep, onGoFocus, onEndAndContinue }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center animate-fade"
      style={{ paddingTop: 56, paddingBottom: 110 }}
    >
      <p className="text-[14px] tracking-[1.5px] text-[#a89d8e] uppercase font-semibold mb-7">
        You&apos;re in a focus session
      </p>
      <h1
        className="font-serif font-medium text-[#2d2825] leading-tight mb-5"
        style={{ fontSize: 'clamp(28px, 5vw, 42px)', maxWidth: '20ch' }}
      >
        This one can wait. You were in the middle of something.
      </h1>

      <div
        className="bg-white border border-[#efe7da] rounded-[18px] p-8 mb-10 w-full"
        style={{ maxWidth: 440 }}
      >
        <p className="text-[13px] tracking-[1px] text-[#a89d8e] uppercase font-semibold mb-3">
          Your step
        </p>
        <p className="font-serif text-[22px] font-medium text-[#2d2825] leading-tight">
          {currentStep}
        </p>
      </div>

      <button
        onClick={onGoFocus}
        className="inline-flex items-center gap-2.5 min-h-[60px] px-9 bg-[#2f7261] text-white border-none rounded-2xl text-[17px] font-bold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(47,114,97,0.28)]"
        style={{ boxShadow: '0 6px 18px rgba(47,114,97,0.22)' }}
      >
        Back to focus
      </button>
      <button
        onClick={onEndAndContinue}
        className="mt-2 bg-transparent border-none text-[#a89d8e] text-[15px] font-semibold cursor-pointer px-3 py-3 hover:text-[#8a7f70] transition-colors"
      >
        End session &amp; let me through
      </button>
    </div>
  );
}
