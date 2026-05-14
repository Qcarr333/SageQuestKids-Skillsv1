'use client';

import { useEffect, useMemo, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { VisualKeyboard } from '@/components/gaming/typing-meteor/VisualKeyboard';
import { KeyboardCoachDock } from '@/components/gaming/keyboard-coach/KeyboardCoachDock';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { getMathTask } from './tasks';
import { MathGrade } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY = 'math_key_quest';

export function MathKeyQuestGame() {
  const [grade, setGrade] = useState<MathGrade>('2nd');
  const [status, setStatus] = useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task, setTask] = useState(() => getMathTask('2nd'));
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [problemsDone, setProblemsDone] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [syncWarning, setSyncWarning] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const userId = 'local-user'; // TODO wire authenticated user profile id

  useEffect(() => setShowKeyboard(['Kindergarten','1st','2nd','3rd'].includes(grade)), [grade]);
  useEffect(() => { (async()=>{ const p=await getUserGameProgress(userId, GAME_KEY); if (p) setTotalXP(p.xp); })(); }, []);

  const accuracy = attempts ? Math.round((correct/attempts)*100) : 0;
  const nextTargetKey = useMemo(() => task.answer[Math.min(input.length, Math.max(0, task.answer.length - 1))] ?? '', [input.length, task.answer]);

  const startRound = () => { setStatus('running'); setTask(getMathTask(grade)); setInput(''); setAttempts(0); setCorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setProblemsDone(0); setWrongStreak(0); setHintsUsed(0); setSyncWarning(''); };

  const sanitize = (value: string) => value.split('').filter((c) => task.allowed_inputs.includes(c)).join('');

  const submit = () => {
    if (status !== 'running') return;
    setAttempts((a)=>a+1);
    if (input.trim() === task.answer) {
      const gain = task.xp_value;
      const ns = streak + 1;
      setCorrect((c)=>c+1); setStreak(ns); setBestStreak((b)=>Math.max(b,ns)); setXpEarned((x)=>x+gain); setProblemsDone((p)=>p+1); setWrongStreak(0); setInput(''); setTask(getMathTask(grade));
      playCorrectSound(soundOn);
    } else {
      setStreak(0); setWrongStreak((w)=>w+1); playTryAgainSound(soundOn);
      if (wrongStreak >= 1) setHintsUsed((h)=>h+1);
    }
  };

  const endRound = async () => {
    let roundXP = xpEarned + 15;
    if (accuracy > 80) roundXP += 15;
    if (hintsUsed === 0) roundXP += 10;
    const previous = await getUserGameProgress(userId, GAME_KEY);
    if (problemsDone > (previous?.best_score ?? 0)) roundXP += 20;
    const updatedXP = (previous?.xp ?? totalXP) + roundXP;
    setXpEarned(roundXP); setTotalXP(updatedXP);
    try {
      await saveUserGameProgress(userId, GAME_KEY, { grade_level: grade.toLowerCase() as any, xp: updatedXP, level: calculateLevelFromXP(updatedXP), best_score: Math.max(previous?.best_score ?? 0, problemsDone), total_sessions:(previous?.total_sessions ?? 0)+1, total_correct:(previous?.total_correct ?? 0)+correct, total_attempts:(previous?.total_attempts ?? 0)+attempts, accuracy, current_difficulty: task.difficulty, settings:{ best_streak: Math.max(bestStreak, Number(previous?.settings?.best_streak ?? 0)) } });
    } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn); setStatus('ended');
  };

  return <main className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-sky-950 px-4 py-6"><div className="mx-auto max-w-6xl space-y-4"><GameTopBar title="Math Key Quest" grade={grade} xpEarned={xpEarned} accuracyLabel={`Accuracy: ${accuracy}%`} streak={streak} />{status==='ready'&&<GradeSelector selectedGrade={grade} onChange={(g)=>setGrade(g as MathGrade)} />}<section className="rounded-2xl bg-white/95 p-5 text-slate-900"><p className="text-sm font-bold text-indigo-700">Keyboarding, number row, math facts, symbols, accuracy</p><p className="mt-2 text-lg font-semibold">{task.instruction}</p><p className="mt-1 text-2xl font-black">{task.prompt}</p><p className="mt-1 text-sm text-slate-700">Use the number row to type your answer.</p><p className="mt-2 text-sm">Quest progress: {'🧭'.repeat(Math.min(10, problemsDone + 1))}</p><input value={input} onChange={(e)=>setInput(sanitize(e.target.value))} onKeyDown={(e)=>{ if (e.key==='Enter') submit(); }} className="mt-3 w-full rounded-xl border-2 border-sky-500 px-4 py-3 text-lg" placeholder="Type your answer" disabled={status!=='running'} /><p className="mt-2 text-sm text-slate-700">{wrongStreak === 0 ? 'Find the next number key near the top row.' : wrongStreak === 1 ? 'Try again — you are close.' : `Hint: ${task.hint}`}</p></section><GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn((v)=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion((v)=>!v)}><button onClick={()=>setShowKeyboard((v)=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{showKeyboard ? 'Hide Keyboard Guide' : 'Show Keyboard Guide'}</button></GameControlRow><VisualKeyboard targetKey={nextTargetKey} visible={showKeyboard} /><KeyboardCoachDock targets={task.answer.split('').map((k) => ({ key: k }))} paused={status==='paused'} />{status==='ended'&&<RoundSummary xpEarned={xpEarned} problemsCompleted={problemsDone} accuracy={accuracy} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}</div></main>;
}
