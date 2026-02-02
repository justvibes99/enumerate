import { useState, useEffect, useCallback } from "react";
import type { DataSet, QuizDirection, Item, ReviewCard } from "../../types";

interface FlashcardModeProps {
  item: Item;
  card: ReviewCard;
  direction: QuizDirection;
  dataSet: DataSet;
  onRate: (quality: number) => void;
}

export function FlashcardMode({
  item,
  direction,
  dataSet,
  onRate,
}: FlashcardModeProps) {
  const [flipped, setFlipped] = useState(false);

  const front =
    direction === "prompt-to-match" ? item.prompt : item.match;
  const back =
    direction === "prompt-to-match" ? item.match : item.prompt;
  const frontLabel =
    direction === "prompt-to-match"
      ? dataSet.promptLabel
      : dataSet.matchLabel;
  const backLabel =
    direction === "prompt-to-match"
      ? dataSet.matchLabel
      : dataSet.promptLabel;

  // Reset flip on new card
  useEffect(() => {
    setFlipped(false);
  }, [item.id]);

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) {
          handleFlip();
        }
      }
      if (flipped) {
        if (e.key === "1") onRate(1);
        if (e.key === "2") onRate(3);
        if (e.key === "3") onRate(4);
        if (e.key === "4") onRate(5);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipped, handleFlip, onRate]);

  return (
    <div>
      {/* Card */}
      <div
        className="flip-card cursor-pointer mb-6"
        onClick={handleFlip}
        style={{ minHeight: "300px" }}
      >
        <div className={`flip-card-inner relative w-full ${flipped ? "flipped" : ""}`} style={{ minHeight: "300px" }}>
          {/* Front */}
          <div
            className="flip-card-front absolute inset-0 border border-border shadow-lg rounded-[var(--radius)] p-8 flex flex-col items-center justify-center bg-surface-raised
              hover:shadow-md transition-all duration-150"
          >
            <span className="text-xs font-body font-medium text-text-tertiary mb-4">
              {frontLabel}
            </span>
            <span className="font-heading text-4xl text-text-primary text-center">
              {front}
            </span>
            <span className="text-xs text-text-tertiary mt-6">
              Tap to reveal
            </span>
          </div>
          {/* Back */}
          <div
            className="flip-card-back absolute inset-0 border border-border shadow-lg rounded-[var(--radius)] p-8 flex flex-col items-center justify-center"
            style={{ backgroundColor: dataSet.accentColor }}
          >
            <span className="text-xs font-body font-medium text-text-primary/60 mb-4">
              {backLabel}
            </span>
            <span className="font-heading text-4xl text-text-primary text-center">
              {back}
            </span>
          </div>
        </div>
      </div>

      {/* Rating buttons (only when flipped) */}
      {flipped && (
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => onRate(1)}
            className="bg-error-light border border-error/30 shadow-sm rounded-[var(--radius-sm)] py-3 px-2
              font-body font-semibold text-sm text-error cursor-pointer
              transition-all duration-150 hover:shadow-md active:scale-[0.98]"
          >
            Again
            <span className="block text-xs font-mono text-error/60 mt-0.5">1</span>
          </button>
          <button
            onClick={() => onRate(3)}
            className="bg-warning-light border border-warning/30 shadow-sm rounded-[var(--radius-sm)] py-3 px-2
              font-body font-semibold text-sm text-warning cursor-pointer
              transition-all duration-150 hover:shadow-md active:scale-[0.98]"
          >
            Hard
            <span className="block text-xs font-mono text-warning/60 mt-0.5">2</span>
          </button>
          <button
            onClick={() => onRate(4)}
            className="bg-success-light border border-success/30 shadow-sm rounded-[var(--radius-sm)] py-3 px-2
              font-body font-semibold text-sm text-success cursor-pointer
              transition-all duration-150 hover:shadow-md active:scale-[0.98]"
          >
            Good
            <span className="block text-xs font-mono text-success/60 mt-0.5">3</span>
          </button>
          <button
            onClick={() => onRate(5)}
            className="bg-info-light border border-info/30 shadow-sm rounded-[var(--radius-sm)] py-3 px-2
              font-body font-semibold text-sm text-info cursor-pointer
              transition-all duration-150 hover:shadow-md active:scale-[0.98]"
          >
            Easy
            <span className="block text-xs font-mono text-info/60 mt-0.5">4</span>
          </button>
        </div>
      )}
    </div>
  );
}
