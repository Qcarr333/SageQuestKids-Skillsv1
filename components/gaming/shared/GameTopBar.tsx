import Link from 'next/link';

type Props = {
  title: string;
  grade: string;
  xpEarned: number;
  accuracyLabel: string;
  streak: number;
  timeRemaining?: number;
};

export function GameTopBar({ title, grade, xpEarned, accuracyLabel, streak, timeRemaining }: Props) {
  return (
    <header className="rounded-2xl bg-slate-900/90 p-4 ring-1 ring-sky-300/20">
      <div className="flex flex-wrap items-center gap-3 text-white">
        <Link href="/gaming" className="min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-semibold">Back to Gaming</Link>
        <h1 className="text-2xl font-black">{title}</h1>
        <span className="rounded bg-sky-600/80 px-3 py-1">Grade: {grade}</span>
        <span>Round XP: {xpEarned}</span>
        <span>{accuracyLabel}</span>
        <span>Streak: {streak}</span>
        {typeof timeRemaining === 'number' && <span>Time: {timeRemaining}s</span>}
      </div>
    </header>
  );
}
