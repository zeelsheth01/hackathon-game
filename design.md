# Hackathon Game: Comprehensive Project Blueprint

This document outlines the entire architecture, design, and gameplay loop of the "Hackathon Game" (formerly Hackathon Simulator). This blueprint contains all the necessary information to rebuild the project from scratch.

## 1. Core Concept & Gameplay Loop
"Hackathon Game" is a highly interactive, decision-driven web simulation of a software hackathon. The user navigates a 14-stage lifecycle to build a product under a time limit, make architectural decisions, survive random chaos events, and present their final product to an AI judge.

### The 14 Stages (`types/game.ts` / `store/gameStore.ts`)
1. **Difficulty Selection (`difficulty`)**: Select the pace (Relaxed - 10m, Standard - 7m, Crunch - 5m, Dev - 60s). This determines the global countdown timer and final score multiplier.
2. **Team Formation (`teamFormation`)**: Select a team of virtual coworkers (e.g., Pragmatic, Perfectionist, Dreamer).
3. **Problem Reveal (`problemReveal`)**: RNG selects a real-world problem statement (e.g., EdTech, AI, HealthTech) with specific constraints and bonus objectives.
4. **Solution Direction (`solutionDirection`)**: High-level strategy (AI agent vs lightweight standard vs hardware).
5. **Tech Stack Selection (`techStack`)**: Drag & Drop interface to select Frontend, Backend, Database, and Deployment. Synergies (e.g., Next.js + Vercel) provide hidden multipliers.
6. **USP Definition (`usp`)**: Craft the Unique Selling Proposition.
7. **Feature Backlog (`features`)**: Filter features by effort vs impact using a Drag & Drop prioritization board.
8. **Pitch Deck Builder (`pitchDeck`)**: Organize presentation slides.
9. **Mentor Audits (`mentor`)**: Pitch architecture to a mentor for warnings/hints.
10. **Business Model (`businessModel`)**: Select monetization strategy (SaaS, Freemium, Open Source).
11. **Pitch Prep (`pitchPrep`)**: Final adjustments before the timer runs out.
12. **Judge Spin (`judgeSpin`)**: Spin a wheel to select the evaluating judge (judges have different biases for Design, Execution, Innovation).
13. **Final Judging (`judging`)**: The judge evaluates the project and gives a final score out of 400.
14. **Final Results (`results`)**: View score breakdowns, an AI-generated roast, and upload the score to a persistent global leaderboard.

## 2. Technology Stack
* **Framework**: Next.js 15 (React 19, App Router)
* **Styling**: Tailwind CSS v4 + Framer Motion for micro-animations and UI transitions.
* **State Management**: Zustand (with persist middleware for saving progress on reload).
* **Database**: PostgreSQL (managed via Prisma ORM).
* **Authentication**: NextAuth.js (Credentials/Email/Social logins).
* **AI Integration**: OpenAI/Gemini APIs for dynamic content generation (e.g., generating PRDs, judge roasts).
* **Drag & Drop**: `@dnd-kit/core` for Tech Stack and Feature Backlog stages.

## 3. UI/UX Design System (Apple-like Minimalist Light)
* **Color Palette**: Clean warm-white background (`oklch(0.99 0.01 75)`), dark slate text, pure white cards. Vibrant Royal Blue/Indigo accent (`oklch(0.55 0.2 250)`).
* **Typography**: 
  * Main Interface: `Space Grotesk` (Futuristic geometric sans-serif).
  * Data/Code/Technical elements: `Roboto Mono`.
* **Component Styling**:
  * Large, legible text (`text-sm` base, `text-4xl` headers).
  * Prominent, context-aware call-to-action buttons (e.g., "ACCEPT CHALLENGE >" instead of generic "Next").
  * Dev tools and debug panels are hidden by default unless `gameMode === 'dev'` to avoid confusing users.

## 4. State Management (Zustand `gameStore.ts`)
The entire game state is managed globally:
```typescript
interface GameState {
  phase: GamePhase; // LOBBY, PROBLEM_REVEAL, TECH_STACK...
  stage: GameStage; // The specific 1 of 14 steps
  difficulty: 'easy' | 'medium' | 'hard' | 'dev' | null;
  globalTimeRemaining: number;
  isTimerPaused: boolean;
  score: {
    innovation: number;
    execution: number;
    design: number;
    pitch: number;
    bonus: number;
  };
  selectedProblem: Problem | null;
  selectedTech: Record<string, TechItem>;
  // Additional state for team, features, events...
}
```

## 5. Database Schema (`prisma/schema.prisma`)
Used primarily for Authentication and the Persistent Leaderboard:
* **User, Account, Session**: Standard NextAuth models.
* **Project**: Tracks a user's completed hackathon project (`title`, `description`, `difficulty`).
* **TechSelection & Feature**: One-to-Many relationships mapping the decisions made during the run to the Project.
* **SimulationRun**: Stores the grading metrics and AI feedback.
* **Leaderboard**: Global high scores linked to the User.

## 6. Dynamic AI API Routes
The backend contains specific routes to synthesize the user's choices into readable outputs using LLMs:
* `/api/generate-prd`: Takes the entire Zustand state JSON and generates a startup-grade Product Requirements Document based on the user's tech stack and feature backlog.
* `/api/generate-roast`: Simulates the selected Judge (from the spin wheel) tearing apart or praising the architecture based on their specific personality (e.g., a YC investor vs a hardcore backend engineer).

## 7. Rebuilding Strategy (Step-by-Step)
If recreating this project from a blank Next.js repository:
1. **Init**: Setup Next.js 15, Tailwind v4, Prisma, and Zustand.
2. **DB & Auth**: Configure PostgreSQL, run `prisma db push`, and setup `lib/auth.ts` (NextAuth).
3. **Global Store**: Create `store/gameStore.ts` to track time, score, and phase.
4. **Data Assets**: Hardcode the assets in `data/` (problems, tech items, judges, chaos events).
5. **UI Shell**: Build `app/game/page.tsx` as a giant switch statement or conditionally rendered wrapper using Framer Motion `<AnimatePresence>` for smooth transitions between the 14 stages.
6. **Stages**: Build individual components for each stage (e.g., `components/game/ProblemReveal.tsx`, `TechStackDnD.tsx`).
7. **APIs**: Implement the OpenAI endpoints in `app/api/` for the final dynamic results screen.
8. **Styling**: Ensure `globals.css` uses the Space Grotesk / Roboto Mono fonts and the Apple-like minimalist light theme.

## 8. Complete Folder Structure
To exactly replicate the workspace, an AI should generate the following tree:
```text
├── app/
│   ├── api/ (generate-prd/route.ts, generate-roast/route.ts)
│   ├── auth/signin/page.tsx
│   ├── game/page.tsx (Main 14-stage loop)
│   ├── leaderboard/page.tsx
│   ├── layout.tsx (Root layout with fonts and NextAuth Provider)
│   └── page.tsx (Landing Page)
├── components/
│   ├── drag-drop/ (TechStackDnD.tsx, FeaturePriorityDnD.tsx)
│   ├── game/ (GameLayout.tsx, GameTimer.tsx, ResultScreen.tsx, ProblemReveal.tsx)
│   └── ui/ (Tailwind/Shadcn base components: button.tsx, badge.tsx, etc)
├── data/
│   ├── chaosEvents.ts (Random disruptions)
│   ├── judges.ts (AI evaluators with specific scoring biases)
│   ├── problems.ts (22 Hackathon challenge statements)
│   └── techItems.ts (15 Tech stack options with synergy definitions)
├── lib/ (auth.ts, prisma.ts, utils.ts, sound.ts)
├── prisma/ (schema.prisma)
├── store/ (gameStore.ts - Zustand configuration)
├── types/ (game.ts - Shared interfaces)
├── tailwind.config.ts / postcss.config.mjs (Tailwind v4 Setup)
└── package.json
```

## 9. Game Data Constants required
When rebuilding, the AI must explicitly define arrays for:
1. **Problems**: Needs `{ id, title, description, category, difficulty, constraints[], bonusObjectives[] }`
2. **Tech Items**: Needs `{ id, name, category, icon, scoreModifiers: { execution, design, innovation }, synergies[] }`
3. **Judges**: Needs `{ id, name, persona, biases: { design, execution, innovation, pitch } }`
4. **Chaos Events**: Needs `{ id, title, description, timePenalty, statPenalty, resolutionOptions[] }`
