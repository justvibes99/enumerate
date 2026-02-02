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
            className="flip-card-front absolute inset-0 border-3 border-ink shadow-brutal-lg rounded p-8 flex flex-col items-center justify-center bg-cream
              hover:shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
          >
            <span className="text-xs font-heading uppercase tracking-wider text-ink/40 mb-4">
              {frontLabel}
            </span>
            <span className="font-heading font-bold text-4xl text-ink text-center">
              {front}
            </span>
            <span className="text-xs text-ink/30 mt-6">
              Tap to reveal
            </span>
          </div>
          {/* Back */}
          <div
            className="flip-card-back absolute inset-0 border-3 border-ink shadow-brutal-lg rounded p-8 flex flex-col items-center justify-center"
            style={{ backgroundColor: dataSet.accentColor }}
          >
            <span className="text-xs font-heading uppercase tracking-wider text-ink/40 mb-4">
              {backLabel}
            </span>
            <span className="font-heading font-bold text-4xl text-ink text-center">
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
            className="bg-coral border-3 border-ink shadow-brutal rounded py-3 px-2
              font-heading font-bold text-sm text-ink cursor-pointer
              transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm"
          >
            Again
            <span className="block text-xs font-mono text-ink/50 mt-0.5">1</span>
          </button>
          <button
            onClick={() => onRate(3)}
            className="bg-salmon border-3 border-ink shadow-brutal rounded py-3 px-2
              font-heading font-bold text-sm text-ink cursor-pointer
              transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm"
          >
            Hard
            <span className="block text-xs font-mono text-ink/50 mt-0.5">2</span>
          </button>
          <button
            onClick={() => onRate(4)}
            className="bg-teal border-3 border-ink shadow-brutal rounded py-3 px-2
              font-heading font-bold text-sm text-ink cursor-pointer
              transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm"
          >
            Good
            <span className="block text-xs font-mono text-ink/50 mt-0.5">3</span>
          </button>
          <button
            onClick={() => onRate(5)}
            className="bg-mint border-3 border-ink shadow-brutal rounded py-3 px-2
              font-heading font-bold text-sm text-ink cursor-pointer
              transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm"
          >
            Easy
            <span className="block text-xs font-mono text-ink/50 mt-0.5">4</span>
          </button>
        </div>
      )}
    </div>
  );
}
