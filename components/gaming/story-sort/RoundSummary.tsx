import Link from 'next/link';

type Props = { xpEarned: number; correct: number; attempts: number; accuracy: number; bestStreak: number; level: number; syncWarning?: string; onPlayAgain: () => void };
export function RoundSummary({ xpEarned, correct, attempts, accuracy, bestStreak, level, syncWarning, onPlayAgain }: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 text-slate-900 shadow">
      <h2 className="text-2xl font-black">Round Summary</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p><b>XP earned:</b> {xpEarned}</p><p><b>Correct placements:</b> {correct}</p><p><b>Attempts:</b> {attempts}</p><p><b>Accuracy:</b> {accuracy}%</p><p><b>Best streak:</b> {bestStreak}</p><p><b>Level progress:</b> Level {level}</p>
      </div>
      {syncWarning && <p className="mt-2 text-sm text-amber-700">{syncWarning}</p>}
      <div className="mt-4 flex gap-3">
        <button onClick={onPlayAgain} className="min-h-11 rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white">Play again</button>
        <Link href="/gaming" className="min-h-11 rounded-xl bg-slate-200 px-4 py-2 font-semibold">Return to Gaming</Link>
      </div>
    </section>
  );
}
