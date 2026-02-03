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
        <div>
          <h3 className="font-heading text-lg text-text-primary truncate">
            {dataSet.title}
          </h3>
          <p className="text-sm text-text-secondary mt-1">{dataSet.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-body text-xs text-text-tertiary">
              {dataSet.items.length} items
            </span>
            {progress && (
              <span className="font-body text-xs text-text-tertiary">
                {masteredPct}% mastered
              </span>
            )}
          </div>
          <ProgressBar value={masteredPct} className="mt-2" />
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
        <p className="font-heading text-xl text-text-tertiary">
          No sets yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {dataSets.map((ds) => (
        <SetCard key={ds.id} dataSet={ds} />
      ))}
    </div>
  );
}
