import { useEffect, useState } from "react";
import type { DataSet, ReviewCard } from "../../types";
import { getReviewCards } from "../../lib/storage";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../lib/utils";

interface ItemBreakdownProps {
  dataSet: DataSet;
}

type SortKey = "prompt" | "status" | "ease" | "nextReview" | "ratio";

export function ItemBreakdown({ dataSet }: ItemBreakdownProps) {
  const [cards, setCards] = useState<Map<string, ReviewCard>>(new Map());
  const [sortBy, setSortBy] = useState<SortKey>("prompt");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    getReviewCards(dataSet.id, "prompt-to-match").then((reviewCards) => {
      const map = new Map<string, ReviewCard>();
      for (const c of reviewCards) {
        map.set(c.itemId, c);
      }
      setCards(map);
    });
  }, [dataSet.id]);

  const getStatus = (card?: ReviewCard) => {
    if (!card || card.lastReviewedAt === 0) return "new";
    if (card.interval >= 21) return "mastered";
    return "learning";
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  };

  const sorted = [...dataSet.items].sort((a, b) => {
    const cardA = cards.get(a.id);
    const cardB = cards.get(b.id);
    let cmp = 0;

    switch (sortBy) {
      case "prompt":
        cmp = a.prompt.localeCompare(b.prompt);
        break;
      case "status": {
        const order = { new: 0, learning: 1, mastered: 2 };
        cmp = order[getStatus(cardA)] - order[getStatus(cardB)];
        break;
      }
      case "ease":
        cmp = (cardA?.easeFactor ?? 2.5) - (cardB?.easeFactor ?? 2.5);
        break;
      case "nextReview":
        cmp = (cardA?.nextReviewDate ?? 0) - (cardB?.nextReviewDate ?? 0);
        break;
      case "ratio": {
        const ratioA =
          cardA && cardA.correctCount + cardA.incorrectCount > 0
            ? cardA.correctCount / (cardA.correctCount + cardA.incorrectCount)
            : 0;
        const ratioB =
          cardB && cardB.correctCount + cardB.incorrectCount > 0
            ? cardB.correctCount / (cardB.correctCount + cardB.incorrectCount)
            : 0;
        cmp = ratioA - ratioB;
        break;
      }
    }

    return sortAsc ? cmp : -cmp;
  });

  const statusColor = {
    new: "neutral" as const,
    learning: "warning" as const,
    mastered: "success" as const,
  };

  const SortHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: SortKey;
  }) => (
    <th
      className="text-left px-3 py-2 text-xs font-body font-semibold cursor-pointer hover:bg-surface-raised"
      onClick={() => handleSort(sortKey)}
    >
      {label} {sortBy === sortKey ? (sortAsc ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div>
      <h3 className="font-heading text-lg text-text-primary mb-3">
        Item Breakdown
      </h3>
      <div className="border border-border rounded-[var(--radius)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-sunken text-text-secondary">
              <SortHeader label="Prompt" sortKey="prompt" />
              <th className="text-left px-3 py-2 text-xs font-body font-semibold">
                Match
              </th>
              <SortHeader label="Status" sortKey="status" />
              <SortHeader label="Ease" sortKey="ease" />
              <SortHeader label="Next Review" sortKey="nextReview" />
              <SortHeader label="Correct %" sortKey="ratio" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => {
              const card = cards.get(item.id);
              const status = getStatus(card);
              const total = (card?.correctCount ?? 0) + (card?.incorrectCount ?? 0);
              const ratio =
                total > 0
                  ? Math.round(((card?.correctCount ?? 0) / total) * 100)
                  : 0;

              return (
                <tr
                  key={item.id}
                  className={`border-t border-border ${i % 2 === 0 ? "bg-surface-raised" : "bg-surface-sunken"}`}
                >
                  <td className="px-3 py-2 font-medium">{item.prompt}</td>
                  <td className="px-3 py-2">{item.match}</td>
                  <td className="px-3 py-2">
                    <Badge color={statusColor[status]}>{status}</Badge>
                  </td>
                  <td className="px-3 py-2 font-body">
                    {card ? card.easeFactor.toFixed(1) : "—"}
                  </td>
                  <td className="px-3 py-2 font-body text-xs">
                    {card && card.nextReviewDate > 0
                      ? formatDate(card.nextReviewDate)
                      : "—"}
                  </td>
                  <td className="px-3 py-2 font-body">
                    {total > 0 ? `${ratio}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
