import { useNavigate } from "react-router-dom";
import { SegmentedProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useState } from "react";

interface QuizHeaderProps {
  currentIndex: number;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  setId: string;
}

export function QuizHeader({
  currentIndex,
  totalCards,
  correctCount,
  incorrectCount,
  setId,
}: QuizHeaderProps) {
  const navigate = useNavigate();
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
        title="Quit Session?"
      >
        <p className="text-text-primary mb-4">
          Your progress in this session won't be saved. Cards you've already
          answered have been recorded.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={() => navigate(`/set/${setId}`)}
          >
            Quit
          </Button>
          <Button variant="secondary" onClick={() => setShowQuit(false)}>
            Continue
          </Button>
        </div>
      </Modal>
    </>
  );
}
