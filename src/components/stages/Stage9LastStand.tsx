import React, { useState } from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { Shield, Castle, Swords, Flame, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Stage9LastStandProps {
  gameState: GameState;
  onComplete: (scoreBonus: number) => void;
  onPenalty: () => void;
}

interface LastStandOption {
  id: string;
  title: string;
  desc: string;
  bonus: number;
}

const RAW_GATE_OPTIONS: LastStandOption[] = [
  {
    id: 'gate_partial',
    title: 'Ағаш тосқауылдармен қақпаны жартылай бекітіп қорғау әдісі',
    desc: 'Қарсы соққыға мүмкіндік бар, бірақ ауыр таранға шыдамайды',
    bonus: 5
  },
  {
    id: 'gate_stone_wall',
    title: 'Қамал қақпасын ішінен қыш-таспен тұтас қалап тастау',
    desc: 'Цитадельді ашылмас монолитке айналдырып, қарсылықты ұзақ созу тәсілі',
    bonus: 14
  },
  {
    id: 'gate_open_corridor',
    title: 'Қақпаны жаппай, дәлізге жаяу сарбаздарды сапқа тұрғызу',
    desc: 'Жау сан басымдығымен тар өткелге басып кіреді',
    bonus: 2
  }
];

const RAW_GARRISON_OPTIONS: LastStandOption[] = [
  {
    id: 'garr_basement',
    title: 'Төменгі жертөлелер мен азық қоймаларына тығылып отыру',
    desc: 'Қорғаныс жігері әлсіреп, әскери бастама жауға өтеді',
    bonus: 1
  },
  {
    id: 'garr_stairs',
    title: 'Тек ішкі баспалдақтар мен дәліздерде торуыл жасау',
    desc: 'Тар дәлізде ұрыс жүргізіп, шабуылшыларды бір-бірлеп бөлу әдісі',
    bonus: 8
  },
  {
    id: 'garr_high_tower',
    title: 'Қайыр ханмен бірге ең биік мұнарадан жебе борату',
    desc: 'Жоғарыдан бүкіл ауланы бақылап, басқыншы нояндарды нысанаға алу',
    bonus: 16
  }
];

const RAW_COUNTER_OPTIONS: LastStandOption[] = [
  {
    id: 'counter_bricks',
    title: 'Қамал қабырғасының кірпіштерін жұлып алып лақтырып соғысу',
    desc: 'Джувейни жылнамасында жазылған Қайыр ханның өшпес тарихи ерлігі',
    bonus: 20
  },
  {
    id: 'counter_surrender',
    title: 'Ақ ту көтеріп жауға берілу туралы өтініш білдіру',
    desc: 'Моңғол қолбасшылары берілгендерді де аяусыз жазалап, қаланы өртейді',
    bonus: 0
  },
  {
    id: 'counter_hide',
    title: 'Барлық қаруды тастап қамал бұрышына тығылып отыру',
    desc: 'Қарсылықты тоқтатып, дәрменсіз күйде тұтқынға түсуге алып келеді',
    bonus: 2
  }
];

export const Stage9LastStand: React.FC<Stage9LastStandProps> = ({
  gameState,
  onComplete,
  onPenalty
}) => {
  const [gateOptions] = useState<LastStandOption[]>(() => [...RAW_GATE_OPTIONS].sort(() => Math.random() - 0.5));
  const [garrisonOptions] = useState<LastStandOption[]>(() => [...RAW_GARRISON_OPTIONS].sort(() => Math.random() - 0.5));
  const [counterOptions] = useState<LastStandOption[]>(() => [...RAW_COUNTER_OPTIONS].sort(() => Math.random() - 0.5));

  const [tacticsChosen, setTacticsChosen] = useState<{
    gate: string | null;
    garrison: string | null;
    counter: string | null;
  }>({
    gate: null,
    garrison: null,
    counter: null
  });

  const [hasExecuted, setHasExecuted] = useState(false);
  const [resultSummary, setResultSummary] = useState<string | null>(null);

  const canExecute = tacticsChosen.gate !== null && tacticsChosen.garrison !== null && tacticsChosen.counter !== null;

  const handleExecute = () => {
    if (!canExecute || hasExecuted) return;
    setHasExecuted(true);

    const chosenGate = gateOptions.find(o => o.id === tacticsChosen.gate);
    const chosenGarrison = garrisonOptions.find(o => o.id === tacticsChosen.garrison);
    const chosenCounter = counterOptions.find(o => o.id === tacticsChosen.counter);

    // Calculate final battle resistance with randomized options
    const scoreVal = Math.round(
      (gameState.defense * 0.3) +
      (gameState.army * 0.3) +
      (gameState.food * 0.2) +
      (gameState.playerLives * 8) +
      (chosenGate?.bonus || 0) +
      (chosenGarrison?.bonus || 0) +
      (chosenCounter?.bonus || 0)
    );

    soundManager.playVictory();
    setResultSummary(
      'Цитадельдегі соңғы шайқас шешімдері бекітілді. Барлық көрсеткіштер мен ұпайлар қорытынды мемлекеттік сараптамаға автоматты түрде қосылды.'
    );

    setTimeout(() => {
      onComplete(scoreVal);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-2xl border-2 border-red-700/60 bg-[#290d0d] p-4 sm:p-5 shadow-2xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/40">
            <Castle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">9-кезең</span>
              <span className="text-xs text-stone-400">• Шешуші шайқас</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
              СОҢҒЫ ҚОРҒАНЫС: ЦИТАДЕЛЬДЕГІ ЕРЛІК
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#f5c7c7] leading-relaxed italic">
              «Сыртқы қабырғалар бұзылды. Қайыр хан өзінің ең сенімді батырларымен ішкі Цитадельге бекінді. Барлық қалған ресурстарыңыз (Әскер: {gameState.army}, Азық: {gameState.food}, Қорғаныс: {gameState.defense}%, Өмір: {gameState.playerLives}) есептеледі!»
            </p>
          </div>
        </div>
      </div>

      {/* 3 Last-Stand Decisions */}
      <div className="space-y-3">
        
        {/* 1. Gate Barricade */}
        <div className="rounded-2xl border border-stone-800 bg-[#1c130d] p-4">
          <h4 className="font-bold text-sm text-[#fae8b4] mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            1. Цитадель кіреберісін бекіту жоспары:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {gateOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playClick();
                  setTacticsChosen(prev => ({ ...prev, gate: opt.id }));
                }}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  tacticsChosen.gate === opt.id
                    ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                    : 'border-stone-800 bg-[#251910] text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="font-bold text-amber-200">{opt.title}</div>
                <div className="text-[11px] text-stone-400 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Top roof defense */}
        <div className="rounded-2xl border border-stone-800 bg-[#1c130d] p-4">
          <h4 className="font-bold text-sm text-[#fae8b4] mb-2 flex items-center gap-2">
            <Swords className="h-4 w-4 text-emerald-400" />
            2. Цитадель қорғаныс гарнизонын орналастыру:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {garrisonOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playClick();
                  setTacticsChosen(prev => ({ ...prev, garrison: opt.id }));
                }}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  tacticsChosen.garrison === opt.id
                    ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                    : 'border-stone-800 bg-[#251910] text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="font-bold text-amber-200">{opt.title}</div>
                <div className="text-[11px] text-stone-400 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. The Brick weapon historic choice */}
        <div className="rounded-2xl border border-stone-800 bg-[#1c130d] p-4">
          <h4 className="font-bold text-sm text-[#fae8b4] mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-400" />
            3. Қару-жарақ пен жебе таусылған соңғы сәттегі тарихи әрекет:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {counterOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.playClick();
                  setTacticsChosen(prev => ({ ...prev, counter: opt.id }));
                }}
                className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                  tacticsChosen.counter === opt.id
                    ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] ring-1 ring-amber-400 shadow-lg shadow-amber-950/40'
                    : 'border-stone-800 bg-[#251910] text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="font-bold text-amber-200">{opt.title}</div>
                <div className="text-[11px] text-stone-400 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result feedback */}
      {resultSummary && (
        <div className="rounded-2xl border border-amber-500/60 bg-amber-950/60 p-4 text-xs sm:text-sm text-amber-200 leading-relaxed animate-in fade-in">
          <div className="flex items-center gap-2 font-bold mb-1">
            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
            <span>Соңғы қорғаныс аяқталды!</span>
          </div>
          <p>{resultSummary}</p>
        </div>
      )}

      {/* Action Submit */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-800 bg-[#16120e] p-4">
        <span className="text-xs text-stone-400">
          Барлық 3 соңғы шешімді таңдап, тарихи шешуші қадамды жасаңыз.
        </span>
        <button
          onClick={handleExecute}
          disabled={!canExecute || hasExecuted}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs sm:text-sm font-bold transition active:scale-95 ${
            canExecute && !hasExecuted
              ? 'bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-lg shadow-amber-950/50'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          <span>ШЕШУШІ ШАЙҚАСТЫ ӨТКІЗУ (ФИНАЛҒА ӨТУ)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
