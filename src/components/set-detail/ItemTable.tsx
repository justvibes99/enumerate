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
    new: "cream" as const,
    learning: "yellow" as const,
    mastered: "teal" as const,
  };

  return (
    <div className="mb-8">
      <h2 className="font-heading font-bold text-xl text-ink mb-4">
        Items ({dataSet.items.length})
      </h2>
      <div className="border-3 border-ink rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-ink text-cream">
              <th className="text-left px-4 py-3 font-heading text-sm font-bold w-12">
                #
              </th>
              <th className="text-left px-4 py-3 font-heading text-sm font-bold">
                {dataSet.promptLabel}
              </th>
              <th className="text-left px-4 py-3 font-heading text-sm font-bold">
                {dataSet.matchLabel}
              </th>
              <th className="text-left px-4 py-3 font-heading text-sm font-bold w-24">
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
                  className={`border-t-2 border-ink/10 ${i % 2 === 0 ? "bg-cream" : "bg-white"}`}
                >
                  <td className="px-4 py-2 font-mono text-sm text-ink/40">
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
