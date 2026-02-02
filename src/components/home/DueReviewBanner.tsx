import { Link } from "react-router-dom";

interface DueReviewBannerProps {
  dueCardCount: number;
  dueSets: Array<{ dataSetId: string; count: number }>;
}

export function DueReviewBanner({
  dueCardCount,
  dueSets,
}: DueReviewBannerProps) {
  if (dueCardCount === 0 || dueSets.length === 0) return null;

  // Link to the set with the most due cards
  const topSet = dueSets.sort((a, b) => b.count - a.count)[0];

  return (
    <div className="bg-primary-light border border-primary/30 shadow-md rounded-[var(--radius)] p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-heading text-lg text-text-primary">
            You have {dueCardCount} card{dueCardCount !== 1 ? "s" : ""} due for
            review across {dueSets.length} set{dueSets.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            Keep your streak going!
          </p>
        </div>
        <Link
          to={`/set/${topSet.dataSetId}`}
          className="bg-primary text-white border border-primary rounded-[var(--radius-sm)] px-6 py-3
            font-body font-semibold text-sm no-underline
            transition-all duration-150
            hover:bg-primary-hover hover:shadow-md active:scale-[0.98]"
        >
          Review Now
        </Link>
      </div>
    </div>
  );
}
