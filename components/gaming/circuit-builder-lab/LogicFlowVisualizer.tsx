type Props = { completion: number; reducedMotion: boolean };

export function LogicFlowVisualizer({ completion, reducedMotion }: Props) {
  return (
    <div className="rounded-2xl bg-slate-950/70 p-3 ring-1 ring-cyan-400/30">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">Energy Flow</div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 ${reducedMotion ? '' : 'transition-all duration-500'}`}
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  );
}
