import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GamePhase, Problem, TechItem, GameScore, PlayerProfile, ScoreEvaluation, Pace } from '../shared/types';

interface GameState {
  phase: GamePhase;
  score: GameScore;
  selectedProblem: Problem | null;
  selectedTech: string[];
  playerProfile: PlayerProfile | null;
  pace: Pace | null;
  scoreEvaluation: ScoreEvaluation | null;
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  updateScore: (score: Partial<GameScore>) => void;
  setSelectedProblem: (problem: Problem | null) => void;
  addSelectedTech: (tech: string) => void;
  removeSelectedTech: (tech: string) => void;
  setPlayerProfile: (profile: PlayerProfile) => void;
  setPace: (pace: Pace) => void;
  setScoreEvaluation: (evaluation: ScoreEvaluation) => void;
  resetGame: () => void;
}

const initialScore: GameScore = {
  innovation: 0,
  execution: 0,
  design: 0,
  pitch: 0,
  bonus: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      phase: GamePhase.REGISTRATION,
      score: { ...initialScore },
      selectedProblem: null,
      selectedTech: [],
      playerProfile: null,
      pace: null,
      scoreEvaluation: null,

      setPhase: (phase) => set({ phase }),
      updateScore: (newScore) => set((state) => ({ score: { ...state.score, ...newScore } })),
      setSelectedProblem: (selectedProblem) => set({ selectedProblem }),
      addSelectedTech: (tech) => set((state) => ({ 
        selectedTech: state.selectedTech.includes(tech) ? state.selectedTech : [...state.selectedTech, tech]
      })),
      removeSelectedTech: (tech) => set((state) => ({
        selectedTech: state.selectedTech.filter(t => t !== tech)
      })),
      setPlayerProfile: (profile) => set({ playerProfile: profile }),
      setPace: (pace) => set({ pace }),
      setScoreEvaluation: (evaluation) => set({ scoreEvaluation: evaluation }),
      resetGame: () => set({
        phase: GamePhase.REGISTRATION,
        score: { ...initialScore },
        selectedProblem: null,
        selectedTech: [],
        playerProfile: null,
        pace: null,
        scoreEvaluation: null,
      }),
    }),
    {
      name: 'hackathon-game-storage',
    }
  )
);
