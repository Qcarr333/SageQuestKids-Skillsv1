import { CircuitComponent } from './types';

type Props = {
  item: CircuitComponent;
  isPlaced: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

export function DraggableComponent({ item, isPlaced, isSelected, onSelect }: Props) {
  return (
    <button
      draggable={!isPlaced}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
      onClick={() => !isPlaced && onSelect(item.id)}
      className={`min-h-12 rounded-xl border px-3 py-2 text-left font-semibold transition ${
        isPlaced ? 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500' : 'border-sky-300 bg-slate-800 text-white hover:bg-slate-700'
      } ${isSelected ? 'ring-2 ring-cyan-300' : ''}`}
    >
      {item.label}
    </button>
  );
}
