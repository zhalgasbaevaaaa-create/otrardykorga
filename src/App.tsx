import React, { useState, useEffect } from 'react';
import { GameState, GameStage, TroopAllocation } from './types';
import { soundManager } from './utils/sound';
import { GameHUD } from './components/GameHUD';
import { InteractiveMap } from './components/InteractiveMap';
import { RulesModal } from './components/RulesModal';
import { IntroScreen } from './components/stages/IntroScreen';
import { Stage1Danger } from './components/stages/Stage1Danger';
import { Stage2Scout } from './components/stages/Stage2Scout';
import { Stage3Defense } from './components/stages/Stage3Defense';
import { Stage4Provisions } from './components/stages/Stage4Provisions';
import { Stage5Quiz } from './components/stages/Stage5Quiz';
import { Stage6Siege } from './components/stages/Stage6Siege';
import { Stage7Gate } from './components/stages/Stage7Gate';
import { Stage8Message } from './components/stages/Stage8Message';
import { Stage9LastStand } from './components/stages/Stage9LastStand';
import { Stage10Final } from './components/stages/Stage10Final';
import { GameOverScreen } from './components/stages/GameOverScreen';
import { Map, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'otrar_defense_game_state_v1';

const STAGE_TO_NUMBER: Record<GameStage, number> = {
  intro: 0,
  stage1_danger: 1,
  stage2_scout: 2,
  stage3_defense: 3,
  stage4_provisions: 4,
  stage5_quiz: 5,
  stage6_siege: 6,
  stage7_gate: 7,
  stage8_message: 8,
  stage9_last_stand: 9,
  stage10_final: 10,
  game_over: 0
};

const INITIAL_GAME_STATE: GameState = {
  currentStage: 'intro',
  stageNumber: 1,
  playerLives: 5,
  score: 0,
  army: 100,
  food: 100,
  defense: 70,
  treasury: 50,
  timeRemaining: 0,
  soundEnabled: true,
  historyLog: [],
  startTime: Date.now(),
  selectedMapPoint: 'otrar_citadel',
  activeScoutRoute: 'route_east_chagatai'
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  const [savedStageNum, setSavedStageNum] = useState<number>(1);

  // Check saved game on initial load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        if (
          parsed &&
          parsed.stageNumber > 1 &&
          parsed.currentStage !== 'intro' &&
          parsed.currentStage !== 'game_over' &&
          parsed.currentStage !== 'stage10_final'
        ) {
          setHasSavedGame(true);
          setSavedStageNum(parsed.stageNumber);
        }
      }
    } catch {
      // Ignore localStorage issues in sandboxed environments
    }
  }, []);

  // Save progress helper
  const persistState = (state: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  };

  const handleStartGame = () => {
    const newState: GameState = {
      ...INITIAL_GAME_STATE,
      currentStage: 'stage1_danger',
      stageNumber: 1,
      startTime: Date.now()
    };
    setGameState(newState);
    setIsMapExpanded(false);
    persistState(newState);
  };

  const handleResumeGame = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as GameState;
        setGameState(parsed);
        return;
      }
    } catch {
      // fallback
    }
    handleStartGame();
  };

  const handlePenalty = () => {
    setGameState(prev => {
      const updatedLives = prev.playerLives - 1;
      const isOver = updatedLives <= 0;

      if (isOver) {
        soundManager.playGameOver();
      }

      const updatedState: GameState = {
        ...prev,
        playerLives: Math.max(0, updatedLives),
        currentStage: isOver ? 'game_over' : prev.currentStage
      };
      persistState(updatedState);
      return updatedState;
    });
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    setHasSavedGame(false);
    handleStartGame();
  };

  const handleToggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setGameState(prev => {
      const next = { ...prev, soundEnabled: !isMuted };
      persistState(next);
      return next;
    });
  };

  // Stage Transitions
  const handleStage1Complete = (impact: { defense: number; food: number; army: number; treasury: number; score: number }) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage2_scout',
        stageNumber: 2,
        defense: impact.defense,
        food: impact.food,
        army: impact.army,
        treasury: impact.treasury,
        score: impact.score
      };
      persistState(next);
      return next;
    });
  };

  const handleStage2Success = (scoreDelta: number) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage3_defense',
        stageNumber: 3,
        score: prev.score + scoreDelta,
        activeScoutRoute: 'route_east_chagatai'
      };
      persistState(next);
      return next;
    });
  };

  const handleStage3Complete = (_alloc: TroopAllocation, defenseBonus: number, scoreBonus: number) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage4_provisions',
        stageNumber: 4,
        defense: Math.min(100, prev.defense + defenseBonus),
        score: prev.score + scoreBonus
      };
      persistState(next);
      return next;
    });
  };

  const handleStage4Complete = (impact: { food: number; army: number; defense: number; treasury: number; score: number }) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage5_quiz',
        stageNumber: 5,
        food: impact.food,
        army: impact.army,
        defense: impact.defense,
        treasury: impact.treasury,
        score: impact.score
      };
      persistState(next);
      return next;
    });
  };

  const handleStage5Complete = (scoreBonus: number) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage6_siege',
        stageNumber: 6,
        score: prev.score + scoreBonus
      };
      persistState(next);
      return next;
    });
  };

  const handleStage6Complete = (impact: { defense: number; army: number; score: number }) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage7_gate',
        stageNumber: 7,
        defense: impact.defense,
        army: impact.army,
        score: impact.score
      };
      persistState(next);
      return next;
    });
  };

  const handleStage7Complete = (impact: { defense: number; army: number; score: number }) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage8_message',
        stageNumber: 8,
        defense: impact.defense,
        army: impact.army,
        score: impact.score
      };
      persistState(next);
      return next;
    });
  };

  const handleStage8Complete = (scoreBonus: number) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage9_last_stand',
        stageNumber: 9,
        score: prev.score + scoreBonus
      };
      persistState(next);
      return next;
    });
  };

  const handleStage9Complete = (scoreBonus: number) => {
    setGameState(prev => {
      const next: GameState = {
        ...prev,
        currentStage: 'stage10_final',
        stageNumber: 10,
        score: prev.score + scoreBonus
      };
      persistState(next);
      return next;
    });
  };

  return (
    <div id="game-app-root" className="min-h-screen bg-[#110c08] text-stone-200 font-sans selection:bg-amber-600 selection:text-white flex flex-col">
      
      {/* Top HUD bar */}
      <GameHUD
        gameState={gameState}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesOpen(true)}
        onRestart={handleRestart}
      />

      {/* Main Game Container */}
      <main id="game-main-content" className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        
        {/* VIEW 1: INTRO SCREEN */}
        {gameState.currentStage === 'intro' && (
          <IntroScreen
            onStart={handleStartGame}
            onOpenRules={() => setIsRulesOpen(true)}
            hasSavedGame={hasSavedGame}
            onResume={handleResumeGame}
            savedStageNum={savedStageNum}
          />
        )}

        {/* VIEW 2: GAME OVER SCREEN */}
        {gameState.currentStage === 'game_over' && (
          <GameOverScreen
            gameState={gameState}
            onRestart={handleRestart}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {/* VIEW 3: FINAL VICTORY SCREEN (STAGE 10) */}
        {gameState.currentStage === 'stage10_final' && (
          <Stage10Final
            gameState={gameState}
            onRestart={handleRestart}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {/* VIEW 4: ACTIVE PLAYING (STAGES 1 to 9) */}
        {gameState.currentStage !== 'intro' &&
          gameState.currentStage !== 'game_over' &&
          gameState.currentStage !== 'stage10_final' && (
            <div className="space-y-4">
              
              {/* Interactive Map Accordion / Toggle */}
              <div className="rounded-2xl border border-[#8c6b3e]/40 bg-[#17110b] overflow-hidden shadow-lg">
                <div 
                  onClick={() => {
                    soundManager.playClick();
                    setIsMapExpanded(!isMapExpanded);
                  }}
                  className="flex items-center justify-between px-4 py-3 bg-[#241910] hover:bg-[#2c1f14] transition cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Map className="h-4 w-4 text-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-[#fae8b4]">
                      Интерактивті тарихи карта (Отырар оазисі және шептер)
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800 hidden sm:inline">
                      {gameState.stageNumber === 2 ? 'Барлау кезеңі: Негізгі соққыны таңдаңыз' : 'Шолу режимі'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <span>{isMapExpanded ? 'Картаны жинау' : 'Картаны көру'}</span>
                    {isMapExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>

                {/* Map Body: Always expanded on Stage 2 (Scout), or toggleable on other stages */}
                {(isMapExpanded || gameState.stageNumber === 2) && (
                  <div className="p-3 bg-[#120d07] border-t border-stone-800">
                    <InteractiveMap
                      gameState={gameState}
                      selectableRoutes={gameState.stageNumber === 2}
                      selectedRouteId={gameState.activeScoutRoute}
                      onSelectRoute={(routeId) => {
                        setGameState(prev => ({ ...prev, activeScoutRoute: routeId }));
                      }}
                      highlightPoiId={gameState.selectedMapPoint || undefined}
                    />
                  </div>
                )}
              </div>

              {/* Stage-Specific Quest Components */}
              {gameState.currentStage === 'stage1_danger' && (
                <Stage1Danger
                  gameState={gameState}
                  onComplete={handleStage1Complete}
                  onPenalty={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage2_scout' && (
                <Stage2Scout
                  gameState={gameState}
                  selectedRouteId={gameState.activeScoutRoute || null}
                  onSelectRoute={(routeId) => {
                    setGameState(prev => ({ ...prev, activeScoutRoute: routeId }));
                  }}
                  onSuccess={handleStage2Success}
                  onFail={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage3_defense' && (
                <Stage3Defense
                  gameState={gameState}
                  onComplete={handleStage3Complete}
                  onPenalty={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage4_provisions' && (
                <Stage4Provisions
                  gameState={gameState}
                  onComplete={handleStage4Complete}
                  onPenalty={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage5_quiz' && (
                <Stage5Quiz
                  gameState={gameState}
                  onSuccess={handleStage5Complete}
                  onFail={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage6_siege' && (
                <Stage6Siege
                  gameState={gameState}
                  onComplete={handleStage6Complete}
                  onPenalty={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage7_gate' && (
                <Stage7Gate
                  gameState={gameState}
                  onComplete={handleStage7Complete}
                  onPenalty={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage8_message' && (
                <Stage8Message
                  gameState={gameState}
                  onComplete={handleStage8Complete}
                  onPenalty={handlePenalty}
                />
              )}

              {gameState.currentStage === 'stage9_last_stand' && (
                <Stage9LastStand
                  gameState={gameState}
                  onComplete={handleStage9Complete}
                  onPenalty={handlePenalty}
                />
              )}

            </div>
          )}

      </main>

      {/* Rules & Historical Reference Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-[#0d0906] py-3 text-center text-xs text-stone-500">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>«Отырарды қорға» — Қазақстан тарихы курсына арналған интерактивті тарихи-стратегиялық ойын</span>
        </p>
      </footer>

    </div>
  );
}
