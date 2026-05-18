type Props = {
  status: 'ready'|'running'|'paused'|'ended';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
  children?: React.ReactNode;
};

export function GameControlRow({ status, onStart, onPause, onResume, onEnd, soundOn, onToggleSound, reducedMotion, onToggleMotion, children }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {status !== 'running' && status !== 'paused' ? <button onClick={onStart} className="min-h-11 rounded-xl bg-teal-600 px-4 py-2 font-semibold text-white">Start</button> : null}
      {status === 'running' && <button onClick={onPause} className="min-h-11 rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white">Pause</button>}
      {status === 'paused' && <button onClick={onResume} className="min-h-11 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Resume</button>}
      {(status === 'running' || status === 'paused') && <button onClick={onEnd} className="min-h-11 rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white">End Round</button>}
      <button onClick={onToggleSound} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{soundOn ? 'Mute Sounds' : 'Unmute Sounds'}</button>
      <button onClick={onToggleMotion} className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold text-white">{reducedMotion ? 'Enable Motion' : 'Reduce Motion'}</button>
      {children}
    </div>
  );
}
