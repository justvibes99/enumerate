import { useCallback } from "react";
import type { ReviewCard, QuizDirection, Item } from "../types";
import {
  ensureReviewCards,
  getSettings,
  upsertReviewCard,
} from "../lib/storage";
import { sm2 } from "../lib/sm2";
import { shuffle } from "../lib/utils";

const MAX_SESSION_CARDS = 20;

/**
 * Select cards for a study session:
 * 1. Due cards (most overdue first, then lowest ease)
 * 2. Pad with new cards up to daily limit
 * 3. Cap at MAX_SESSION_CARDS
 */
export function useSpacedRepetition() {
  const selectCards = useCallback(
    async (
      dataSetId: string,
      direction: QuizDirection,
      items: Item[],
    ): Promise<ReviewCard[]> => {
      const allCards = await ensureReviewCards(dataSetId, direction, items);
      const settings = await getSettings();
      const now = Date.now();

      // Separate due and new cards
      const dueCards = allCards
        .filter((c) => c.lastReviewedAt > 0 && c.nextReviewDate <= now)
        .sort((a, b) => {
          // Most overdue first
          const overdueA = now - a.nextReviewDate;
          const overdueB = now - b.nextReviewDate;
          if (overdueA !== overdueB) return overdueB - overdueA;
          // Then lowest ease factor
          return a.easeFactor - b.easeFactor;
        });

      const newCards = shuffle(
        allCards.filter((c) => c.lastReviewedAt === 0),
      );

      const selected: ReviewCard[] = [...dueCards];

      // Pad with new cards up to daily limit and session max
      const newCardLimit = Math.min(
        settings.newCardsPerDay,
        MAX_SESSION_CARDS - selected.length,
      );
      if (newCardLimit > 0) {
        selected.push(...newCards.slice(0, newCardLimit));
      }

      // Cap total
      return shuffle(selected.slice(0, MAX_SESSION_CARDS));
    },
    [],
  );

  const updateCard = useCallback(
    async (card: ReviewCard, quality: number): Promise<ReviewCard> => {
      const result = sm2({
        quality,
        easeFactor: card.easeFactor,
        interval: card.interval,
        repetitions: card.repetitions,
      });

      const updated: ReviewCard = {
        ...card,
        easeFactor: result.easeFactor,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReviewDate: result.nextReviewDate,
        lastReviewedAt: Date.now(),
        correctCount: card.correctCount + (quality >= 3 ? 1 : 0),
        incorrectCount: card.incorrectCount + (quality < 3 ? 1 : 0),
      };

      await upsertReviewCard(updated);
      return updated;
    },
    [],
  );

  return { selectCards, updateCard };
}
