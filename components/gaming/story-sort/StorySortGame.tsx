'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { awardXP, calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { DraggableItem } from './DraggableItem';
import { DropZone } from './DropZone';
import { getTaskForGrade } from './GradeDifficultyTasks';
import { HintPanel } from './HintPanel';
import { RoundSummary } from './RoundSummary';
import { TaskInstructionPanel } from './TaskInstructionPanel';
import { StoryGradeOption } from './types';

const GAME_KEY = 'story_sort';

export function StorySortGame() {
  const [grade, setGrade] = useState<StoryGradeOption>('3rd');
  const [status, setStatus] = useState<'ready'|'running'|'ended'>('ready');
  const [task, setTask] = useState(() => getTaskForGrade('3rd'));
  const [placements, setPlacements] = useState<Record<string,string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [syncWarning, setSyncWarning] = useState('');
  const [totalXP, setTotalXP] = useState(0);

  const userId = 'local-user'; // TODO connect authenticated profile id

  useEffect(() => {
    (async () => {
      const existing = await getUserGameProgress(userId, GAME_KEY);
      if (existing) setTotalXP(existing.xp);
    })();
  }, []);

  const startRound = () => {
    setTask(getTaskForGrade(grade));
    setPlacements({});
    setAttempts(0); setCorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setHintUsed(false); setSyncWarning('');
    setStatus('running');
  };

  const tryPlace = async (zoneId: string, itemId: string) => {
    if (placements[itemId] || status !== 'running') return;
    setAttempts((a) => a + 1);
    const rightZone = task.correct_answers[itemId];
    if (rightZone === zoneId) {
      setPlacements((p) => ({ ...p, [itemId]: zoneId }));
      setCorrect((c) => c + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setXpEarned((x) => x + 3);
      if (soundOn) {
        // TODO placeholder hooks: soft chime, gentle pop, puzzle snap
      }
      await awardXP(userId, GAME_KEY, 3, 'round_complete');
    } else {
      setStreak(0);
    }
    setSelectedItem(null);
  };

  const onClickZone = (zoneId: string) => {
    if (!selectedItem) return;
    void tryPlace(zoneId, selectedItem);
  };

  const completion = `${Object.keys(placements).length}/${task.draggable_items.length}`;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;

  useEffect(() => {
    if (status !== 'running') return;
    if (Object.keys(placements).length !== task.draggable_items.length) return;
    void endRound();
  }, [placements, status, task.draggable_items.length]);

  const endRound = async () => {
    const previous = await getUserGameProgress(userId, GAME_KEY);
    let bonusXP = task.xp_value + 15;
    if (accuracy > 80) bonusXP += 15;
    if (!hintUsed) bonusXP += 10;
    if (correct > (previous?.best_score ?? 0)) bonusXP += 20;

    const finalRoundXP = xpEarned + bonusXP;
    setXpEarned(finalRoundXP);
    const updatedXP = (previous?.xp ?? totalXP) + finalRoundXP;
    setTotalXP(updatedXP);

    try {
      await saveUserGameProgress(userId, GAME_KEY, {
        grade_level: grade.toLowerCase() as any,
        xp: updatedXP,
        level: calculateLevelFromXP(updatedXP),
        best_score: Math.max(previous?.best_score ?? 0, correct),
        total_sessions: (previous?.total_sessions ?? 0) + 1,
        total_correct: (previous?.total_correct ?? 0) + correct,
        total_attempts: (previous?.total_attempts ?? 0) + attempts,
        accuracy,
        current_difficulty: `${grade}-${task.task_type}`,
        settings: { best_streak: Math.max(bestStreak, Number(previous?.settings?.best_streak ?? 0)), mastered_task_types: [task.task_type] },
      });
    } catch {
      setSyncWarning('Progress will sync when available');
    }
    setStatus('ended');
  };

  const unplaced = useMemo(() => task.draggable_items.filter((item) => !placements[item.id]), [placements, task.draggable_items]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-2xl bg-slate-900/90 p-4 ring-1 ring-sky-300/20">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/gaming" className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">Back to Gaming</Link>
            <h1 className="text-2xl font-black">Story Sort Drag-and-Drop</h1>
            <span className="rounded bg-sky-600/80 px-3 py-1">Grade: {grade}</span>
            <span>Round XP: {xpEarned}</span><span>Accuracy: {accuracy}%</span><span>Current streak: {streak}</span>
          </div>
        </header>

        {status === 'ready' && <GradeSelector selectedGrade={grade} onChange={(g) => setGrade(g as StoryGradeOption)} />}

        <TaskInstructionPanel instruction={task.instruction} completion={completion} />

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/95 p-4 text-slate-900">
            <h2 className="text-lg font-bold">Item Bank</h2>
            <div className="mt-3 grid gap-2">
              {unplaced.map((item) => <DraggableItem key={item.id} item={item} selected={selectedItem === item.id} placed={false} onSelect={setSelectedItem} />)}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-purple-300/20">
            <h2 className="text-lg font-bold">Drop Zones</h2>
            <div className="mt-3 grid gap-3">
              {task.drop_zones.map((zone) => {
                const filledEntry = Object.entries(placements).find(([, z]) => z === zone.id);
                const filledItem = filledEntry ? task.draggable_items.find((i) => i.id === filledEntry[0]) : undefined;
                return <DropZone key={zone.id} id={zone.id} label={zone.label} filledLabel={filledItem?.label} large={grade === 'Kindergarten' || grade === '1st'} onDropItem={(z,i)=>void tryPlace(z,i)} onClickPlace={onClickZone} />;
              })}
            </div>
          </div>
        </section>

        <HintPanel hint={task.hint} hintUsed={hintUsed} onHint={() => setHintUsed(true)} />

        <div className="flex flex-wrap gap-2">
          {status !== 'running' ? <button onClick={startRound} className="min-h-11 rounded-xl bg-teal-600 px-4 py-2 font-semibold">Start Task</button> : <button onClick={() => void endRound()} className="min-h-11 rounded-xl bg-rose-600 px-4 py-2 font-semibold">End Round</button>}
          <button onClick={() => setSoundOn((v) => !v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{soundOn ? 'Mute sounds' : 'Unmute sounds'}</button>
        </div>

        {status === 'ended' && <RoundSummary xpEarned={xpEarned} correct={correct} attempts={attempts} accuracy={accuracy} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={() => setStatus('ready')} />}
      </div>
    </main>
  );
}
