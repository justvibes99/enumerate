import { Link } from "react-router-dom";
import type { DataSet } from "../../types";
import type { SetProgress } from "../../types";
import { Badge } from "../ui/Badge";
import { formatRelativeDate } from "../../lib/utils";

interface SetHeaderProps {
  dataSet: DataSet;
  progress: SetProgress | null;
}

export function SetHeader({ dataSet, progress }: SetHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        to="/"
        className="text-sm font-heading font-bold text-ink/60 no-underline hover:text-ink"
      >
        ← Back to sets
      </Link>
      <div className="mt-4 flex items-start gap-4">
        <div
          className="text-5xl p-3 border-3 border-ink rounded shadow-brutal"
          style={{ backgroundColor: dataSet.accentColor }}
        >
          {dataSet.icon}
        </div>
        <div className="flex-1">
          <h1 className="font-heading font-bold text-3xl text-ink">
            {dataSet.title}
          </h1>
          <p className="text-ink/60 mt-1">{dataSet.description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge color="cream">{dataSet.items.length} items</Badge>
            <Badge color="mint">
              {dataSet.promptLabel} → {dataSet.matchLabel}
            </Badge>
            {progress && progress.lastStudiedAt > 0 && (
              <Badge color="lavender">
                Last studied {formatRelativeDate(progress.lastStudiedAt)}
              </Badge>
            )}
          </div>
          {progress && (
            <div className="flex gap-4 mt-3">
              <span className="font-mono text-sm">
                <span className="text-teal font-bold">{progress.masteredCount}</span> mastered
              </span>
              <span className="font-mono text-sm">
                <span className="text-yellow font-bold">{progress.learningCount}</span> learning
              </span>
              <span className="font-mono text-sm">
                <span className="text-ink/40 font-bold">{progress.newCount}</span> new
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
