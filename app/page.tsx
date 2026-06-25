'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { Screen, Task } from '@/lib/types';
import { loadTasks, saveTasks } from '@/lib/storage';
import FocusSession from '@/components/screens/FocusSession';
import TaskDetail from '@/components/screens/TaskDetail';
import HomeScreen from '@/components/screens/HomeScreen';
import AddTask from '@/components/screens/AddTask';
import EmptyState from '@/components/screens/EmptyState';
import BlockedScreen from '@/components/screens/BlockedScreen';
import FinishModal from '@/components/FinishModal';

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>('empty');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [detailValue, setDetailValue] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [breakError, setBreakError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadTasks();
    if (saved.length > 0) {
      setTasks(saved);
      setScreen('home');
    }
  }, []);

  // Persist whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Timer engine
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setShowFinishModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // ── derived ──
  const activeTask = tasks.find(t => t.id === activeTaskId) ?? null;
  const activeStep =
    activeTask?.steps.find(s => s.id === activeStepId) ??
    activeTask?.steps.find(s => !s.done) ??
    activeTask?.steps[0] ??
    null;

  // ── helpers ──
  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(
    (min = selectedMinutes) => {
      stopTimer();
      setTimeLeft(min * 60);
      setHasStarted(false);
    },
    [selectedMinutes, stopTimer],
  );

  // ── navigation ──
  const goHome = useCallback(() => {
    setScreen(tasks.length > 0 ? 'home' : 'empty');
  }, [tasks.length]);

  const goAdd = useCallback(() => {
    setTitleValue('');
    setDetailValue('');
    setBreakError(null);
    setScreen('add');
  }, []);

  const openTask = useCallback(
    (taskId: string) => {
      setActiveTaskId(taskId);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const next = task.steps.find(s => !s.done);
        setActiveStepId(next?.id ?? task.steps[0]?.id ?? null);
      }
      setScreen('taskDetail');
    },
    [tasks],
  );

  // ── focus session ──
  const togglePlay = useCallback(() => {
    setIsRunning(r => !r);
    setHasStarted(true);
  }, []);

  const endSession = useCallback(() => {
    stopTimer();
    setShowFinishModal(true);
  }, [stopTimer]);

  const setPreset = useCallback(
    (min: number) => {
      if (isRunning || hasStarted) return;
      setSelectedMinutes(min);
      setTimeLeft(min * 60);
    },
    [isRunning, hasStarted],
  );

  const startFocusOn = useCallback(
    (stepId: string) => {
      stopTimer();
      setActiveStepId(stepId);
      setTimeLeft(selectedMinutes * 60);
      setHasStarted(false);
      setScreen('focus');
    },
    [stopTimer, selectedMinutes],
  );

  // ── steps ──
  const toggleStep = useCallback(
    (stepId: string) => {
      if (!activeTaskId) return;
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTaskId
            ? { ...t, steps: t.steps.map(s => (s.id === stepId ? { ...s, done: !s.done } : s)) }
            : t,
        ),
      );
    },
    [activeTaskId],
  );

  const addStepToTask = useCallback(
    (text: string) => {
      if (!activeTaskId) return;
      setTasks(prev =>
        prev.map(t =>
          t.id === activeTaskId
            ? {
                ...t,
                steps: [
                  ...t.steps,
                  { id: uid(), text, done: false, order: t.steps.length },
                ],
              }
            : t,
        ),
      );
    },
    [activeTaskId],
  );

  // ── finish modal ──
  const markDone = useCallback(() => {
    if (!activeTaskId || !activeStep) return;
    const stepId = activeStep.id;

    setTasks(prev =>
      prev.map(t =>
        t.id === activeTaskId
          ? { ...t, steps: t.steps.map(s => (s.id === stepId ? { ...s, done: true } : s)) }
          : t,
      ),
    );
    setShowFinishModal(false);
    resetTimer();

    // advance to next incomplete step
    setTasks(prev => {
      const task = prev.find(t => t.id === activeTaskId);
      if (task) {
        const next = task.steps.find(s => s.id !== stepId && !s.done);
        setActiveStepId(next?.id ?? null);
      }
      return prev;
    });
    setScreen('taskDetail');
  }, [activeTaskId, activeStep, resetTimer]);

  const keepGoing = useCallback(() => {
    setShowFinishModal(false);
    // Give a 5-min top-up
    stopTimer();
    setTimeLeft(5 * 60);
    setHasStarted(false);
  }, [stopTimer]);

  // ── AI breakdown ──
  const breakItDown = useCallback(async () => {
    setIsBreaking(true);
    setBreakError(null);

    const taskTitle = titleValue.trim();
    const taskDesc = detailValue.trim();

    // Create the task and navigate immediately — steps stream in afterwards.
    const newTaskId = uid();
    const newTask: Task = {
      id: newTaskId,
      title: taskTitle,
      description: taskDesc,
      createdAt: new Date().toISOString(),
      steps: [],
    };
    setTasks(prev => [...prev, newTask]);
    setActiveTaskId(newTaskId);
    setActiveStepId(null);
    setTitleValue('');
    setDetailValue('');
    setScreen('taskDetail');

    try {
      const res = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle, description: taskDesc }),
      });

      if (!res.ok || !res.body) throw new Error('Request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let orderCounter = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';
        for (const event of events) {
          if (!event.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(event.slice(6));
            if (payload.step) {
              const order = orderCounter++;
              setTasks(prev =>
                prev.map(t =>
                  t.id === newTaskId
                    ? { ...t, steps: [...t.steps, { id: uid(), text: payload.step, done: false, order }] }
                    : t,
                ),
              );
            }
            if (payload.error) setBreakError(payload.error);
          } catch {}
        }
      }
    } catch (err) {
      setBreakError((err as Error).message || 'Failed to break down task. Add steps manually.');
    } finally {
      setIsBreaking(false);
    }
  }, [titleValue, detailValue]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f4ef', position: 'relative' }}>

      {screen === 'empty' && <EmptyState onAdd={goAdd} />}

      {screen === 'home' && (
        <HomeScreen
          tasks={tasks}
          greeting={getGreeting()}
          onTaskOpen={openTask}
          onAdd={goAdd}
        />
      )}

      {screen === 'add' && (
        <AddTask
          titleValue={titleValue}
          detailValue={detailValue}
          isBreaking={isBreaking}
          breakError={breakError}
          onTitleInput={setTitleValue}
          onDetailInput={setDetailValue}
          onBreakItDown={breakItDown}
          onBack={goHome}
        />
      )}

      {screen === 'taskDetail' && activeTask && (
        <TaskDetail
          task={activeTask}
          isStreaming={isBreaking}
          onBack={goHome}
          onToggleStep={toggleStep}
          onStartFocus={startFocusOn}
          onAddStep={addStepToTask}
        />
      )}

      {screen === 'focus' && (
        <FocusSession
          currentStep={activeStep?.text ?? 'Get started'}
          timeLeft={timeLeft}
          totalSec={selectedMinutes * 60}
          selectedMinutes={selectedMinutes}
          isRunning={isRunning}
          hasStarted={hasStarted}
          onTogglePlay={togglePlay}
          onEndSession={endSession}
          onSetPreset={setPreset}
        />
      )}

      {screen === 'blocked' && (
        <BlockedScreen
          currentStep={activeStep?.text ?? 'Your current step'}
          onGoFocus={() => setScreen('focus')}
          onEndAndContinue={() => {
            stopTimer();
            goHome();
          }}
        />
      )}

      {showFinishModal && (
        <FinishModal
          currentStep={activeStep?.text ?? 'Your step'}
          onMarkDone={markDone}
          onKeepGoing={keepGoing}
        />
      )}
    </div>
  );
}
