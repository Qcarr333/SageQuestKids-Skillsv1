import { DraggableTaskItem } from './types';

type Props = {
  item: DraggableTaskItem;
  selected: boolean;
  placed: boolean;
  onSelect: (id: string) => void;
};

export function DraggableItem({ item, selected, placed, onSelect }: Props) {
  return (
    <button
      type="button"
      draggable={!placed}
      onClick={() => onSelect(item.id)}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
      className={`min-h-12 rounded-xl px-4 py-3 text-left font-semibold transition ${placed ? 'bg-slate-300 text-slate-600' : 'bg-white text-slate-900'} ${selected ? 'ring-2 ring-sky-500' : 'ring-1 ring-slate-200'} ${placed ? '' : 'hover:-translate-y-0.5'}`}
      disabled={placed}
    >
      {item.label}
    </button>
  );
}
