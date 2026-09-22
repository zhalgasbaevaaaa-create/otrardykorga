import React from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { Skull, RotateCcw, BookOpen, HeartCrack } from 'lucide-react';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
  onOpenRules: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState,
  onRestart,
  onOpenRules
}) => {
  return (
    <div className="mx-auto max-w-2xl space-y-5 animate-in fade-in duration-300 px-4 py-8">
      
      <div className="relative overflow-hidden rounded-3xl border-2 border-red-700/80 bg-gradient-to-b from-[#2e0e0e] via-[#1c0a0a] to-[#0e0606] p-6 sm:p-10 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/30 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/20 border border-red-500/50 text-red-500 shadow-inner">
          <Skull className="h-8 w-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-red-400">
          Қорғаныс үзілді
        </span>

        <h2 className="mt-2 text-3xl sm:text-5xl font-black text-red-200 tracking-tight">
          ОТЫРАР ҚҰЛАДЫ
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-stone-300 leading-relaxed">
          Барлық өмір қоры сарқылды (0 ❤️). Қала шептері бұзылып, жау қақпаны бұзып өтті. Алайда, Отырар батырларының ерлігі тарихта мәңгі өшпейді.
        </p>

        {/* Stats summary */}
        <div className="mt-6 flex items-center justify-center gap-6 border-y border-red-900/50 py-3 text-xs sm:text-sm">
          <div>
            <span className="text-stone-400">Жеткен кезеңіңіз:</span>
            <div className="font-bold text-amber-400 text-base">{gameState.currentStage}-кезең</div>
          </div>
          <div className="h-8 w-px bg-stone-700" />
          <div>
            <span className="text-stone-400">Жиналған ұпай:</span>
            <div className="font-bold text-amber-400 text-base">{gameState.score} ⭐</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playHorn();
              onRestart();
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-red-600 shadow-lg shadow-red-950/50 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>ОЙЫНДЫ ҚАЙТА БАСТАУ</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-stone-700 bg-[#221212] px-6 py-3.5 text-sm font-semibold text-stone-300 hover:bg-[#301a1a] active:scale-95 cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>ТАРИХИ ДЕРЕКТЕРДІ ОҚУ</span>
          </button>
        </div>

      </div>

    </div>
  );
};
