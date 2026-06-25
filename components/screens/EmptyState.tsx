'use client';

interface Props {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center animate-fade"
      style={{ paddingTop: 56, paddingBottom: 110 }}>
      <div className="w-24 h-24 rounded-full bg-[#eaf1ee] flex items-center justify-center mb-9">
        <div className="w-11 h-11 rounded-full" style={{ border: '3px solid #5b9182' }} />
      </div>
      <h1
        className="font-serif font-medium text-[#2d2825] leading-tight mb-4"
        style={{ fontSize: 'clamp(30px, 5.5vw, 46px)', maxWidth: '16ch' }}
      >
        One step at a time. Let&apos;s start.
      </h1>
      <p
        className="text-[18px] text-[#8a7f70] mb-11 leading-relaxed"
        style={{ maxWidth: '34ch' }}
      >
        Add the assignment that&apos;s been sitting in the back of your mind. We&apos;ll make it
        feel smaller.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2.5 min-h-[62px] px-10 bg-[#2f7261] text-white border-none rounded-2xl text-[18px] font-bold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(47,114,97,0.28)]"
        style={{ boxShadow: '0 6px 18px rgba(47,114,97,0.22)' }}
      >
        <span className="text-[22px] leading-none">+</span> Add your first task
      </button>
    </div>
  );
}
