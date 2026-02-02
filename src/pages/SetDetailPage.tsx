import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DataSet, QuizDirection } from "../types";
import { getDataSet } from "../lib/storage";
import { useSetProgress } from "../hooks/useStorage";
import { PageContainer } from "../components/layout/PageContainer";
import { SetHeader } from "../components/set-detail/SetHeader";
import { StudyModeSelector } from "../components/set-detail/StudyModeSelector";
import { ItemTable } from "../components/set-detail/ItemTable";
import { Button } from "../components/ui/Button";

export function SetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dataSet, setDataSet] = useState<DataSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<QuizDirection>("prompt-to-match");
  const { progress } = useSetProgress(id ?? "");

  useEffect(() => {
    if (!id) return;
    getDataSet(id).then((ds) => {
      setDataSet(ds ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-center py-16 font-heading text-xl text-text-tertiary">
          Loading...
        </p>
      </PageContainer>
    );
  }

  if (!dataSet) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="font-heading text-xl text-text-tertiary mb-4">
            Set not found
          </p>
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SetHeader dataSet={dataSet} progress={progress} />
      <StudyModeSelector
        dataSet={dataSet}
        direction={direction}
        onDirectionChange={setDirection}
      />
      <div className="flex gap-3 mb-4">
        <Link to={`/set/${dataSet.id}/stats`}>
          <Button variant="secondary" size="sm">
            View Stats
          </Button>
        </Link>
        {!dataSet.isBuiltIn && (
          <Link to={`/set/${dataSet.id}/edit`}>
            <Button variant="secondary" size="sm">
              Edit Set
            </Button>
          </Link>
        )}
      </div>
      <ItemTable dataSet={dataSet} />
    </PageContainer>
  );
}
