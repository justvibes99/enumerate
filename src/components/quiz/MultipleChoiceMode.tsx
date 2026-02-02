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
        className="border border-border rounded-[var(--radius)] shadow-lg p-6 mb-4 text-center"
        style={{ backgroundColor: dataSet.accentColor }}
      >
        <span className="text-xs font-body font-medium text-text-primary/60 block mb-2">
          {promptLabel}
        </span>
        <span className="font-heading text-3xl text-text-primary">
          {prompt}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          let classes = "bg-surface-raised border-border";
          if (answered) {
            if (option === correctAnswer) classes = "bg-success-light border-success/30";
            else if (option === selected) classes = "bg-error-light border-error/30";
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`${classes} border rounded-[var(--radius-sm)] p-4 text-left
                font-body font-semibold text-lg text-text-primary
                transition-all duration-150
                ${!answered ? "shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98]" : "shadow-none"}
                ${answered && option === correctAnswer ? "shadow-sm" : ""}
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
