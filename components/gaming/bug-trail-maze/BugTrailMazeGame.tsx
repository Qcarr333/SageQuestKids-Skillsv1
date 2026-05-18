'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { getTrailTask } from './tasks';
import { BugGrade, TrailItem } from './types';
import { RoundSummary } from './RoundSummary';

const GAME_KEY = 'bug_trail_maze';

export function BugTrailMazeGame() {
  const [grade, setGrade] = useState<BugGrade>('2nd');
  const [status, setStatus] = useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task, setTask] = useState(() => getTrailTask('2nd'));
  const [bug, setBug] = useState({x:10,y:50});
  const [items, setItems] = useState<TrailItem[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [insideFrames, setInsideFrames] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [wideAssist, setWideAssist] = useState(false);
  const [syncWarning, setSyncWarning] = useState('');
  const [totalXP, setTotalXP] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const userId='local-user'; // TODO use existing auth profile id

  useEffect(()=>{ (async()=>{const p=await getUserGameProgress(userId,GAME_KEY); if(p) setTotalXP(p.xp);})(); },[]);
  const pathWidth = wideAssist ? task.path_width + 30 : task.path_width;
  const pathAccuracy = totalFrames ? Math.round((insideFrames/totalFrames)*100) : 0;

  const resetRound = () => { setTask(getTrailTask(grade)); setItems([...task.correct_items, ...task.distractor_items]); setBug({x:10,y:50}); setAttempts(0); setCorrect(0); setIncorrect(0); setStreak(0); setBestStreak(0); setXpEarned(0); setInsideFrames(0); setTotalFrames(0); setSyncWarning(''); };
  const startRound = () => { setStatus('running'); resetRound(); };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (status !== 'running') return;
    const rect = areaRef.current?.getBoundingClientRect(); if (!rect) return;
    const x = ((e.clientX-rect.left)/rect.width)*100; const y=((e.clientY-rect.top)/rect.height)*100;
    setBug({x,y});
    setTotalFrames((f)=>f+1);
    const centerY = 50 + Math.sin((x/100)*Math.PI*2) * 18;
    if (Math.abs(y-centerY) <= pathWidth/10) setInsideFrames((f)=>f+1);
  };

  const collect = (item: TrailItem) => {
    if (status !== 'running') return;
    setAttempts((a)=>a+1);
    setItems((prev)=>prev.filter((i)=>i.id!==item.id));
    if (item.correct) {
      const add = task.required_order ? 5 : 3;
      const ns = streak + 1;
      setCorrect((c)=>c+1); setStreak(ns); setBestStreak((b)=>Math.max(b,ns)); setXpEarned((x)=>x+add); playCorrectSound(soundOn);
    } else {
      setIncorrect((i)=>i+1); setStreak(0); playTryAgainSound(soundOn);
    }
  };

  useEffect(()=>{ if(status==='running' && items.length===0) void endRound(); },[items,status]);

  const endRound = async () => {
    let roundXP = xpEarned + 15;
    if (pathAccuracy > 80) roundXP += 15;
    if (incorrect === 0) roundXP += 10;
    const previous = await getUserGameProgress(userId,GAME_KEY);
    if (correct > (previous?.best_score ?? 0)) roundXP += 20;
    const updatedXP = (previous?.xp ?? totalXP) + roundXP;
    setXpEarned(roundXP); setTotalXP(updatedXP);
    try {
      await saveUserGameProgress(userId,GAME_KEY,{ grade_level:grade.toLowerCase() as any, xp:updatedXP, level:calculateLevelFromXP(updatedXP), best_score:Math.max(previous?.best_score??0,correct), total_sessions:(previous?.total_sessions??0)+1, total_correct:(previous?.total_correct??0)+correct, total_attempts:(previous?.total_attempts??0)+attempts, accuracy:pathAccuracy, current_difficulty:task.difficulty, settings:{ path_accuracy:pathAccuracy, best_streak:Math.max(bestStreak, Number(previous?.settings?.best_streak ?? 0)), mastered_task_types:[task.task_type] } });
    } catch { setSyncWarning('Progress will sync when available'); }
    playCompleteSound(soundOn); setStatus('ended');
  };

  const itemSize = useMemo(()=>wideAssist ? task.item_size+12 : task.item_size,[task.item_size,wideAssist]);

  return <main className="min-h-screen bg-gradient-to-b from-green-200 via-emerald-100 to-sky-100 px-4 py-6"><div className="mx-auto max-w-6xl space-y-4"><GameTopBar title="Bug Trail Maze" grade={grade} xpEarned={xpEarned} accuracyLabel={`Path accuracy: ${pathAccuracy}%`} streak={streak} />{status==='ready'&&<GradeSelector selectedGrade={grade} onChange={(g)=>setGrade(g as BugGrade)} />}<section className="rounded-2xl bg-white/95 p-4 text-slate-900"><p className="text-sm font-semibold text-emerald-700">{task.instruction}</p><p className="text-sm text-slate-700">Hint: {incorrect >= 1 ? task.hint : 'Guide the bug smoothly and stay on the trail.'}</p></section><section className="rounded-2xl bg-white/90 p-3"><div ref={areaRef} onPointerMove={onPointerMove} className="relative h-[420px] overflow-hidden rounded-xl bg-gradient-to-b from-lime-100 to-emerald-200"><svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M 5 50 C 25 15, 45 85, 65 50 S 90 20, 95 55" stroke="#8b5a2b" strokeWidth={pathWidth/8} fill="none" strokeLinecap="round" opacity="0.7"/></svg><div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 px-3 py-2 text-sm font-bold text-white" style={{left:`${bug.x}%`,top:`${bug.y}%`}}>🐞</div>{items.map((item, idx)=><button key={item.id} onClick={()=>collect(item)} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 font-semibold ${item.correct?'bg-lime-300':'bg-orange-200'}`} style={{left:`${20+idx*18}%`,top:`${30+(idx%2)*30}%`, minWidth:itemSize, minHeight:itemSize}}>{item.label}</button>)}</div></section><GameControlRow status={status} onStart={startRound} onPause={()=>setStatus('paused')} onResume={()=>setStatus('running')} onEnd={()=>void endRound()} soundOn={soundOn} onToggleSound={()=>setSoundOn(v=>!v)} reducedMotion={reducedMotion} onToggleMotion={()=>setReducedMotion(v=>!v)}><button onClick={()=>setWideAssist(v=>!v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{wideAssist ? 'Normal Path Width' : 'Wider Path Assist'}</button><button onClick={resetRound} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">Restart Maze</button></GameControlRow>{status==='ended'&&<RoundSummary xpEarned={xpEarned} pathAccuracy={pathAccuracy} itemsCollected={correct+incorrect} correctItems={correct} missedItems={incorrect} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={()=>setStatus('ready')} />}</div></main>;
}
