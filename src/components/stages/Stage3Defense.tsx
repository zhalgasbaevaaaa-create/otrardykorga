import React, { useState } from 'react';
import { GameState, TroopAllocation } from '../../types';
import { soundManager } from '../../utils/sound';
import { Shield, Users, ArrowRight, CheckCircle2, RotateCcw, Plus, Minus, AlertCircle, Compass } from 'lucide-react';

interface Stage3DefenseProps {
  gameState: GameState;
  onComplete: (allocation: TroopAllocation, defenseBonus: number, scoreBonus: number) => void;
  onPenalty: () => void;
}

interface DefenseDoctrine {
  id: string;
  isOptimal: boolean;
  title: string;
  desc: string;
  allocation: TroopAllocation;
}

const RAW_DOCTRINES: DefenseDoctrine[] = [
  {
    id: 'east_north_focus',
    isOptimal: true,
    title: 'Шығыс бас майданы мен Солтүстік қақпаны барынша күшейту',
    desc: 'Басты моңғол түмендері шоғырланған қауіпті бағыттарға жасақтарды көп қою',
    allocation: { eastTower: 35, northGate: 30, southGate: 20, westWall: 15 }
  },
  {
    id: 'balanced_split',
    isOptimal: false,
    title: 'Қаланың барлық төрт қақпасына жасақтарды теңдей бөліп қою',
    desc: 'Әр шепке жиырма бес жауынгерден бөліп, біркелкі қорғану тәсілі',
    allocation: { eastTower: 25, northGate: 25, southGate: 25, westWall: 25 }
  },
  {
    id: 'west_river_focus',
    isOptimal: false,
    title: 'Сырдария өзені бойындағы батыс қорғаныс шебін негізгі ету',
    desc: 'Су тосқауылы бар бағытқа артық әскер қойып, шығысты әлсірету',
    allocation: { eastTower: 20, northGate: 20, southGate: 20, westWall: 40 }
  },
  {
    id: 'south_bazaar_focus',
    isOptimal: false,
    title: 'Оңтүстік сауда қақпасы мен керуен сарайларды қорғауға бағыттау',
    desc: 'Арыс өзені бағытына көп жасақ қойып, солтүстік қақпаны азайту',
    allocation: { eastTower: 25, northGate: 20, southGate: 45, westWall: 10 }
  }
];

export const Stage3Defense: React.FC<Stage3DefenseProps> = ({
  gameState,
  onComplete,
  onPenalty
}) => {
  const totalTroops = 100;

  // Randomized doctrines order on component mount
  const [shuffledDoctrines] = useState<DefenseDoctrine[]>(() => {
    return [...RAW_DOCTRINES].sort(() => Math.random() - 0.5);
  });

  const [selectedDoctrineId, setSelectedDoctrineId] = useState<string | null>(null);

  // Initial state starts with 0 troops allocated so the answer is never given in advance
  const [allocation, setAllocation] = useState<TroopAllocation>({
    northGate: 0,
    eastTower: 0,
    westWall: 0,
    southGate: 0
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const currentTotal = allocation.northGate + allocation.eastTower + allocation.westWall + allocation.southGate;
  const remaining = totalTroops - currentTotal;

  const handleAdjust = (sector: keyof TroopAllocation, delta: number) => {
    soundManager.playClick();
    const currentVal = allocation[sector];
    if (delta > 0 && remaining < delta) return;
    if (delta < 0 && currentVal + delta < 0) return;

    setAllocation(prev => ({
      ...prev,
      [sector]: Math.max(0, currentVal + delta)
    }));
    setFeedback(null);
  };

  const handleSelectDoctrine = (doctrine: DefenseDoctrine) => {
    soundManager.playClick();
    setSelectedDoctrineId(doctrine.id);
    setAllocation({ ...doctrine.allocation });
    setFeedback(null);
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedDoctrineId(null);
    setAllocation({
      northGate: 0,
      eastTower: 0,
      westWall: 0,
      southGate: 0
    });
    setFeedback(null);
  };

  const handleDeploy = () => {
    if (remaining !== 0) {
      soundManager.playError();
      setFeedback('Барлық 100 жасақты толық бөлуіңіз керек! (Қалғаны: ' + remaining + ')');
      return;
    }

    // Historical evaluation
    const isOptimal = allocation.eastTower >= 30 && allocation.northGate >= 25 && allocation.westWall >= 10 && allocation.southGate >= 15;
    const isCriticalWeakness = allocation.eastTower < 20 || allocation.northGate < 15 || allocation.westWall === 0 || allocation.southGate === 0;

    if (isCriticalWeakness) {
      soundManager.playDamage();
      onPenalty();
      setFeedback('Әскерлерді орналастыру шешімі қабылданды. Нәтиже қорытынды есепке автоматты түрде қосылды.');
      setTimeout(() => {
        onComplete(allocation, 0, 0);
      }, 1200);
    } else if (isOptimal) {
      soundManager.playClick();
      setFeedback('Әскерлерді орналастыру шешімі қабылданды. Нәтиже қорытынды есепке автоматты түрде қосылды.');
      setTimeout(() => {
        onComplete(allocation, 15, 15);
      }, 1200);
    } else {
      soundManager.playClick();
      setFeedback('Әскерлерді орналастыру шешімі қабылданды. Нәтиже қорытынды есепке автоматты түрде қосылды.');
      setTimeout(() => {
        onComplete(allocation, 8, 10);
      }, 1200);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-2xl border-2 border-emerald-600/50 bg-[#0e1f16] p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">3-кезең</span>
              <span className="text-xs text-stone-400">• Шептерді бөлу</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
              ҚОРҒАНЫС: ӘСКЕРДІ НҮКТЕЛЕРГЕ ОРНАЛАСТЫРУ
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#cce7db] leading-relaxed">
              100 жауынгерлік жасақты қаланың 4 стратегиялық шебіне бөліңіз. Шығыс даладан моңғол түмендерінің негізгі соққысы төніп тұрғанын ескеріп, тактикалық доктрина таңдаңыз немесе әр шепті дербес реттеңіз.
            </p>
          </div>
        </div>
      </div>

      {/* Troop Counter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-800 bg-[#16120e] p-3.5 text-xs">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold text-stone-300">Бөлінуі тиіс әскер: 100 жасақ</span>
          <span className={`px-2.5 py-1 rounded-full font-bold ${
            remaining === 0 ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' : 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
          }`}>
            Қалғаны: {remaining}
          </span>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-lg bg-[#271d13] px-3 py-1.5 text-stone-300 border border-stone-800 hover:bg-[#382a1c] transition cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
          <span>Қайта бастау (0/100)</span>
        </button>
      </div>

      {/* Randomized Strategic Doctrines (Order is randomly shuffled each game) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400 px-1">
          <span className="font-semibold text-[#fae8b4] flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            Стратегиялық доктриналар (Кез келген нұсқаны таңдап, төменде түзетуге болады):
          </span>
          <span className="text-[11px] text-stone-500">Кездейсоқ орналасу</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {shuffledDoctrines.map((doctrine, index) => {
            const letter = ['А', 'В', 'С', 'D'][index];
            const isSelected = selectedDoctrineId === doctrine.id;

            return (
              <button
                key={doctrine.id}
                onClick={() => handleSelectDoctrine(doctrine)}
                className={`text-left rounded-xl border p-3.5 transition cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-[#2e1d10] text-[#fae8b4] shadow-md shadow-amber-950/40'
                    : 'border-stone-800 bg-[#1c140d] text-stone-300 hover:border-stone-700 hover:bg-[#251910]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm text-amber-300">
                    {letter}. {doctrine.title}
                  </span>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-1" />}
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed mb-2">
                  {doctrine.desc}
                </p>
                <div className="text-[10px] font-mono text-stone-500 flex flex-wrap gap-2 border-t border-stone-800/80 pt-1.5">
                  <span>Шығыс: {doctrine.allocation.eastTower}%</span>
                  <span>Солтүстік: {doctrine.allocation.northGate}%</span>
                  <span>Оңтүстік: {doctrine.allocation.southGate}%</span>
                  <span>Батыс: {doctrine.allocation.westWall}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Defense Sectors Manual Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        
        {/* Sector 1: East Tower */}
        <div className="rounded-2xl border-2 border-amber-600/40 bg-[#1e150d] p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-sm text-[#fae8b4]">1. Шығыс мұнарасы</h4>
              <p className="text-[11px] text-amber-400 font-semibold">Жау лагеріне қарсы бас шеп</p>
            </div>
            <span className="text-lg font-bold text-amber-300 font-mono">{allocation.eastTower}%</span>
          </div>
          <p className="text-xs text-stone-400 mb-3">
            Шағатай мен Үгедей түмендері тікелей қарсы тұрған ең қауіпті сектор.
          </p>
          <div className="flex items-center justify-between gap-2 border-t border-stone-800 pt-2.5">
            <button
              onClick={() => handleAdjust('eastTower', -5)}
              disabled={allocation.eastTower <= 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
              aria-label="Азайту"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 bg-stone-900 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${allocation.eastTower}%` }}
              />
            </div>
            <button
              onClick={() => handleAdjust('eastTower', 5)}
              disabled={remaining < 5}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-30 cursor-pointer"
              aria-label="Қосу"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sector 2: North Gate */}
        <div className="rounded-2xl border border-stone-800 bg-[#1e150d] p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-sm text-[#fae8b4]">2. Солтүстік қақпа (Сопыхана)</h4>
              <p className="text-[11px] text-stone-400">Керуен жолы және солтүстік қорған</p>
            </div>
            <span className="text-lg font-bold text-amber-300 font-mono">{allocation.northGate}%</span>
          </div>
          <p className="text-xs text-stone-400 mb-3">
            Қаланың қақпалары арасындағы ең осал әрі көп шабуыл жасалатын орын.
          </p>
          <div className="flex items-center justify-between gap-2 border-t border-stone-800 pt-2.5">
            <button
              onClick={() => handleAdjust('northGate', -5)}
              disabled={allocation.northGate <= 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
              aria-label="Азайту"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 bg-stone-900 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${allocation.northGate}%` }}
              />
            </div>
            <button
              onClick={() => handleAdjust('northGate', 5)}
              disabled={remaining < 5}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 cursor-pointer"
              aria-label="Қосу"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sector 3: South Gate */}
        <div className="rounded-2xl border border-stone-800 bg-[#1e150d] p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-sm text-[#fae8b4]">3. Оңтүстік қақпа (Дәруаза)</h4>
              <p className="text-[11px] text-stone-400">Арыс өзені бағытындағы кіреберіс</p>
            </div>
            <span className="text-lg font-bold text-amber-300 font-mono">{allocation.southGate}%</span>
          </div>
          <p className="text-xs text-stone-400 mb-3">
            Бас керуен сарайлар мен сауда орындарына кіретін қос мұнаралы қақпа.
          </p>
          <div className="flex items-center justify-between gap-2 border-t border-stone-800 pt-2.5">
            <button
              onClick={() => handleAdjust('southGate', -5)}
              disabled={allocation.southGate <= 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
              aria-label="Азайту"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 bg-stone-900 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${allocation.southGate}%` }}
              />
            </div>
            <button
              onClick={() => handleAdjust('southGate', 5)}
              disabled={remaining < 5}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 cursor-pointer"
              aria-label="Қосу"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sector 4: West Wall */}
        <div className="rounded-2xl border border-stone-800 bg-[#1e150d] p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-bold text-sm text-[#fae8b4]">4. Батыс қабырға</h4>
              <p className="text-[11px] text-stone-400">Сырдария өзені жағындағы қорған</p>
            </div>
            <span className="text-lg font-bold text-amber-300 font-mono">{allocation.westWall}%</span>
          </div>
          <p className="text-xs text-stone-400 mb-3">
            Табиғи өзен тосқауылы бар, бірақ тұтқиылдан келетін жау үшін қарауыл қажет.
          </p>
          <div className="flex items-center justify-between gap-2 border-t border-stone-800 pt-2.5">
            <button
              onClick={() => handleAdjust('westWall', -5)}
              disabled={allocation.westWall <= 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
              aria-label="Азайту"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 bg-stone-900 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-purple-500 h-full transition-all duration-300"
                style={{ width: `${allocation.westWall}%` }}
              />
            </div>
            <button
              onClick={() => handleAdjust('westWall', 5)}
              disabled={remaining < 5}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 cursor-pointer"
              aria-label="Қосу"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className="rounded-xl border border-[#b38848]/60 bg-[#251b12] p-3 text-xs sm:text-sm text-[#f5ebd8] leading-relaxed flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-[#f59e0b] shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Deploy Button */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-800 bg-[#16120e] p-4">
        <span className="text-xs text-stone-400">
          Барлық 100 жасақ тағайындалған соң, «Әскерді орналастыру» батырмасын басыңыз.
        </span>
        <button
          onClick={handleDeploy}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-amber-500 active:scale-95 shadow-lg shadow-amber-950/50 cursor-pointer"
        >
          <Shield className="h-4 w-4" />
          <span>ОРНАЛАСТЫРУДЫ БЕКІТУ</span>
        </button>
      </div>

    </div>
  );
};
