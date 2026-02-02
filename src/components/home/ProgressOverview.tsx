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
    { label: "Sets", value: totalSets, bg: "bg-surface-raised" },
    { label: "Mastered", value: masteredCount, bg: "bg-success-light" },
    { label: "Streak", value: `${currentStreak}d`, bg: "bg-info-light" },
    { label: "Today", value: todaySessions, bg: "bg-warning-light" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} border border-border rounded-[var(--radius)] shadow-sm p-3 text-center`}
        >
          <div className="font-mono font-bold text-2xl text-text-primary">
            {stat.value}
          </div>
          <div className="text-xs font-body font-medium text-text-secondary mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
