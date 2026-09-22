import React from 'react';
import { GameState } from '../types';
import { soundManager } from '../utils/sound';
import { 
  Heart, 
  Shield, 
  Wheat, 
  Swords, 
  Coins, 
  Star, 
  Clock, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  RotateCcw
} from 'lucide-react';

interface GameHUDProps {
  gameState: GameState;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onRestart: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameState,
  onToggleSound,
  onOpenRules,
  onRestart
}) => {
  // Format elapsed time or remaining time
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stageTitles: Record<number, string> = {
    1: '1. Қауіп',
    2: '2. Барлау',
    3: '3. Қорғаныс',
    4: '4. Азық қоры',
    5: '5. Тарихи сұрақ',
    6: '6. Қоршау',
    7: '7. Қақпа',
    8: '8. Құпия хабар',
    9: '9. Соңғы қорғаныс',
    10: '10. Финал'
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#8c6b3e]/60 bg-[#16120e]/95 px-3 py-2.5 backdrop-blur-md shadow-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5">
        
        {/* Left Side: Game Title & Current Stage */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏰</span>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#fae8b4] sm:text-base">
                ОТЫРАРДЫ ҚОРҒА
              </h1>
              <div className="flex items-center gap-1.5 text-[11px] text-[#b38848]">
                <span>1219–1220 жж.</span>
                <span>•</span>
                <span className="font-medium text-[#f59e0b]">
                  {stageTitles[gameState.stageNumber] || 'Кезең ' + gameState.stageNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Real-time Stats & Resources */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          {/* Hearts (Өмір) */}
          <div 
            className="flex items-center gap-1 rounded-lg border border-red-900/50 bg-[#261010]/80 px-2.5 py-1 text-xs font-semibold text-red-300"
            title="Қолбасшы өмірі (5-тен)"
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((idx) => (
                <Heart
                  key={idx}
                  className={`h-4 w-4 transition-all duration-300 ${
                    idx <= gameState.playerLives
                      ? 'fill-red-500 text-red-500 scale-100'
                      : 'text-stone-700 scale-75 opacity-40'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-red-200">{gameState.playerLives}</span>
          </div>

          {/* Defense (Қорғаныс) */}
          <div 
            className="flex items-center gap-1.5 rounded-lg border border-blue-900/50 bg-[#101b2b]/80 px-2 py-1 text-xs font-semibold text-blue-200"
            title="Қала қорғанысының беріктігі"
          >
            <Shield className="h-4 w-4 text-blue-400" />
            <span>{Math.round(gameState.defense)}%</span>
          </div>

          {/* Food (Азық) */}
          <div 
            className="flex items-center gap-1.5 rounded-lg border border-amber-900/50 bg-[#261a0f]/80 px-2 py-1 text-xs font-semibold text-amber-200"
            title="Қала азық-түлік қоры"
          >
            <Wheat className="h-4 w-4 text-amber-400" />
            <span>{Math.round(gameState.food)}</span>
          </div>

          {/* Army (Әскер) */}
          <div 
            className="flex items-center gap-1.5 rounded-lg border border-emerald-900/50 bg-[#0f2419]/80 px-2 py-1 text-xs font-semibold text-emerald-200"
            title="Отырар гарнизонының жауынгерлік күші"
          >
            <Swords className="h-4 w-4 text-emerald-400" />
            <span>{Math.round(gameState.army)}</span>
          </div>

          {/* Treasury (Қазына) */}
          <div 
            className="flex items-center gap-1.5 rounded-lg border border-yellow-900/50 bg-[#29220c]/80 px-2 py-1 text-xs font-semibold text-yellow-200"
            title="Қала қазынасы мен ресурстары"
          >
            <Coins className="h-4 w-4 text-yellow-400" />
            <span>{Math.round(gameState.treasury)}</span>
          </div>

          {/* Score (Ұпай) */}
          <div 
            className="flex items-center gap-1.5 rounded-lg border border-purple-900/50 bg-[#21112b]/80 px-2.5 py-1 text-xs font-bold text-purple-200"
            title="Жинаған жалпы ұпайыңыз"
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{gameState.score}</span>
          </div>

          {/* Time (Уақыт) */}
          <div 
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-[#1c1813] px-2 py-1 text-xs text-stone-300"
            title="Ойын уақыты"
          >
            <Clock className="h-3.5 w-3.5 text-[#b38848]" />
            <span className="font-mono">{formatTime(gameState.timeRemaining)}</span>
          </div>
        </div>

        {/* Right Side: Quick Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
              gameState.soundEnabled
                ? 'border-[#b38848]/60 bg-[#2b1f14] text-[#fae8b4] hover:bg-[#3d2c1d]'
                : 'border-stone-800 bg-[#16120e] text-stone-500'
            }`}
            title={gameState.soundEnabled ? 'Дыбысты өшіру' : 'Дыбысты қосу'}
            aria-label="Дыбысты ауыстыру"
          >
            {gameState.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="flex items-center gap-1 rounded-lg border border-[#b38848]/60 bg-[#2b1f14] px-2.5 py-1 text-xs font-medium text-[#fae8b4] transition hover:bg-[#3d2c1d] active:scale-95"
            title="Ойын ережесі мен нұсқаулық"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#d97706]" />
            <span className="hidden sm:inline">Ереже</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Ойынды қайта бастағыңыз келе ме? Барлық прогресс жаңарады.')) {
                onRestart();
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-800 text-stone-400 transition hover:bg-red-950/40 hover:text-red-300 active:scale-95"
            title="Қайта бастау"
            aria-label="Қайта бастау"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
