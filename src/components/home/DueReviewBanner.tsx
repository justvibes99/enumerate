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
    <div className="bg-yellow border-3 border-ink shadow-brutal-lg rounded p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-heading font-bold text-lg text-ink">
            You have {dueCardCount} card{dueCardCount !== 1 ? "s" : ""} due for
            review across {dueSets.length} set{dueSets.length !== 1 ? "s" : ""}
          </p>
          <p className="text-sm text-ink/70 mt-1">
            Keep your streak going!
          </p>
        </div>
        <Link
          to={`/set/${topSet.dataSetId}`}
          className="bg-ink text-cream border-3 border-ink rounded px-6 py-3
            font-heading font-bold text-sm no-underline
            transition-all duration-100
            hover:bg-ink/80"
        >
          REVIEW NOW
        </Link>
      </div>
    </div>
  );
}
