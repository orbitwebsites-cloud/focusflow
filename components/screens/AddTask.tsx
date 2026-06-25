'use client';

interface Props {
  titleValue: string;
  detailValue: string;
  isBreaking: boolean;
  breakError: string | null;
  onTitleInput: (val: string) => void;
  onDetailInput: (val: string) => void;
  onBreakItDown: () => void;
  onBack: () => void;
}

export default function AddTask({
  titleValue,
  detailValue,
  isBreaking,
  breakError,
  onTitleInput,
  onDetailInput,
  onBreakItDown,
  onBack,
}: Props) {
  return (
    <div className="max-w-[620px] mx-auto px-6 animate-fade" style={{ paddingTop: 40, paddingBottom: 140 }}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 bg-transparent border-none text-[#8a7f70] text-[15px] font-semibold cursor-pointer px-1 py-2 hover:text-[#2d2825] transition-colors"
        style={{ marginBottom: 36 }}
      >
        <span className="text-[18px]">←</span> Back
      </button>

      {isBreaking ? (
        <div className="flex flex-col items-center text-center" style={{ paddingTop: 60 }}>
          <div
            className="w-14 h-14 rounded-full border-4 border-[#e7dfd3] animate-spin-slow"
            style={{ borderTopColor: '#5b9182', marginBottom: 32 }}
          />
          <h2 className="font-serif text-[26px] font-medium text-[#2d2825] mb-3">
            Breaking it into small steps…
          </h2>
          <p className="text-[16px] text-[#a89d8e]" style={{ maxWidth: '30ch' }}>
            This takes a few seconds. No rush — breathe.
          </p>
        </div>
      ) : (
        <>
          <h1
            className="font-serif font-medium text-[#2d2825] mb-2.5"
            style={{ fontSize: 'clamp(28px, 4.6vw, 38px)' }}
          >
            What needs doing?
          </h1>
          <p className="text-[17px] text-[#a89d8e] leading-relaxed" style={{ marginBottom: 40 }}>
            Just the assignment. We&apos;ll break it into small steps for you.
          </p>

          <label className="block text-[14px] font-bold text-[#8a7f70] mb-2.5">Assignment</label>
          <input
            value={titleValue}
            onChange={e => onTitleInput(e.target.value)}
            placeholder="e.g. Write 5-page history essay on WWII"
            className="w-full text-[19px] font-semibold text-[#2d2825] bg-white border border-[#e7dfd3] rounded-[14px]"
            style={{ padding: '20px', marginBottom: 24, outline: 'none', transition: 'border-color 160ms' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6fa496')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e7dfd3')}
          />

          <label className="block text-[14px] font-bold text-[#8a7f70] mb-2.5">
            Anything to add?{' '}
            <span className="font-medium text-[#b8ad9d]">(optional)</span>
          </label>
          <textarea
            value={detailValue}
            onChange={e => onDetailInput(e.target.value)}
            placeholder="Due date, length, topic notes…"
            rows={3}
            className="w-full text-[16px] text-[#2d2825] bg-white border border-[#e7dfd3] rounded-[14px] resize-y leading-relaxed"
            style={{ padding: '18px 20px', marginBottom: 36, outline: 'none', transition: 'border-color 160ms' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#6fa496')}
            onBlur={e => (e.currentTarget.style.borderColor = '#e7dfd3')}
          />

          {breakError && (
            <p className="text-[#b06a5a] text-[14px] mb-4 text-center">{breakError}</p>
          )}

          <button
            onClick={onBreakItDown}
            disabled={!titleValue.trim()}
            className="w-full inline-flex items-center justify-center gap-2.5 min-h-[62px] bg-[#2f7261] text-white border-none rounded-2xl text-[18px] font-bold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ boxShadow: titleValue.trim() ? '0 6px 18px rgba(47,114,97,0.22)' : 'none' }}
          >
            Break it down for me
          </button>
          <p className="text-center text-[14px] text-[#b8ad9d] mt-4">
            No account needed. Your task stays on this device.
          </p>
        </>
      )}
    </div>
  );
}
