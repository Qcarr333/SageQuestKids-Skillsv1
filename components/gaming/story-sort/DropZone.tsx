type Props = {
  id: string;
  label: string;
  filledLabel?: string;
  large?: boolean;
  onDropItem: (zoneId: string, itemId: string) => void;
  onClickPlace: (zoneId: string) => void;
};

export function DropZone({ id, label, filledLabel, large, onDropItem, onClickPlace }: Props) {
  return (
    <button
      type="button"
      onClick={() => onClickPlace(id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const itemId = e.dataTransfer.getData('text/plain');
        onDropItem(id, itemId);
      }}
      className={`min-h-20 rounded-2xl border-2 border-dashed p-3 text-left transition ${large ? 'text-lg' : 'text-base'} ${filledLabel ? 'border-teal-400 bg-teal-100 text-slate-900' : 'border-sky-300 bg-slate-800/40 text-sky-100 hover:border-sky-200'}`}
    >
      <p className="text-sm font-bold uppercase tracking-wide">{label}</p>
      <p className="mt-1 font-semibold">{filledLabel ?? 'Drop item here'}</p>
    </button>
  );
}
