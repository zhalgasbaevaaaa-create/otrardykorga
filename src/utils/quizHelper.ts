import { HistoricalQuestion } from '../types';

export interface ShuffledQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  originalCorrectText: string;
}

export function shuffleQuestion(q: HistoricalQuestion): ShuffledQuestion {
  const correctText = q.options[q.correctIndex];
  
  // Create indexed pairs [originalOption, originalIndex]
  const indexed = q.options.map((opt, idx) => ({ opt, isCorrect: idx === q.correctIndex }));
  
  // Fisher-Yates shuffle
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  
  const newOptions = indexed.map(item => item.opt);
  const newCorrectIndex = indexed.findIndex(item => item.isCorrect);

  return {
    id: q.id,
    question: q.question,
    options: newOptions,
    correctIndex: newCorrectIndex,
    explanation: q.explanation,
    originalCorrectText: correctText
  };
}
