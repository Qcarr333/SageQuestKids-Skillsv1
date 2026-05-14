import { SpawnedObject } from './types';

type Props = { obj: SpawnedObject; onClick: (id: string) => void };
export function CollectibleObject({ obj, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(obj.id)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 font-bold ${obj.isCorrect ? 'bg-lime-300 text-slate-900' : 'bg-rose-300 text-slate-900'}`}
      style={{ left: `${obj.x}%`, top: `${obj.y}%`, minWidth: obj.size, minHeight: obj.size }}
    >
      {obj.label}
    </button>
  );
}
