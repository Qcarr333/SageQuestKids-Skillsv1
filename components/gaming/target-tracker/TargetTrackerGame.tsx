'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { awardXP, calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { CollectibleObject } from './CollectibleObject';
import { GameInstructionPanel } from './GameInstructionPanel';
import { getTrackerTask } from './GradeDifficultyTasks';
import { MovingTargetCharacter } from './MovingTargetCharacter';
import { RoundSummary } from './RoundSummary';
import { TrackingZone } from './TrackingZone';
import { SpawnedObject, TrackerGradeOption } from './types';

const GAME_KEY = 'target_tracker';
const ROUND_SECONDS = 60;

export function TargetTrackerGame() {
  const [grade, setGrade] = useState<TrackerGradeOption>('3rd');
  const [status, setStatus] = useState<'ready'|'running'|'paused'|'ended'>('ready');
  const [task, setTask] = useState(() => getTrackerTask('3rd'));
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [targetPos, setTargetPos] = useState({ x: 20, y: 40 });
  const [objects, setObjects] = useState<SpawnedObject[]>([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [trackingFrames, setTrackingFrames] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [showZone, setShowZone] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [syncWarning, setSyncWarning] = useState('');
  const areaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const userId = 'local-user'; // TODO connect to authenticated user profile

  useEffect(() => { (async () => { const p = await getUserGameProgress(userId, GAME_KEY); if (p) setTotalXP(p.xp); })(); }, []);

  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const trackingSeconds = trackingFrames / 60;

  const startRound = () => {
    setTask(getTrackerTask(grade)); setStatus('running'); setTimeLeft(ROUND_SECONDS); setObjects([]); setTrackingFrames(0); setAttempts(0); setCorrect(0); setMissed(0); setStreak(0); setBestStreak(0); setXpEarned(0); setSyncWarning('');
  };

  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => setTimeLeft((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => { if (timeLeft === 0 && status === 'running') void endRound(); }, [timeLeft, status]);

  useEffect(() => {
    if (status !== 'running') return;
    const start = performance.now();
    const animate = (now: number) => {
      const t = (now - start) / 1000;
      const speed = reducedMotion ? task.target_speed * 0.7 : task.target_speed;
      let x = 50, y = 50;
      if (task.path === 'horizontal_wave') { x = 50 + Math.sin(t * speed * 0.8) * 35; y = 45 + Math.sin(t * speed * 0.4) * 12; }
      if (task.path === 'diagonal') { x = 20 + ((t * speed * 10) % 60); y = 20 + ((t * speed * 6) % 55); }
      if (task.path === 'circular') { x = 50 + Math.cos(t * speed * 0.8) * 28; y = 48 + Math.sin(t * speed * 0.8) * 20; }
      if (task.path === 'figure_eight') { x = 50 + Math.sin(t * speed) * 30; y = 48 + Math.sin(t * speed * 2) * 16; }
      setTargetPos({ x, y });

      const dx = cursor.x - x;
      const dy = cursor.y - y;
      const distPx = Math.sqrt(dx * dx + dy * dy) * 10; // approximate scale for percent-based plane
      if (distPx <= task.tracking_zone_radius) setTrackingFrames((f) => f + 1);

      setObjects((prev) => prev.filter((o) => now - o.bornAt < o.lifetime));
      if (Math.random() < 0.03) {
        const pool = [...task.correct_targets, ...task.distractors];
        const candidate = pool[Math.floor(Math.random() * pool.length)];
        setObjects((prev) => [...prev, { ...candidate, x: x + (Math.random() * 18 - 9), y: y + (Math.random() * 18 - 9), bornAt: now, lifetime: task.object_lifetime, size: task.object_size }]);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [cursor.x, cursor.y, reducedMotion, status, task]);

  const handleClickObject = async (id: string) => {
    const obj = objects.find((o) => o.id === id);
    if (!obj) return;
    setAttempts((a) => a + 1);
    setObjects((prev) => prev.filter((o) => o !== obj));
    if (obj.isCorrect) {
      const nextStreak = streak + 1;
      setCorrect((c) => c + 1);
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      let delta = 3;
      if (nextStreak % 5 === 0) delta += 10;
      setXpEarned((x) => x + delta);
      if (soundOn) { /* TODO: sound hooks soft chime/pop/nature tone */ }
      await awardXP(userId, GAME_KEY, delta, 'round_complete');
    } else {
      setMissed((m) => m + 1);
      setStreak(0);
    }
  };

  const endRound = async () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let bonuses = 15;
    if (accuracy > 80) bonuses += 15;
    bonuses += Math.floor(trackingSeconds / 10) * 5;
    const previous = await getUserGameProgress(userId, GAME_KEY);
    if (correct > (previous?.best_score ?? 0)) bonuses += 20;
    const roundXP = xpEarned + bonuses;
    const updatedXP = (previous?.xp ?? totalXP) + roundXP;
    setXpEarned(roundXP); setTotalXP(updatedXP);
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
        settings: { tracking_accuracy: Math.round((trackingSeconds / ROUND_SECONDS) * 100), best_streak: Math.max(bestStreak, Number(previous?.settings?.best_streak ?? 0)), mastered_task_types: [task.task_type] },
      });
    } catch { setSyncWarning('Progress will sync when available'); }
    setStatus('ended');
  };

  const collected = correct + missed;
  const characterSize = useMemo(() => Math.max(52, task.object_size), [task.object_size]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-2xl bg-slate-900/85 p-4 ring-1 ring-emerald-300/20"><div className="flex flex-wrap items-center gap-3"><Link href="/gaming" className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">Back to Gaming</Link><h1 className="text-2xl font-black">Target Tracker Adventure</h1><span className="rounded bg-emerald-600/80 px-3 py-1">Grade: {grade}</span><span>Round XP: {xpEarned}</span><span>Accuracy: {accuracy}%</span><span>Streak: {streak}</span><span>Time: {timeLeft}s</span></div></header>
        {status === 'ready' && <GradeSelector selectedGrade={grade} onChange={(g) => setGrade(g as TrackerGradeOption)} />}
        <GameInstructionPanel instruction={task.instruction} character={task.character} />
        <section className="rounded-2xl bg-slate-900/70 p-3 ring-1 ring-sky-300/20">
          <div ref={areaRef} onPointerMove={(e) => { const rect = areaRef.current?.getBoundingClientRect(); if (!rect) return; setCursor({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }); }} className="relative h-[420px] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_30%_25%,rgba(16,185,129,.28),transparent_45%),radial-gradient(circle_at_75%_35%,rgba(56,189,248,.22),transparent_45%),#0f172a]">
            <TrackingZone x={targetPos.x} y={targetPos.y} radius={task.tracking_zone_radius} visible={showZone} />
            <MovingTargetCharacter x={targetPos.x} y={targetPos.y} label={task.character} size={characterSize} />
            {objects.map((obj) => <CollectibleObject key={`${obj.id}-${obj.bornAt}`} obj={obj} onClick={handleClickObject} />)}
          </div>
        </section>
        <div className="flex flex-wrap gap-2">{status !== 'running' ? <button onClick={startRound} className="min-h-11 rounded-xl bg-emerald-600 px-4 py-2 font-semibold">Start</button> : <><button onClick={() => setStatus('paused')} className="min-h-11 rounded-xl bg-amber-500 px-4 py-2 font-semibold">Pause</button><button onClick={() => setStatus('running')} className="min-h-11 rounded-xl bg-sky-600 px-4 py-2 font-semibold">Resume</button><button onClick={() => void endRound()} className="min-h-11 rounded-xl bg-rose-600 px-4 py-2 font-semibold">End Round</button></>}<button onClick={() => setSoundOn((v) => !v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{soundOn ? 'Mute Sounds' : 'Unmute Sounds'}</button><button onClick={() => setReducedMotion((v) => !v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{reducedMotion ? 'Enable Motion' : 'Reduce Motion'}</button><button onClick={() => setShowZone((v) => !v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{showZone ? 'Hide Tracking Zone' : 'Show Tracking Zone'}</button></div>
        {status === 'ended' && <RoundSummary xpEarned={xpEarned} collected={collected} correct={correct} missed={missed} accuracy={accuracy} bestStreak={bestStreak} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={() => setStatus('ready')} />}
      </div>
    </main>
  );
}
