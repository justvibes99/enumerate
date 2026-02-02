import { useState, useEffect, useRef } from "react";
import type { DataSet, QuizDirection, Item } from "../../types";
import { fuzzyMatch, type MatchResult } from "../../lib/fuzzy-match";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { AnswerFeedback } from "./AnswerFeedback";

interface TypedAnswerModeProps {
  item: Item;
  direction: QuizDirection;
  dataSet: DataSet;
  onAnswer: (quality: number, userAnswer: string) => void;
}

export function TypedAnswerMode({
  item,
  direction,
  dataSet,
  onAnswer,
}: TypedAnswerModeProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = direction === "prompt-to-match" ? item.prompt : item.match;
  const correctAnswer = direction === "prompt-to-match" ? item.match : item.prompt;
  const promptLabel =
    direction === "prompt-to-match" ? dataSet.promptLabel : dataSet.matchLabel;

  // Reset on new card
  useEffect(() => {
    setAnswer("");
    setResult(null);
    inputRef.current?.focus();
  }, [item.id]);

  const handleCheck = () => {
    if (!answer.trim()) return;
    const matchResult = fuzzyMatch(answer, correctAnswer);
    setResult(matchResult);
  };

  const handleNext = () => {
    if (result) {
      onAnswer(result.quality, answer);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (result) {
          handleNext();
        } else {
          handleCheck();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [result, answer]);

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

      {/* Answer input */}
      {!result && (
        <div className="space-y-4">
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
          />
          <Button onClick={handleCheck} fullWidth disabled={!answer.trim()}>
            Check
          </Button>
        </div>
      )}

      {/* Feedback */}
      {result && (
        <AnswerFeedback
          correct={result.exact || result.close}
          close={result.close}
          correctAnswer={correctAnswer}
          userAnswer={answer}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
