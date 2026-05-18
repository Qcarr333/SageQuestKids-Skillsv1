type Props = {
  slot: string;
  value?: string;
  glow: boolean;
  large: boolean;
  onDropValue: (slot: string, componentId: string) => void;
};

export function TargetSlot({ slot, value, glow, large, onDropValue }: Props) {
  return (
    <button
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropValue(slot, e.dataTransfer.getData('text/plain'))}
      onClick={() => onDropValue(slot, '__selected__')}
      className={`rounded-2xl border-2 border-dashed px-3 py-3 text-center text-sm font-semibold transition ${
        large ? 'min-h-20' : 'min-h-14'
      } ${glow ? 'border-cyan-300 bg-cyan-900/30 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)]' : 'border-sky-700 bg-slate-900/70 text-sky-100'}`}
    >
      {value ?? `Drop in ${slot}`}
    </button>
  );
}
