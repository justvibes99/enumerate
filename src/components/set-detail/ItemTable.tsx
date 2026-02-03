import type { DataSet } from "../../types";
import { Badge } from "../ui/Badge";
import { useEffect, useState } from "react";
import { getReviewCards } from "../../lib/storage";
import type { ReviewCard } from "../../types";

interface ItemTableProps {
  dataSet: DataSet;
}

export function ItemTable({ dataSet }: ItemTableProps) {
  const [cardMap, setCardMap] = useState<Map<string, ReviewCard>>(new Map());

  useEffect(() => {
    getReviewCards(dataSet.id, "prompt-to-match").then((cards) => {
      const map = new Map<string, ReviewCard>();
      for (const card of cards) {
        map.set(card.itemId, card);
      }
      setCardMap(map);
    });
  }, [dataSet.id]);

  function getStatus(itemId: string): "new" | "learning" | "mastered" {
    const card = cardMap.get(itemId);
    if (!card || card.lastReviewedAt === 0) return "new";
    if (card.interval >= 21) return "mastered";
    return "learning";
  }

  const statusColor = {
    new: "neutral" as const,
    learning: "warning" as const,
    mastered: "success" as const,
  };

  return (
    <div className="mb-5">
      <h2 className="font-heading text-xl text-text-primary mb-4">
        Items ({dataSet.items.length})
      </h2>
      <div className="border border-border rounded-[var(--radius)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-sunken">
              <th className="text-left px-4 py-3 text-sm font-body font-semibold text-text-secondary w-12">
                #
              </th>
              <th className="text-left px-4 py-3 text-sm font-body font-semibold text-text-secondary">
                {dataSet.promptLabel}
              </th>
              <th className="text-left px-4 py-3 text-sm font-body font-semibold text-text-secondary">
                {dataSet.matchLabel}
              </th>
              <th className="text-left px-4 py-3 text-sm font-body font-semibold text-text-secondary w-24">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {dataSet.items.map((item, i) => {
              const status = getStatus(item.id);
              return (
                <tr
                  key={item.id}
                  className={`border-t border-border ${i % 2 === 0 ? "bg-surface-raised" : "bg-surface-sunken"}`}
                >
                  <td className="px-4 py-2 font-body text-sm text-text-tertiary">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {item.prompt}
                  </td>
                  <td className="px-4 py-2 text-sm">{item.match}</td>
                  <td className="px-4 py-2">
                    <Badge color={statusColor[status]}>{status}</Badge>
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
