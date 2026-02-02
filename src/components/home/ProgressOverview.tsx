interface ProgressOverviewProps {
  totalSets: number;
  masteredCount: number;
  currentStreak: number;
  todaySessions: number;
}

export function ProgressOverview({
  totalSets,
  masteredCount,
  currentStreak,
  todaySessions,
}: ProgressOverviewProps) {
  const stats = [
    { label: "SETS", value: totalSets, bg: "bg-mint" },
    { label: "MASTERED", value: masteredCount, bg: "bg-teal" },
    { label: "STREAK", value: `${currentStreak}d`, bg: "bg-lavender" },
    { label: "TODAY", value: todaySessions, bg: "bg-yellow" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} border-3 border-ink rounded shadow-brutal p-4 text-center`}
        >
          <div className="font-mono font-bold text-2xl text-ink">
            {stat.value}
          </div>
          <div className="font-heading text-xs font-bold uppercase tracking-wider text-ink mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
