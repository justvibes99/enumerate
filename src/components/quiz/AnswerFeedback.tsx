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
      className={`border rounded-[var(--radius)] p-4 text-center mb-4 ${
        correct ? "bg-success-light border-success/30" : close ? "bg-warning-light border-warning/30" : "bg-error-light border-error/30"
      }`}
    >
      <div className="text-3xl mb-2">
        {correct ? "✓" : close ? "≈" : "✗"}
      </div>
      <p className="font-heading text-lg text-text-primary">
        {correct ? "Nice!" : close ? "Close!" : "Not quite"}
      </p>
      {!correct && userAnswer && (
        <p className="text-sm text-text-secondary mt-1">
          You answered: <span className="font-bold">{userAnswer}</span>
        </p>
      )}
      <p className="text-sm text-text-primary mt-1">
        Correct answer: <span className="font-bold">{correctAnswer}</span>
      </p>
      <button
        onClick={onNext}
        className="mt-4 bg-primary text-white border border-primary rounded-[var(--radius-sm)] px-6 py-2
          font-body font-semibold text-sm cursor-pointer
          transition-all duration-150 hover:bg-primary-hover hover:shadow-md active:scale-[0.98]"
      >
        Next
      </button>
    </div>
  );
}
