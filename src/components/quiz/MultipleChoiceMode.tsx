import { useState, useEffect, useMemo } from "react";
import type { DataSet, QuizDirection, Item } from "../../types";
import { shuffle } from "../../lib/utils";

interface MultipleChoiceModeProps {
  item: Item;
  direction: QuizDirection;
  dataSet: DataSet;
  onAnswer: (correct: boolean) => void;
}

export function MultipleChoiceMode({
  item,
  direction,
  dataSet,
  onAnswer,
}: MultipleChoiceModeProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const prompt = direction === "prompt-to-match" ? item.prompt : item.match;
  const correctAnswer = direction === "prompt-to-match" ? item.match : item.prompt;
  const promptLabel =
    direction === "prompt-to-match" ? dataSet.promptLabel : dataSet.matchLabel;

  // Generate 4 options
  const options = useMemo(() => {
    const field = direction === "prompt-to-match" ? "match" : "prompt";
    const others = dataSet.items
      .filter((i) => i[field] !== correctAnswer)
      .map((i) => i[field]);
    const wrongOptions = shuffle(others).slice(0, 3);
    return shuffle([correctAnswer, ...wrongOptions]);
  }, [item.id, direction, dataSet.items, correctAnswer]);

  // Reset on new card
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
  }, [item.id]);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct = option === correctAnswer;

    // Auto-advance after delay
    setTimeout(() => {
      onAnswer(correct);
    }, 1200);
  };

  return (
    <div>
      {/* Prompt */}
      <div
        className="border-3 border-ink rounded shadow-brutal-lg p-8 mb-6 text-center"
        style={{ backgroundColor: dataSet.accentColor }}
      >
        <span className="text-xs font-heading uppercase tracking-wider text-ink/40 block mb-2">
          {promptLabel}
        </span>
        <span className="font-heading font-bold text-3xl text-ink">
          {prompt}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          let bg = "bg-white";
          if (answered) {
            if (option === correctAnswer) bg = "bg-teal";
            else if (option === selected) bg = "bg-coral";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`${bg} border-3 border-ink rounded p-4 text-left
                font-heading font-bold text-lg text-ink
                transition-all duration-100
                ${!answered ? "shadow-brutal cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm" : "shadow-none"}
                ${answered && option === correctAnswer ? "shadow-brutal" : ""}
              `}
            >
              {option}
              {answered && option === correctAnswer && (
                <span className="ml-2">✓</span>
              )}
              {answered && option === selected && option !== correctAnswer && (
                <span className="ml-2">✗</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
