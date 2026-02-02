interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div
      className={`border border-border rounded-full bg-surface-sunken h-2.5 overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-success rounded-full transition-all duration-200"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface SegmentedProgressBarProps {
  correct: number;
  incorrect: number;
  total: number;
  className?: string;
}

export function SegmentedProgressBar({
  correct,
  incorrect,
  total,
  className = "",
}: SegmentedProgressBarProps) {
  if (total === 0) return null;
  const correctPct = (correct / total) * 100;
  const incorrectPct = (incorrect / total) * 100;

  return (
    <div
      className={`border border-border rounded-full bg-surface-sunken h-2.5 overflow-hidden flex ${className}`}
    >
      <div
        className="h-full bg-success transition-all duration-200"
        style={{ width: `${correctPct}%` }}
      />
      <div
        className="h-full bg-error transition-all duration-200"
        style={{ width: `${incorrectPct}%` }}
      />
    </div>
  );
}
