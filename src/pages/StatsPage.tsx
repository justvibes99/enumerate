import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DataSet } from "../types";
import { getDataSet } from "../lib/storage";
import { useSetProgress } from "../hooks/useStorage";
import { PageContainer } from "../components/layout/PageContainer";
import { SetStatsView } from "../components/stats/SetStatsView";
import { StreakCalendar } from "../components/stats/StreakCalendar";
import { ItemBreakdown } from "../components/stats/ItemBreakdown";
import { Button } from "../components/ui/Button";

export function StatsPage() {
  const { id } = useParams<{ id: string }>();
  const [dataSet, setDataSet] = useState<DataSet | null>(null);
  const [loading, setLoading] = useState(true);
  const { progress } = useSetProgress(id ?? "");

  useEffect(() => {
    if (id) {
      getDataSet(id).then((ds) => {
        setDataSet(ds ?? null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !dataSet) {
    return (
      <PageContainer>
        <p className="text-center py-16 font-heading text-xl text-ink/50">
          Loading...
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link
        to={`/set/${dataSet.id}`}
        className="text-sm font-heading font-bold text-ink/60 no-underline hover:text-ink"
      >
        ← Back to {dataSet.title}
      </Link>
      <h1 className="font-heading font-bold text-3xl text-ink mt-4 mb-6">
        {dataSet.icon} {dataSet.title} — Stats
      </h1>

      {progress && <SetStatsView progress={progress} />}
      <StreakCalendar dataSetId={dataSet.id} />
      <ItemBreakdown dataSet={dataSet} />

      <div className="mt-8">
        <Link to={`/set/${dataSet.id}`}>
          <Button variant="secondary">Back to Set</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
