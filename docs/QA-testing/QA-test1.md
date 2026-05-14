# QA Test 1: Localhost 3003 Guardrail Run

This QA setup is for the Sage Quest Kids Skills gaming portal and game modules. It records repeatable local development runs against `http://localhost:3003` using Playwright artifacts: screenshots on failure, videos on failure, traces on retry, HTML report, and JUnit XML.

## One-time setup

```powershell
npm install
npx playwright install
```

## Local QA server

```powershell
npm run dev:qa
```

Expected local URL:

```text
http://localhost:3003/gaming
```

## Guardrail test commands

Run the full guardrail suite:

```powershell
npm run qa:e2e
```

Run with the browser visible for a QA dev pass:

```powershell
npm run qa:e2e:headed
```

Open the recorded Playwright report:

```powershell
npm run qa:report
```

## Artifact locations

- Playwright HTML report: `qa-artifacts/playwright-report`
- Test output, screenshots, traces, and retained failure videos: `qa-artifacts/test-results`
- JUnit result file: `qa-artifacts/results.xml`

## Current guardrails

- Gaming hub renders and exposes playable game cards.
- Hub navigation reaches Bug Trail Maze from the game card.
- Bug Trail Maze can start, pause, resume, end, and show its round summary.
- Bug Trail Maze accessibility support controls remain available during play.
- Every game route smoke-loads and fails on browser console errors.
- Desktop Chromium and tablet WebKit projects run by default.

## Manual QA Run Log

| Date | Tester | Build/Branch | Browser | Route | Result | Notes / Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-05-13 |  |  |  | `/gaming` |  |  |
| 2026-05-13 |  |  |  | `/gaming/bug-trail-maze` |  |  |

## Manual pass checklist

- Confirm `http://localhost:3003/gaming` loads without a blank screen.
- Confirm all visible game cards have readable titles, descriptions, skills, grade ranges, and action buttons.
- Confirm grade buttons are usable and the selected state is visible.
- Launch Bug Trail Maze from the hub.
- Start a Bug Trail Maze round and verify controls: pause, resume, end round, mute, reduce motion, wider path assist, restart.
- End the round and verify summary stats appear.
- Record any visual, audio, timing, input, or accessibility issue in the run log above.
