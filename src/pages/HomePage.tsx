import { useState, useMemo } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { ProgressOverview } from "../components/home/ProgressOverview";
import { DueReviewBanner } from "../components/home/DueReviewBanner";
import { SetGrid } from "../components/home/SetGrid";
import { Input } from "../components/ui/Input";
import { useStorage } from "../hooks/useStorage";

export function HomePage() {
  const {
    dataSets,
    loading,
    dueCardCount,
    dueSets,
    globalStreak,
    globalMastered,
    todaySessions,
  } = useStorage();

  const [search, setSearch] = useState("");

  const filteredSets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dataSets;
    return dataSets.filter(
      (ds) =>
        ds.title.toLowerCase().includes(q) ||
        ds.description.toLowerCase().includes(q),
    );
  }, [dataSets, search]);

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="font-heading text-xl text-text-tertiary">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {dataSets.length > 0 && (
        <Input
          type="text"
          placeholder="Search sets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
      )}
      <ProgressOverview
        totalSets={dataSets.length}
        masteredCount={globalMastered}
        currentStreak={globalStreak.current}
        todaySessions={todaySessions}
      />
      <DueReviewBanner dueCardCount={dueCardCount} dueSets={dueSets} />
      <SetGrid dataSets={filteredSets} />
    </PageContainer>
  );
}
