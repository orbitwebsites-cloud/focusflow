'use client';
import type { Task } from '@/lib/types';

interface Props {
  tasks: Task[];
  greeting: string;
  onTaskOpen: (taskId: string) => void;
  onAdd: () => void;
}

export default function HomeScreen({ tasks, greeting, onTaskOpen, onAdd }: Props) {
  return (
    <div
      className="max-w-[720px] mx-auto px-6 animate-fade"
      style={{ paddingTop: 52, paddingBottom: 140 }}
    >
      <div style={{ marginBottom: 40 }}>
        <p className="text-[15px] text-[#a89d8e] font-semibold mb-1.5">{greeting}</p>
        <h1
          className="font-serif font-medium text-[#2d2825]"
          style={{ fontSize: 'clamp(30px, 5vw, 42px)' }}
        >
          Your tasks
        </h1>
      </div>

      <div className="flex flex-col" style={{ gap: 14, marginBottom: 32 }}>
        {tasks.map(task => {
          const done = task.steps.filter(s => s.done).length;
          const total = task.steps.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isComplete = total > 0 && done === total;
          const notStarted = done === 0;

          return (
            <button
              key={task.id}
              onClick={() => onTaskOpen(task.id)}
              className="block w-full text-left bg-white border border-[#efe7da] rounded-[18px] cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(67,52,40,0.08)] hover:border-[#e2d6c4]"
              style={{ padding: 24 }}
            >
              <div className="flex justify-between items-start gap-4" style={{ marginBottom: 16 }}>
                <span className="text-[19px] font-bold text-[#2d2825] leading-tight">
                  {task.title}
                </span>
                <span
                  className="flex-shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
                  style={
                    isComplete
                      ? { background: '#eaf1ee', color: '#2f7261' }
                      : notStarted
                      ? { background: '#f3efe7', color: '#a89d8e' }
                      : { background: '#f5eee2', color: '#b08948' }
                  }
                >
                  {isComplete ? 'Done' : notStarted ? 'Not started' : 'In progress'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[7px] bg-[#f0e9dd] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5b9182] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[13px] font-semibold text-[#a89d8e] whitespace-nowrap">
                  {done} of {total}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2.5 min-h-[60px] px-8 bg-[#2f7261] text-white border-none rounded-2xl text-[17px] font-bold cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(47,114,97,0.28)]"
        style={{ boxShadow: '0 6px 18px rgba(47,114,97,0.22)' }}
      >
        <span className="text-[22px] leading-none">+</span> Add task
      </button>
    </div>
  );
}
