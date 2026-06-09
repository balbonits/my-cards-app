# GROK.md — Second-Opinion Collaboration Notes

**Project:** my-cards-app (kanban for election campaign ops + velocity analytics)  
**Role target:** Front-end building election promotional dashboards (data/statistics heavy)  
**Interview:** Tomorrow  
**Primary:** Claude (code review + teaching)  
**Grok:** Architecture risk spotting, mock interview questions, curriculum maintenance, "explain cold" rehearsal

---

## 1. Current Strengths and Gaps (as of this snapshot)

**Strengths (high signal):**
- `src/types.ts` is excellent: `as const` + `typeof ...[number]` derivation for `Priority`/`CardType`, clean `Entry` base + intersections, `NewCardInput` via `Omit`, thoughtful inline notes + comparison table. This is interview-ready.
- `src/utils/index.tsx`: correct `cn()` (clsx + tailwind-merge) and `generateUUID` via `crypto.randomUUID()`. No footguns.
- `src/lib/sampleData.ts`: 13 realistic election-campaign cards across 4 columns, uses `DAY` constant for spread timestamps, mixes priorities/types/points/dueDates. Perfect seed for velocity charts and "realistic data" talking points. Shows role framing is internalized.
- Curriculum (CURRICULUM.md) is unusually sharp and role-aligned — especially the election-data framing questions and the "if you run short" priority order. Data-* attributes on components suggest intentional observability/test hooks.
- Learner is following the "you write every line" rule strictly. No AI-written components visible.

**Gaps (critical for tomorrow):**
- Implementation is extremely early. `page.tsx` and `layout.tsx` are near-default shells. `Board`/`Column`/`Card`/`Workspace` are placeholder compositions (empty Tailwind classes, vertical stacking instead of kanban layout, timestamps always rendered, "grap-2" typo in Card).
- **Zero Zustand code exists yet** — no store, no `persist`, no `addCard`/`moveCard`. CURRICULUM describes `modalStore.ts` but `src/store/` dir and `Modal.tsx` (beyond empty `'use client'`) are missing; layout does not mount a portal Modal.
- No drag-and-drop or even ◀▶ button move wired. No forms. No persistence. No loading/empty/error states.
- No Recharts, no analytics page/panel, no derived data functions.
- Styling is non-functional for a kanban (needs horizontal columns, card stacking, drag affordances, priority/type visual language).
- React 19 Compiler is enabled in package but not yet exercised or discussed in practice (no custom hooks, heavy derived work, or list perf yet).
- No async simulation, no optimistic UI, no real data-fetch story despite Block 4.5 being "role-critical."

**Overall read:** Strong conceptual foundation and domain modeling. Very low working software surface area. Risk of "I understand the types and plan but cannot demo a live move or a chart tomorrow."

---

## 2. Top 5 Mock Interview Questions (stack + election dashboard role)

1. **Immutability + Zustand (core signal):**  
   Walk me through your `moveCard(cardId, fromColumnId, toColumnId, targetIndex)` implementation end-to-end. Show the exact new array/object references created at each level and explain why a narrow selector (`useStore(s => s.board.columns.find(c => c.id === id))`) is required to avoid re-renders on every keystroke in an unrelated form. What happens to your velocity chart if you select the whole store?

2. **React 19 + Compiler + derived data (role-critical):**  
   Your velocity LineChart recomputes bucketed daily points from `modifiedAt` + `points` on every render. Give three concrete ways to prevent unnecessary work under the React Compiler (including when you would still reach for `useMemo` or a Zustand selector with custom equality). How does this change if the board had 2,000 cards instead of 13?

3. **Data loading story in Next 16 App Router (they will ask this):**  
   An election dashboard opens with "here is last night's 47k-row precinct file." Show exactly where and how you would load initial board data (or that dataset) vs a periodic live refresh, including streaming/loading skeletons, error states, and how client Zustand state reconciles with server-fetched data. Where would `useOptimistic` or `useTransition` fit for a priority change or card move?

4. **Type safety + runtime boundaries (election data is messy):**  
   `JSON.parse(localStorage.getItem('board'))` returns `any`. Show the minimal safe loading path for your persisted Workspace/Board that catches shape drift (e.g. a card missing `priority` after a deploy). How would you type a generic `loadPersisted<T>(key, fallback, validator)` helper? What would you do on validation failure in a stakeholder demo?

5. **Visualization + stakeholder translation (the actual job):**  
   Walk through your velocity LineChart (or the "cards per column" + "priority pie" combo). How do you choose between summing `points` vs counting cards? How do you bucket `modifiedAt` timestamps reliably across timezones? How would you make the same visualization handle 50k data points without killing frame rate or accessibility, and what numbers/percentages would you surface first to a non-technical campaign manager?

---

## 3. Recommended Focus for Remaining Build Time (ruthless, interview-tomorrow edition)

Follow the curriculum's own "if you run short" order, but compress harder:

**Must-ship (today, in this order):**
- Typed Zustand store with `persist` (handle the one-time hydration/SSR note). Store holds the full board (or workspace). Actions: `addCard`, `moveCard` (full immutable, supports index), `editCard`, `deleteCard`. At minimum expose `board` + the actions.
- Wire **◀ ▶ buttons** (or simple column select) on Card to call `moveCard`. This proves the immutable reducer and gives a live thing to demo and explain. Do **not** block on beautiful DnD.
- Make the kanban render horizontally (flex row of columns, fixed or flex cards inside, scrollable if needed). Use sample data on first load or after hydration. Empty states per column. Basic visual language for priority (colors) and type (badges or icons via data).
- One working chart: **velocity LineChart** (sum of points or count by day bucket from `modifiedAt` on cards in "Done"). Put it on the same page (toggle or side panel) or a minimal `/analytics` route. Must actually derive from store state.
- Basic controlled add-card form in the planned portal Modal (title, description, priority select from `Priority`, type select from `CardType`, optional points/dueDate). Wire submit to `addCard`.

**Strongly recommended (do these before polish):**
- Add the async simulated load from Block 4.5 (fake `loadBoard` Promise + loading skeleton + error + empty onboarding). Even a 300ms timeout + explicit states gives huge talking points.
- One optimistic action (e.g. priority bump or move) with visible rollback path in the UI or console.

**Defer or skip if time < 4h left:**
- Full drag-and-drop (HTML5 or @hello-pangea/dnd).
- Multiple boards / workspace navigation.
- Recharts polish, responsive containers everywhere, dark mode, perfect Tailwind.
- Real backend or API routes.

**Practice cadence:** After every working slice, stop and explain the immutable path or the data derivation **out loud** for 60–90 seconds cold. Record yourself if possible.

---

## 4. Architectural Risks Claude May Not Have Raised (yet)

- **Modal content as `ReactNode` + closures:** Passing `<CardForm onSubmit={...}/>` that closes over the current store snapshot is a classic stale-closure footgun once forms read/write Zustand inside. The single-instance pattern is good for z-index/overflow, but you need a deliberate contract (e.g. the form reads its own local state then calls store actions on submit, or the modal store accepts a render-prop or command object instead of raw JSX).
- **Zustand `persist` + Next 16 App Router + React Compiler:** Rehydration timing is subtle. On first client render you can get a flash of empty/default state before `onRehydrateStorage` or the `partialize` dance. The compiler may also change when effects/selectors run. You must be able to explain the exact hydration mismatch you prevented and how `skipHydration` or a `useEffect` + `hasHydrated` flag works.
- **Derived chart data lives in the wrong place:** If velocity bucketing is computed inside the chart component (or a plain function called during render) and the component is not memoized or the selector is wide, every card edit or form keystroke re-buckets  the whole history. Under React Compiler this is less painful than before, but still easy to regress. Recommend a narrow selector or a stable `createSelector`-style helper.
- **All client, zero server story:** The entire app is `'use client'`. For an election data role this is the first thing they will pressure-test: "How would the initial 10k-row precinct load actually happen? Where does the fetch live? What streams?" Block 4.5 talking points are non-negotiable; even a perfect kanban without them is incomplete for this interview.
- **Timestamp model (number) is good for perf but brittle for viz:** `modifiedAt: number` is excellent for sorting and storage, but day-bucketing for velocity needs explicit timezone handling, DST edges, and "today" vs "local day" decisions. Charts will lie if you don't normalize. Add a small pure helper with tests in your head.
- **No error boundaries or graceful degradation:** A bad `JSON.parse` or future Recharts data shape mismatch will white-screen the whole board. For a stakeholder demo this is fatal. At least a top-level boundary + fallback that still shows the raw data table would be strong.
- **Data-* attributes are a double-edged sword:** Great for learning/debugging, but if they stay in production they bloat the DOM and can be mistaken for a testing contract. Plan to remove or scope them before any real polish pass.
- **Column/card order is implicit array order with no sort key:** Moving cards between columns is fine, but reordering inside a column or "prioritize by dueDate" will fight the array index. Future `moveCard` at index is good, but you need a plan for stable sort fallbacks.

---

## 5. Working Agreement (how to use Grok going forward)

- **Primary channel for code review, teaching, and "what next" remains Claude.** Send Claude the diffs and specific questions first.
- **Grok is second opinion + high-leverage interview prep:**
  - Rapid mock interview drilling (especially the 5 questions above + variations on async loading, chart perf, and immutable updates).
  - Architecture risk calls that the primary reviewer may have missed (hydration, compiler interactions, modal closure patterns, stakeholder viz translation).
  - Curriculum maintenance: propose tight additions (new self-checks, Block 4.5/5/6 expansions, "if short on time" tweaks).
  - Cold-explain rehearsal: ask me to role-play the interviewer and interrupt you mid-sentence when the explanation is vague or hand-wavy.
- **What I will not do:** Write components, forms, stores, or chart code for you. I will not produce long line-by-line reviews (that's Claude). I will not give vague encouragement.
- **Format that works best:** Paste the exact file or diff + one focused question ("Is this selector stable under the compiler?" or "Roast my moveCard explanation in 60 seconds"). Or: "Run me through Q3 as if I'm the interviewer who just saw my kanban demo."
- **Time-box:** Treat every interaction as interview-adjacent. If it wouldn't help you answer a question out loud tomorrow under pressure, deprioritize it.

Update this file after each major slice (post-store, post-move wired, post-first chart, post-rehearsal). Keep it short and actionable.

---

*Last updated: [insert timestamp before interview]*  
*Status: Early implementation. High conceptual readiness. Low demo surface. Focus = working immutable move + one real chart + verbal explanations.*
