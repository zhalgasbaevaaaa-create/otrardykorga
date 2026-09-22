import React, { useState } from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { GAME_IMAGES } from '../../assets/images';
import { 
  Wheat, 
  Droplets, 
  Flame, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Search,
  Hammer
} from 'lucide-react';

interface Stage4ProvisionsProps {
  gameState: GameState;
  onComplete: (impact: { food: number; army: number; defense: number; treasury: number; score: number }) => void;
  onPenalty: () => void;
}

export const Stage4Provisions: React.FC<Stage4ProvisionsProps> = ({
  gameState,
  onComplete,
  onPenalty
}) => {
  // Tabs for the inner city modules
  const [subStep, setSubStep] = useState<'provisions' | 'kyariz_puzzle' | 'artisans' | 'counter_spy'>('provisions');

  // Step 1: Provisions choice (options re-ordered so optimal is NOT index 0)
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Step 2: Kyariz Water Network Sluice Levers (Values 1 to 5)
  // Target: Total incoming flow = 10 units. Optimal: Citadel = 4, Shahristan = 4, Moat = 2
  const [citadelSluice, setCitadelSluice] = useState<number>(3);
  const [shahristanSluice, setShahristanSluice] = useState<number>(3);
  const [moatSluice, setMoatSluice] = useState<number>(4);
  const [kyarizSolved, setKyarizSolved] = useState<boolean | null>(null);

  // Step 3: Artisans production choice
  const [artisanFocus, setArtisanFocus] = useState<'flame_pots' | 'armor_arrows' | 'parapet_stones' | null>(null);

  // Step 4: Espionage deduction
  // Guard 1: "Мен түн ортасында Шығыс қақпада болдым, ешқандай жарық көрмедім."
  // Guard 2: "Солтүстік қақпада Қараша батырдың жасақшысы Сүлеймен қол шаммен далаға 3 рет белгі бергенін байқадым."
  // Guard 3: "Батыс қабырғадағы қарауыл су арнасын тексеріп, барлығы тыныш екенін айтты."
  // Correct suspect: Guard 2's target (Сүлеймен / Қарашаның жасақшысы)
  const [selectedSuspect, setSelectedSuspect] = useState<number | null>(null);
  const [spySolved, setSpySolved] = useState<boolean | null>(null);

  const [hasFinalized, setHasFinalized] = useState(false);

  // Balanced provisions strategies with nuanced historical trade-offs (Randomized)
  const [plans] = useState(() => [
    {
      id: 0,
      title: 'А. Гарнизон мен әскерге басымдық беру',
      tag: 'Әскери бағыт',
      desc: 'Қала қабырғасын қорғап тұрған 10 000 сарбазға мол азық беріп, бейбіт тұрғындардың үлесін 40%-ға азайту.',
      pros: 'Әскер күші сақталады, бірақ халық аштықтан әлсіреп, ішкі бүлік қаупі артады.',
      effect: '+10 Әскер, -10 Азық, -5% Халық көңіл-күйі'
    },
    {
      id: 1,
      title: 'В. Қорларды еркін тарату және нарықты ашық ұстау',
      tag: 'Нарықтық бөлініс',
      desc: 'Халық дүрлікпесін деп барлық жерасты астық шұңқырларын ашып, нарықтағы бағаны бақылаусыз қалдыру.',
      pros: 'Алғашқы апталарда халық тыныш, алайда 2 айдан кейін азық қоры толық сарқылады.',
      effect: '-25 Азық шығыны, -10 Қазына, -1 Өмір'
    },
    {
      id: 2,
      title: 'С. Теңгерімді нормалау және тұрғындар мен әскерге ортақ карточка енгізу',
      tag: 'Орталықтанған тәртіп',
      desc: 'Қайыр ханның жарлығымен қаланың барлық қамбалары мен наубайханаларын мемлекеттік есепке алу. Сарбаздарға жауынгерлік, тұрғындарға тіршілік нормасы кепілдендіріледі.',
      pros: 'Азық 6 айға еркін жетеді, халықтың қамалды қорғауға деген сенімі мен ынтымағы нығаяды.',
      effect: '+20 Азық сақтығы, +10% Қорғаныс, +20 Ұпай'
    },
    {
      id: 3,
      title: 'D. Бай саудагерлердің қорын күшпен тартып алу',
      tag: 'Төтенше шара',
      desc: 'Керуен сарайлардағы бай көпестердің дәнді-дақылдарын мемлекет меншігіне тәркілеп, қазынаны үнемдеу.',
      pros: 'Қысқа мерзімде азық көбейеді, бірақ саудагерлер мен билер арасында жасырын наразылық туады.',
      effect: '+10 Азық, -15 Қазына беделі, +5 Ұпай'
    }
  ].sort(() => Math.random() - 0.5));

  // Kyariz check
  const handleVerifyKyariz = () => {
    soundManager.playClick();
    const total = citadelSluice + shahristanSluice + moatSluice;
    // Condition: Citadel must be at least 4, Shahristan at least 3, Moat at least 2, and total must equal 10
    if (total === 10 && citadelSluice >= 4 && shahristanSluice >= 3 && moatSluice >= 2) {
      soundManager.playClick();
      setKyarizSolved(true);
    } else {
      soundManager.playDamage();
      setKyarizSolved(false);
      onPenalty();
    }
  };

  // Espionage suspect selection
  const handleSelectSuspect = (idx: number) => {
    if (spySolved !== null) return;
    soundManager.playClick();
    setSelectedSuspect(idx);
    
    // Suspect 1 is the traitor (Сүлеймен - Қараша батырдың құпия нұсқауын орындаушы)
    if (idx === 1) {
      soundManager.playClick();
      setSpySolved(true);
    } else {
      soundManager.playDamage();
      setSpySolved(false);
      onPenalty();
    }
  };

  // Final confirmation
  const handleFinalSubmit = () => {
    if (selectedPlan === null) return;
    setHasFinalized(true);

    let foodDelta = 10;
    let defDelta = 5;
    let armyDelta = 0;
    let scoreDelta = 15;

    if (selectedPlan === 2) {
      // Optimal plan
      foodDelta = 20;
      defDelta = 10;
      scoreDelta = 25;
    } else if (selectedPlan === 0) {
      foodDelta = -10;
      armyDelta = 10;
      defDelta = -5;
      scoreDelta = 10;
    } else if (selectedPlan === 1) {
      foodDelta = -25;
      defDelta = -10;
      scoreDelta = 5;
      onPenalty();
    } else {
      foodDelta = 10;
      defDelta = 5;
      scoreDelta = 15;
    }

    if (kyarizSolved) {
      foodDelta += 10;
      defDelta += 5;
      scoreDelta += 15;
    }

    if (artisanFocus === 'flame_pots') {
      defDelta += 10;
      scoreDelta += 10;
    } else if (artisanFocus === 'armor_arrows') {
      armyDelta += 10;
      scoreDelta += 10;
    }

    if (spySolved) {
      defDelta += 10;
      scoreDelta += 20;
    }

    soundManager.playSuccess();
    onComplete({
      food: Math.min(100, Math.max(10, gameState.food + foodDelta)),
      defense: Math.min(100, Math.max(10, gameState.defense + defDelta)),
      army: Math.min(100, Math.max(10, gameState.army + armyDelta)),
      treasury: gameState.treasury,
      score: gameState.score + scoreDelta
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header with City Life Atmospheric Hero */}
      <div className="rounded-2xl border-2 border-amber-600/50 bg-[#24170d] p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 z-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/40 shadow-inner">
              <Wheat className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">4-кезең</span>
                <span className="text-xs text-stone-400">• Ішкі қала өмірі және тыл стратегиясы</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
                ОТЫРАРДЫҢ ТЫЛЫ: АЗЫҚ, СУ ЖӘНЕ ҚАУІПСІЗДІК
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#ebd8bf] leading-relaxed max-w-2xl">
                «6 айлық қоршау тек қабырғадағы садақ атумен шектелмейді. Қаланың жерасты кәріз су жүйесі, қыш ұстаханалары мен астық қоймалары толық бақылауда болуы қажет!»
              </p>
            </div>
          </div>
        </div>

        {/* Inner City Life Illustration Visual */}
        <div className="mt-4 rounded-xl overflow-hidden border border-amber-800/60 shadow-lg relative max-h-48 group">
          <img 
            src={GAME_IMAGES.innerCity} 
            alt="Отырар қаласының ішкі өмірі"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover filter brightness-95 contrast-105 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161009] via-transparent to-transparent"></div>
          <div className="absolute bottom-2.5 left-3 bg-black/75 px-3 py-1 rounded-lg border border-amber-600/50 text-[11px] text-amber-200 backdrop-blur-md">
            🏛️ <strong>Отырар шахристаны:</strong> Базар алаңы, кәріз құдықтары және қолөнершілер шеберханасы (1219 ж.)
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setSubStep('provisions');
          }}
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition border ${
            subStep === 'provisions'
              ? 'border-amber-500 bg-amber-950/80 text-amber-200 shadow-md'
              : 'border-stone-800 bg-[#1a130d] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Wheat className="h-4 w-4 text-amber-400" />
          <span>1. Азық нормасы {selectedPlan !== null && '✓'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setSubStep('kyariz_puzzle');
          }}
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition border ${
            subStep === 'kyariz_puzzle'
              ? 'border-sky-500 bg-sky-950/80 text-sky-200 shadow-md'
              : 'border-stone-800 bg-[#1a130d] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Droplets className="h-4 w-4 text-sky-400" />
          <span>2. Кәріз су жұмбағы {kyarizSolved && '✓'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setSubStep('artisans');
          }}
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition border ${
            subStep === 'artisans'
              ? 'border-orange-500 bg-orange-950/80 text-orange-200 shadow-md'
              : 'border-stone-800 bg-[#1a130d] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Hammer className="h-4 w-4 text-orange-400" />
          <span>3. «Отырар оты» {artisanFocus !== null && '✓'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setSubStep('counter_spy');
          }}
          className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition border ${
            subStep === 'counter_spy'
              ? 'border-red-500 bg-red-950/80 text-red-200 shadow-md'
              : 'border-stone-800 bg-[#1a130d] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Search className="h-4 w-4 text-red-400" />
          <span>4. Сатқынды әшкерелеу {spySolved && '✓'}</span>
        </button>
      </div>

      {/* SUBSTEP 1: PROVISIONS STRATEGY */}
      {subStep === 'provisions' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="rounded-xl bg-[#1c140e] border border-amber-900/50 p-3 text-xs text-[#ebd8bf]">
            💡 <strong className="text-amber-300">Тарихи міндет:</strong> Отырарда 6 айға жететін астық қорын қалай үлестіресіз? Ұқсас нұсқалардың ішінен қаланың төзімділігін максималды сақтайтын шешімді таңдаңыз.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedPlan(plan.id);
                  }}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-[#2d1e11] shadow-lg shadow-amber-950/40 scale-[1.01]'
                      : 'border-stone-800 bg-[#1b140e] hover:border-stone-700 hover:bg-[#241a12]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-stone-300 border border-stone-700">
                        {plan.tag}
                      </span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />}
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-[#fae8b4]">{plan.title}</h4>
                    <p className="text-xs text-stone-300 leading-relaxed mt-1 mb-3">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="border-t border-stone-800/80 pt-2 text-xs flex flex-col gap-1">
                    <span className="text-stone-400 italic">{plan.pros}</span>
                    <span className="font-semibold text-amber-300">{plan.effect}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setSubStep('kyariz_puzzle');
              }}
              disabled={selectedPlan === null}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-500 cursor-pointer"
            >
              <span>КЕЛЕСІ: КӘРІЗ СУ ЖҮЙЕСІ ЖҰМБАҒЫ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUBSTEP 2: KYARIZ LOGIC PUZZLE */}
      {subStep === 'kyariz_puzzle' && (
        <div className="rounded-2xl border border-sky-800/50 bg-[#101923] p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Droplets className="h-5 w-5 text-sky-400" />
            <h3 className="font-bold text-lg text-sky-200">
              ЛОГИКАЛЫҚ ЖҰМБАҚ: ЖЕРАСТЫ КӘРІЗ СУ ШЛЮЗДЕРІН ТЕҢГЕРУ
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Арыс өзенінен Отырарға құпия жер асты қыш құбырлары (кәріздер) арқылы келетін судың жалпы көлемі — <strong>10 бірлік</strong>. 
            Қаланың қауіпсіздігі үшін су мына ереже бойынша бөлінуі тиіс:
          </p>

          <div className="rounded-xl bg-sky-950/40 border border-sky-800/40 p-3 text-xs text-sky-300 space-y-1">
            <div>1. <strong>Цитадель хауызына</strong> кем дегенде <strong>4 бірлік</strong> (әскердің бас су көзі).</div>
            <div>2. <strong>Шахристан хауызына</strong> кем дегенде <strong>3 бірлік</strong> (тұрғындар мен өрт сөндіру үшін).</div>
            <div>3. <strong>Қорғаныс орының арнасына</strong> кем дегенде <strong>2 бірлік</strong> (жау қабырғаға саты қоя алмауы үшін).</div>
            <div>4. Үш арнаның қосындысы <strong>дәл 10 бірлік</strong> болуы шарт! (Артық кетсе жер асты қамбаларын су басады, кем болса қала шөлдейді).</div>
          </div>

          {/* Sluice Sliders / Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-sky-900/60 bg-[#162230] p-4 text-center">
              <span className="text-xs text-stone-400 font-semibold uppercase">Цитадель су хауызы</span>
              <div className="text-3xl font-black text-sky-300 my-2">{citadelSluice} бірлік</div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={citadelSluice} 
                onChange={(e) => setCitadelSluice(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Талап: кемі 4 бірлік</span>
            </div>

            <div className="rounded-xl border border-sky-900/60 bg-[#162230] p-4 text-center">
              <span className="text-xs text-stone-400 font-semibold uppercase">Шахристан (Халық суы)</span>
              <div className="text-3xl font-black text-sky-300 my-2">{shahristanSluice} бірлік</div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={shahristanSluice} 
                onChange={(e) => setShahristanSluice(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Талап: кемі 3 бірлік</span>
            </div>

            <div className="rounded-xl border border-sky-900/60 bg-[#162230] p-4 text-center">
              <span className="text-xs text-stone-400 font-semibold uppercase">Қорғаныс орының арнасы</span>
              <div className="text-3xl font-black text-sky-300 my-2">{moatSluice} бірлік</div>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={moatSluice} 
                onChange={(e) => setMoatSluice(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Талап: кемі 2 бірлік</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-sky-900/50 pt-3">
            <div className="text-xs">
              Жалпы бөлінген су: <strong className={citadelSluice + shahristanSluice + moatSluice === 10 ? 'text-emerald-400' : 'text-red-400'}>
                {citadelSluice + shahristanSluice + moatSluice} / 10
              </strong>
            </div>

            <button
              onClick={handleVerifyKyariz}
              className="rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 text-xs font-bold transition shadow cursor-pointer"
            >
              ШЛЮЗДЕРДІ ТЕКСЕРУ
            </button>
          </div>

          {kyarizSolved !== null && (
            <div className="p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-500/50 bg-[#26170d] text-[#fae8b4] animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Кәріз су жүйесінің параметрі бекітілді.</span>
                <p className="text-[11px] text-stone-300 font-normal mt-0.5">Нәтиже қорытынды есепке автоматты түрде қосылды.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setSubStep('artisans');
              }}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-sky-500 cursor-pointer"
            >
              <span>КЕЛЕСІ: «ОТЫРАР ОТЫ» ЖӘНЕ ҚАРУ ӨНДІРІСІ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUBSTEP 3: ARTISANS PRODUCTION */}
      {subStep === 'artisans' && (
        <div className="rounded-2xl border border-orange-800/50 bg-[#1f140b] p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Hammer className="h-5 w-5 text-orange-400" />
            <h3 className="font-bold text-lg text-orange-200">
              ҚЫШ ПЕН ТЕМІР ҰСТАХАНАЛАРЫ: ҚАУІПТІ ҚАРУ ӨНДІРІСІ
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Отырардың қыш шеберлері әлемде теңдессіз керамикалық құмыралар жасайтын. Соғыс кезінде олар нафта мен күкірт толтырылған, жарылғыш <strong>«Отырар оты»</strong> құмыраларын жасап, манжанықтарға қарсы қолданған. Шеберханалардың негізгі күшін қай бағытқа жұмылдырасыз?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => {
                soundManager.playClick();
                setArtisanFocus('flame_pots');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                artisanFocus === 'flame_pots'
                  ? 'border-orange-500 bg-orange-950/60 shadow-lg'
                  : 'border-stone-800 bg-[#161009] hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Flame className="h-5 w-5 text-orange-400" />
                {artisanFocus === 'flame_pots' && <CheckCircle2 className="h-4 w-4 text-orange-400" />}
              </div>
              <h4 className="font-bold text-sm text-[#fae8b4]">1. «Отырар оты» құмыралары</h4>
              <p className="text-xs text-stone-300 mt-1">
                Моңғолдардың ағаш қамал бұзғыштары мен манжанықтарын қашықтан өртеуге арналған жарылғыш керамикалық отты құмыралар.
              </p>
              <span className="text-[11px] font-semibold text-orange-300 block mt-2">+10% Қорғаныс өрті</span>
            </div>

            <div
              onClick={() => {
                soundManager.playClick();
                setArtisanFocus('armor_arrows');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                artisanFocus === 'armor_arrows'
                  ? 'border-orange-500 bg-orange-950/60 shadow-lg'
                  : 'border-stone-800 bg-[#161009] hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                {artisanFocus === 'armor_arrows' && <CheckCircle2 className="h-4 w-4 text-orange-400" />}
              </div>
              <h4 className="font-bold text-sm text-[#fae8b4]">2. Сауыт бұзар жебелер</h4>
              <p className="text-xs text-stone-300 mt-1">
                Шыңғыс ханның темір сауытты нөкерлері мен атты әскерінің сауытын тесетін қырлы болат жебелер соғу.
              </p>
              <span className="text-[11px] font-semibold text-amber-300 block mt-2">+10 Әскер соққысы</span>
            </div>

            <div
              onClick={() => {
                soundManager.playClick();
                setArtisanFocus('parapet_stones');
              }}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                artisanFocus === 'parapet_stones'
                  ? 'border-orange-500 bg-orange-950/60 shadow-lg'
                  : 'border-stone-800 bg-[#161009] hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Layers className="h-5 w-5 text-emerald-400" />
                {artisanFocus === 'parapet_stones' && <CheckCircle2 className="h-4 w-4 text-orange-400" />}
              </div>
              <h4 className="font-bold text-sm text-[#fae8b4]">3. Қамал кірпіштері мен қалқандар</h4>
              <p className="text-xs text-stone-300 mt-1">
                Манжанық соққысынан қираған қабырға саңылауларын тез бітейтін күйдірілген қыш пахса блоктарын жасау.
              </p>
              <span className="text-[11px] font-semibold text-emerald-300 block mt-2">+5% Қамал беріктігі</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setSubStep('counter_spy');
              }}
              disabled={artisanFocus === null}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-orange-500 disabled:bg-stone-800 disabled:text-stone-500 cursor-pointer"
            >
              <span>КЕЛЕСІ: САЛТ БҰЗҒАН ТЫҢШЫНЫ ТЕРГЕУ</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUBSTEP 4: COUNTER-ESPIONAGE DEDUCTION PUZZLE */}
      {subStep === 'counter_spy' && (
        <div className="rounded-2xl border border-red-800/50 bg-[#211111] p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Search className="h-5 w-5 text-red-400" />
            <h3 className="font-bold text-lg text-red-200">
              МИҒА ШАБУЫЛ ЖӘНЕ ДЕДУКЦИЯ: ҚАМАЛДАҒЫ ТЫҢШЫНЫ ӘШКЕРЕЛЕУ
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Түн ортасында күзетшілердің бірі Солтүстік қақпа мұнарасынан моңғол ордасына қарай құпия от белгісін бергені анықталды. Төмендегі 3 қарауылдың айғақтарын сараптап, <strong>сатқындықты кім ұйымдастырғанын</strong> табыңыз:
          </p>

          <div className="space-y-3">
            <div
              onClick={() => handleSelectSuspect(0)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                selectedSuspect === 0
                  ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400'
                  : 'border-stone-800 bg-[#160d0d] hover:border-stone-700'
              }`}
            >
              <strong className="text-xs text-amber-300">1-айғақ: Шығыс қақпа қарауылы Әділ:</strong>
              <p className="text-xs text-stone-300 mt-1">
                «Мен түнде күзетте тұрдым. Сағат үш шамасында Солтүстік қақпа жақтан қызыл оттың 3 рет тұтанғанын көрдім. Бірақ өз бекетімнен табан аударғаным жоқ».
              </p>
            </div>

            <div
              onClick={() => handleSelectSuspect(1)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                selectedSuspect === 1
                  ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400'
                  : 'border-stone-800 bg-[#160d0d] hover:border-stone-700'
              }`}
            >
              <strong className="text-xs text-amber-300">2-айғақ: Қараша батырдың жасақшысы Сүлеймен:</strong>
              <p className="text-xs text-stone-300 mt-1">
                «Мен түнде қақпаның кілтін майлап жүрдім. Қолымдағы факел байқаусызда желден сөніп, қайта жанды. Мен ешкіммен хабарласқан жоқпын, батырым Қарашаның бұйрығымен түнде қақпаға бардым».
              </p>
            </div>

            <div
              onClick={() => handleSelectSuspect(2)}
              className={`p-3.5 rounded-xl border cursor-pointer transition ${
                selectedSuspect === 2
                  ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400'
                  : 'border-stone-800 bg-[#160d0d] hover:border-stone-700'
              }`}
            >
              <strong className="text-xs text-amber-300">3-айғақ: Базар алаңының күзетшісі Мұрат:</strong>
              <p className="text-xs text-stone-300 mt-1">
                «Мен түнде астық қоймасын күзеттім. Қоймада ешқандай бөтен адам болған жоқ, барлық мөрлер бүтін».
              </p>
            </div>
          </div>

          {spySolved !== null && (
            <div className="p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-500/50 bg-[#26170d] text-[#fae8b4] animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold">Күдікті анықталып, тергеу жауабы қабылданды.</span>
                <p className="text-[11px] text-stone-300 font-normal mt-0.5">Нәтиже қорытынды есепке автоматты түрде қосылды.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINAL CONFIRMATION & ADVANCE BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-stone-800 bg-[#16120e] p-4 shadow-xl">
        <div className="text-xs text-stone-400">
          {selectedPlan !== null ? (
            <span>
              Азық: <strong className="text-amber-300">{plans[selectedPlan].title.slice(0, 20)}...</strong> • 
              Кәріз: <strong className={kyarizSolved ? 'text-emerald-400' : 'text-stone-400'}>{kyarizSolved ? 'Теңгерілді' : 'Күтуде'}</strong> • 
              Тыңшы: <strong className={spySolved ? 'text-emerald-400' : 'text-stone-400'}>{spySolved ? 'Әшкереленді' : 'Күтуде'}</strong>
            </span>
          ) : (
            '1-бөлімнен азық стратегиясын таңдаңыз.'
          )}
        </div>

        <button
          onClick={handleFinalSubmit}
          disabled={selectedPlan === null || hasFinalized}
          className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold transition active:scale-95 shrink-0 ${
            selectedPlan !== null && !hasFinalized
              ? 'bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-lg shadow-amber-950/40'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          <span>ІШКІ ҚАЛА СТРАТЕГИЯСЫН БЕКІТУ (5-КЕЗЕҢГЕ ӨТУ)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};

