import Link from 'next/link';

type Props = {
  xpEarned: number;
  accuracy: number;
  correct: number;
  missed: number;
  bestStreak: number;
  level: number;
  syncWarning?: string;
  onPlayAgain: () => void;
};

export function RoundSummary({ xpEarned, accuracy, correct, missed, bestStreak, level, syncWarning, onPlayAgain }: Props) {
  return (
    <section className="rounded-2xl bg-white/95 p-6 text-slate-900 shadow-xl">
      <h2 className="text-2xl font-black">Round Complete 🚀</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p><span className="font-semibold">XP earned:</span> {xpEarned}</p>
        <p><span className="font-semibold">Accuracy:</span> {accuracy}%</p>
        <p><span className="font-semibold">Correct answers:</span> {correct}</p>
        <p><span className="font-semibold">Missed answers:</span> {missed}</p>
        <p><span className="font-semibold">Best streak:</span> {bestStreak}</p>
        <p><span className="font-semibold">Level progress:</span> Level {level}</p>
      </div>
      {syncWarning && <p className="mt-3 text-sm text-amber-700">{syncWarning}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={onPlayAgain} className="min-h-11 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Play Again</button>
        <Link href="/gaming" className="min-h-11 rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-900">Return to Gaming</Link>
      </div>
    </section>
  );
}
