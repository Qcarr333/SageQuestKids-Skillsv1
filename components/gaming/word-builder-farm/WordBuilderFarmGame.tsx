'use client';

import { useEffect, useMemo, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { HandPlacementGuide } from '@/components/gaming/typing-meteor/HandPlacementGuide';
import { VisualKeyboard } from '@/components/gaming/typing-meteor/VisualKeyboard';
import { KeyboardCoachDock } from '@/components/gaming/keyboard-coach/KeyboardCoachDock';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { getFarmTask } from './tasks';
import { FarmGrade } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY = 'word_builder_farm';

export function WordBuilderFarmGame() {
  const [grade, setGrade] = useState<FarmGrade>('2nd');
  const [status, setStatus] = useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task, setTask] = useState(() => getFarmTask('2nd'));
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [syncWarning, setSyncWarning] = useState('');
  const [totalXP, setTotalXP] = useState(0);

  const userId = 'local-user'; // TODO connect to auth profile id
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;

  useEffect(() => { setShowKeyboard(grade === 'Kindergarten' || grade === '1st' || grade === '2nd'); }, [grade]);
  useEffect(() => { (async()=>{ const p = await getUserGameProgress(userId, GAME_KEY); if (p) setTotalXP(p.xp); })(); }, []);

  const startRound = () => { setStatus('running'); setTask(getFarmTask(grade)); setInput(''); setAttempts(0); setCorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setTasksDone(0); setSyncWarning(''); };

  const checkAnswer = () => {
    if (status !== 'running') return;
    setAttempts((a) => a + 1);
    if (input.trim().toLowerCase() === task.answer.toLowerCase()) {
      const gain = task.xp_value;
      const nextStreak = streak + 1;
      setCorrect((c) => c + 1); setStreak(nextStreak); setBestStreak((b) => Math.max(b, nextStreak)); setXpEarned((x) => x + gain); setTasksDone((t) => t + 1);
      playCorrectSound(soundOn);
      setTask(getFarmTask(grade)); setInput('');
    } else {
      setStreak(0);
      playTryAgainSound(soundOn);
    }
  };

  const endRound = async () => {
    let roundXP = xpEarned + 15;
    if (accuracy > 80) roundXP += 15;
    const previous = await getUserGameProgress(userId, GAME_KEY);
    if (tasksDone > (previous?.best_score ?? 0)) roundXP += 20;
    const updatedXP = (previous?.xp ?? totalXP) + roundXP;
    setXpEarned(roundXP); setTotalXP(updatedXP);
    try {
      await saveUserGameProgress(userId, GAME_KEY, {
        grade_level: grade.toLowerCase() as any, xp: updatedXP, level: calculateLevelFromXP(updatedXP), best_score: Math.max(previous?.best_score ?? 0, tasksDone),
        total_sessions: (previous?.total_sessions ?? 0) + 1, total_correct: (previous?.total_correct ?? 0) + correct, total_attempts: (previous?.total_attempts ?? 0) + attempts,
        accuracy, current_difficulty: task.difficulty, settings: { best_streak: Math.max(bestStreak, Number(previous?.settings?.best_streak ?? 0)) },
      });
    } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn);
    setStatus('ended');
  };

  const targetKey = useMemo(() => task.answer?.[Math.min(input.length, Math.max(0, task.answer.length - 1))] ?? '', [input.length, task.answer]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-200 via-green-100 to-lime-100 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <GameTopBar title="Word Builder Farm" grade={grade} xpEarned={xpEarned} accuracyLabel={`Accuracy: ${accuracy}%`} streak={streak} />
        {status === 'ready' && <GradeSelector selectedGrade={grade} onChange={(g) => setGrade(g as FarmGrade)} />}

        <section className="rounded-2xl bg-white/95 p-5 text-slate-900 shadow">
          <p className="text-sm font-bold text-green-700">Typing, spelling, phonics, sight words, vocabulary</p>
          <p className="mt-2 text-lg font-semibold">{task.instruction}</p>
          <p className="mt-1 text-base">Prompt: <span className="font-bold">{task.prompt}</span> {task.image_clue ? task.image_clue : ''}</p>
          <p className="mt-1 text-sm text-slate-700">Clue: {task.clue ?? 'Build the word carefully.'}</p>
          <p className="mt-3 text-sm">Farm progress: {'🌱'.repeat(Math.min(10, tasksDone + 1))}</p>
          <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') checkAnswer(); }} placeholder="Type answer" className="mt-3 w-full rounded-xl border-2 border-green-400 px-4 py-3 text-lg" disabled={status !== 'running'} />
          <div className="mt-2 text-sm">Letter slots: {task.answer.split('').map((c, i) => <span key={`${c}-${i}`} className="mx-1 inline-block min-w-8 rounded bg-green-100 px-2 py-1 text-center">{input[i] ?? '_'}</span>)}</div>
          <p className="mt-2 text-sm text-slate-700">{attempts > 0 && input && input.toLowerCase() !== task.answer.toLowerCase() ? "Try again — you're getting closer." : 'Find the next letter and return to home row.'}</p>
        </section>

        <GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn((v)=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion((v)=>!v)}>
          <button onClick={()=>setShowKeyboard((v)=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{showKeyboard ? 'Hide Keyboard Guide' : 'Show Keyboard Guide'}</button>
        </GameControlRow>

        <VisualKeyboard targetKey={targetKey} visible={showKeyboard} />
        <HandPlacementGuide targetKey={targetKey} />
        <KeyboardCoachDock targets={task.answer.split('').map((k) => ({ key: k }))} paused={status === 'paused'} />

        {status === 'ended' && <RoundSummary xpEarned={xpEarned} wordsCompleted={tasksDone} accuracy={accuracy} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}
      </div>
    </main>
  );
}
