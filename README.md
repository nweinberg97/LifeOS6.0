# LifeOS 6.0 

> *A local-first, zero-backend digital productivity operating system engineered to run completely inside the desktop web browser.*

---

### ⚠️ Project Status & Context
*Note: This repository represents an ongoing, iterative product design and engineering experiment. If you notice multiple versions on my profile, it is because I was actively experimenting with different component structures and refactoring iterations. The project is currently on a temporary pause, but serves as an exploration into local-first software architecture.*

---

## 🎯 Vision & Overview
**LifeOS** is designed as a private, high-performance digital life assistant. The platform consolidates fragmented productivity workflows into a single, cohesive, lightweight Single-Page Application (SPA) with zero external server dependencies. 

State management and persistence are handled entirely client-side using browser-native APIs (`localStorage` and `IndexedDB`), ensuring complete data privacy and offline execution.

---

## 🧩 Core Utility Modules
The platform integrates four foundational utility environments under a universal, unified card ecosystem:

1. **Taskly:** Kanban-based task velocity management designed to enforce focus and prioritize completion.
2. **Boardly:** Dynamic life category visual canvas acting as a free-form digital sticky-note board for goals, tasks, and notes.
3. **Timely:** Chronological scheduling across daily, weekly, and monthly views alongside a unified planning engine.
4. **Brainly:** High-density knowledge management, typed/audio notes, and structured link directories with near-zero latency search.

---

## 🛠️ Design & Technical Philosophy
* **Local-First Architecture:** Operates entirely independent of a backend server tier, utilizing `localStorage` and `IndexedDB` for instant state hydration and persistence.
* **Minimalist Aesthetic:** Governed by a "Less is More" ethos, prioritizing functional negative space, low cognitive load, and a design language inspired by Apple, Linear, and Notion.
* **Progressive Hardware Integration:** Leverages native browser capabilities—such as the Web Audio API for synthetic audio feedback and the Web Speech API for local voice transcription and synthesis.
