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
import { getExpeditionTask } from './tasks';
import { ExpeditionGrade } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY='keyboard_expedition';

export function KeyboardExpeditionGame(){
  const [grade,setGrade]=useState<ExpeditionGrade>('2nd');
  const [status,setStatus]=useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task,setTask]=useState(()=>getExpeditionTask('2nd'));
  const [input,setInput]=useState('');
  const [attempts,setAttempts]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [streak,setStreak]=useState(0);
  const [bestStreak,setBestStreak]=useState(0);
  const [xpEarned,setXpEarned]=useState(0);
  const [completed,setCompleted]=useState(0);
  const [wrongStreak,setWrongStreak]=useState(0);
  const [showKeyboard,setShowKeyboard]=useState(true);
  const [soundOn,setSoundOn]=useState(true);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [syncWarning,setSyncWarning]=useState('');
  const [totalXP,setTotalXP]=useState(0);
  const userId='local-user'; // TODO wire existing logged-in user id

  useEffect(()=>setShowKeyboard(['Kindergarten','1st','2nd'].includes(grade)),[grade]);
  useEffect(()=>{(async()=>{const p=await getUserGameProgress(userId,GAME_KEY); if(p) setTotalXP(p.xp);})();},[]);

  const accuracy=attempts?Math.round((correct/attempts)*100):0;
  const targetKey=useMemo(()=>task.answer[Math.min(input.length, Math.max(0, task.answer.length-1))] ?? '',[input.length,task.answer]);

  const startRound=()=>{ setStatus('running'); setTask(getExpeditionTask(grade)); setInput(''); setAttempts(0); setCorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setCompleted(0); setWrongStreak(0); setSyncWarning(''); };
  const submit=()=>{
    if(status!=='running') return;
    setAttempts((a)=>a+1);
    if(input.trim().toUpperCase()===task.answer.toUpperCase()){
      const gain=task.xp_value;
      const ns=streak+1;
      setCorrect((c)=>c+1); setStreak(ns); setBestStreak((b)=>Math.max(b,ns)); setXpEarned((x)=>x+gain); setCompleted((c)=>c+1); setWrongStreak(0); setInput(''); setTask(getExpeditionTask(grade));
      playCorrectSound(soundOn);
    } else { setStreak(0); setWrongStreak((w)=>w+1); playTryAgainSound(soundOn); }
  };

  const endRound=async()=>{
    let roundXP=xpEarned+15;
    if(accuracy>80) roundXP+=15;
    const previous=await getUserGameProgress(userId,GAME_KEY);
    if(completed>(previous?.best_score??0)) roundXP+=20;
    const updatedXP=(previous?.xp??totalXP)+roundXP;
    setXpEarned(roundXP); setTotalXP(updatedXP);
    try { await saveUserGameProgress(userId,GAME_KEY,{ grade_level:grade.toLowerCase() as any, xp:updatedXP, level:calculateLevelFromXP(updatedXP), best_score:Math.max(previous?.best_score??0,completed), total_sessions:(previous?.total_sessions??0)+1, total_correct:(previous?.total_correct??0)+correct, total_attempts:(previous?.total_attempts??0)+attempts, accuracy, current_difficulty:task.difficulty, settings:{ best_streak:Math.max(bestStreak, Number(previous?.settings?.best_streak ?? 0)), mastered_task_types:[task.task_type] } }); } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn); setStatus('ended');
  };

  return <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 px-4 py-6"><div className="mx-auto max-w-6xl space-y-4"><GameTopBar title="Keyboard Expedition" grade={grade} xpEarned={xpEarned} accuracyLabel={`Accuracy: ${accuracy}%`} streak={streak} />{status==='ready'&&<GradeSelector selectedGrade={grade} onChange={(g)=>setGrade(g as ExpeditionGrade)} />}<section className="rounded-2xl bg-white/95 p-5 text-slate-900"><p className="text-sm font-bold text-indigo-700">Keyboarding, typing fluency, vocabulary, comprehension, instruction-following</p><p className="mt-2 text-lg font-semibold">{task.instruction}</p><p className="mt-1 text-xl font-bold">{task.prompt}</p><p className="mt-1 text-sm text-slate-700">Clue: {wrongStreak>=2?task.clue:'Type carefully to reveal the next map section.'}</p><p className="mt-2 text-sm">Expedition progress: {'🗺️'.repeat(Math.min(10, completed + 1))}</p><input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') submit(); }} className="mt-3 w-full rounded-xl border-2 border-indigo-500 px-4 py-3 text-lg" placeholder="Type your answer" disabled={status!=='running'} /><p className="mt-2 text-sm text-slate-700">{wrongStreak===0?'Type the clue to unlock the bridge.':wrongStreak===1?'Try again — you are close.': 'Need help? Follow the highlighted keys.'}</p></section><GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn(v=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion(v=>!v)}><button onClick={()=>setShowKeyboard(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{showKeyboard?'Hide Keyboard Guide':'Show Keyboard Guide'}</button></GameControlRow><VisualKeyboard targetKey={targetKey} visible={showKeyboard} /><KeyboardCoachDock targets={task.answer.split('').map((k) => ({ key: k }))} paused={status==='paused'} /><HandPlacementGuide targetKey={targetKey} />{status==='ended'&&<RoundSummary xpEarned={xpEarned} accuracy={accuracy} challengesCompleted={completed} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}</div></main>;
}
