import { useEffect, useState } from "react";
import { getQuizSessions } from "../../lib/storage";
import { toDateKey } from "../../lib/utils";

interface StreakCalendarProps {
  dataSetId: string;
}

export function StreakCalendar({ dataSetId }: StreakCalendarProps) {
  const [dayCounts, setDayCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    getQuizSessions(dataSetId).then((sessions) => {
      const counts = new Map<string, number>();
      for (const s of sessions) {
        if (s.completedAt > 0) {
          const key = toDateKey(s.completedAt);
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
      }
      setDayCounts(counts);
    });
  }, [dataSetId]);

  // Generate last 60 days
  const days: string[] = [];
  const now = new Date();
  for (let i = 59; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    days.push(toDateKey(d.getTime()));
  }

  const maxCount = Math.max(1, ...Array.from(dayCounts.values()));

  function getColor(count: number): string {
    if (count === 0) return "#FFF8E7"; // cream
    const ratio = count / maxCount;
    if (ratio < 0.33) return "#95E1D3"; // mint
    if (ratio < 0.66) return "#4ECDC4"; // teal
    return "#FF6B6B"; // coral
  }

  return (
    <div className="mb-8">
      <h3 className="font-heading font-bold text-lg text-ink mb-3">
        Activity (Last 60 Days)
      </h3>
      <div className="border-3 border-ink rounded p-4 bg-white inline-block">
        <div className="flex flex-wrap gap-1" style={{ maxWidth: "330px" }}>
          {days.map((day) => {
            const count = dayCounts.get(day) ?? 0;
            return (
              <div
                key={day}
                className="w-4 h-4 border border-ink/20 rounded-sm"
                style={{ backgroundColor: getColor(count) }}
                title={`${day}: ${count} session${count !== 1 ? "s" : ""}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-ink/60">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#FFF8E7", border: "1px solid #2D2D2D33" }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#95E1D3" }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#4ECDC4" }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#FF6B6B" }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
