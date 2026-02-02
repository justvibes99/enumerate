import { Link } from "react-router-dom";
import type { DataSet, QuizDirection } from "../../types";
import { Toggle } from "../ui/Toggle";

interface StudyModeSelectorProps {
  dataSet: DataSet;
  direction: QuizDirection;
  onDirectionChange: (dir: QuizDirection) => void;
}

export function StudyModeSelector({
  dataSet,
  direction,
  onDirectionChange,
}: StudyModeSelectorProps) {
  const dirLabel1 = `${dataSet.promptLabel} → ${dataSet.matchLabel}`;
  const dirLabel2 = `${dataSet.matchLabel} → ${dataSet.promptLabel}`;
  const dirParam = direction === "match-to-prompt" ? "?dir=match-to-prompt" : "";

  const canMultipleChoice = dataSet.items.length >= 4;

  const modes = [
    {
      title: "Flashcards",
      description: "Flip cards and self-rate",
      bg: "bg-error-light",
      to: `/set/${dataSet.id}/flashcard${dirParam}`,
      enabled: true,
    },
    {
      title: "Multiple Choice",
      description: canMultipleChoice
        ? "Pick from 4 options"
        : "Need at least 4 items",
      bg: "bg-success-light",
      to: `/set/${dataSet.id}/multiple-choice${dirParam}`,
      enabled: canMultipleChoice,
    },
    {
      title: "Typed Answer",
      description: "Type the answer from memory",
      bg: "bg-warning-light",
      to: `/set/${dataSet.id}/typed-answer${dirParam}`,
      enabled: true,
    },
  ];

  return (
    <div className="mb-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="font-heading text-xl text-text-primary">Study Modes</h2>
        <Toggle
          options={[dirLabel1, dirLabel2]}
          value={direction === "prompt-to-match" ? dirLabel1 : dirLabel2}
          onChange={(v) =>
            onDirectionChange(
              v === dirLabel1 ? "prompt-to-match" : "match-to-prompt",
            )
          }
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((mode) =>
          mode.enabled ? (
            <Link key={mode.title} to={mode.to} className="no-underline">
              <div
                className={`${mode.bg} border border-border shadow-sm rounded-[var(--radius)] p-4 text-center
                  transition-all duration-150 cursor-pointer
                  hover:shadow-lg active:scale-[0.98]`}
              >
                <h3 className="font-heading text-lg text-text-primary">
                  {mode.title}
                </h3>
                <p className="text-sm text-text-secondary mt-1">{mode.description}</p>
              </div>
            </Link>
          ) : (
            <div
              key={mode.title}
              className="bg-surface-sunken border border-border/50 rounded-[var(--radius)] p-4 text-center opacity-50"
            >
              <h3 className="font-heading text-lg text-text-tertiary">
                {mode.title}
              </h3>
              <p className="text-sm text-text-tertiary mt-1">{mode.description}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
