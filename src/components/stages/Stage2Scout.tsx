import React, { useState } from 'react';
import { GameState } from '../../types';
import { SCOUT_ROUTES } from '../../data/mapData';
import { soundManager } from '../../utils/sound';
import { Compass, CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';

interface Stage2ScoutProps {
  gameState: GameState;
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
  onSuccess: (scoreDelta: number) => void;
  onFail: () => void;
}

export const Stage2Scout: React.FC<Stage2ScoutProps> = ({
  gameState,
  selectedRouteId,
  onSelectRoute,
  onSuccess,
  onFail
}) => {
  const [routes] = useState(() => [...SCOUT_ROUTES].sort(() => Math.random() - 0.5));
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleConfirm = () => {
    if (!selectedRouteId || hasEvaluated) return;

    const route = routes.find(r => r.id === selectedRouteId);
    if (!route) return;

    setHasEvaluated(true);

    if (route.isCorrectMainRoute) {
      soundManager.playClick();
      setIsCorrect(true);
    } else {
      soundManager.playDamage();
      setIsCorrect(false);
      onFail();
    }
  };

  const handleNext = () => {
    onSuccess(isCorrect ? 10 : 0);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-2xl border-2 border-amber-600/50 bg-[#1f160e] p-4 sm:p-5 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/40">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">2-кезең</span>
              <span className="text-xs text-stone-400">• Әскери барлау</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
              БАРЛАУ: МОҢҒОЛ ӘСКЕРІНІҢ БАҒЫТЫН АНЫҚТАУ
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#ebd8bf] leading-relaxed">
              Картадан Отырарды қоршауға тікелей бағытталған моңғол қалың қолының (Шағатай мен Үгедей түмендерінің) негізгі шабуыл бағытын таңдаңыз.
            </p>
          </div>
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {routes.map((route, idx) => {
          const isSelected = selectedRouteId === route.id;
          const letter = idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : 'D';

          return (
            <div
              key={route.id}
              onClick={() => {
                if (!hasEvaluated) {
                  soundManager.playClick();
                  onSelectRoute(route.id);
                }
              }}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                isSelected
                  ? 'border-amber-400 bg-amber-500/20 text-[#fae8b4] shadow-lg shadow-amber-950/40 ring-1 ring-amber-400 scale-[1.01]'
                  : 'border-stone-800 bg-[#1b150f] hover:border-stone-700 hover:bg-[#231a12]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-xs font-bold text-amber-300">
                    {letter}
                  </span>
                  <h4 className="font-bold text-sm text-[#fae8b4]">{route.name}</h4>
                </div>
                {isSelected && <Eye className="h-4 w-4 text-amber-400" />}
              </div>

              <div className="text-xs space-y-1 text-stone-300">
                <p><strong className="text-amber-400">Қолбасшы:</strong> {route.commander}</p>
                <p><strong className="text-stone-400">Әскер саны:</strong> {route.tumenCount}</p>
                <p className="text-[11px] text-stone-400 italic mt-1.5 leading-relaxed">{route.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluation Feedback (Neutral amber glow, no reveal of right/wrong, automatic recording) */}
      {hasEvaluated && (
        <div className="rounded-2xl border border-amber-500/50 bg-[#26170d] p-4 text-sm leading-relaxed animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#fae8b4]">Шешім қабылданды</p>
              <p className="text-xs text-stone-300 mt-0.5">
                Барлау дерегі бекітілді, нәтиже қорытынды есепке автоматты түрде қосылды.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-800 bg-[#16120e] p-4">
        <span className="text-xs text-stone-400">
          {!selectedRouteId
            ? 'Бағытты таңдау үшін картадағы немесе тізімдегі нұсқаны басыңыз.'
            : hasEvaluated
            ? 'Шешім қабылданды. Келесі кезеңге өтіңіз.'
            : 'Таңдауыңызды растауға дайынсыз ба?'}
        </span>

        {!hasEvaluated ? (
          <button
            onClick={handleConfirm}
            disabled={!selectedRouteId}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition active:scale-95 ${
              selectedRouteId
                ? 'bg-amber-600 text-white hover:bg-amber-500 cursor-pointer shadow-lg'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <span>БАҒЫТТЫ БЕКІТУ</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-amber-500 cursor-pointer shadow-lg active:scale-95"
          >
            <span>3-КЕЗЕҢГЕ ӨТУ (ҚОРҒАНЫСТЫ ҰЙЫМДАСТЫРУ)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

    </div>
  );
};
