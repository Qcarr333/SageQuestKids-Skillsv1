'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getUserSettings, saveUserSettings } from '@/lib/gaming/services/userSettingsService';
import { DEFAULT_SETTINGS, KeyboardCoachSettings, KeyboardTarget } from './types';

type ContextType = {
  settings: KeyboardCoachSettings;
  targets: KeyboardTarget[];
  activeIndex: number;
  visible: boolean;
  setTargets: (targets: KeyboardTarget[]) => void;
  setWord: (word: string) => void;
  advanceTarget: () => void;
  resetSequence: () => void;
  setPaused: (paused: boolean) => void;
  updateSettings: (patch: Partial<KeyboardCoachSettings>) => void;
};

const KeyboardCoachContext = createContext<ContextType | null>(null);

export function KeyboardCoachProvider({ children, userId = 'local-user' }: { children: React.ReactNode; userId?: string }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [targets, setTargetsState] = useState<KeyboardTarget[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { (async()=> { const db = await getUserSettings(userId); if (db?.keyboard_coach_settings) setSettings({ ...DEFAULT_SETTINGS, ...(db.keyboard_coach_settings as object) } as KeyboardCoachSettings); })(); }, [userId]);

  const updateSettings = (patch: Partial<KeyboardCoachSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void saveUserSettings(userId, { keyboard_coach_settings: next });
      return next;
    });
  };

  const setTargets = (next: KeyboardTarget[]) => { setTargetsState(next); setActiveIndex(0); };
  const setWord = (word: string) => setTargets(word.split('').map((char) => ({ key: char.toUpperCase() })));
  const advanceTarget = () => setActiveIndex((i) => Math.min(i + 1, Math.max(0, targets.length - 1)));
  const resetSequence = () => setActiveIndex(0);

  const value = useMemo(() => ({ settings, targets, activeIndex, visible: settings.keyboard_coach_enabled && settings.keyboard_coach_mode !== 'hidden' && !paused, setTargets, setWord, advanceTarget, resetSequence, setPaused, updateSettings }), [settings, targets, activeIndex, paused]);

  return <KeyboardCoachContext.Provider value={value}>{children}</KeyboardCoachContext.Provider>;
}

export function useKeyboardCoach() {
  const ctx = useContext(KeyboardCoachContext);
  if (!ctx) throw new Error('useKeyboardCoach must be used within KeyboardCoachProvider');
  return ctx;
}
