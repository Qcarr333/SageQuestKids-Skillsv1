'use client';

import { FINGER_BY_KEY, HOME_ROW, KEYBOARD_ROWS } from './keymap';
import { useKeyboardCoach } from './useKeyboardCoach';

function FingerGuideLayer({ activeKey }: { activeKey?: string }) {
  const finger = activeKey ? FINGER_BY_KEY[activeKey] : null;
  if (!finger) return <p className="text-xs text-sky-100">Finger guide: Home row ready.</p>;
  return <p className="text-xs text-sky-100">Finger guide: <span className="font-bold">{finger.replace('_', ' ')}</span> presses <span className="font-bold">{activeKey}</span>.</p>;
}

function KeyboardCoachSettingsPanel() {
  const { settings, updateSettings } = useKeyboardCoach();
  return <div className="mt-2 flex flex-wrap gap-2 text-xs"><button onClick={() => updateSettings({ keyboard_coach_mode: settings.keyboard_coach_mode === 'compact' ? 'full' : 'compact' })} className="rounded bg-slate-700 px-2 py-1">{settings.keyboard_coach_mode === 'compact' ? 'Full' : 'Compact'}</button><button onClick={() => updateSettings({ keyboard_coach_position: settings.keyboard_coach_position === 'bottom-right' ? 'bottom-center' : 'bottom-right' })} className="rounded bg-slate-700 px-2 py-1">Move</button><button onClick={() => updateSettings({ keyboard_coach_show_hands: !settings.keyboard_coach_show_hands })} className="rounded bg-slate-700 px-2 py-1">Hands</button><button onClick={() => updateSettings({ keyboard_coach_show_home_row: !settings.keyboard_coach_show_home_row })} className="rounded bg-slate-700 px-2 py-1">Home Row</button><button onClick={() => updateSettings({ keyboard_coach_reduced_motion: !settings.keyboard_coach_reduced_motion })} className="rounded bg-slate-700 px-2 py-1">Motion</button></div>;
}

export function KeyboardCoachOverlay() {
  const { settings, targets, activeIndex, visible, updateSettings } = useKeyboardCoach();
  if (!visible) return null;
  const activeKey = targets[activeIndex]?.key?.toUpperCase() === ' ' ? 'SPACE' : targets[activeIndex]?.key?.toUpperCase();
  const nextKey = targets[activeIndex + 1]?.key?.toUpperCase();
  const pos = settings.keyboard_coach_position === 'bottom-center' ? 'left-1/2 -translate-x-1/2' : 'right-4';

  return <aside className={`fixed bottom-4 z-50 ${pos} w-[min(92vw,760px)] rounded-2xl bg-slate-900/95 p-3 text-white shadow-2xl ring-1 ring-cyan-300/30`} style={{ opacity: settings.keyboard_coach_opacity }}><div className="flex items-center justify-between"><h3 className="text-sm font-bold">Keyboard Coach</h3><button onClick={() => updateSettings({ keyboard_coach_enabled: false })} className="rounded bg-slate-700 px-2 py-1 text-xs">Hide</button></div><p className="mb-2 text-xs text-cyan-100">Target: <b>{activeKey ?? '—'}</b> {nextKey ? <span className="text-sky-300">Next: {nextKey}</span> : null}</p><div className="space-y-1">{KEYBOARD_ROWS.map((row) => <div key={row.join('-')} className="flex flex-wrap gap-1">{row.map((k) => { const isHome = HOME_ROW.includes(k); const isActive = k === activeKey; const isNext = k === nextKey; return <div key={k} className={`rounded-lg px-2 py-1 text-xs font-semibold ${isActive ? 'bg-cyan-400 text-slate-900' : isNext ? 'bg-indigo-500 text-white' : isHome && settings.keyboard_coach_show_home_row ? 'bg-amber-400/80 text-slate-900' : 'bg-slate-700'} ${settings.keyboard_coach_reduced_motion ? '' : isActive ? 'animate-pulse' : ''}`}>{k}</div>; })}</div>)}</div>{settings.keyboard_coach_show_hands && settings.keyboard_coach_mode === 'full' && <FingerGuideLayer activeKey={activeKey} />}<KeyboardCoachSettingsPanel /></aside>;
}
