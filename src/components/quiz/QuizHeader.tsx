import { SegmentedProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useState } from "react";

interface QuizHeaderProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  onQuit: () => void;
}

export function QuizHeader({
  currentIndex,
  totalCards,
  correctCount,
  incorrectCount,
  onQuit,
}: QuizHeaderProps) {
  const [showQuit, setShowQuit] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowQuit(true)}
        >
          ← Quit
        </Button>
        <div className="flex-1">
          <SegmentedProgressBar
            correct={correctCount}
            incorrect={incorrectCount}
            total={totalCards}
          />
        </div>
        <span className="font-body text-sm text-text-secondary whitespace-nowrap">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>
      <Modal
        open={showQuit}
        onClose={() => setShowQuit(false)}
        title="End Session?"
      >
        <p className="text-text-primary mb-4">
          Your answers so far have been saved. End this session and see your results?
        </p>
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={onQuit}
          >
            End Session
          </Button>
          <Button variant="secondary" onClick={() => setShowQuit(false)}>
            Continue
          </Button>
        </div>
      </Modal>
    </>
  );
}
