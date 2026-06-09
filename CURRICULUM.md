# One-Day Prep Curriculum — React 19 · TypeScript · Zustand · Data Viz

**Goal:** Rehearse the highest-frequency interview topics for a front-end role
working on **election promotional dashboards** (data + statistics heavy) by
building a kanban board with **velocity & analytics** charts.

**Rules of engagement:** *You* write every line. This plan tells you **what** to
build, **what** to be able to explain, and gives **self-check questions**. No
solutions here — that's the point.

**Stack already scaffolded:** Next.js 16 · React 19 (React Compiler on) ·
Zustand 5 · Tailwind 4. ⚠️ Per `AGENTS.md`, this Next 16 differs from tutorials —
read `node_modules/next/dist/docs/` before any Next-specific code (adding a
page, client vs server components, etc.).

Suggested pacing: ~8 focused hours. Take real breaks between blocks.

---

## Block 0 — Setup & framing (30 min)

- [ ] `npm run dev`, confirm the app loads.
- [ ] Skim the Next 16 docs for: how to add a route/page, and the
      client-component directive. Don't trust memory here.
- [ ] Re-read your `src/types.ts`. It's your foundation for everything below.

**Election-role framing to keep in mind all day:** you'll be rendering
*datasets* (poll numbers, demographics, engagement, A/B promo variants). So every
block, ask: *"how would this scale to 10k rows / update live / format for a
non-technical stakeholder?"*

---

## Block 1 — TypeScript foundations (60–75 min)

**Review (be able to explain each):**
- [ ] `type` vs `interface` — object contracts vs unions/compositions
- [ ] String-literal unions vs `enum` vs `as const` objects
- [ ] Utility types: `Partial`, `Pick`, `Omit`, `Record`, `Readonly`
- [ ] Generics — functions and types (`<T>`)
- [ ] Typing functions, events, and the `satisfies` operator
- [ ] `unknown` vs `any` (and why `JSON.parse` returns `any` — a real risk)

**Build tasks (in `src/types.ts`):**
- [ ] Name your priority union: `export type Priority = 'low' | 'medium' | 'high'`
- [ ] Derive the runtime list from one source:
      `const PRIORITIES = [...] as const; type Priority = typeof PRIORITIES[number]`
- [ ] Add velocity groundwork: optional `points?: number` on cards (scrum story
      points) so velocity can be *weighted*, not just card-counts.
- [ ] Define the input type for "create card" using a utility type so callers
      can't pass `id` / `createdAt` / `modifiedAt`.

**Self-check Q's:**
1. Why does `JSON.parse(localStorage.getItem(...))` return `any`, and what's the
   risk? How would you make loading type-safe?
2. Write the type for a function that takes `Omit<Card,'id'|'createdAt'|'modifiedAt'>`
   and returns a `Card`.
3. What's the difference between `as const` and a plain array, at the type level?

---

## Block 2 — React core: rendering (90 min)

**Review:**
- [ ] Components, props, composition, `children`
- [ ] Lists & keys — *why* `key={card.id}`, never index or title
- [ ] Conditional rendering & empty states
- [ ] JSX rules (fragments, expressions, why you can't use `if` inline)

**Build task — STATIC board, no state yet:**
- [ ] Hardcode a `Board` object and render `Board → Columns → Cards`
- [ ] Components: `<Board>`, `<Column>`, `<CardItem>` (compose them)
- [ ] Empty-column state ("No cards yet")
- [ ] Style with Tailwind (flex row of columns, stacked cards)

**Self-check Q's:**
1. What does React do with `key` during reconciliation? What breaks with
   `key={index}` when you reorder a list?
2. Controlled vs uncontrolled component — define both.
3. When does a component re-render? (And how does the React Compiler change the
   `useMemo`/`useCallback` story in React 19?)

---

## Block 2.5 — Modal component (45 min) ✅ built during Block 2

*Built early because it's needed for add-card form (Block 3) and card editing.*

**Concepts covered:**
- [ ] `ReactDOM.createPortal` — renders outside the component tree into `document.body`,
      escaping any parent `overflow:hidden` or `z-index` stacking context
- [ ] Single-instance pattern — `<Modal />` mounted once in `layout.tsx`, controlled
      by a Zustand store (`isOpen`, `content: ReactNode | null`)
- [ ] `useEffect` cleanup — Escape key listener must be removed on unmount
- [ ] `e.stopPropagation()` — backdrop click closes, dialog click doesn't
- [ ] `'use client'` boundary — Modal needs it; `modalStore.ts` does not

**Files:**
- `src/store/modalStore.ts` — Zustand store: `openModal(content)` / `closeModal()`
- `src/components/Modal.tsx` — portal + backdrop + dialog, reads from store
- `src/app/layout.tsx` — `<Modal />` rendered once before `</body>`

**Usage from any component:**
```tsx
const { openModal } = useModalStore();
openModal(<CardForm onClose={closeModal} />);
```

**Self-check Q's:**
1. Why `createPortal` instead of just rendering the modal inline?
2. What happens if you forget the `useEffect` cleanup on the Escape listener?
3. Why does `modalStore.ts` not need `'use client'` but `Modal.tsx` does?
4. What is `ReactNode` and how does it differ from `ReactElement`?

---

## Block 3 — Hooks & local state (90 min)

**Review:**
- [ ] `useState` (incl. functional updates `setX(prev => ...)`)
- [ ] `useEffect` — dependency array, cleanup, when it runs
- [ ] `useRef` — DOM refs vs mutable values
- [ ] Custom hooks — extracting logic, typing the return
- [ ] Stale closures (a classic bug source)

**Build task — add-card form (opens in Modal):**
- [ ] Controlled inputs (title, description `<textarea>` with `whitespace-pre-wrap`,
      priority `<select>` from `Priority` array, type `<select>` from `CardType` array)
- [ ] Typed events (`React.ChangeEvent<HTMLInputElement>`, `React.ChangeEvent<HTMLTextAreaElement>`, `FormEvent`)
- [ ] Local `useState` for form fields; submit creates a card object
- [ ] Generate ids with `crypto.randomUUID()` inside the handler (not in render)
- [ ] Open form via `openModal(<CardForm />)` — no `'use client'` on the trigger
      component unless it has other browser needs

**Self-check Q's:**
1. Why `setX(prev => prev + 1)` instead of `setX(x + 1)`? When does it matter?
2. What goes in a `useEffect` dependency array and what happens if you lie?
3. Why can't you call `localStorage` during render in Next's App Router? What's a
   hydration mismatch?

---

## Block 4 — Zustand + persistence (75 min)

**Review:**
- [ ] Creating a typed store (state shape + actions in one type)
- [ ] Selectors and why you select narrowly (`useStore(s => s.cards)`)
- [ ] Immutable updates — never mutate; return new arrays/objects
- [ ] `persist` middleware → localStorage, and rehydration timing
- [ ] Zustand vs Context vs Redux — trade-offs

**Build task — move data into the store:**
- [ ] Store file lives at `src/store/boardStore.ts` (or `useBoardStore`). One typed `create<BoardState>()` call. State shape + actions co-located in the same type.
- [ ] Store shape: the board + actions
- [ ] `addCard(columnId, input)` — sets id + timestamps
- [ ] `moveCard(cardId, fromCol, toCol, index)` — **the immutability rep**
- [ ] `editCard(cardId, patch)` — bumps `modifiedAt`
- [ ] `deleteCard(cardId)`
- [ ] `persist` middleware is configured with `name`, `partialize` (only persist the board/workspace, not transient UI), and explicit handling for rehydration (either `skipHydration` + `useEffect` "hasHydrated" flag, or `onRehydrateStorage`).
- [ ] Every action that mutates returns brand new arrays/objects at every level touched (`columns`, the specific column's `cards` array, the card object itself). No `.push`, `.splice`, or direct property assignment on store state.
- [ ] At least one selector is deliberately narrow and one is shown as "bad (wide)" during rehearsal. Demonstrate the re-render difference.
- [ ] `moveCard` supports both column change **and** intra-column reordering via target index. Buttons or a minimal drop target prove it works.
- [ ] **Wire `moveCard` to UI** — at minimum ◀ ▶ buttons on each card that move
      it to the prev/next column. Don't leave the immutable reducer untested. DnD
      is the stretch; buttons prove the reducer works and give you a thing to demo.

**Self-check Q's:**
1. Walk through `moveCard` immutably — which arrays get new references and why?
2. Why does selecting the *whole* store cause extra re-renders? Fix it.
3. How does `persist` avoid a hydration mismatch on first paint?
4. What exactly does Zustand's `persist` write to localStorage on first mount before
   rehydration, and how do you prevent a flash of the initial `create(...)` state?
5. Show the exact new references created when you move a card from column 0 index 1
   to column 2 index 0. Name every array/object that must be new.
6. Why would a selector that returns `state.board` cause every card to re-render on
   a single priority change, even with the React Compiler?

---

## Block 4.5 — Async data & React 19 patterns (45–60 min) ⭐ role-critical

*Added after Grok flagged it: an election-data role opens with "how do you fetch
and refresh live data?" The rest of this plan is 100% client-side, so this block
exists to give you both a small artifact AND talking points.*

**Build (small, simulated — no real backend):**
- [ ] Make board loading **async**: a `loadBoard(): Promise<Board>` that resolves
      from localStorage after a small `setTimeout` delay (fakes a network fetch).
- [ ] Render the three states explicitly: **loading** (skeleton/spinner),
      **error** (something failed), **empty** (no board yet → onboarding CTA).
- [ ] Add **optimistic UI** to one action — e.g. `moveCard` or a priority change:
      update immediately, then reconcile/roll back if the (fake) save rejects.
- [ ] Add a 5-second "refresh" button that re-runs the async load and merges (or replaces) the board, with a loading indicator that does not block the existing cards.

**Study + be able to explain (read Next 16 docs — don't trust memory):**
- [ ] Server Components vs Client Components: what each *can't* do; where `fetch`
      lives; how you'd load the real election dataset server-side.
- [ ] `Suspense` + streaming: how a loading skeleton maps to a server boundary.
- [ ] Data refresh: revalidation / polling / where live updates plug in.
- [ ] React 19 primitives: `useOptimistic`, `useActionState`, `useTransition` —
      what each is for, in one sentence each.
- [ ] Exact sequence in Next 16 App Router for: initial HTML (server), first client paint (possible mismatch), rehydration of persisted Zustand state, then a client-side poll or `router.refresh()` boundary.
- [ ] How `useOptimistic` differs from "just set the state early and fix it later" — specifically the automatic revert contract and how it composes with transitions.
- [ ] Where you would put a real `fetch('/api/election/precincts?date=...')` if this were a production dashboard instead of localStorage.

**Self-check Q's:**
1. In App Router, where does the initial board load happen and how does a
   periodic live refresh work — with loading skeletons and error states?
2. How does `useOptimistic` differ from just calling `setState` early?
3. Server data + client (Zustand) state — how do you reconcile them?
4. You call `loadBoard()` inside a `useEffect([], ...)` in a client component. What are the three states you must render, and what happens on the server for the initial HTML?
5. Your optimistic move succeeds in the UI but the fake `saveMove` rejects. Show the exact lines that revert the store (and why you cannot just call `setState` with the old value you closed over).
6. Server Component can `fetch` election data and stream it. Client Zustand owns drag-and-drop state. What is your merge strategy on initial load and on a background refresh, and where do conflicts surface?

---

## Block 5 — Velocity & analytics with Recharts (90 min)

**Setup:**
- [ ] `npm i recharts`
- [ ] Add an `/analytics` page (check Next 16 docs for routing) or a panel toggle
- [ ] Charts must be in a **client component** (they use the DOM)

**Derive the data (selectors / plain functions over store state):**
- [ ] **Cards per column** → `BarChart` (workload distribution)
- [ ] **Priority breakdown** → `PieChart` (how much is high-priority)
- [ ] **Velocity** → `LineChart`: count (or sum of `points`) of cards in the
      "done" column bucketed by `modifiedAt` per day/week. This is your headline
      scrum metric — *work completed over time*.
- [ ] Velocity computation is **not** done by mapping inside the chart component on every render. It lives in a stable pure function or a Zustand selector (or `useMemo` only if the compiler doesn't elide it). The function takes `Card[]` (or the done column) and returns `[{date: string, points: number}, ...]`.
- [ ] Chart data derivation handles the "no done cards yet" and "all cards have same-day modifiedAt" edge cases without crashing or showing empty meaningless lines.
- [ ] At least one chart uses `ResponsiveContainer` + proper `width`/`height` or aspect. (One excellent velocity line + one supporting chart is sufficient; all three are not required.)
- [ ] Accessibility pass on the chart area: title/description via `aria-labelledby`, data table fallback or `<VisuallyHidden>` summary, color contrast on lines/bars vs background.
- [ ] Wrap each in `<ResponsiveContainer>`; layout the dashboard with Tailwind
      grid; style the cards/legends with Tailwind.

**Election-data talking points (likely interview territory):**
- [ ] How would you format big numbers / percentages for stakeholders?
- [ ] Responsive + accessible charts (labels, color contrast, `aria`)
- [ ] Performance with large datasets — memoizing derived data, downsampling,
      canvas (Chart.js) vs SVG (Recharts) trade-off
- [ ] Live-updating data — where would polling/streaming plug in?

**Self-check Q's:**
1. Where should the velocity computation live — in the component, a selector, or
   a memoized helper? Why?
2. If the dataset were 50k points, what changes?
3. How do you keep a chart's derived data from recomputing on every render?
4. You have 14,000 cards with `modifiedAt` spread over 90 days. Your velocity line
   recomputes on every keystroke. List the three cheapest places to cut the work.
5. For a stakeholder who doesn't care about story points, which metric do you surface
   first — cumulative points or card count — and why? How do you let them switch?
6. Show the bucketing logic that turns epoch ms into `"2026-04-12"` keys that survive
   DST and timezone shifts.

---

## Block 6 — Mock interview & polish (45–60 min)

- [ ] Extract a `useVelocityData(doneCards)` or equivalent custom hook that returns the bucketted series + any summary stats. Type its return value.
- [ ] Replace any remaining wide selectors or "select everything" usage with narrow ones + `useShallow` where arrays/objects are returned.
- [ ] Kill all `any` (especially around the persisted localStorage parse path) and add a tiny runtime validator or branded type for the loaded shape.
- [ ] Remove or scope the `data-part` / `data-component` attributes before any stakeholder-facing demo.
- [ ] Out loud, explain your `moveCard` and your velocity calc to an imaginary
      reviewer.
- [ ] Rapid-fire Q&A (have Grok or a friend quiz you):

**Question bank:**
- Explain the dependency array of `useEffect`.
- `type` vs `interface` — when each?
- Why is mutating state a bug in React? Show the immutable fix.
- What's a key and why not the index?
- How does Zustand differ from Context for global state?
- What does the React Compiler do, and what does it make obsolete?
- How do you type an event handler / a generic component?
- Server vs client components in Next — what can't a server component do?
- How would you visualize live election poll data and keep it performant?
- Controlled vs uncontrolled inputs — trade-offs.
- *(Grok)* Walk through exactly where/how you'd load the initial board (or
  election dataset) and a periodic live refresh in Next 16 + React 19 App
  Router, including loading skeletons and error states.
- *(Grok)* Your velocity chart recomputes and re-renders on every keystroke in
  the add form. Give three concrete ways to stop that work and when you'd choose
  each under the React Compiler.
- *(Grok)* Show how you'd add optimistic UI for `moveCard` or a priority change
  (React 19 primitives or Zustand), plus the exact rollback path on failure.
- *(Grok)* Your `persist` middleware just wrote the board. On the next deploy you
  add `'task'` to `CardType`. What happens on rehydrate for a user with old data?
- *(Grok)* Walk the component tree from `<Home>` to a single priority dot. At each
  step: Server Component or Client Component, and why?
- *(Grok)* The kanban looks great with 13 cards. A real GOTV board has hundreds.
  Name the first three things that break and the minimal change for each.
- You need to surface "X high-priority cards due in the next 72 hours" as a big number for the campaign lead. Where does that number live (selector? derived in chart? inline in header?), how do you keep it from recalculating on every card hover, and how would you make the same number work for a 40k-card national dataset?

---

## Cross-cutting (performance & scale, accessibility, timestamp hygiene, verbal fluency)

**Performance & scale (election data reality):**
- [ ] For any list or derived computation, be ready to answer: "What changes at 1k cards? 10k? 50k?"
- [ ] Know one concrete technique for each: virtualization (or windowing), downsampling before chart, web worker for bucketing, canvas fallback vs SVG, pagination of columns/cards.

**Accessibility (dashboards for real humans):**
- [ ] Cards are keyboard reachable and operable (at minimum via the move buttons). `aria-label` or `aria-describedby` on priority/type affordances.
- [ ] Chart regions have accessible names and a text alternative (even if just a small summary line: "12 high, 7 medium, 3 low").
- [ ] Drag/move operations announce the result to screen readers (live region or assertive status update).

**Timestamp & date hygiene (easy to get wrong in interviews):**
- [ ] All timestamps in the domain are `number` (epoch ms). All display and bucketing goes through a single pure helper file (`src/lib/dates.ts` or similar). No `new Date(...)` inline in components or inside render.

**Verbal fluency targets (practice these out loud daily):**
- 60-second version: "Here is how a card physically moves from one column to another without ever mutating state."
- 90-second version: "This is the exact data shape an election dashboard would receive, where I would fetch it in Next 16, and how the client Zustand layer would stay in sync during a live vote-count refresh."
- 45-second version: "Under the React Compiler I still reach for X in this one place because Y, and here is the before/after re-render count."

---

## If you run short on time — priority order

1. Blocks 1–2 (TS + rendering) — **non-negotiable**, most-tested.
2. Block 4 (Zustand + immutable `moveCard`, **wired to ◀▶ buttons**) — strong
   state-management signal.
3. Block 4.5 **talking points** (async load, server vs client, `useOptimistic`)
   — even if you don't build it all, be able to *speak* to it; the role opens
   here.
4. Block 5 (one chart — the **velocity LineChart**) — matches the role.
5. Block 3 fills naturally as you build the form.

Better to *finish fewer blocks and explain them cold* than to half-build all six.
