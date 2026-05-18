type Props = {
  largeTargets: boolean;
  simplifiedMode: boolean;
  onToggleLargeTargets: () => void;
  onToggleSimplified: () => void;
  onHint: () => void;
  onRestartPuzzle: () => void;
};

export function AssistControls({ largeTargets, simplifiedMode, onToggleLargeTargets, onToggleSimplified, onHint, onRestartPuzzle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={onHint} className="min-h-11 rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white">Hint</button>
      <button onClick={onRestartPuzzle} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">Restart Puzzle</button>
      <button onClick={onToggleLargeTargets} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{largeTargets ? 'Normal Slots' : 'Larger Slots'}</button>
      <button onClick={onToggleSimplified} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{simplifiedMode ? 'Full Layout' : 'Simplified Mode'}</button>
    </div>
  );
}
