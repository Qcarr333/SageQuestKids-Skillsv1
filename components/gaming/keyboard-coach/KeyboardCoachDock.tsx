'use client';

import { useEffect } from 'react';
import { KeyboardTarget } from './types';
import { KeyboardCoachOverlay } from './KeyboardCoachOverlay';
import { KeyboardCoachProvider, useKeyboardCoach } from './useKeyboardCoach';

function Inner({ targets, paused }: { targets: KeyboardTarget[]; paused: boolean }) {
  const coach = useKeyboardCoach();
  useEffect(() => { coach.setTargets(targets); }, [targets]);
  useEffect(() => { coach.setPaused(paused); }, [paused]);
  return <KeyboardCoachOverlay />;
}

export function KeyboardCoachDock({ targets, paused }: { targets: KeyboardTarget[]; paused: boolean }) {
  return <KeyboardCoachProvider><Inner targets={targets} paused={paused} /></KeyboardCoachProvider>;
}
