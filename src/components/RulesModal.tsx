import React, { useState } from 'react';
import { soundManager } from '../utils/sound';
import { HISTORICAL_QUESTIONS } from '../data/questions';
import { 
  X, 
  BookOpen, 
  ShieldAlert, 
  GraduationCap, 
  CheckCircle2, 
  Heart, 
  Compass, 
  Award,
  HelpCircle
} from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'history' | 'study'>('rules');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredQuestions = HISTORICAL_QUESTIONS.filter(q => 
    q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.options[q.correctIndex].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border-2 border-[#b38848] bg-[#1a140e] text-[#f5ebd8] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#8c6b3e]/40 bg-[#251d14] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-lg font-bold text-[#fae8b4]">Ойын ережесі және тарихи анықтамалық</h2>
              <p className="text-xs text-[#b38848]">Қазақстан тарихы: 1219–1220 жж. Отырар қорғанысы</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#33261a] text-[#ebd5b3] transition hover:bg-[#4a3726] active:scale-95"
            aria-label="Жабу"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#8c6b3e]/30 bg-[#16110a] px-5 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('rules');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'rules'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Ойын ережесі мен жүйесі</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('history');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'history'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Тарихи оқиға хроникасы</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('study');
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'study'
                ? 'border-[#f59e0b] text-[#f59e0b]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Студентке: 40 сұрақ базасы</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed space-y-4 text-[#ded2be]">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#b38848]/30 bg-[#241a11] p-4">
                <h3 className="mb-2 font-bold text-[#fae8b4] flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#f59e0b]" />
                  Сіздің рөліңіз: Отырар қорғанысының қолбасшысы
                </h3>
                <p className="text-xs sm:text-sm text-stone-300">
                  Сіз 1219 жылғы Отырар қаласының қорғанысын басқару міндетін қабылдадыңыз. Шығыстан моңғол қалың қолы таяп келеді. Мақсатыңыз — тарихи стратегиялық шешімдер қабылдап, ресурстарды сақтап, қаланы мүмкіндігінше ұзақ әрі табанды қорғау.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-red-900/50 bg-[#251010]/60 p-3">
                  <span className="font-bold text-red-300 flex items-center gap-1.5 mb-1">
                    <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                    5 Өмір жүйесі
                  </span>
                  <p className="text-stone-300">
                    Әрбір қате тест жауабы, картадағы қате бағыт, стратегиялық кемшілік немесе уақыттың таусылуы 1 өмірді жояды. Өмір 0 болғанда «Отырар құлады» шығады.
                  </p>
                </div>

                <div className="rounded-xl border border-[#b38848]/40 bg-[#201912] p-3">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Award className="h-4 w-4 text-amber-400" />
                    10 Кезең құрылымы
                  </span>
                  <p className="text-stone-300">
                    Ойын 10 түрлі механиканы қамтиды: шешім қабылдау, интерактивті картадан барлау, әскер бөлу, азық басқару, таймерлі сұрақ, қоршау штурмы, құпия дерек және финал.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#8c6b3e]/30 bg-[#201811] p-4 text-xs space-y-2">
                <h4 className="font-bold text-[#fae8b4]">Ресурстар мағынасы:</h4>
                <ul className="space-y-1.5 text-stone-300">
                  <li><strong className="text-blue-300">🛡️ Қорғаныс (100%):</strong> Қала қабырғасы мен қақпалардың физикалық беріктігі.</li>
                  <li><strong className="text-amber-300">🍞 Азық (100):</strong> Қала халқы мен сарбаздарды асырау қоймасы.</li>
                  <li><strong className="text-emerald-300">⚔️ Әскер (100):</strong> Отырар гарнизоны мен садақшыларының жауынгерлік күші.</li>
                  <li><strong className="text-yellow-300">💰 Қазына (100):</strong> Қаланың қаржылық және шеберханалық қоры.</li>
                  <li><strong className="text-purple-300">⭐ Ұпай:</strong> Дұрыс жауаптар мен сәтті стратегиялық қадамдар үшін беріледі.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-[#b38848]/30 bg-[#201710] p-4">
                <h4 className="font-bold text-[#f59e0b] mb-1">1218 жыл — Отырар оқиғасы (апаты)</h4>
                <p className="text-stone-300">
                  Шыңғыс хан 450–500 түйеден тұратын 100-дей адам бастаған бай сауда керуенін жібереді. Қайыр хан керуендегі тыңшыларды әшкерелеп, керуенді тоқтатып, адамдарын жазалайды. Бұл моңғол жорығының басталуына сылтау болды.
                </p>
              </div>

              <div className="rounded-xl border border-[#b38848]/30 bg-[#201710] p-4">
                <h4 className="font-bold text-[#f59e0b] mb-1">1219 жылдың күзі — Отырар қоршауы</h4>
                <p className="text-stone-300">
                  Шыңғыс хан ұлдары Шағатай мен Үгедейді қаланы алуға қалдырып, өзі Бұхараға аттанды. Қала 6 ай бойы қаһармандықпен қорғанды. Тек Қараша батырдың опасыздығынан кейін жау қалаға кірді.
                </p>
              </div>

              <div className="rounded-xl border border-[#b38848]/30 bg-[#201710] p-4">
                <h4 className="font-bold text-[#f59e0b] mb-1">1220 жыл — Қайыр ханның соңғы ерлігі</h4>
                <p className="text-stone-300">
                  Қайыр хан цитадельде тағы 1 ай шайқасып, қаруы біткенде қабырға кірпіштерімен соғысты. Тұтқындалғаннан кейін қатыгездікпен өлтірілді, бірақ оның ерлігі бүкіл әлем тарихында қайсарлықтың үлгісі болып қалды.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'study' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#8c6b3e]/30 bg-[#241a12] p-2.5">
                <HelpCircle className="h-4 w-4 text-[#f59e0b]" />
                <input
                  type="text"
                  placeholder="Сұрақты немесе тақырыпты іздеу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-200 outline-none placeholder:text-stone-500"
                />
              </div>

              <p className="text-xs text-[#b38848]">
                Академиялық базада барлығы 40 тексерілген тарихи сұрақ бар (табылғаны: {filteredQuestions.length}):
              </p>

              <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
                {filteredQuestions.map((q) => (
                  <div key={q.id} className="rounded-xl border border-[#8c6b3e]/25 bg-[#201811] p-3 text-xs">
                    <p className="font-semibold text-[#fae8b4] mb-1.5">
                      {q.id}. {q.question}
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Дұрыс жауабы: {q.options[q.correctIndex]}</span>
                    </div>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      💡 {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#8c6b3e]/40 bg-[#201810] px-5 py-3">
          <span className="text-[11px] text-stone-400">
            Отырар қорғанысы • 1-курс студенттеріне арналған оқу кешені
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="rounded-lg bg-[#b38848] px-4 py-1.5 text-xs font-bold text-[#1a140d] transition hover:bg-[#d4a359] active:scale-95"
          >
            Түсінікті, ойынға оралу
          </button>
        </div>
      </div>
    </div>
  );
};
