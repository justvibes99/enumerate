import { Link } from "react-router-dom";
import type { DataSet } from "../../types";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useSetProgress } from "../../hooks/useStorage";

interface SetCardProps {
  dataSet: DataSet;
}

function SetCard({ dataSet }: SetCardProps) {
  const { progress } = useSetProgress(dataSet.id);
  const masteredPct = progress
    ? Math.round((progress.masteredCount / progress.totalItems) * 100)
    : 0;

  return (
    <Link to={`/set/${dataSet.id}`} className="no-underline">
      <Card accentColor={dataSet.accentColor} hoverable>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{dataSet.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-lg text-ink truncate">
              {dataSet.title}
            </h3>
            <p className="text-sm text-ink/60 mt-1">{dataSet.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="font-mono text-xs text-ink/60">
                {dataSet.items.length} items
              </span>
              {progress && (
                <span className="font-mono text-xs text-ink/60">
                  {masteredPct}% mastered
                </span>
              )}
            </div>
            <ProgressBar value={masteredPct} className="mt-2" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface SetGridProps {
  dataSets: DataSet[];
}

export function SetGrid({ dataSets }: SetGridProps) {
  if (dataSets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-heading text-xl text-ink/50">
          No sets yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dataSets.map((ds) => (
        <SetCard key={ds.id} dataSet={ds} />
      ))}
    </div>
  );
}
