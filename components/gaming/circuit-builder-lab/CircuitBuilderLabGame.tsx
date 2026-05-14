'use client';

import { useMemo, useState } from 'react';
import { GradeSelector } from '@/components/gaming/GradeSelector';
import { GameControlRow } from '@/components/gaming/shared/GameControlRow';
import { GameTopBar } from '@/components/gaming/shared/GameTopBar';
import { calculateLevelFromXP, getUserGameProgress, saveUserGameProgress } from '@/lib/gaming/progress';
import { playCompleteSound, playCorrectSound, playTryAgainSound } from '@/lib/gaming/soundEffects';
import { AssistControls } from './AssistControls';
import { CircuitWorkspace } from './CircuitWorkspace';
import { InstructionPanel } from './InstructionPanel';
import { LogicFlowVisualizer } from './LogicFlowVisualizer';
import { RoundSummary } from './RoundSummary';
import { getCircuitTask } from './tasks';
import { CircuitGrade } from './types';

const GAME_KEY = 'circuit_builder_lab';
const userId = 'local-user';

export function CircuitBuilderLabGame() {
  const [grade, setGrade] = useState<CircuitGrade>('2nd');
  const [status, setStatus] = useState<'ready' | 'running' | 'paused' | 'ended'>('ready');
  const [task, setTask] = useState(() => getCircuitTask('2nd'));
  const [placements, setPlacements] = useState<Record<string, string | undefined>>({});
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [logicChainsCompleted, setLogicChainsCompleted] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [syncWarning, setSyncWarning] = useState('');
  const [hintText, setHintText] = useState('Build from left to right to activate the lab.');
  const [highlightedSlots, setHighlightedSlots] = useState<string[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeTargets, setLargeTargets] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  const slots = useMemo(() => Array.from({ length: task.target_slots }, (_, i) => `slot${i + 1}`), [task.target_slots]);
  const completion = Math.round((Object.values(placements).filter(Boolean).length / task.target_slots) * 100) || 0;
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;

  const startRound = async () => {
    const nextTask = getCircuitTask(grade);
    setTask(nextTask);
    setPlacements({});
    setAttempts(0);
    setCorrect(0);
    setStreak(0);
    setBestStreak(0);
    setLogicChainsCompleted(0);
    setXpEarned(0);
    setSyncWarning('');
    setHintText('Build from left to right to activate the lab.');
    setHighlightedSlots([]);
    const p = await getUserGameProgress(userId, GAME_KEY);
    if (p) setTotalXP(p.xp);
    setStatus('running');
  };

  const tryPlace = (slot: string, droppedId: string) => {
    if (status !== 'running') return;
    const componentId = droppedId === '__selected__' ? selectedComponentId : droppedId;
    if (!componentId || placements[slot]) return;

    setAttempts((a) => a + 1);
    if (task.correct_connections[slot] === componentId) {
      setPlacements((p) => ({ ...p, [slot]: componentId }));
      setCorrect((c) => c + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      setXpEarned((x) => x + 3);
      playCorrectSound(soundOn);
      setSelectedComponentId(null);
    } else {
      setStreak(0);
      playTryAgainSound(soundOn);
      if (attempts >= 2) {
        setHintText('Try placing the next item in sequence from left to right.');
        setHighlightedSlots([slot]);
      }
    }
  };

  const endRound = async () => {
    const completed = slots.every((slot) => placements[slot]);
    let roundXP = xpEarned + (completed ? 15 : 0) + (accuracy >= 85 ? 15 : 0);
    if (completed && attempts <= task.target_slots) roundXP += 10;

    const previous = await getUserGameProgress(userId, GAME_KEY);
    if (correct > (previous?.best_score ?? 0)) roundXP += 20;

    const updatedXP = (previous?.xp ?? totalXP) + roundXP;
    setXpEarned(roundXP);
    setTotalXP(updatedXP);
    if (completed) setLogicChainsCompleted((v) => v + 1);

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
        current_difficulty: task.difficulty,
        settings: {
          mastered_task_types: [task.task_type],
          best_streak: Math.max(bestStreak, previous?.settings?.best_streak as number ?? 0),
          game_specific_stats: {
            circuits_completed: completed ? 1 : 0,
            logic_chains_completed: completed ? 1 : 0,
            drag_accuracy: accuracy,
            assist_mode_used: largeTargets || simplifiedMode,
            puzzle_completion_rate: completion,
          },
        },
      });
    } catch {
      setSyncWarning('Progress will sync when available');
    }

    playCompleteSound(soundOn);
    setStatus('ended');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-sky-900 px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <GameTopBar title="Circuit Builder Lab" grade={grade} xpEarned={xpEarned} accuracyLabel={`Completion: ${completion}%`} streak={streak} />
        {status === 'ready' && <GradeSelector selectedGrade={grade} onChange={(g) => setGrade(g as CircuitGrade)} />}
        <InstructionPanel instruction={task.instruction} hint={hintText} />
        <LogicFlowVisualizer completion={completion} reducedMotion={reducedMotion} />
        <CircuitWorkspace items={simplifiedMode ? task.draggable_components.filter((_, i) => i < task.target_slots) : task.draggable_components} slots={slots} placements={placements} selectedComponentId={selectedComponentId} largeTargets={largeTargets || grade === 'Kindergarten'} highlightedSlots={highlightedSlots} onSelectComponent={setSelectedComponentId} onDropValue={tryPlace} />
        <AssistControls onHint={() => setHintText(task.draggable_components[0]?.hint ?? 'Look for matching labels and order.')} onRestartPuzzle={() => setPlacements({})} largeTargets={largeTargets} simplifiedMode={simplifiedMode} onToggleLargeTargets={() => setLargeTargets((v) => !v)} onToggleSimplified={() => setSimplifiedMode((v) => !v)} />
        <GameControlRow status={status} onStart={() => void startRound()} onPause={() => setStatus('paused')} onResume={() => setStatus('running')} onEnd={() => void endRound()} soundOn={soundOn} onToggleSound={() => setSoundOn((v) => !v)} reducedMotion={reducedMotion} onToggleMotion={() => setReducedMotion((v) => !v)} />
        {status === 'ended' && <RoundSummary xpEarned={xpEarned} accuracy={accuracy} correctPlacements={correct} completion={completion} logicChainsCompleted={logicChainsCompleted} level={calculateLevelFromXP(totalXP)} syncWarning={syncWarning} onPlayAgain={() => setStatus('ready')} />}
      </div>
    </main>
  );
}
