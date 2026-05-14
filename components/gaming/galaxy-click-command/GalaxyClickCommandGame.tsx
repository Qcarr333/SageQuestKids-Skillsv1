'use client';

import { useEffect, useMemo, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { getGalaxyTask } from './tasks';
import { GalaxyGrade, GalaxyTarget } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY='galaxy_click_command';

export function GalaxyClickCommandGame(){
  const [grade,setGrade]=useState<GalaxyGrade>('2nd');
  const [status,setStatus]=useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task,setTask]=useState(()=>getGalaxyTask('2nd'));
  const [targets,setTargets]=useState<GalaxyTarget[]>([]);
  const [attempts,setAttempts]=useState(0);
  const [correct,setCorrect]=useState(0);
  const [streak,setStreak]=useState(0);
  const [bestStreak,setBestStreak]=useState(0);
  const [xpEarned,setXpEarned]=useState(0);
  const [soundOn,setSoundOn]=useState(true);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [slowMode,setSlowMode]=useState(false);
  const [largeTargets,setLargeTargets]=useState(false);
  const [syncWarning,setSyncWarning]=useState('');
  const [totalXP,setTotalXP]=useState(0);
  const userId='local-user';

  useEffect(()=>{(async()=>{const p=await getUserGameProgress(userId,GAME_KEY); if(p) setTotalXP(p.xp);})();},[]);

  const accuracy=attempts?Math.round((correct/attempts)*100):0;
  const missionProgress=Math.min(100,Math.round((correct/Math.max(1,task.correct_targets.length))*100));

  const startRound=()=>{ setStatus('running'); const t=getGalaxyTask(grade); setTask(t); setTargets([...t.correct_targets,...t.distractor_targets]); setAttempts(0); setCorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setSyncWarning(''); };

  const clickTarget=(target:GalaxyTarget)=>{
    if(status!=='running') return;
    setAttempts((a)=>a+1);
    setTargets((prev)=>prev.filter((t)=>t.id!==target.id));
    if(target.correct){ const ns=streak+1; setCorrect((c)=>c+1); setStreak(ns); setBestStreak((b)=>Math.max(b,ns)); setXpEarned((x)=>x+3); playCorrectSound(soundOn); }
    else { setStreak(0); playTryAgainSound(soundOn); }
  };

  useEffect(()=>{ if(status==='running' && targets.filter(t=>t.correct).length===0) void endRound(); },[status,targets]);

  const endRound=async()=>{
    let roundXP=xpEarned+15; if(accuracy>80) roundXP+=15;
    const previous=await getUserGameProgress(userId,GAME_KEY); if(correct>(previous?.best_score??0)) roundXP+=20;
    const updatedXP=(previous?.xp??totalXP)+roundXP; setXpEarned(roundXP); setTotalXP(updatedXP);
    try { await saveUserGameProgress(userId,GAME_KEY,{ grade_level:grade.toLowerCase() as any, xp:updatedXP, level:calculateLevelFromXP(updatedXP), best_score:Math.max(previous?.best_score??0,correct), total_sessions:(previous?.total_sessions??0)+1, total_correct:(previous?.total_correct??0)+correct, total_attempts:(previous?.total_attempts??0)+attempts, accuracy, current_difficulty:task.difficulty, settings:{ mastered_task_types:[task.task_type], targets_clicked:correct, targets_missed:attempts-correct } }); } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn); setStatus('ended');
  };

  const targetSize=useMemo(()=>largeTargets?task.target_size+18:task.target_size,[largeTargets,task.target_size]);

  return <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-sky-900 px-4 py-6"><div className="mx-auto max-w-6xl space-y-4"><GameTopBar title="Galaxy Click Command" grade={grade} xpEarned={xpEarned} accuracyLabel={`Accuracy: ${accuracy}%`} streak={streak} />{status==='ready'&&<GradeSelector selectedGrade={grade} onChange={(g)=>setGrade(g as GalaxyGrade)} />}<section className="rounded-2xl bg-white/95 p-4 text-slate-900"><p className="text-sm font-semibold text-indigo-700">{task.instruction}</p><p className="text-sm text-slate-700">Mission progress: {missionProgress}%</p></section><section className="rounded-2xl bg-slate-900/70 p-3 ring-1 ring-sky-300/30"><div className="relative h-[420px] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,.2),transparent_45%),#020617]">{targets.map((t,idx)=><button key={t.id} onClick={()=>clickTarget(t)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 font-semibold ${t.correct?'bg-cyan-300':'bg-purple-200'}`} style={{left:`${15+(idx*14)%78}%`,top:`${25+((idx*19)%60)}%`, minWidth:targetSize, minHeight:targetSize}}>{t.label}</button>)}</div></section><GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn(v=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion(v=>!v)}><button onClick={()=>setSlowMode(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{slowMode?'Normal Speed':'Slower Mode'}</button><button onClick={()=>setLargeTargets(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{largeTargets?'Normal Targets':'Larger Targets'}</button></GameControlRow>{status==='ended'&&<RoundSummary xpEarned={xpEarned} accuracy={accuracy} targetsCompleted={correct} bestStreak={bestStreak} missionProgress={missionProgress} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}</div></main>;
}
