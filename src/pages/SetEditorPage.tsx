import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { DataSet } from "../types";
import { getDataSet } from "../lib/storage";
import { PageContainer } from "../components/layout/PageContainer";
import { SetEditorForm } from "../components/set-editor/SetEditorForm";

export function SetEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [dataSet, setDataSet] = useState<DataSet | undefined>(undefined);
  const [loading, setLoading] = useState(isEditing);

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
      <h1 className="font-heading text-3xl text-text-primary mt-4 mb-6">
        {isEditing ? "Edit Set" : "Create New Set"}
      </h1>
      <SetEditorForm existingSet={dataSet} />
    </PageContainer>
  );
}
