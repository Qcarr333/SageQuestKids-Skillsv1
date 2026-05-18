import { HOME_ROW_KEYS } from './config';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

type Props = {
  targetKey?: string;
  visible: boolean;
};

export function VisualKeyboard({ targetKey, visible }: Props) {
  if (!visible) return null;
  const normalizedTarget = targetKey?.toUpperCase();

  return (
    <section className="rounded-2xl bg-slate-900/85 p-4 ring-1 ring-sky-300/30" aria-label="On-screen keyboard">
      <p className="mb-3 text-sm font-semibold text-sky-100">Keyboard Guide</p>
      <div className="space-y-2">
        {ROWS.map((row) => (
          <div key={row.join('')} className="flex flex-wrap justify-center gap-2">
            {row.map((key) => {
              const isHome = HOME_ROW_KEYS.includes(key);
              const isTarget = normalizedTarget === key;
              return (
                <div
                  key={key}
                  className={`min-w-10 rounded-lg px-3 py-2 text-center text-sm font-bold ${
                    isTarget
                      ? 'bg-orange-400 text-slate-950 ring-2 ring-orange-200'
                      : isHome
                      ? 'bg-teal-500/80 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  {key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-200 sm:grid-cols-2">
        <p className="rounded bg-slate-800/80 px-2 py-1">Left hand home zone: A S D F</p>
        <p className="rounded bg-slate-800/80 px-2 py-1">Right hand home zone: J K L ;</p>
      </div>
    </section>
  );
}
