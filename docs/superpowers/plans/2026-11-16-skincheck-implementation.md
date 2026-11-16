# SkinCheck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Ideas example with SkinCheck, a local-first PWA educational questionnaire for preliminary review of user-reported skin-lesion signs.

**Architecture:** A typed `features/skincheck` domain owns questionnaire answers, deterministic evaluation and display-ready findings. A Zustand store persists versioned, Zod-validated completed checks in localStorage; pages render a state-based route model in the existing shell. Calculations deliberately return criteria and caveats, never diagnoses or probabilities.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, Zustand, Zod, Vitest, Playwright, vite-plugin-pwa.

**Spec:** `/Users/pavelnasuta/.hermes/composer-pastes/pasted_content_2026-11-16_10-45-00-863_56d94e.txt`

## Global Constraints

- This is a teaching prototype, not a certified medical device, diagnostic tool or image-analysis service.
- Do not use AI, photographs, medical diagnoses, disease probabilities or treatment/removal advice.
- The weighted 7-point checklist is displayed only for potentially pigmented entries; a score of 3 or more means a recommendation for prompt in-person medical assessment, not a diagnosis.
- Missing and “Не знаю” answers are visible as unevaluated; uncertain or incomplete entries recommend an in-person consultation.
- Keep all records on-device in versioned localStorage; do not add a backend, authentication, analytics, keys or external tracking.
- Preserve PWA operation, GitHub Pages repository subpath compatibility, Russian-first copy and mobile-first accessibility.
- Keep QA lightweight: unit-test deterministic scoring/storage and retain one end-to-end create → save → reload smoke flow. Run build on each implementation phase.

---

### Task 1: Create the typed assessment domain and deterministic evaluation

**Files:**
- Create: `src/features/skincheck/skincheck-types.ts`, `src/features/skincheck/skincheck-evaluation.ts`, `src/features/skincheck/skincheck-evaluation.test.ts`

**Interfaces:**
- `AssessmentDraft` holds location, appearance, size, ABCDE, symptoms and risk answers.
- `evaluateAssessment(draft): AssessmentEvaluation` returns checklist applicability, numeric score, unevaluated criteria, ABCDE findings, alert flags, result level and explanation lines.
- `AssessmentResultLevel` is `'no-urgent-criteria' | 'consult-dermatologist' | 'prompt-assessment'`.

- [ ] Write focused tests for the exact 7-point weights, threshold 3, incomplete criteria and non-pigmented applicability.
- [ ] Implement the pure evaluator with a local constant for the three 2-point and four 1-point NICE criteria.
- [ ] Implement alert logic only from explicitly supplied responses: growth, bleeding/non-healing sore, growing firm nodule, form/colour change and multiple suspicious signs.
- [ ] Verify `npm run test -- skincheck-evaluation` and `npm run build`.

### Task 2: Persist completed assessments safely

**Files:**
- Create: `src/features/skincheck/skincheck-storage.ts`, `src/features/skincheck/skincheck-storage.test.ts`, `src/stores/skincheck-store.ts`

**Interfaces:**
- `SkinCheckRecord` is a completed immutable snapshot `{ id, createdAt, draft, evaluation }`.
- `useSkinCheckStore` exposes `records`, `save(draft)`, `remove(id)`, `hydrate()` and `storageStatus`.
- Storage key is `skincheck:records:v1`; persisted payload has `version: 1` and is Zod-validated before use.

- [ ] Write tests for save/re-hydrate, corrupt-payload recovery and deletion.
- [ ] Reuse the existing safe browser-storage adapter; keep localStorage access outside React display components.
- [ ] Verify focused tests and `npm run build`.

### Task 3: Build the assessment flow and result screen

**Files:**
- Create: `src/features/skincheck/SkinCheckPage.tsx`, `src/features/skincheck/FaceMap.tsx`, `src/features/skincheck/QuestionChoice.tsx`, `src/features/skincheck/AssessmentResult.tsx`
- Modify: `src/app/App.tsx`, `src/app/routes.ts`, `src/app/layouts/AppShell.tsx`

**Interfaces:**
- `SkinCheckPage` owns unsaved draft state and step index until the user saves the completed result.
- `FaceMap` receives selected location and `onSelect(location)`; it is a labelled SVG schematic plus a choice list fallback.
- `AssessmentResult` receives a record or evaluation and exposes save/new/history/methods actions.

- [ ] Replace the starter homepage with SkinCheck entry points and its limitations notice.
- [ ] Render five compact questionnaire groups with an accessible progress indicator, back/next controls and button-led options.
- [ ] Collect only optional millimetre input; make the user choose a size range or enter a valid 0–200 mm value before completing the general-information step.
- [ ] Show the result as named criteria, score and caveats—not a probability or a diagnosis—and make the mandatory disclaimer visually persistent.
- [ ] Verify `npm run build` and inspect desktop/mobile flows manually.

### Task 4: Add record history and educational methods content

**Files:**
- Create: `src/features/skincheck/HistoryPage.tsx`, `src/features/skincheck/MethodsPage.tsx`
- Modify: `src/features/skincheck/SkinCheckPage.tsx`, `src/app/App.tsx`, `src/app/routes.ts`

**Interfaces:**
- History opens an immutable saved record, supports delete confirmation and gives a browser-data warning.
- Methods content presents ABCDE, the weighted 7-point checklist, warning signs, limitations and the three named source links.

- [ ] Add a readable empty history state and saved-record cards with date, location, level and key criteria.
- [ ] Add a compact source-backed reference view; external links open safely in a new tab.
- [ ] Verify `npm run build`.

### Task 5: Adapt PWA metadata, smoke test and release checks

**Files:**
- Modify: `index.html`, `vite.config.ts`, `e2e/ideas.spec.ts`

**Interfaces:**
- Manifest app name and browser title identify SkinCheck.
- The smoke test starts at the repository subpath, completes an assessment, saves it and verifies it after reload.

- [ ] Retitle manifest/browser metadata while retaining existing scoped asset paths and service-worker configuration.
- [ ] Replace the Ideas browser test with one named SkinCheck happy path, not a test per visual component.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` and `npm run test:e2e`.
- [ ] Check a 390×844 and 1440×900 flow for horizontal overflow and clipped controls.

## Plan self-review

- **Spec coverage:** Tasks 1–2 cover scoring, alerts and local persistence; Task 3 covers entry, face location, questionnaire, progress and result; Task 4 covers history and educational methods; Task 5 covers PWA and verification.
- **Medical boundary:** no claimed diagnoses, probabilities, image processing or invented risk points; uncertainty results in a consultation recommendation.
- **Scope:** comparison of repeat assessments is intentionally deferred because it is optional and would distract from the first complete demonstrable flow.
