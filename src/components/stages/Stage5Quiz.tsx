import React, { useState, useEffect } from 'react';
import { GameState } from '../../types';
import { HISTORICAL_QUESTIONS } from '../../data/questions';
import { soundManager } from '../../utils/sound';
import { shuffleQuestion, ShuffledQuestion } from '../../utils/quizHelper';
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';

interface Stage5QuizProps {
  gameState: GameState;
  onSuccess: (scoreBonus: number) => void;
  onFail: () => void;
}

export const Stage5Quiz: React.FC<Stage5QuizProps> = ({
  gameState,
  onSuccess,
  onFail
}) => {
  // Select and shuffle 3 distinct historical questions for multi-question brainstorming challenge
  const [questions] = useState<ShuffledQuestion[]>(() => {
    const shuffledPool = [...HISTORICAL_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffledPool.slice(0, 3).map(q => shuffleQuestion(q));
  });

  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const currentQuestion = questions[currentQIndex];

  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);

  // 25-second countdown timer for each question
  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, timeLeft, currentQIndex]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsCorrect(false);
    soundManager.playDamage();
    onFail();
  };

  const handleSelectAnswer = (idx: number) => {
    if (isAnswered) return;
    soundManager.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQuestion.correctIndex) {
      soundManager.playClick();
      setIsCorrect(true);
      setCorrectCount(prev => prev + 1);
    } else {
      soundManager.playDamage();
      setIsCorrect(false);
      onFail();
    }
  };

  const handleNextOrFinish = () => {
    if (currentQIndex < questions.length - 1) {
      soundManager.playClick();
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
      setTimeLeft(25);
    } else {
      // Finished all 3 questions
      const totalBonus = correctCount * 10;
      onSuccess(totalBonus);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-in fade-in duration-300">
      
      {/* Header with 25s Countdown Timer & Brainstorming Indicator */}
      <div className="rounded-2xl border-2 border-purple-600/50 bg-[#1e1026] p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">5-кезең</span>
                <span className="text-xs text-stone-400">• Тарихи сынақ және миға шабуыл</span>
                <span className="rounded-full bg-purple-900/60 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                  Сұрақ {currentQIndex + 1} / {questions.length}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#fae8b4] mt-0.5">
                ТАРИХИ СЫНАҚ: АНАЛИТИКАЛЫҚ ДЕРЕКТЕР
              </h2>
            </div>
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-base font-bold shadow-md self-start sm:self-auto ${
            timeLeft <= 5 
              ? 'border-red-500 bg-red-950 text-red-300 animate-pulse' 
              : 'border-purple-500/40 bg-[#291636] text-purple-200'
          }`}>
            <Clock className={`h-4 w-4 ${timeLeft <= 5 ? 'text-red-400' : 'text-purple-400'}`} />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-[#8c6b3e]/40 bg-[#1c140e] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Студенттердің тарихи ойлау қабілеті сынағы
          </span>
          <span className="text-xs text-stone-400">
            Сұрақ: <strong className="text-amber-300">{currentQIndex + 1}</strong> / {questions.length}
          </span>
        </div>

        <h3 className="mt-1 text-base sm:text-lg font-bold leading-relaxed text-[#fae8b4] mb-6">
          {currentQuestion.question}
        </h3>

        {/* 4 Shuffled Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const letters = ['A', 'B', 'C', 'D'];

            let btnStyle = 'border-stone-800 bg-[#251b12] text-stone-200 hover:border-stone-700 hover:bg-[#302317]';
            if (isAnswered) {
              if (isSelected) {
                btnStyle = 'border-amber-400 bg-amber-500/20 text-[#fae8b4] shadow-lg shadow-amber-950/50 ring-1 ring-amber-400';
              } else {
                btnStyle = 'border-stone-900 bg-[#161009] text-stone-600 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                disabled={isAnswered}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer ${btnStyle}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/40 font-bold text-xs text-amber-300">
                  {letters[idx]}
                </span>
                <span className="font-medium leading-snug">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Feedback (Neutral amber glow, no reveal of right/wrong, automatic recording) */}
      {isAnswered && (
        <div className="rounded-2xl border border-amber-500/50 bg-[#26170d] p-4 text-sm leading-relaxed animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-[#fae8b4]">Жауап қабылданды</span>
                <p className="text-xs text-stone-300 mt-0.5">Нәтиже қорытынды есепке автоматты түрде қосылды.</p>
              </div>
            </div>

            <button
              onClick={handleNextOrFinish}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-amber-500 active:scale-95 shadow-md cursor-pointer shrink-0"
            >
              <span>
                {currentQIndex < questions.length - 1 
                  ? `КЕЛЕСІ СҰРАҚҚА ӨТУ (${currentQIndex + 2}/${questions.length})` 
                  : '6-КЕЗЕҢГЕ ӨТУ (ҚОРШАУ ШАЙҚАСЫ)'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Prompt reminder */}
      {!isAnswered && (
        <div className="text-center text-xs text-stone-500">
          ⚠️ Уақыт біткенге дейін (25 секунд) жауап беріңіз. Таңдалған нұсқа сары болып жанып, жауап қабылданады.
        </div>
      )}

    </div>
  );
};

