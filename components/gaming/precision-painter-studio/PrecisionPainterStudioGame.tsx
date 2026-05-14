'use client';

import { useEffect, useRef, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { getPainterTask } from './tasks';
import { PainterGrade } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY='precision_painter_studio';

export function PrecisionPainterStudioGame(){
  const [grade,setGrade]=useState<PainterGrade>('2nd');
  const [status,setStatus]=useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task,setTask]=useState(()=>getPainterTask('2nd'));
  const [brushSize,setBrushSize]=useState<'small'|'medium'|'large'>('medium');
  const [assist,setAssist]=useState(false);
  const [soundOn,setSoundOn]=useState(true);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [attempts,setAttempts]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [streak,setStreak]=useState(0);
  const [bestStreak,setBestStreak]=useState(0);
  const [xpEarned,setXpEarned]=useState(0);
  const [painted,setPainted]=useState(0);
  const [onTarget,setOnTarget]=useState(0);
  const [syncWarning,setSyncWarning]=useState('');
  const [totalXP,setTotalXP]=useState(0);
  const areaRef=useRef<HTMLDivElement>(null);
  const userId='local-user';

  useEffect(()=>{(async()=>{const p=await getUserGameProgress(userId,GAME_KEY); if(p) setTotalXP(p.xp);})();},[]);

  const completion=Math.min(100,Math.round((painted/140)*100));
  const precision=painted?Math.round((onTarget/painted)*100):0;
  const accuracy=attempts?Math.round((correct/attempts)*100):0;

  const startRound=()=>{ setStatus('running'); setTask(getPainterTask(grade)); setAttempts(0); setCorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setPainted(0); setOnTarget(0); setSyncWarning(''); };

  const draw=(e: React.PointerEvent<HTMLDivElement>)=>{
    if(status!=='running') return;
    const rect=areaRef.current?.getBoundingClientRect(); if(!rect) return;
    const x=((e.clientX-rect.left)/rect.width)*100; const y=((e.clientY-rect.top)/rect.height)*100;
    setPainted((p)=>p+1);
    const centerY=50+Math.sin((x/100)*Math.PI*2)*20;
    const tolerance=(assist?12:8)+(brushSize==='large'?5:brushSize==='small'?-1:0);
    if(Math.abs(y-centerY)<=tolerance){ setOnTarget((t)=>t+1); }
  };

  const evaluate=()=>{
    setAttempts((a)=>a+1);
    if(precision/100>=task.precision_requirement){
      const ns=streak+1;
      setCorrect((c)=>c+1); setStreak(ns); setBestStreak((b)=>Math.max(b,ns)); setXpEarned((x)=>x+task.xp_value); playCorrectSound(soundOn);
      setTask(getPainterTask(grade)); setPainted(0); setOnTarget(0);
    } else { setStreak(0); playTryAgainSound(soundOn); }
  };

  const endRound=async()=>{
    let roundXP=xpEarned+15; if(precision>80) roundXP+=15;
    const previous=await getUserGameProgress(userId,GAME_KEY); if(correct>(previous?.best_score??0)) roundXP+=20;
    const updatedXP=(previous?.xp??totalXP)+roundXP; setXpEarned(roundXP); setTotalXP(updatedXP);
    try { await saveUserGameProgress(userId,GAME_KEY,{ grade_level:grade.toLowerCase() as any, xp:updatedXP, level:calculateLevelFromXP(updatedXP), best_score:Math.max(previous?.best_score??0,correct), total_sessions:(previous?.total_sessions??0)+1, total_correct:(previous?.total_correct??0)+correct, total_attempts:(previous?.total_attempts??0)+attempts, accuracy, current_difficulty:task.difficulty, settings:{ precision_score:precision, mastered_task_types:[task.task_type] } }); } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn); setStatus('ended');
  };

  return <main className="min-h-screen bg-gradient-to-b from-pink-100 via-indigo-100 to-cyan-100 px-4 py-6"><div className="mx-auto max-w-6xl space-y-4"><GameTopBar title="Precision Painter Studio" grade={grade} xpEarned={xpEarned} accuracyLabel={`Precision: ${precision}%`} streak={streak} />{status==='ready'&&<GradeSelector selectedGrade={grade} onChange={(g)=>setGrade(g as PainterGrade)} />}<section className="rounded-2xl bg-white/95 p-4 text-slate-900"><p className="text-sm font-semibold text-pink-700">{task.instruction}</p><p className="text-sm text-slate-700">Trace, color, and move smoothly. Completion: {completion}%</p></section><section className="rounded-2xl bg-white/90 p-3"><div ref={areaRef} onPointerMove={draw} className="relative h-[420px] rounded-xl bg-gradient-to-b from-white to-pink-50"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M 5 50 C 25 20, 45 80, 65 50 S 90 30, 95 55" stroke="#a855f7" strokeWidth={assist?10:7} fill="none" strokeLinecap="round" opacity="0.5"/></svg></div></section><div className="flex flex-wrap gap-2"><button onClick={()=>setBrushSize('small')} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">Small Brush</button><button onClick={()=>setBrushSize('medium')} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">Medium Brush</button><button onClick={()=>setBrushSize('large')} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">Large Brush</button><button onClick={()=>setAssist(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{assist?'Normal Path':'Wider Path Assist'}</button><button onClick={evaluate} className="min-h-11 rounded-xl bg-pink-600 px-4 py-2 font-semibold text-white">Check Progress</button></div><GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn(v=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion(v=>!v)} />{status==='ended'&&<RoundSummary xpEarned={xpEarned} precision={precision} completion={completion} accuracy={accuracy} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}</div></main>;
}
