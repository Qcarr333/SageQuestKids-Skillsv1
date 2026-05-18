import { calculateLevelFromXP } from '@/lib/gaming/progress';

type XPProgressProps = {
  xp: number;
  level?: number;
  label?: string;
};

export function XPProgress({ xp, level, label = 'Skill Growth' }: XPProgressProps) {
  const resolvedLevel = level ?? calculateLevelFromXP(xp);
  const progressToNext = Math.min(100, Math.round((xp / ((resolvedLevel + 1) * 100)) * 100));

  return (
    <section className="rounded-2xl bg-white/95 p-5 shadow-lg ring-1 ring-sky-100" aria-label="XP summary">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-bold text-slate-900">Level {resolvedLevel}</p>
          <p className="text-sm text-slate-600">{xp} XP earned through practice</p>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">Ready to play</span>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={progressToNext} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-r from-teal-400 via-sky-400 to-purple-500" style={{ width: `${progressToNext}%` }} />
      </div>
    </section>
  );
}
