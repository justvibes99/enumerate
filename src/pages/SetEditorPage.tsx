import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DataSet } from "../types";
import { getDataSet } from "../lib/storage";
import { PageContainer } from "../components/layout/PageContainer";
import { SetEditorForm } from "../components/set-editor/SetEditorForm";
import { AIGenerate } from "../components/set-editor/AIGenerate";
import type { GeneratedSet } from "../lib/generate-set";

export function SetEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [dataSet, setDataSet] = useState<DataSet | undefined>(undefined);
  const [loading, setLoading] = useState(isEditing);
  const [aiData, setAiData] = useState<GeneratedSet | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getDataSet(id).then((ds) => {
        setDataSet(ds);
        setLoading(false);
      });
    }
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

  return (
    <PageContainer className="max-w-3xl">
      <Link
        to={isEditing && dataSet ? `/set/${dataSet.id}` : "/"}
        className="text-sm font-body font-medium text-text-secondary no-underline hover:text-text-primary"
      >
        ← Back
      </Link>
      <h1 className="font-heading text-3xl text-text-primary mt-4 mb-4">
        {isEditing ? "Edit Set" : "Create New Set"}
      </h1>
      {!isEditing && (
        <>
          <AIGenerate onGenerated={setAiData} />
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs font-body font-medium text-text-tertiary uppercase tracking-wider">
              or create manually
            </span>
            <div className="flex-1 border-t border-border" />
          </div>
        </>
      )}
      <SetEditorForm existingSet={dataSet} aiData={aiData} />
    </PageContainer>
  );
}
