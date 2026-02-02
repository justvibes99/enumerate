import { PageContainer } from "../components/layout/PageContainer";
import { ProgressOverview } from "../components/home/ProgressOverview";
import { DueReviewBanner } from "../components/home/DueReviewBanner";
import { SetGrid } from "../components/home/SetGrid";
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

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="font-heading text-xl text-ink/50">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProgressOverview
        totalSets={dataSets.length}
        masteredCount={globalMastered}
        currentStreak={globalStreak.current}
        todaySessions={todaySessions}
      />
      <DueReviewBanner dueCardCount={dueCardCount} dueSets={dueSets} />
      <SetGrid dataSets={dataSets} />
    </PageContainer>
  );
}
