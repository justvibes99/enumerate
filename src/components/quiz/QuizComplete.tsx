import { Link } from "react-router-dom";
import type { DataSet, ItemResult, QuizMode } from "../../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface QuizCompleteProps {
  dataSet: DataSet;
  mode: QuizMode;
  results: ItemResult[];
}

export function QuizComplete({ dataSet, results }: QuizCompleteProps) {
  const correct = results.filter((r) => r.correct).length;
  const incorrect = results.filter((r) => !r.correct).length;
  const pct = Math.round((correct / results.length) * 100);

  const missedItems = results
    .filter((r) => !r.correct)
    .map((r) => {
      const item = dataSet.items.find((i) => i.id === r.itemId);
      return item ? { ...item, userAnswer: r.userAnswer } : null;
    })
    .filter(Boolean);

  return (
    <div className="max-w-lg mx-auto text-center">
      <Card className="mb-6">
        <div className="text-5xl mb-4">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
        <h2 className="font-heading font-bold text-2xl text-ink mb-2">
          Session Complete!
        </h2>
        <p className="text-ink/60 mb-4">
          You got {correct} out of {results.length} correct ({pct}%)
        </p>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="font-mono font-bold text-3xl text-teal">
              {correct}
            </div>
            <div className="text-xs font-heading uppercase tracking-wider text-ink/60">
              Correct
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono font-bold text-3xl text-coral">
              {incorrect}
            </div>
            <div className="text-xs font-heading uppercase tracking-wider text-ink/60">
              Incorrect
            </div>
          </div>
        </div>
      </Card>

      {missedItems.length > 0 && (
        <Card className="mb-6 text-left">
          <h3 className="font-heading font-bold text-lg text-ink mb-3">
            Items to Review
          </h3>
          <div className="space-y-2">
            {missedItems.map(
              (item) =>
                item && (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-2 border-ink/10 rounded px-3 py-2"
                  >
                    <span className="font-medium">{item.prompt}</span>
                    <span className="text-teal font-bold">{item.match}</span>
                  </div>
                ),
            )}
          </div>
        </Card>
      )}

      <div className="flex justify-center gap-3">
        <Link to={`/set/${dataSet.id}`}>
          <Button variant="secondary">Back to Set</Button>
        </Link>
        <Link to="/">
          <Button variant="primary">Home</Button>
        </Link>
      </div>
    </div>
  );
}
