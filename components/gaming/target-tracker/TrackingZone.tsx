type Props = { x: number; y: number; radius: number; visible: boolean };
export function TrackingZone({ x, y, radius, visible }: Props) {
  if (!visible) return null;
  return <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/50 bg-sky-300/10" style={{ left: `${x}%`, top: `${y}%`, width: radius * 2, height: radius * 2 }} />;
}
