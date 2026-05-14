'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { HandPlacementGuide } from '@/components/gaming/typing-meteor/HandPlacementGuide';
import { VisualKeyboard } from '@/components/gaming/typing-meteor/VisualKeyboard';
import { KeyboardCoachDock } from '@/components/gaming/keyboard-coach/KeyboardCoachDock';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { getRhythmTask } from './tasks';
import { RhythmGrade } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY='rhythm_row_typing';

export function RhythmRowTypingGame(){
  const [grade,setGrade]=useState<RhythmGrade>('2nd');
  const [status,setStatus]=useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task,setTask]=useState(()=>getRhythmTask('2nd'));
  const [index,setIndex]=useState(0);
  const [input,setInput]=useState('');
  const [attempts,setAttempts]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [combo,setCombo]=useState(0);
  const [bestCombo,setBestCombo]=useState(0);
  const [xpEarned,setXpEarned]=useState(0);
  const [timingHits,setTimingHits]=useState<number[]>([]);
  const [soundOn,setSoundOn]=useState(true);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [slowMode,setSlowMode]=useState(false);
  const [showKeyboard,setShowKeyboard]=useState(true);
  const [syncWarning,setSyncWarning]=useState('');
  const [totalXP,setTotalXP]=useState(0);
  const [beatTick,setBeatTick]=useState(0);
  const beatStart=useRef<number>(Date.now());
  const userId='local-user'; // TODO wire existing auth user id

  useEffect(()=>setShowKeyboard(['Kindergarten','1st','2nd'].includes(grade)),[grade]);
  useEffect(()=>{(async()=>{const p=await getUserGameProgress(userId,GAME_KEY); if(p) setTotalXP(p.xp);})();},[]);

  useEffect(()=>{
    if(status!=='running') return;
    const bpm=slowMode ? Math.max(50, task.bpm-12) : task.bpm;
    const ms=Math.round(60000/bpm);
    beatStart.current=Date.now();
    const id=setInterval(()=>setBeatTick((b)=>b+1),ms);
    return ()=>clearInterval(id);
  },[slowMode,status,task.bpm]);

  const current=task.prompt_sequence[index] ?? '';
  const targetKey=useMemo(()=>current[Math.min(input.length, Math.max(0,current.length-1))] ?? '',[current,input.length]);
  const accuracy=attempts?Math.round((correct/attempts)*100):0;
  const timingConsistency=timingHits.length?Math.max(0,100-Math.round(timingHits.reduce((a,b)=>a+b,0)/timingHits.length/8)):100;

  const startRound=()=>{ setStatus('running'); setTask(getRhythmTask(grade)); setIndex(0); setInput(''); setAttempts(0); setCorrect(0); setCombo(0); setBestCombo(0); setXpEarned(0); setTimingHits([]); setSyncWarning(''); };

  const submit=()=>{
    if(status!=='running') return;
    setAttempts((a)=>a+1);
    const delta=Math.abs(Date.now()-beatStart.current);
    if(input.trim().toLowerCase()===current.toLowerCase()){
      const ns=combo+1;
      setCorrect((c)=>c+1); setCombo(ns); setBestCombo((b)=>Math.max(b,ns)); setXpEarned((x)=>x+(current.length===1?1:4)); setTimingHits((h)=>[...h,delta]);
      if(ns>0 && ns%5===0) setXpEarned((x)=>x+10);
      setInput(''); setIndex((i)=> (i+1) % task.prompt_sequence.length);
      playCorrectSound(soundOn);
    } else {
      setCombo(0); playTryAgainSound(soundOn);
    }
  };

  const endRound=async()=>{
    let roundXP=xpEarned+15;
    if(accuracy>80) roundXP+=15;
    const previous=await getUserGameProgress(userId,GAME_KEY);
    if(correct>(previous?.best_score??0)) roundXP+=20;
    const updatedXP=(previous?.xp??totalXP)+roundXP;
    setXpEarned(roundXP); setTotalXP(updatedXP);
    try { await saveUserGameProgress(userId,GAME_KEY,{ grade_level:grade.toLowerCase() as any, xp:updatedXP, level:calculateLevelFromXP(updatedXP), best_score:Math.max(previous?.best_score??0,correct), total_sessions:(previous?.total_sessions??0)+1, total_correct:(previous?.total_correct??0)+correct, total_attempts:(previous?.total_attempts??0)+attempts, accuracy, current_difficulty:task.difficulty, settings:{ best_combo:Math.max(bestCombo, Number(previous?.settings?.best_combo ?? 0)), bpm_completed:task.bpm, patterns_completed:correct } }); } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn); setStatus('ended');
  };

  const rating=timingHits.length===0?'Great':timingHits[timingHits.length-1] < task.timing_window*0.35 ? 'Great' : timingHits[timingHits.length-1] < task.timing_window*0.7 ? 'Good' : 'Nice Try';

  return <main className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-900 px-4 py-6"><div className="mx-auto max-w-6xl space-y-4"><GameTopBar title="Rhythm Row Typing" grade={grade} xpEarned={xpEarned} accuracyLabel={`Accuracy: ${accuracy}%`} streak={combo} />{status==='ready'&&<GradeSelector selectedGrade={grade} onChange={(g)=>setGrade(g as RhythmGrade)} />}<section className="rounded-2xl bg-white/10 p-4 text-white ring-1 ring-purple-300/30"><p className="text-sm font-semibold text-purple-100">{task.instruction}</p><div className="mt-3 rounded-xl bg-slate-900/70 p-4"><p className="text-xs uppercase tracking-wide text-purple-200">Rhythm lane</p><p className="mt-2 text-3xl font-black tracking-wider">{current}</p><p className="mt-1 text-sm text-purple-100">Timing cue: {rating} • Beat {beatTick}</p><div className="mt-3 h-2 rounded bg-purple-900"><div className="h-full rounded bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" style={{width:`${Math.min(100,(combo/10)*100)}%`}} /></div></div><input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') submit(); }} className="mt-3 w-full rounded-xl border-2 border-purple-400 bg-slate-950 px-4 py-3 text-lg text-white" placeholder="Type in rhythm" disabled={status!=='running'} /><p className="mt-2 text-sm text-purple-100">{combo>0?'Flow smoothly to the next key.':'Keep your fingers near home row.'}</p></section><GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn(v=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion(v=>!v)}><button onClick={()=>setSlowMode(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{slowMode?'Normal Tempo':'Slower Rhythm Mode'}</button><button onClick={()=>setShowKeyboard(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{showKeyboard?'Hide Keyboard Guide':'Show Keyboard Guide'}</button></GameControlRow><VisualKeyboard targetKey={targetKey} visible={showKeyboard} /><KeyboardCoachDock targets={task.pattern.split('').map((k) => ({ key: k }))} paused={status==='paused'} /><HandPlacementGuide targetKey={targetKey} />{status==='ended'&&<RoundSummary xpEarned={xpEarned} accuracy={accuracy} timingConsistency={timingConsistency} bestCombo={bestCombo} flowScore={combo+correct} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}</div></main>;
}
