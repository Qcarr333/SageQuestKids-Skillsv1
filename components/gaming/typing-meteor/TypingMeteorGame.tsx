'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { awardXP, calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { GRADE_PROMPTS, GRADE_SETTINGS, ROUND_DURATION_SECONDS } from './config';
import { ActiveMeteor, GradeOption, MeteorPrompt } from './types';
import { Meteor } from './Meteor';
import { VisualKeyboard } from './VisualKeyboard';
import { HandPlacementGuide } from './HandPlacementGuide';
import { RoundSummary } from './RoundSummary';
import { KeyboardCoachDock } from '@/components/gaming/keyboard-coach/KeyboardCoachDock';

const GAME_KEY = 'typing_meteor_defense';

export function TypingMeteorGame() {
  const [grade, setGrade] = useState<GradeOption>('3rd');
  const [status, setStatus] = useState<'ready' | 'running' | 'paused' | 'ended'>('ready');
  const [meteors, setMeteors] = useState<ActiveMeteor[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SECONDS);
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [mute, setMute] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [syncWarning, setSyncWarning] = useState('');

  const userId = 'local-user'; // TODO: read from existing authenticated profile/session.
  const rafRef = useRef<number | null>(null);
  const spawnRef = useRef<number>(0);

  const settings = GRADE_SETTINGS[grade];
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const target = meteors[0];

  useEffect(() => {
    setShowKeyboard(settings.keyboardDefault);
  }, [settings.keyboardDefault]);

  useEffect(() => {
    (async () => {
      const progress = await getUserGameProgress(userId, GAME_KEY);
      if (progress) {
        setTotalXP(progress.xp);
      }
    })();
  }, []);

  const nextPrompt = useCallback((): MeteorPrompt => {
    const pool = GRADE_PROMPTS[grade];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [grade]);

  const spawnMeteor = useCallback(() => {
    setMeteors((prev) => {
      if (prev.length >= settings.maxMeteors) return prev;
      const prompt = nextPrompt();
      return [...prev, { ...prompt, x: 18 + Math.random() * 64, y: 2, speed: settings.baseSpeed + Math.random() * 8, bornAt: Date.now(), id: `${prompt.id}-${Date.now()}` }];
    });
  }, [nextPrompt, settings.baseSpeed, settings.maxMeteors]);

  useEffect(() => {
    if (status !== 'running') return;
    const tick = () => {
      setMeteors((prev) => prev.map((m) => ({ ...m, y: m.y + m.speed * 0.02 })).filter((m) => m.y < 92));
      const now = Date.now();
      if (now - spawnRef.current > settings.spawnMs) {
        spawnRef.current = now;
        spawnMeteor();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [settings.spawnMs, spawnMeteor, status]);

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setInterval(() => setTimeLeft((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (timeLeft === 0 && status === 'running') endRound();
  }, [timeLeft, status]);

  const startRound = () => {
    setStatus('running');
    setMeteors([]);
    setTimeLeft(ROUND_DURATION_SECONDS);
    setInput('');
    setCorrect(0);
    setAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setXpEarned(0);
    setSyncWarning('');
    spawnRef.current = 0;
  };

  const handleMatch = async (meteor: ActiveMeteor) => {
    const earned = meteor.kind === 'letter' ? 2 : 5;
    const nextStreak = streak + 1;
    const streakBonus = nextStreak % 5 === 0 ? 10 : 0;
    setCorrect((c) => c + 1);
    setAttempts((a) => a + 1);
    setStreak(nextStreak);
    setBestStreak((b) => Math.max(b, nextStreak));
    setXpEarned((x) => x + earned + streakBonus);
    setMeteors((prev) => prev.filter((m) => m.id !== meteor.id));
    setInput('');

    if (!mute) {
      // TODO: sound hooks: soft chime + gentle whoosh
    }

    await awardXP(userId, GAME_KEY, earned + streakBonus, 'round_complete');
  };

  useEffect(() => {
    if (status !== 'running' || !target) return;
    const normalized = input.trim().toLowerCase();
    const expected = target.text.trim().toLowerCase();
    if (!normalized) return;

    if (expected.length === 1) {
      if (normalized.endsWith(expected)) handleMatch(target);
      else if (normalized.length >= 1) {
        setAttempts((a) => a + 1);
        setStreak(0);
        setInput('');
      }
      return;
    }

    if (normalized === expected) handleMatch(target);
  }, [handleMatch, input, status, target]);

  const endRound = async () => {
    setStatus('ended');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let finalXP = xpEarned + 15;
    if (accuracy > 80) finalXP += 20;

    const previous = await getUserGameProgress(userId, GAME_KEY);
    const previousBest = previous?.best_score ?? 0;
    const roundScore = correct;
    if (roundScore > previousBest) finalXP += 25;

    setXpEarned(finalXP);
    const updatedXP = (previous?.xp ?? totalXP) + finalXP;
    setTotalXP(updatedXP);

    try {
      await saveUserGameProgress(userId, GAME_KEY, {
        game_key: GAME_KEY,
        grade_level: grade.toLowerCase() as any,
        xp: updatedXP,
        level: calculateLevelFromXP(updatedXP),
        best_score: Math.max(previousBest, roundScore),
        total_sessions: (previous?.total_sessions ?? 0) + 1,
        total_correct: (previous?.total_correct ?? 0) + correct,
        total_attempts: (previous?.total_attempts ?? 0) + attempts,
        accuracy,
        current_difficulty: grade,
        settings: {
          best_streak: Math.max(previous?.settings?.best_streak as number ?? 0, bestStreak),
          mastered_keys: [],
          mastered_words: [],
        },
      });
    } catch {
      setSyncWarning('Progress will sync when available.');
    }
  };

  const targetKey = useMemo(() => (target?.text.length === 1 ? target.text : target?.text[0]), [target]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-2xl bg-slate-900/90 p-4 ring-1 ring-sky-300/20">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/gaming" className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">Back to Gaming</Link>
            <h1 className="text-2xl font-black">Typing Meteor Defense</h1>
            <span className="rounded bg-sky-600/80 px-3 py-1">Grade: {grade}</span>
            <span>Round XP: {xpEarned}</span><span>Streak: {streak}</span><span>Accuracy: {accuracy}%</span><span>Time: {timeLeft}s</span>
          </div>
        </header>

        {status === 'ready' && <GradeSelector selectedGrade={grade} onChange={(g) => setGrade(g as GradeOption)} />}

        <div className="rounded-2xl bg-slate-900/80 p-3 ring-1 ring-purple-300/20">
          <div className="relative h-[360px] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,.2),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,.2),transparent_50%),#020617]">
            {meteors.map((m) => <Meteor key={m.id} meteor={m} highlighted={m.id === target?.id} reducedMotion={reducedMotion} sizeClass={settings.meteorSize} />)}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-white/90 px-3 py-2 text-slate-900">Type: <span className="font-bold">{target?.text ?? 'Press Start to launch meteors'}</span></div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {status !== 'running' ? (
              <button onClick={startRound} className="min-h-11 rounded-xl bg-teal-600 px-4 py-2 font-semibold">Start</button>
            ) : (
              <>
                <button onClick={() => setStatus('paused')} className="min-h-11 rounded-xl bg-amber-500 px-4 py-2 font-semibold">Pause</button>
                <button onClick={() => setStatus('ended')} className="min-h-11 rounded-xl bg-rose-600 px-4 py-2 font-semibold">End Round</button>
              </>
            )}
            {status === 'paused' && <button onClick={() => setStatus('running')} className="min-h-11 rounded-xl bg-sky-600 px-4 py-2 font-semibold">Resume</button>}
            <button onClick={() => setMute((m) => !m)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{mute ? 'Unmute' : 'Mute'} Sounds</button>
            <button onClick={() => setReducedMotion((r) => !r)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{reducedMotion ? 'Enable Animations' : 'Hide Animations'}</button>
            <button onClick={() => setShowKeyboard((v) => !v)} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">{showKeyboard ? 'Hide Keyboard Guide' : 'Show Keyboard Guide'}</button>
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && target && input.trim().toLowerCase() === target.text.toLowerCase()) handleMatch(target); }}
            className="mt-3 w-full rounded-xl border-2 border-sky-500 bg-slate-950 px-4 py-3 text-lg text-white outline-none"
            placeholder="Type your answer here"
            aria-label="Type answer"
            disabled={status !== 'running'}
          />
        </div>

        <VisualKeyboard targetKey={targetKey} visible={showKeyboard} />
        <HandPlacementGuide targetKey={targetKey} />
        <KeyboardCoachDock targets={(target?.text ?? '').split('').map((k) => ({ key: k }))} paused={status === 'paused'} />

        {status === 'ended' && (
          <RoundSummary
            xpEarned={xpEarned}
            accuracy={accuracy}
            correct={correct}
            missed={Math.max(0, attempts - correct)}
            bestStreak={bestStreak}
            level={calculateLevelFromXP(totalXP)}
            syncWarning={syncWarning}
            onPlayAgain={() => setStatus('ready')}
          />
        )}
      </div>
    </main>
  );
}
