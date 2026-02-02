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
      bg: "bg-coral",
      to: `/set/${dataSet.id}/flashcard${dirParam}`,
      enabled: true,
    },
    {
      title: "Multiple Choice",
      description: canMultipleChoice
        ? "Pick from 4 options"
        : "Need at least 4 items",
      bg: "bg-teal",
      to: `/set/${dataSet.id}/multiple-choice${dirParam}`,
      enabled: canMultipleChoice,
    },
    {
      title: "Typed Answer",
      description: "Type the answer from memory",
      bg: "bg-yellow",
      to: `/set/${dataSet.id}/typed-answer${dirParam}`,
      enabled: true,
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="font-heading font-bold text-xl text-ink">Study Modes</h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {modes.map((mode) =>
          mode.enabled ? (
            <Link key={mode.title} to={mode.to} className="no-underline">
              <div
                className={`${mode.bg} border-3 border-ink shadow-brutal-lg rounded p-6 text-center
                  transition-all duration-100 cursor-pointer
                  hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none`}
              >
                <h3 className="font-heading font-bold text-lg text-ink">
                  {mode.title}
                </h3>
                <p className="text-sm text-ink/70 mt-1">{mode.description}</p>
              </div>
            </Link>
          ) : (
            <div
              key={mode.title}
              className="bg-cream border-3 border-ink/30 rounded p-6 text-center opacity-50"
            >
              <h3 className="font-heading font-bold text-lg text-ink/50">
                {mode.title}
              </h3>
              <p className="text-sm text-ink/40 mt-1">{mode.description}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
