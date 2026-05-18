type Props = { hint: string; onHint: () => void; hintUsed: boolean };

export function HintPanel({ hint, onHint, hintUsed }: Props) {
  return (
    <section className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-sky-300/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={onHint} className="min-h-11 rounded-xl bg-sky-600 px-4 py-2 font-semibold">{hintUsed ? 'Hint Used' : 'Show Hint'}</button>
        <button className="min-h-11 rounded-xl bg-purple-600 px-4 py-2 font-semibold" type="button">Read Aloud (Soon)</button>
      </div>
      {hintUsed && <p className="mt-2 text-sm text-sky-100">Hint: {hint}</p>}
      <p className="mt-2 text-xs text-slate-300">Try again support is always on: incorrect moves return gently to the item bank.</p>
    </section>
  );
}
