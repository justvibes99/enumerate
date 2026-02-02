interface AnswerFeedbackProps {
  correct: boolean;
  correctAnswer: string;
  userAnswer?: string;
  close?: boolean; // fuzzy match was close
  onNext: () => void;
}

export function AnswerFeedback({
  correct,
  correctAnswer,
  userAnswer,
  close = false,
  onNext,
}: AnswerFeedbackProps) {
  return (
    <div
      className={`border-3 border-ink rounded p-6 text-center mb-4 ${
        correct ? "bg-teal" : close ? "bg-yellow" : "bg-coral"
      }`}
    >
      <div className="text-3xl mb-2">
        {correct ? "✓" : close ? "≈" : "✗"}
      </div>
      <p className="font-heading font-bold text-lg text-ink">
        {correct ? "Nice!" : close ? "Close!" : "Not quite"}
      </p>
      {!correct && userAnswer && (
        <p className="text-sm text-ink/70 mt-1">
          You answered: <span className="font-bold">{userAnswer}</span>
        </p>
      )}
      <p className="text-sm text-ink mt-1">
        Correct answer: <span className="font-bold">{correctAnswer}</span>
      </p>
      <button
        onClick={onNext}
        className="mt-4 bg-ink text-cream border-3 border-ink rounded px-6 py-2
          font-heading font-bold text-sm cursor-pointer
          transition-all duration-100 hover:bg-ink/80"
      >
        NEXT
      </button>
    </div>
  );
}
