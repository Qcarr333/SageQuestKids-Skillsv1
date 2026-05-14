type Props = { x: number; y: number; label: string; size: number };
export function MovingTargetCharacter({ x, y, label, size }: Props) {
  return <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/90 px-3 py-2 text-center font-bold text-white shadow-lg" style={{ left: `${x}%`, top: `${y}%`, minWidth: size, minHeight: size }}>{label}</div>;
}
