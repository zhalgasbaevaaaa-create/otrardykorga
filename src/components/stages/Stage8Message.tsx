import React, { useState } from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { Scroll, CheckCircle2, XCircle, ArrowRight, BookOpen, Clock } from 'lucide-react';

interface Stage8MessageProps {
  gameState: GameState;
  onComplete: (scoreBonus: number) => void;
  onPenalty: () => void;
}

interface DocOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

const RAW_DOC_OPTIONS: DocOption[] = [
  {
    id: 'samarkand',
    text: 'Самарқаннан келген Хорезмшахтың қалың атты көмек әскері',
    isCorrect: false
  },
  {
    id: 'kariz',
    text: 'Жер асты кәріз жүйесі мен халық бірлігі',
    isCorrect: true
  },
  {
    id: 'river_dam',
    text: 'Сырдария өзенін бөгеп тастаған инженерлік тосқауылдар',
    isCorrect: false
  },
  {
    id: 'mongol_retreat',
    text: 'Моңғолдардың азығы таусылып, қоршауды уақытша тоқтату шешімі',
    isCorrect: false
  }
];

export const Stage8Message: React.FC<Stage8MessageProps> = ({
  gameState,
  onComplete,
  onPenalty
}) => {
  const [options] = useState<DocOption[]>(() => [...RAW_DOC_OPTIONS].sort(() => Math.random() - 0.5));
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const primarySourceText = `«...Отырар қамалының айналасындағы терең орлар мен биік пахса қабырғалар қаланы берік етті. Оның үстіне қаланың жер асты қыш кәріз құбырлары арқылы келетін тұщы су қоймалары және халықтың Қайыр ханға деген адалдығы қорғаныстың алты ай бойы мызғымай тұруына басты тірек болды. Алайда, қоршаудың бесінші айының соңында әскербасы Қараша батыр үрейге бой алдырып, түн жамылып Сопыхана қақпасынан жауға қарай өтіп кетті...»
— Ала ад-Дин Ата-мәлік Джувейни, «Тарих-и жаһангушай»`;

  const handleSubmit = () => {
    if (selectedAnswerId === null || hasSubmitted) return;
    setHasSubmitted(true);

    const chosen = options.find(o => o.id === selectedAnswerId);
    if (chosen?.isCorrect) {
      soundManager.playClick();
      setIsCorrect(true);
    } else {
      soundManager.playDamage();
      setIsCorrect(false);
      onPenalty();
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      onComplete(20);
    } else {
      onComplete(5);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-2xl border-2 border-amber-600/50 bg-[#24170c] p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/40">
            <Scroll className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">8-кезең</span>
              <span className="text-xs text-stone-400">• Тарихи деректану</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
              ҚҰПИЯ ХАБАР: ТАРИХИ ҚҰЖАТТЫ ТАЛДАУ
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#ebd5bd] leading-relaxed">
              XIII ғасыр тарихшысының көне жазбасын мұқият оқып, Отырардың ұзақ төтеп беру себебін анықтаңыз.
            </p>
          </div>
        </div>
      </div>

      {/* Medieval Parchment Scroll Excerpt */}
      <div className="relative rounded-2xl border-2 border-[#b38848] bg-gradient-to-b from-[#2b1f13] to-[#1e150d] p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d97706] mb-3">
          <BookOpen className="h-4 w-4" />
          <span>Көне жылнама үзіндісі:</span>
        </div>
        <blockquote className="rounded-xl border-l-4 border-amber-500 bg-[#161009]/80 p-4 text-xs sm:text-sm italic leading-relaxed text-[#fae8b4]">
          {primarySourceText}
        </blockquote>
      </div>

      {/* Analytical Question */}
      <div className="rounded-2xl border border-stone-800 bg-[#1a140e] p-5 shadow-xl">
        <h3 className="font-bold text-sm sm:text-base text-[#fae8b4] mb-4">
          Сұрақ: Тарихи құжат пен археологиялық деректерге сүйенсек, Отырар қорғанысының 6 айға созылуына әсер еткен ең басты инженерлік және табиғи фактор қайсы?
        </h3>

        <div className="space-y-2.5">
          {options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = selectedAnswerId === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => {
                  if (!hasSubmitted) {
                    soundManager.playClick();
                    setSelectedAnswerId(opt.id);
                  }
                }}
                disabled={hasSubmitted}
                className={`w-full text-left rounded-xl border p-3.5 text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                    : 'border-stone-800 bg-[#251b13] text-stone-300 hover:border-stone-700 hover:bg-[#302318]'
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/40 font-bold text-xs text-amber-300 mt-0.5">
                  {letter}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback banner */}
      {hasSubmitted && (
        <div className="rounded-2xl border border-amber-500/50 bg-[#26170d] p-4 text-xs sm:text-sm leading-relaxed text-[#fae8b4]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Тарихи дереккөзді талдау жауабы қабылданды.</span>
                <p className="text-[11px] text-stone-300 mt-0.5">Нәтиже қорытынды есепке автоматты түрде қосылды.</p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="shrink-0 flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-500 active:scale-95 shadow-md cursor-pointer"
            >
              <span>9-КЕЗЕҢГЕ ӨТУ (СОҢҒЫ ҚОРҒАНЫС)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Submit footer */}
      {!hasSubmitted && (
        <div className="flex items-center justify-between rounded-2xl border border-stone-800 bg-[#16120e] p-4">
          <span className="text-xs text-stone-400">
            Дереккөзді талдап, нұсқаны белгілеңіз.
          </span>
          <button
            onClick={handleSubmit}
            disabled={selectedAnswerId === null}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition active:scale-95 ${
              selectedAnswerId !== null
                ? 'bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-lg shadow-amber-950/40'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>ЖАУАПТЫ БЕКІТУ</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
};
