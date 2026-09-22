import React from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { Trophy, Award, RotateCcw, BookOpen, Shield, Heart, Users, Wheat, Coins, CheckCircle2 } from 'lucide-react';

interface Stage10FinalProps {
  gameState: GameState;
  onRestart: () => void;
  onOpenRules: () => void;
}

export const Stage10Final: React.FC<Stage10FinalProps> = ({
  gameState,
  onRestart,
  onOpenRules
}) => {
  // Title and academic credit determination
  let titleBadge = '📜 «Тарихтың зерек зерттеушісі»';
  let titleDescription = 'Сіз Отырар оқиғаларының маңызды фактілерін зерделеп, тарихи шешімдерге сараптама жасадыңыз.';
  let rankGrade = 'Жақсы (C+ / 75-79%)';
  let letterGrade = 'C+';

  if (gameState.score >= 120) {
    titleBadge = '🏆 «Отырардың ұлы қолбасшысы»';
    titleDescription = 'Асқан тактикалық шеберлік пен мызғымас ерлік! Отырар қамалын 6 ай бойы абыроймен қорғап, тарихта өшпес өнеге көрсеттіңіз.';
    rankGrade = 'Үздік / Академиялық шебер қолбасшы (A / 95-100%)';
    letterGrade = 'A';
  } else if (gameState.score >= 95) {
    titleBadge = '🛡️ «Қаланың сенімді қорғаушысы»';
    titleDescription = 'Қорғаныс шептерін берік ұстап, азық пен ресурстарды ұтымды басқардыңыз. Қайыр ханның сенімді серігі болдыңыз.';
    rankGrade = 'Өте жақсы / Сенімді сардар (B+ / 85-89%)';
    letterGrade = 'B+';
  } else if (gameState.score >= 70) {
    titleBadge = '⚔️ «Қорғанысты толық меңгерген стратег»';
    titleDescription = 'Шешуші шайқастарда батыл тактикалар қолданып, жаудың шабуылдарына қаймықпай тойтарыс бердіңіз.';
    rankGrade = 'Жақсы / Стратег (B / 80-84%)';
    letterGrade = 'B';
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 animate-in fade-in duration-300">
      
      {/* Victory / Final Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#b38848] bg-gradient-to-b from-[#2e1d0f] via-[#20150b] to-[#120d07] p-6 sm:p-10 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-inner">
          <Trophy className="h-8 w-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#f59e0b]">
          Ойын аяқталды • Академиялық бағалау
        </span>
        
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#fae8b4] tracking-tight">
          {titleBadge}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-[#ebd6b8] leading-relaxed">
          {titleDescription}
        </p>

        {/* Score & Health Highlight */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 border-y border-[#8c6b3e]/30 py-4">
          <div className="text-center">
            <span className="text-xs text-stone-400">Жинаған ұпай:</span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">{gameState.score} ⭐</div>
          </div>
          <div className="h-10 w-px bg-stone-700 hidden sm:block" />
          <div className="text-center">
            <span className="text-xs text-stone-400">Қалған өмір:</span>
            <div className="text-3xl font-extrabold text-red-400 flex items-center justify-center gap-1">
              {Array.from({ length: gameState.playerLives }).map((_, i) => (
                <Heart key={i} className="h-6 w-6 fill-red-500 text-red-500" />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-stone-700 hidden sm:block" />
          <div className="text-center">
            <span className="text-xs text-stone-400">Дәрежесі:</span>
            <div className="text-lg font-bold text-emerald-400">{rankGrade}</div>
          </div>
        </div>

        {/* Final Statistics Breakdown */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="rounded-xl border border-stone-800 bg-[#17110b] p-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>Қорғаныс:</span>
            </div>
            <div className="text-lg font-bold text-blue-400">{gameState.defense}%</div>
          </div>
          <div className="rounded-xl border border-stone-800 bg-[#17110b] p-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              <span>Әскер күші:</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">{gameState.army} жасақ</div>
          </div>
          <div className="rounded-xl border border-stone-800 bg-[#17110b] p-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Wheat className="h-3.5 w-3.5 text-amber-400" />
              <span>Азық сақтығы:</span>
            </div>
            <div className="text-lg font-bold text-amber-400">{gameState.food}%</div>
          </div>
          <div className="rounded-xl border border-stone-800 bg-[#17110b] p-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Coins className="h-3.5 w-3.5 text-yellow-400" />
              <span>Қала қазынасы:</span>
            </div>
            <div className="text-lg font-bold text-yellow-400">{gameState.treasury} динар</div>
          </div>
        </div>

        {/* Educational Historical Summary */}
        <div className="mt-6 rounded-2xl border border-[#8c6b3e]/40 bg-[#1f150d] p-5 text-left text-xs sm:text-sm text-[#ecd9be] leading-relaxed space-y-3">
          <h4 className="font-bold text-[#fae8b4] flex items-center gap-2 text-sm sm:text-base border-b border-[#8c6b3e]/30 pb-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            1-курс студенттеріне арналған Отырар қорғанысының (1219–1220 жж.) тарихи-стратегиялық сараптамасы:
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-stone-800 bg-[#161009] p-3">
              <span className="font-bold text-amber-300 block mb-1">🏔️ Топографиялық және инженерлік артықшылық:</span>
              <p className="text-[11px] sm:text-xs text-stone-300">
                Отырар төрт қақпасының айналасында екі қапталы табиғи тау қыраттарымен, бір жағы Сырдария мен Арыс өзендерімен, тек бір жағы ғана жазық даламен шектесіп, жаудың атты әскерінің жаппай маневр жасауына тосқауыл қойды. Жер асты қыш кәріз құбырлары 6 айлық қоршауда сусыз қалдырмады.
              </p>
            </div>
            
            <div className="rounded-xl border border-stone-800 bg-[#161009] p-3">
              <span className="font-bold text-amber-300 block mb-1">📜 Деректанулық негіздер (Жувейни, Рашид ад-Дин):</span>
              <p className="text-[11px] sm:text-xs text-stone-300">
                Ала ад-Дин Джувейнидің «Тарих-и жаһангушай» және Рашид ад-Диннің «Жамиғ ат-тауарих» еңбектерінде Қайыр ханның теңдессіз ерлігі, моңғолдардың Шағатай мен Үгедей басқарған әскерінің ұзақ тоқтауы және Қараша батырдың опасыздығы егжей-тегжейлі жазылған.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1 text-xs text-stone-300">
            <p>
              1. <strong>6 айлық теңдессіз ерлік:</strong> Орта Азияның көптеген ірі шаһарлары бірнеше аптада тізе бүккенде, Отырар халқы Қайыр хан бастауымен 1219 жылдың күзінен 1220 жылдың көктеміне дейін 6 ай бойы мызғымай қарсы тұрды.
            </p>
            <p>
              2. <strong>Цитадельдегі соңғы айқас:</strong> Сатқындықтан қақпа ашылса да, Қайыр хан соңғы сарбаздарымен ішкі қамалда тағы бір ай бойы тас кірпіштермен соғысып, дүниені дүр сілкіндірді.
            </p>
            <p>
              3. <strong>Тарихи сабақ:</strong> Отырар оқиғасы — отансүйгіштіктің, еркіндік пен туған жерге адалдықтың, сондай-ақ ел ішіндегі ауызбіршіліктің шешуші маңызын айшықтайтын ұлы тарихи белес.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playHorn();
              onRestart();
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-amber-500 shadow-lg shadow-amber-950/50 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>ОЙЫНДЫ ҚАЙТА БАСТАУ</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-stone-700 bg-[#251b12] px-6 py-3.5 text-sm font-semibold text-stone-200 hover:bg-[#322316] active:scale-95 cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>ТАРИХИ МӘЛІМЕТТЕР МЕН СҰРАҚТАРДЫ ҚАРАУ</span>
          </button>
        </div>

      </div>

    </div>
  );
};
