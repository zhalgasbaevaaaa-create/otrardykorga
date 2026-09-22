export type GameStage = 
  | 'intro'
  | 'stage1_danger'
  | 'stage2_scout'
  | 'stage3_defense'
  | 'stage4_provisions'
  | 'stage5_quiz'
  | 'stage6_siege'
  | 'stage7_gate'
  | 'stage8_message'
  | 'stage9_last_stand'
  | 'stage10_final'
  | 'game_over';

export interface GameState {
  playerLives: number;       // default 5, max 5
  defense: number;           // default 100
  food: number;              // default 100
  army: number;              // default 100
  treasury: number;          // default 100
  score: number;             // default 0
  currentStage: GameStage;
  stageNumber: number;       // 1 - 10
  timeRemaining: number;     // seconds for timed stages
  soundEnabled: boolean;
  historyLog: string[];
  startTime: number;
  selectedMapPoint?: string | null;
  activeScoutRoute?: string | null;
  innerCityWaterSaved?: boolean;
  traitorExposed?: boolean;
  artisanWeaponFocus?: 'flame' | 'armor' | 'repair' | null;
  innerCityMorale?: number;
}

export interface HistoricalQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  sourceNote?: string;
}

export interface MapPOI {
  id: string;
  name: string;
  description: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  type: 'fortress' | 'gate' | 'tower' | 'camp' | 'river' | 'caravan';
}

export interface TroopAllocation {
  northGate: number;
  eastTower: number;
  westWall: number;
  southGate: number;
}
