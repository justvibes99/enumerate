import { useState, useCallback, useEffect } from "react";
import type {
  QuizState,
  QuizMode,
  QuizDirection,
  ReviewCard,
  ItemResult,
  DataSet,
} from "../types";
import { useSpacedRepetition } from "./useSpacedRepetition";
import { saveQuizSession } from "../lib/storage";

export function useQuiz(
  dataSet: DataSet | null,
  mode: QuizMode,
  direction: QuizDirection,
) {
  const { selectCards, updateCard } = useSpacedRepetition();
  const [state, setState] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dataSet) return;
    setLoading(true);
    selectCards(dataSet.id, direction, dataSet.items).then((cards) => {
      if (cards.length === 0) {
        setState(null);
        setLoading(false);
        return;
      }
      setState({
        dataSetId: dataSet.id,
        mode,
        direction,
        cards,
        currentIndex: 0,
        results: [],
        isComplete: false,
        startedAt: Date.now(),
      });
      setLoading(false);
    });
  }, [dataSet, mode, direction, selectCards]);

  const currentCard = state?.cards[state.currentIndex] ?? null;

  const recordAnswer = useCallback(
    async (quality: number, userAnswer?: string, timeSpentMs: number = 0) => {
      if (!state || !currentCard) return;

      await updateCard(currentCard, quality);

      const result: ItemResult = {
        itemId: currentCard.itemId,
        correct: quality >= 3,
        userAnswer,
        timeSpentMs,
      };

      const newResults = [...state.results, result];
      const nextIndex = state.currentIndex + 1;
      const isComplete = nextIndex >= state.cards.length;

      if (isComplete) {
        // Save session
        await saveQuizSession({
          id: crypto.randomUUID(),
          dataSetId: state.dataSetId,
          mode: state.mode,
          direction: state.direction,
          startedAt: state.startedAt,
          completedAt: Date.now(),
          totalCards: state.cards.length,
          correctCount: newResults.filter((r) => r.correct).length,
          incorrectCount: newResults.filter((r) => !r.correct).length,
          itemResults: newResults,
        });
      }

      setState({
        ...state,
        currentIndex: nextIndex,
        results: newResults,
        isComplete,
      });
    },
    [state, currentCard, updateCard],
  );

  const getItemForCard = useCallback(
    (card: ReviewCard) => {
      if (!dataSet) return null;
      return dataSet.items.find((i) => i.id === card.itemId) ?? null;
    },
    [dataSet],
  );

  return {
    state,
    loading,
    currentCard,
    recordAnswer,
    getItemForCard,
    totalCards: state?.cards.length ?? 0,
    currentIndex: state?.currentIndex ?? 0,
    results: state?.results ?? [],
    isComplete: state?.isComplete ?? false,
  };
}
