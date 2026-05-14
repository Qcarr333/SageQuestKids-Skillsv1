import { FINGER_MAP } from './config';

type Props = { targetKey?: string };

export function HandPlacementGuide({ targetKey }: Props) {
  const normalized = targetKey?.toUpperCase();
  const finger = normalized ? FINGER_MAP[normalized] : undefined;

  return (
    <section className="rounded-xl bg-slate-900/80 p-4 text-sm text-sky-100 ring-1 ring-sky-300/30">
      <p className="font-semibold text-white">Hand Placement Guide</p>
      <p>Left hand rests on A S D F • Right hand rests on J K L ; • Thumbs near space bar.</p>
      {normalized && finger && <p className="mt-2 text-lime-300">Use your {finger} for {normalized}. Return to home row after each key.</p>}
      {/* TODO: refine finger mapping and route visualization for advanced keys. */}
    </section>
  );
}
