import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import type { DataSet, QuizDirection } from "../types";
import { getDataSet } from "../lib/storage";
import { useQuiz } from "../hooks/useQuiz";
import { PageContainer } from "../components/layout/PageContainer";
import { QuizHeader } from "../components/quiz/QuizHeader";
import { FlashcardMode } from "../components/quiz/FlashcardMode";
import { QuizComplete } from "../components/quiz/QuizComplete";

export function FlashcardPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const direction: QuizDirection =
    searchParams.get("dir") === "match-to-prompt"
      ? "match-to-prompt"
      : "prompt-to-match";

  const [dataSet, setDataSet] = useState<DataSet | null>(null);

  useEffect(() => {
    if (id) getDataSet(id).then((ds) => setDataSet(ds ?? null));
  }, [id]);

  const {
    currentCard,
    loading,
    recordAnswer,
    getItemForCard,
    totalCards,
    currentIndex,
    results,
    isComplete,
  } = useQuiz(dataSet, "flashcard", direction);

  const handleRate = useCallback(
    (quality: number) => {
      recordAnswer(quality);
    },
    [recordAnswer],
  );

  if (loading || !dataSet) {
    return (
      <PageContainer>
        <p className="text-center py-16 font-heading text-xl text-text-tertiary">
          Loading...
        </p>
      </PageContainer>
    );
  }

  if (isComplete) {
    return (
      <PageContainer>
        <QuizComplete dataSet={dataSet} mode="flashcard" results={results} />
      </PageContainer>
    );
  }

  if (!currentCard) {
    return (
      <PageContainer>
        <p className="text-center py-16 font-heading text-xl text-text-tertiary">
          No cards available for review. Check back later!
        </p>
      </PageContainer>
    );
  }

  const item = getItemForCard(currentCard);
  if (!item) return null;

  return (
    <PageContainer className="max-w-2xl">
      <QuizHeader
        currentIndex={currentIndex}
        totalCards={totalCards}
        correctCount={results.filter((r) => r.correct).length}
        incorrectCount={results.filter((r) => !r.correct).length}
        setId={dataSet.id}
      />
      <FlashcardMode
        item={item}
        card={currentCard}
        direction={direction}
        dataSet={dataSet}
        onRate={handleRate}
      />
    </PageContainer>
  );
}
