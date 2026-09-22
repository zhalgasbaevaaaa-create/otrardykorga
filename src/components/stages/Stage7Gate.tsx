import React, { useState, useEffect } from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { ShieldAlert, Clock, CheckCircle2, XCircle, ArrowRight, Zap, Target } from 'lucide-react';

interface Stage7GateProps {
  gameState: GameState;
  onComplete: (impact: { defense: number; army: number; score: number }) => void;
  onPenalty: () => void;
}

interface WeaponOption {
  id: string;
  isCorrect: boolean;
  title: string;
  desc: string;
}

interface BreachOption {
  id: string;
  isCorrect: boolean;
  title: string;
  desc: string;
}

interface TriviaOption {
  id: string;
  isCorrect: boolean;
  title: string;
}

const RAW_WEAPONS: WeaponOption[] = [
  { id: 'w_infantry', isCorrect: false, title: 'Қақпа алдындағы қылышты жауынгерлерді жедел аттандыру', desc: 'Ауыр таранға қарсы жаяу сарбаздарды ашық майданға шығару жоспары.' },
  { id: 'w_oil', isCorrect: true, title: 'Қайнаған қара май мен отты керамикалық құмыраларды құю', desc: 'Таранның ағаш шатырын өртеп, жаудың қақпа бұзғыштарын күйретеді.' },
  { id: 'w_stone', isCorrect: false, title: 'Қабырға үстінен ауыр гранит тастарды төменге лақтыру', desc: 'Таран төбесіндегі темір тақталардан тайып, әсері төмен болуы мүмкін.' }
];

const RAW_BREACHES: BreachOption[] = [
  { id: 'b_garden', isCorrect: false, title: 'Батыс Сырдария жағындағы тыныш бау-бақша қабырғасы', desc: 'Су жағалауы әзірге қауіпсіз, жау әскері бұл бағытта көрінбейді.' },
  { id: 'b_sopykhana', isCorrect: true, title: 'Сопыхана қақпасының сол жақ пахса қабырғасының ойығы', desc: 'Манжанық соққысынан жарылған ең осал және қауіпті қорғаныс шебі.' },
  { id: 'b_citadel', isCorrect: false, title: 'Қаланың ортасында орналасқан ішкі цитадельдің кең ауласы', desc: 'Қорғаныстың соңғы бекінісі, бірақ әзірге тікелей шабуыл ошағы емес.' }
];

const RAW_TRIVIA: TriviaOption[] = [
  { id: 't_oghyz', isCorrect: false, title: 'Сыр бойындағы байырғы оғыз тайпалық бірлестігі' },
  { id: 't_qarluq', isCorrect: false, title: 'Жетісудағы ежелгі қарлұқ қауымдастығының белді өкілі' },
  { id: 't_qipchaq', isCorrect: true, title: 'Дешті Қыпшақ даласының беделді қыпшақ ақсүйектері' },
  { id: 't_uyghur', isCorrect: false, title: 'Шығыс Түркістандағы көне ұйғыр билеушілері әулеті' }
];

export const Stage7Gate: React.FC<Stage7GateProps> = ({
  gameState,
  onComplete,
  onPenalty
}) => {
  const [timeLeft, setTimeLeft] = useState(40);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Shuffled options on mount
  const [weapons] = useState<WeaponOption[]>(() => [...RAW_WEAPONS].sort(() => Math.random() - 0.5));
  const [breaches] = useState<BreachOption[]>(() => [...RAW_BREACHES].sort(() => Math.random() - 0.5));
  const [trivia] = useState<TriviaOption[]>(() => [...RAW_TRIVIA].sort(() => Math.random() - 0.5));

  // Selections
  const [weaponChoice, setWeaponChoice] = useState<string | null>(null);
  const [breachChoice, setBreachChoice] = useState<string | null>(null);
  const [triviaChoice, setTriviaChoice] = useState<string | null>(null);

  const [stepError, setStepError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Blitz countdown
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playDamage();
          setStepError('Уақыт бітті! Қақпа саңылауына жау жақындап үлгерді.');
          onPenalty();
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  // Step 1: Weapon selection
  const handleWeapon = (option: WeaponOption) => {
    if (weaponChoice !== null) return;
    soundManager.playClick();
    setWeaponChoice(option.id);
    if (!option.isCorrect) {
      soundManager.playDamage();
      onPenalty();
    }
    setTimeout(() => {
      setCurrentStep(2);
    }, 500);
  };

  // Step 2: Weak spot identification
  const handleBreach = (option: BreachOption) => {
    if (breachChoice !== null) return;
    soundManager.playClick();
    setBreachChoice(option.id);
    if (!option.isCorrect) {
      soundManager.playDamage();
      onPenalty();
    }
    setTimeout(() => {
      setCurrentStep(3);
    }, 500);
  };

  const [pendingImpact, setPendingImpact] = useState<{ defense: number; army: number; score: number } | null>(null);

  // Step 3: Fast trivia
  const handleTrivia = (option: TriviaOption) => {
    if (triviaChoice !== null) return;
    soundManager.playClick();
    setTriviaChoice(option.id);
    if (option.isCorrect) {
      setPendingImpact({
        defense: Math.min(100, gameState.defense + 15),
        army: Math.max(20, gameState.army - 5),
        score: gameState.score + 25
      });
    } else {
      soundManager.playDamage();
      onPenalty();
      setPendingImpact({
        defense: gameState.defense,
        army: Math.max(20, gameState.army - 10),
        score: gameState.score + 10
      });
    }
    setTimeout(() => {
      setIsFinished(true);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header with Blitz Timer */}
      <div className="rounded-2xl border-2 border-amber-600/50 bg-[#24150b] p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/40">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">7-кезең</span>
                <span className="text-xs text-stone-400">• Жедел блиц-тапсырмалар</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
                ОТЫРАР ҚАҚПАСЫ: ШТУРМҒА ТОЙТАРЫС
              </h2>
            </div>
          </div>

          {/* Blitz Timer */}
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-[#361f10] px-4 py-2 font-mono text-base font-bold text-amber-200 self-start sm:self-auto shadow-md">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Progress Steps Indicators */}
      <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
        <div className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 ${
          currentStep >= 1 ? 'border-amber-500 bg-amber-950/60 text-amber-200' : 'border-stone-800 bg-[#16120e] text-stone-500'
        }`}>
          <span>1. Қару таңдау</span>
          {currentStep > 1 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
        </div>
        <div className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 ${
          currentStep >= 2 ? 'border-amber-500 bg-amber-950/60 text-amber-200' : 'border-stone-800 bg-[#16120e] text-stone-500'
        }`}>
          <span>2. Осал шепті табу</span>
          {currentStep > 2 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
        </div>
        <div className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 ${
          currentStep >= 3 ? 'border-amber-500 bg-amber-950/60 text-amber-200' : 'border-stone-800 bg-[#16120e] text-stone-500'
        }`}>
          <span>3. Тарихи сұрақ</span>
          {isFinished && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
        </div>
      </div>

      {/* ACTIVE STEP CONTENT */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-stone-800 bg-[#1b140e] p-5 shadow-xl">
          <h3 className="font-bold text-base text-[#fae8b4] mb-1 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            1-тапсырма: Ауыр таранмен қақпаны бұзып жатқан жауға қарсы ең тиімді қаруды таңдаңыз:
          </h3>
          <p className="text-xs text-stone-400 mb-4">Жау қақпаның ағаш маңдайшасын соққылауда.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weapons.map(w => {
              const isSelected = weaponChoice === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => handleWeapon(w)}
                  className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                      : 'border-stone-800 bg-[#251b13] hover:border-amber-500 hover:bg-[#332418]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#fae8b4] mb-1">{w.title}</div>
                  <div className="text-xs text-stone-400">{w.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="rounded-2xl border border-stone-800 bg-[#1b140e] p-5 shadow-xl">
          <h3 className="font-bold text-base text-[#fae8b4] mb-1 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-400" />
            2-тапсырма: Қамал қабырғасындағы ең қауіпті саңылауды анықтап, қосымша жасақ бағыттаңыз:
          </h3>
          <p className="text-xs text-stone-400 mb-4">Шұғыл бұйрық беріңіз.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {breaches.map(b => {
              const isSelected = breachChoice === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => handleBreach(b)}
                  className={`rounded-xl border p-4 text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                      : 'border-stone-800 bg-[#251b13] hover:border-amber-500 hover:bg-[#332418]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#fae8b4] mb-1">{b.title}</div>
                  <div className="text-xs text-stone-400">{b.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentStep === 3 && !isFinished && (
        <div className="rounded-2xl border border-stone-800 bg-[#1b140e] p-5 shadow-xl">
          <h3 className="font-bold text-base text-[#fae8b4] mb-1 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            3-тапсырма: Блиц-сұрақ: Отырар билеушісі Қайыр хан қай түркі тайпасынан шыққан?
          </h3>
          <p className="text-xs text-stone-400 mb-4">Тарихи шындықты таңдаңыз:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {trivia.map(t => {
              const isSelected = triviaChoice === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTrivia(t)}
                  className={`rounded-xl border py-3 px-4 text-center font-bold text-sm transition cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                      : 'border-stone-800 bg-[#251b13] text-[#fae8b4] hover:border-amber-500 hover:bg-[#332418]'
                  }`}
                >
                  {t.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="rounded-2xl border border-amber-500/50 bg-[#26170d] p-4 text-xs sm:text-sm text-[#fae8b4]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-bold">Блиц-тапсырмалар қабылданды!</p>
              <p className="text-[11px] text-stone-300 mt-0.5">Қақпа қорғанысының нәтижесі қорытынды есепке автоматты түрде қосылды.</p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                if (pendingImpact) {
                  onComplete(pendingImpact);
                } else {
                  onComplete({
                    defense: gameState.defense,
                    army: gameState.army,
                    score: gameState.score + 10
                  });
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-500 active:scale-95 shadow-md cursor-pointer"
            >
              <span>8-КЕЗЕҢГЕ ӨТУ (ҚҰПИЯ ХАБАР)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
