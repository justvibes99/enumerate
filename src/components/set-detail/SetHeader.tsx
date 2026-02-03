import { Link } from "react-router-dom";
import type { DataSet } from "../../types";
import type { SetProgress } from "../../types";

interface SetHeaderProps {
  dataSet: DataSet;
  progress: SetProgress | null;
}

export function SetHeader({ dataSet }: SetHeaderProps) {
  return (
    <div className="mb-5">
      <Link
        to="/"
        className="text-sm font-body font-medium text-text-secondary no-underline hover:text-text-primary"
      >
        ← Back to sets
      </Link>
      <div className="mt-4">
        <h1 className="font-heading text-3xl text-text-primary">
          {dataSet.title}
        </h1>
        <p className="text-text-secondary mt-1">{dataSet.description}</p>
      </div>
    </div>
  );
}
