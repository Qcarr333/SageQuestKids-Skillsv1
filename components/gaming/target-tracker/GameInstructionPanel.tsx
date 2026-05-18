type Props = { instruction: string; character: string };
export function GameInstructionPanel({ instruction, character }: Props) {
  return <section className="rounded-2xl bg-white/95 p-4 text-slate-900"><p className="text-xs font-bold uppercase text-sky-700">Instruction</p><p className="mt-1 text-lg font-semibold">{instruction}</p><p className="mt-2 text-sm text-slate-700">Guide character: {character}</p></section>;
}
