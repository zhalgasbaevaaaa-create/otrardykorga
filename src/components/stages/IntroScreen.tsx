import React from 'react';
import { soundManager } from '../../utils/sound';
import { Shield, Play, BookOpen, RotateCcw, Volume2, Sparkles, MapPin, Award } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
  onOpenRules: () => void;
  hasSavedGame: boolean;
  onResume: () => void;
  savedStageNum: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  onOpenRules,
  hasSavedGame,
  onResume,
  savedStageNum
}) => {
  return (
    <div className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden px-4 py-8">
      {/* Background Medieval Atmosphere Glows and Dust */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#452712]/70 via-[#1c140d]/90 to-[#0e0b07] -z-10" />

      {/* Decorative Steppe Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none -z-10" />

      {/* Main Intro Card */}
      <div className="relative w-full max-w-3xl rounded-3xl border-2 border-[#b38848]/70 bg-[#19130d]/90 p-6 sm:p-10 text-center shadow-2xl backdrop-blur-md">
        
        {/* Top Historical Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b38848]/50 bg-[#2b1f14]/80 px-4 py-1.5 text-xs font-semibold text-[#f59e0b] shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Қазақстан тарихы • 1-курс студенттеріне арналған ойын</span>
        </div>

        {/* Title */}
        <div className="space-y-1 mb-5">
          <div className="text-4xl sm:text-5xl">🏰</div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#fae8b4] drop-shadow-md">
            ОТЫРАРДЫ ҚОРҒА
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#d4af37] tracking-wider">
            1219 жыл. Отырар.
          </p>
        </div>

        {/* Atmospheric Cinematic Text */}
        <div className="mx-auto max-w-xl rounded-2xl border border-[#8c6b3e]/40 bg-[#251a11]/70 p-4 sm:p-5 mb-8 shadow-inner">
          <p className="text-sm sm:text-base leading-relaxed text-[#ecd7b0] italic">
            «Шығыстан моңғол әскері жақындап келеді. Отырардың тағдыры енді сіздің шешімдеріңізге байланысты.»
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-[#d97706]">
            <Shield className="h-4 w-4" />
            <span>Рөліңіз: Отырар қорғанысының қолбасшысы</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            onClick={() => {
              soundManager.playHorn();
              onStart();
            }}
            className="group relative flex w-full sm:w-auto min-w-[200px] items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-[#f59e0b] hover:to-[#d97706] hover:shadow-amber-900/50 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="h-5 w-5 fill-white" />
            <span>БАСТАУ</span>
          </button>

          {hasSavedGame && (
            <button
              onClick={() => {
                soundManager.playClick();
                onResume();
              }}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#b38848] bg-[#2e1f13] px-5 py-3.5 text-sm font-semibold text-[#fae8b4] transition hover:bg-[#3d2a1b] active:scale-95"
            >
              <RotateCcw className="h-4 w-4 text-[#f59e0b]" />
              <span>Ойынды жалғастыру ({savedStageNum}-кезең)</span>
            </button>
          )}

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#8c6b3e]/60 bg-[#241a12]/80 px-5 py-3.5 text-sm font-semibold text-[#ebd7b5] transition hover:bg-[#33251a] active:scale-95"
          >
            <BookOpen className="h-4 w-4 text-[#d97706]" />
            <span>Ойын ережесі</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left text-xs border-t border-[#8c6b3e]/30 pt-6 text-[#d1c3ad]">
          <div className="flex items-center gap-2 rounded-lg bg-[#22170f]/70 p-2.5 border border-[#8c6b3e]/20">
            <span className="text-base">🗺️</span>
            <div>
              <p className="font-bold text-[#fae8b4]">Интерактивті карта</p>
              <p className="text-[10px] text-stone-400">Шептер мен бағыттар</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#22170f]/70 p-2.5 border border-[#8c6b3e]/20">
            <span className="text-base">🛡️</span>
            <div>
              <p className="font-bold text-[#fae8b4]">10 Стратегиялық кезең</p>
              <p className="text-[10px] text-stone-400">Ресурс пен қорғаныс</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#22170f]/70 p-2.5 border border-[#8c6b3e]/20">
            <span className="text-base">📚</span>
            <div>
              <p className="font-bold text-[#fae8b4]">40 Академиялық сұрақ</p>
              <p className="text-[10px] text-stone-400">Тексерілген тарих</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#22170f]/70 p-2.5 border border-[#8c6b3e]/20">
            <span className="text-base">❤️</span>
            <div>
              <p className="font-bold text-[#fae8b4]">5 Өмір жүйесі</p>
              <p className="text-[10px] text-stone-400">Нақты шешімдер</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
