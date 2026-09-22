import React, { useState } from 'react';
import { GameState } from '../../types';
import { soundManager } from '../../utils/sound';
import { Flame, Shield, ArrowRight, CheckCircle2, AlertTriangle, Crosshair, Sparkles } from 'lucide-react';

interface Stage6SiegeProps {
  gameState: GameState;
  onComplete: (impact: { defense: number; army: number; score: number }) => void;
  onPenalty: () => void;
}

interface TacticItem {
  id: string;
  type: 'night_raid' | 'wall_oil' | 'passive' | 'open_field';
  title: string;
  desc: string;
  advantage: string;
  impact: string;
}

const RAW_TACTICS: TacticItem[] = [
  {
    id: 'wall_oil',
    type: 'wall_oil',
    title: 'Қабырғадан отты жебелер мен қайнаған қара май құю',
    desc: 'Қабырғаға жақындаған жау сарбаздары мен баспалдақтарына қамалдан от жаудыру.',
    advantage: 'Жаяу әскерге тосқауыл қояды, тұрақты сенімді қорғаныс әдісі.',
    impact: 'Қамал қабырғасы үстінен сенімді бекініс жасау'
  },
  {
    id: 'night_raid',
    type: 'night_raid',
    title: 'Түнде тұтқиылдан шығып, жаудың манжанықтарын өртеп жіберу',
    desc: 'Таң алдында жасырын қақпадан шығып, тас атқыш құрылғыларды құрту.',
    advantage: 'Жаудың қамал бұзғыш ауыр техникаларын түбегейлі саптан шығарады.',
    impact: 'Тәуекелді тұтқиыл шабуылмен жау қаруын жою'
  },
  {
    id: 'passive',
    type: 'passive',
    title: 'Қабырға ішінде тек пассивті күйде тұрып қорғану',
    desc: 'Қарымта соққы жасамай, тек жаудың манжанық соққысын күтіп отыру.',
    advantage: 'Әскер сыртқа шықпайды, алайда қамал қабырғалары біртіндеп күйрейді.',
    impact: 'Енжар қорғаныс жасап, қала ішінде күту'
  },
  {
    id: 'open_field',
    type: 'open_field',
    title: 'Қақпаны ашып, барлық гарнизонмен жазық далаға шығу',
    desc: 'Қамал артықшылығын тастап, барлық сарбаздармен ашық майданда бетпе-бет соғысу.',
    advantage: 'Жаудың жалған шегініс қулығына ұрынып, қоршауда қалу қаупі зор.',
    impact: 'Ашық даладағы соққы, үлкен әскери тәуекел'
  }
];

export const Stage6Siege: React.FC<Stage6SiegeProps> = ({
  gameState,
  onComplete,
  onPenalty
}) => {
  // Shuffled tactics on component mount
  const [tactics] = useState<TacticItem[]>(() => [...RAW_TACTICS].sort(() => Math.random() - 0.5));
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [hasResolved, setHasResolved] = useState(false);

  const selectedTactic = tactics.find(t => t.id === selectedPlanId);

  const handleResolve = () => {
    if (!selectedTactic) return;
    setHasResolved(true);

    if (selectedTactic.type === 'night_raid') {
      soundManager.playHorn();
      onComplete({
        defense: Math.min(100, gameState.defense + 22),
        army: Math.max(20, gameState.army - 5),
        score: gameState.score + 25
      });
    } else if (selectedTactic.type === 'wall_oil') {
      soundManager.playSuccess();
      onComplete({
        defense: Math.min(100, gameState.defense + 15),
        army: gameState.army,
        score: gameState.score + 15
      });
    } else {
      soundManager.playDamage();
      onPenalty();
      onComplete({
        defense: Math.max(15, gameState.defense - 15),
        army: Math.max(15, gameState.army - 10),
        score: gameState.score
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-2xl border-2 border-red-600/50 bg-[#261010] p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/40">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">6-кезең</span>
              <span className="text-xs text-stone-400">• Қоршау шайқасы</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
              ҚОРШАУ: МАНЖАНЫҚТАР МЕН ШАБУЫЛҒА ТОСҚАУЫЛ
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#e8c8c8] leading-relaxed">
              Моңғол қалың қолы қала түбіне келді. Манжанықтардан тас пен от лақтырылуда. Қорғаныс жоспарын таңдаңыз!
            </p>
          </div>
        </div>
      </div>

      {/* Cinematic Animation Battlefield Stage */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl border-2 border-[#8c6b3e]/60 bg-[#140e08] shadow-2xl">
        {/* Sky with Smoke and Flying Fire arrows */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d120a] via-[#1a0f08] to-[#0d0905]" />

        {/* Rising Smoke and Dust Animation */}
        <div className="absolute inset-x-0 bottom-0 h-32 opacity-40 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-700 via-stone-800 to-transparent animate-pulse" />

        {/* SVG Battle Scene */}
        <svg viewBox="0 0 800 240" className="absolute inset-0 w-full h-full select-none">
          <defs>
            <linearGradient id="wallGrad6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9a7442" />
              <stop offset="100%" stopColor="#4a341a" />
            </linearGradient>
          </defs>

          {/* Steppe ground */}
          <line x1="0" y1="210" x2="800" y2="210" stroke="#543c24" strokeWidth="6" />

          {/* OTRAR CITY WALL (Left side) */}
          <g transform="translate(60, 90)">
            {/* Wall block */}
            <rect x="0" y="0" width="180" height="120" fill="url(#wallGrad6)" stroke="#b38848" strokeWidth="2" />
            
            {/* Battlements / зубцы */}
            {[-10, 20, 50, 80, 110, 140, 170].map((bx, i) => (
              <rect key={i} x={bx} y="-15" width="18" height="18" fill="#7a572a" stroke="#b38848" strokeWidth="1" />
            ))}

            {/* Defenders on battlements */}
            <g transform="translate(25, -28)">
              <circle cx="0" cy="0" r="5" fill="#fcd34d" />
              <line x1="0" y1="5" x2="0" y2="14" stroke="#0284c7" strokeWidth="2.5" />
              {/* Bow and arrow aiming right */}
              <path d="M 4,-2 Q 10,6 4,14" fill="none" stroke="#d97706" strokeWidth="1.5" />
              <line x1="2" y1="6" x2="16" y2="2" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            <g transform="translate(85, -28)">
              <circle cx="0" cy="0" r="5" fill="#fcd34d" />
              <line x1="0" y1="5" x2="0" y2="14" stroke="#0284c7" strokeWidth="2.5" />
              {/* Spear */}
              <line x1="-3" y1="12" x2="15" y2="-12" stroke="#e2e8f0" strokeWidth="1.5" />
            </g>
            <g transform="translate(145, -28)">
              <circle cx="0" cy="0" r="5" fill="#fcd34d" />
              <line x1="0" y1="5" x2="0" y2="14" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 4,-2 Q 10,6 4,14" fill="none" stroke="#d97706" strokeWidth="1.5" />
              <line x1="2" y1="6" x2="16" y2="2" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* Blue and Gold City Flag waving */}
            <g transform="translate(10, -50)">
              <line x1="0" y1="0" x2="0" y2="35" stroke="#f59e0b" strokeWidth="2" />
              <path d="M 0,0 C 15,-6 20,6 35,0 L 35,16 C 20,10 15,22 0,16 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1">
                <animate attributeName="d" 
                  values="M 0,0 C 15,-6 20,6 35,0 L 35,16 C 20,10 15,22 0,16 Z;
                          M 0,0 C 15,6 20,-6 35,0 L 35,16 C 20,22 15,10 0,16 Z;
                          M 0,0 C 15,-6 20,6 35,0 L 35,16 C 20,10 15,22 0,16 Z" 
                  dur="3s" 
                  repeatCount="indefinite" 
                />
              </path>
            </g>
          </g>

          {/* MONGOL ADVANCING TROOPS (Right side moving towards wall) */}
          <g>
            <animateTransform 
              attributeName="transform" 
              type="translate" 
              values="650, 140; 590, 140; 650, 140" 
              dur="6s" 
              repeatCount="indefinite" 
            />

            {/* Red & Black Mongol Banner */}
            <line x1="-30" y1="-40" x2="-30" y2="70" stroke="#7f1d1d" strokeWidth="3" />
            <polygon points="-30,-40 10,-30 -30,-20" fill="#dc2626" />

            {/* Catapult throwing animation */}
            <g transform="translate(-100, 30)">
              <line x1="-20" y1="35" x2="20" y2="35" stroke="#78350f" strokeWidth="3" />
              <line x1="0" y1="35" x2="-35" y2="-5" stroke="#92400e" strokeWidth="4" />
              <circle cx="-35" cy="-5" r="5" fill="#44403c" />
            </g>

            {/* Marching cavalry/infantry ranks */}
            {[-60, -30, 0, 30, 60].map((mx, idx) => (
              <g key={idx} transform={`translate(${mx}, 25)`}>
                <circle cx="0" cy="0" r="5.5" fill="#dc2626" />
                <line x1="0" y1="5" x2="0" y2="28" stroke="#1c1917" strokeWidth="3.5" />
                <line x1="0" y1="12" x2="-14" y2="4" stroke="#991b1b" strokeWidth="2" />
                <circle cx="-14" cy="4" r="2.5" fill="#7f1d1d" />
              </g>
            ))}
          </g>

          {/* Animated Projectile Stones & Fire Arrows flying */}
          <g>
            <circle cx="0" cy="0" r="4.5" fill="#f97316" stroke="#ea580c" strokeWidth="1">
              <animateMotion 
                path="M 550,150 Q 380,30 230,110" 
                dur="2.4s" 
                repeatCount="indefinite" 
              />
            </circle>
            <circle cx="0" cy="0" r="3" fill="#ef4444">
              <animateMotion 
                path="M 230,85 Q 400,20 600,165" 
                dur="1.8s" 
                repeatCount="indefinite" 
              />
            </circle>
          </g>
        </svg>

        {/* Cinematic caption */}
        <div className="absolute bottom-2 inset-x-0 text-center text-[11px] font-semibold text-amber-300 drop-shadow">
          Отырар қабырғасына моңғол манжанықтары мен шабуылшы сарбаздары таяп қалды!
        </div>
      </div>

      {/* Defense Tactical Choice Cards */}
      <div className="space-y-3">
        {tactics.map((tactic, idx) => {
          const letter = ['А', 'В', 'С', 'D'][idx];
          const isSelected = selectedPlanId === tactic.id;
          return (
            <div
              key={tactic.id}
              onClick={() => {
                if (!hasResolved) {
                  soundManager.playClick();
                  setSelectedPlanId(tactic.id);
                }
              }}
              className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] shadow-lg shadow-amber-950/40 ring-1 ring-amber-400 scale-[1.01]'
                  : 'border-stone-800 bg-[#1b140e] hover:border-stone-700 hover:bg-[#251a12]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-bold text-sm sm:text-base text-[#fae8b4]">
                  {letter}. {tactic.title}
                </h4>
                {isSelected && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 mb-2 leading-relaxed">
                {tactic.desc}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/80 pt-2 text-xs">
                <span className="text-stone-400">{tactic.advantage}</span>
                <span className="font-semibold text-amber-400">{tactic.impact}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Proceed */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-800 bg-[#16120e] p-4">
        <span className="text-xs text-stone-400">
          Қорғаныс тактикасын таңдап, бұйрық беріңіз.
        </span>
        <button
          onClick={handleResolve}
          disabled={selectedPlanId === null || hasResolved}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold transition active:scale-95 ${
            selectedPlanId !== null && !hasResolved
              ? 'bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-lg shadow-amber-950/40'
              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
          }`}
        >
          <span>ТАКТИКАНЫ ІСКЕ АСЫРУ (7-КЕЗЕҢ)</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
