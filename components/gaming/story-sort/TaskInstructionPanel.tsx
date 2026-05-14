type Props = { instruction: string; completion: string };
export function TaskInstructionPanel({ instruction, completion }: Props) {
  return (
    <section className="rounded-2xl bg-white/95 p-4 text-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Task</p>
      <p className="mt-1 text-lg font-semibold">{instruction}</p>
      <p className="mt-2 text-sm text-slate-700">Completion: {completion}</p>
    </section>
  );
}
