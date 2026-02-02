import type { SetProgress } from "../../types";

interface SetStatsViewProps {
  progress: SetProgress;
}

export function SetStatsView({ progress }: SetStatsViewProps) {
  const total = progress.totalItems;
  const masteredPct = total > 0 ? Math.round((progress.masteredCount / total) * 100) : 0;

  // SVG donut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (masteredPct / 100) * circumference;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
      {/* Donut chart */}
      <div className="relative">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#FFF8E7"
            strokeWidth="16"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#4ECDC4"
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono font-bold text-3xl text-ink">
            {masteredPct}%
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border-3 border-ink rounded bg-cream p-4 text-center shadow-brutal">
          <div className="font-mono font-bold text-2xl text-ink/40">
            {progress.newCount}
          </div>
          <div className="text-xs font-heading uppercase tracking-wider text-ink/60 mt-1">
            New
          </div>
        </div>
        <div className="border-3 border-ink rounded bg-yellow p-4 text-center shadow-brutal">
          <div className="font-mono font-bold text-2xl text-ink">
            {progress.learningCount}
          </div>
          <div className="text-xs font-heading uppercase tracking-wider text-ink/60 mt-1">
            Learning
          </div>
        </div>
        <div className="border-3 border-ink rounded bg-teal p-4 text-center shadow-brutal">
          <div className="font-mono font-bold text-2xl text-ink">
            {progress.masteredCount}
          </div>
          <div className="text-xs font-heading uppercase tracking-wider text-ink/60 mt-1">
            Mastered
          </div>
        </div>
      </div>
    </div>
  );
}
