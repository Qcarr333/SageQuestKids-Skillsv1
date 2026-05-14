type Props = { instruction: string; hint: string };

export function InstructionPanel({ instruction, hint }: Props) {
  return (
    <section className="rounded-2xl bg-white/95 p-4 text-slate-900">
      <p className="text-sm font-semibold text-indigo-700">{instruction}</p>
      <p className="mt-1 text-sm text-slate-700">Hint: {hint}</p>
    </section>
  );
}
