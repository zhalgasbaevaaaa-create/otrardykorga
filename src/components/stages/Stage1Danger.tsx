import React, { useState } from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { Shield, Users, Wheat, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Stage1DangerProps {
  gameState: GameState;
  onComplete: (impact: { defense: number; food: number; army: number; treasury: number; score: number }) => void;
  onPenalty: () => void;
}

interface ChoiceOption {
  id: string;
  title: string;
  desc: string;
  deltaDefense: number;
  deltaFood: number;
  deltaArmy: number;
  deltaTreasury: number;
  deltaScore: number;
}

const RAW_GATE_OPTIONS: ChoiceOption[] = [
  {
    id: 'gate_wood',
    title: 'Қақпаны қарапайым ағаш тіреуіштермен бекіту әдісі',
    desc: 'Шығыны аз, бірақ ауыр соққыға төзімсіз',
    deltaDefense: 4,
    deltaFood: 0,
    deltaArmy: 0,
    deltaTreasury: -2,
    deltaScore: 0
  },
  {
    id: 'gate_iron',
    title: 'Темір құрсаулар, пахса қабаты және сулы ор',
    desc: 'Қазына қаржысын талап ететін кешенді қорғаныс',
    deltaDefense: 18,
    deltaFood: 0,
    deltaArmy: 0,
    deltaTreasury: -10,
    deltaScore: 10
  },
  {
    id: 'gate_stone',
    title: 'Қақпа маңын таспен бітеп, шығуды толық жабу',
    desc: 'Берік қамал, бірақ қарсы шабуылға мүмкіндік жоқ',
    deltaDefense: 12,
    deltaFood: 0,
    deltaArmy: -5,
    deltaTreasury: 0,
    deltaScore: 5
  }
];

const RAW_SCOUT_OPTIONS: ChoiceOption[] = [
  {
    id: 'scout_gate_only',
    title: 'Тек қақпа маңындағы күшейтілген күзет тобын қою',
    desc: 'Қала іші қауіпсіз, алайда сыртқы ақпарат шектеулі',
    deltaDefense: 3,
    deltaFood: 0,
    deltaArmy: 0,
    deltaTreasury: 0,
    deltaScore: 0
  },
  {
    id: 'scout_optimal',
    title: 'Мұнараларға мергендер, Сыр мен Арысқа арнайы жасақ',
    desc: 'Жан-жақты барлау жүргізіп, сарбаздарды тиімді бөлу',
    deltaDefense: 12,
    deltaFood: 0,
    deltaArmy: -5,
    deltaTreasury: 0,
    deltaScore: 10
  },
  {
    id: 'scout_steppe_charge',
    title: 'Далаға жаппай шығып ашық жерде тосқауыл қою',
    desc: 'Тұтқиыл соққы жасауға талпыныс, бірақ тәуекелі жоғары',
    deltaDefense: -5,
    deltaFood: 0,
    deltaArmy: -15,
    deltaTreasury: 0,
    deltaScore: 0
  }
];

const RAW_FOOD_OPTIONS: ChoiceOption[] = [
  {
    id: 'food_free',
    title: 'Қоймаларды ашық ұстап, қала халқына еркін тарату',
    desc: 'Халық көңілін табу, алайда астық тез таусылады',
    deltaDefense: 0,
    deltaFood: -10,
    deltaArmy: 0,
    deltaTreasury: 0,
    deltaScore: 0
  },
  {
    id: 'food_confiscate',
    title: 'Саудагерлер қорын күштеп мемлекет пайдасына тартып алу',
    desc: 'Қорды уақытша толықтыру, бірақ көпестер наразылығын тудыру',
    deltaDefense: 0,
    deltaFood: 8,
    deltaArmy: 0,
    deltaTreasury: -10,
    deltaScore: 3
  },
  {
    id: 'food_optimal',
    title: 'Қамбаларды мемлекеттік есепке алу, кәріз құдықтарын тазалау',
    desc: 'Тәртіп пен қатаң норма енгізіп, су көздерін қорғау',
    deltaDefense: 0,
    deltaFood: 15,
    deltaArmy: 0,
    deltaTreasury: 0,
    deltaScore: 10
  }
];

export const Stage1Danger: React.FC<Stage1DangerProps> = ({ gameState, onComplete, onPenalty }) => {
  // Randomize option order on mount so correct choice is never in a fixed position
  const [gateOptions] = useState<ChoiceOption[]>(() => [...RAW_GATE_OPTIONS].sort(() => Math.random() - 0.5));
  const [scoutOptions] = useState<ChoiceOption[]>(() => [...RAW_SCOUT_OPTIONS].sort(() => Math.random() - 0.5));
  const [foodOptions] = useState<ChoiceOption[]>(() => [...RAW_FOOD_OPTIONS].sort(() => Math.random() - 0.5));

  const [gateChoice, setGateChoice] = useState<string | null>(null);
  const [scoutChoice, setScoutChoice] = useState<string | null>(null);
  const [foodChoice, setFoodChoice] = useState<string | null>(null);

  const canProceed = gateChoice !== null && scoutChoice !== null && foodChoice !== null;

  const handleSubmit = () => {
    if (!canProceed) return;

    const selectedGate = gateOptions.find(o => o.id === gateChoice);
    const selectedScout = scoutOptions.find(o => o.id === scoutChoice);
    const selectedFood = foodOptions.find(o => o.id === foodChoice);

    const deltaDefense = (selectedGate?.deltaDefense || 0) + (selectedScout?.deltaDefense || 0) + (selectedFood?.deltaDefense || 0);
    const deltaFood = (selectedGate?.deltaFood || 0) + (selectedScout?.deltaFood || 0) + (selectedFood?.deltaFood || 0);
    const deltaArmy = (selectedGate?.deltaArmy || 0) + (selectedScout?.deltaArmy || 0) + (selectedFood?.deltaArmy || 0);
    const deltaTreasury = (selectedGate?.deltaTreasury || 0) + (selectedScout?.deltaTreasury || 0) + (selectedFood?.deltaTreasury || 0);
    const deltaScore = 15 + (selectedGate?.deltaScore || 0) + (selectedScout?.deltaScore || 0) + (selectedFood?.deltaScore || 0);

    // If student chose any heavily flawed strategy, apply penalty
    const hasHarmfulChoice = (selectedGate?.deltaScore || 0) < 5 || (selectedScout?.deltaScore || 0) < 5 || (selectedFood?.deltaScore || 0) < 5;
    if (hasHarmfulChoice) {
      soundManager.playDamage();
      onPenalty();
    } else {
      soundManager.playClick();
    }

    onComplete({
      defense: Math.min(100, gameState.defense + deltaDefense),
      food: Math.min(100, gameState.food + deltaFood),
      army: Math.max(20, gameState.army + deltaArmy),
      treasury: Math.max(10, gameState.treasury + deltaTreasury),
      score: gameState.score + deltaScore
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 animate-in fade-in duration-300">
      
      {/* Stage Header Banner */}
      <div className="rounded-2xl border-2 border-amber-600/60 bg-gradient-to-r from-[#29170a] via-[#1f140a] to-[#29170a] p-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/40">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">1-кезең</span>
              <span className="text-xs text-stone-400">• Бастапқы шешімдер</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
              ҚАУІП: ҚАЛА ҚОРҒАНЫСЫН ҰЙЫМДАСТЫРУ
            </h2>
            <p className="mt-1 text-sm text-[#ebd9bf] leading-relaxed italic">
              «Хабаршы ат үстінен түспестен айғайлады: Шығыс көкжиектен мыңдаған моңғол атты әскерінің шаңы көрінді! Қолбасшы, қаланы дереу қоршауға әзірлеңіз!»
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Interactive Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Қақпаны күшейту */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#8c6b3e]/40 bg-[#1b140d]/90 p-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#fae8b4] mb-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span>1. Қақпаны күшейту</span>
            </div>
            <p className="text-xs text-stone-300 mb-3">
              Қаланың басты Дәруазасы мен Солтүстік Сопыхана қақпасын қалай бекітесіз?
            </p>

            <div className="space-y-2">
              {gateOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundManager.playClick();
                    setGateChoice(opt.id);
                  }}
                  className={`w-full text-left rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                    gateChoice === opt.id
                      ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-md shadow-amber-950/40'
                      : 'border-stone-800 bg-[#241a11] text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="font-semibold text-amber-200">{opt.title}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {gateChoice !== null && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Таңдалды</span>
            </div>
          )}
        </div>

        {/* 2. Күзетшілерді орналастыру */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#8c6b3e]/40 bg-[#1b140d]/90 p-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#fae8b4] mb-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>2. Күзет пен шолғыншы</span>
            </div>
            <p className="text-xs text-stone-300 mb-3">
              Қала мұнаралары мен дала шолғыншыларын қалай орналастырасыз?
            </p>

            <div className="space-y-2">
              {scoutOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundManager.playClick();
                    setScoutChoice(opt.id);
                  }}
                  className={`w-full text-left rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                    scoutChoice === opt.id
                      ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-md shadow-amber-950/40'
                      : 'border-stone-800 bg-[#241a11] text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="font-semibold text-amber-200">{opt.title}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {scoutChoice !== null && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Таңдалды</span>
            </div>
          )}
        </div>

        {/* 3. Азық пен су қоры */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#8c6b3e]/40 bg-[#1b140d]/90 p-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#fae8b4] mb-2">
              <Wheat className="h-4 w-4 text-amber-400" />
              <span>3. Азық пен су қоры</span>
            </div>
            <p className="text-xs text-stone-300 mb-3">
              Қоршау ұзаққа созылуы мүмкін. Астық пен кәріз суларын қалай дайындайсыз?
            </p>

            <div className="space-y-2">
              {foodOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    soundManager.playClick();
                    setFoodChoice(opt.id);
                  }}
                  className={`w-full text-left rounded-xl border p-2.5 text-xs transition cursor-pointer ${
                    foodChoice === opt.id
                      ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-md shadow-amber-950/40'
                      : 'border-stone-800 bg-[#241a11] text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="font-semibold text-amber-200">{opt.title}</div>
                  <div className="text-[11px] text-stone-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {foodChoice !== null && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Таңдалды</span>
            </div>
          )}
        </div>

      </div>

      {/* Submit / Proceed Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#8c6b3e]/40 bg-[#16120e] p-4">
        <span className="text-xs text-stone-400">
          {canProceed
            ? '✅ Барлық 3 бастапқы бұйрық бекітілді. Әскер бұйрықты орындауға кірісті!'
            : '⚠️ 2-кезеңге өту үшін жоғарыдағы барлық 3 бөлімнен шешім таңдаңыз.'}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition active:scale-95 ${
            canProceed
              ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-900/40 cursor-pointer'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          <span>ШЕШІМДІ БЕКІТУ ЖӘНЕ 2-КЕЗЕҢГЕ ӨТУ</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
