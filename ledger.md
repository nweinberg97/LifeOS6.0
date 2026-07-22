# SEDI / LifeOS Project Ledger

## Architecture & Technical Stack
- Baseline Codebase: LifeOS 6.0
- Target Architecture: Vanilla HTML5 / CSS3 / JavaScript (ES6+), Zero Frameworks, Local-First SPA[cite: 5].
- Data Persistence: `localStorage` (UI routing, small state) + `IndexedDB` (high-capacity card data, history)[cite: 5].
- Global State Model: Unified Polymorphic Card Schema (`state.cards`) dynamically adapting to tool context bounds[cite: 5].

---

## PRD Module Traceability Matrix

### 1. Home Dashboard [UI: 75% | LOGIC: 40%]
- [x] Clock & Date display[cite: 3, 5]
- [ ] Weather widget integration (Currently static mock)[cite: 3, 5]
- [ ] Next Up Column: Constrain to max 3 items (Top To-Do item + today's Timely events)[cite: 5]
- [ ] Recent Activity Column: Constrain to max 3 items[cite: 5]
- [ ] 1-line text truncation + click overlay for full description[cite: 5]
- [ ] Header click on columns opens full scrollable history modal[cite: 5]

### 2. Taskly (Kanban Workspace) [UI: 80% | LOGIC: 70%]
- [x] 5 Columns: To Do → In Progress → Review → Completed → Backlog[cite: 3, 5]
- [ ] Viewport height 100% lock (no column vertical scroll overflow)[cite: 5]
- [x] Drag & drop card updates + drag to Global Trash Bin[cite: 4, 5]

### 3. Boardly (Life Categories) [UI: 60% | LOGIC: 50%]
- [x] Tab bar capped at 10 categories (Defaults: Health, Relationships, Work, Chores, Admin)[cite: 4, 5]
- [ ] Active tab 25% underline width indicator[cite: 5]
- [ ] Unconstrained free-form absolute positioning canvas (Digital Sticky Notes)[cite: 5]
- [ ] Goal Cards: SMART Goal modal overlay template[cite: 5]
- [ ] Note Cards: Narrow width (~2.5 in), max 10 lines auto-expand/collapse[cite: 5]

### 4. Timely (Planning & Scheduling) [UI: 50% | LOGIC: 20%]
- [x] Scheduling vs. Planning mode toggles[cite: 3, 4, 5]
- [ ] Auto-purge past chronological data (retain current + future only)[cite: 5]
- [ ] Daily View: 24h canvas defaulted to 6 AM - 8 PM visible window with micro-interval steps[cite: 5]
- [ ] Weekly View: Mon-Sun flat columns with Morning/Noon/Afternoon/Evening/Night blocks[cite: 5]
- [ ] Monthly View: Days compress to dot indicators; click opens day sub-view[cite: 5]
- [ ] Reminders Board tab[cite: 5]
- [ ] iCalendar export (.ics file generation) & recurring routine engine[cite: 5]
- [ ] Unified Container Engine for Projects & Goals (3-container carousel + add/delete)[cite: 5]

### 5. Brainly (Knowledge Management) [UI: 70% | LOGIC: 50%]
- [x] Global Search bar (real-time filtering)[cite: 3, 4, 5]
- [x] My Links Dashboard + Link directories[cite: 3, 4, 5]
- [ ] Free-form drag-and-drop Notes & Folders on canvas[cite: 5]
- [ ] Note overlay audio recording (Web Speech API real-time local transcription)[cite: 5]

### 6. Universal Core Services & Navigation [UI: 80% | LOGIC: 70%]
- [x] Top Bar Atom logo + Hamburger drawer (JSON Download, Clear Storage)[cite: 3, 4, 5]
- [x] Universal Board: Staging drawer for card polymorphing[cite: 3, 4, 5]
- [x] Global Trash Bin: Drag target + Web Audio API procedural crunch sound[cite: 3, 4, 5]
- [ ] Side Navigator: Home house icon styling (matches dark pills, turns white on hover)[cite: 5]
- [ ] First-run Onboarding Check (Populate tutorial cards if local storage empty)[cite: 5]

---

## Phase 2 Roadmap & Future Explorations (Deferred)
- Sovereign Brain Module (In-browser RAG with WebGPU / SmolLM2 / Voy vector search)[cite: 5].
- Data Sync & Export Explorations:
  * Local JSON export/import via browser/Chrome[cite: 5].
  * iCloud Drive sandboxed folder sync[cite: 5].
  * P2P Secure Sync mechanics[cite: 5].
  * Auto-send/Email backup triggers[cite: 5].
