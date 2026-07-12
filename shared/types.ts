

export enum GamePhase {
  REGISTRATION = 'REGISTRATION',
  PROFILE_FORM = 'PROFILE_FORM',
  TECH_STACK = 'TECH_STACK',
  PACE_SELECTION = 'PACE_SELECTION',
  PROBLEM_REVEAL = 'PROBLEM_REVEAL',
  GUIDANCE = 'GUIDANCE',
  SCORING = 'SCORING'
}

export type Pace = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  constraints: string[];
  bonusObjectives: string[];
}

export interface TechItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'deployment';
  icon: string;
  scoreModifiers: {
    execution: number;
    design: number;
    innovation: number;
  };
  synergies: string[];
}

export interface GameScore {
  innovation: number;
  execution: number;
  design: number;
  pitch: number;
  bonus: number;
}

export interface PlayerProfile {
  id: string;
  handle: string;
  title: string;
  avatarBg: string;
  name?: string;
  profession?: string;
  github?: string;
  discord?: string;
}

export interface ScoreEvaluation {
  feedback: string;
  modifiers: {
    innovation: number;
    execution: number;
    design: number;
    pitch: number;
  };
}
