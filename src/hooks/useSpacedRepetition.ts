import { useCallback } from "react";
import type { ReviewCard, QuizDirection, Item } from "../types";
import {
  ensureReviewCards,
  upsertReviewCard,
} from "../lib/storage";
import { sm2 } from "../lib/sm2";
import { shuffle } from "../lib/utils";

/**
 * Select all cards for a study session.
 * Cards with more incorrect answers appear earlier.
 */
export function useSpacedRepetition() {
  const selectCards = useCallback(
    async (
      dataSetId: string,
      direction: QuizDirection,
      items: Item[],
    ): Promise<ReviewCard[]> => {
      const allCards = await ensureReviewCards(dataSetId, direction, items);

      // Sort: most struggled cards first (highest incorrect ratio, then lowest ease)
      // New cards (never reviewed) go after struggled cards but before strong ones
      const sorted = [...allCards].sort((a, b) => {
        const totalA = a.correctCount + a.incorrectCount;
        const totalB = b.correctCount + b.incorrectCount;
        const ratioA = totalA > 0 ? a.incorrectCount / totalA : 0;
        const ratioB = totalB > 0 ? b.incorrectCount / totalB : 0;

        // New cards get a middle priority
        const isNewA = a.lastReviewedAt === 0;
        const isNewB = b.lastReviewedAt === 0;
        if (isNewA !== isNewB) return isNewA ? 1 : -1;

        // Higher incorrect ratio first
        if (ratioA !== ratioB) return ratioB - ratioA;
        // Then lowest ease factor
        return a.easeFactor - b.easeFactor;
      });

      // Shuffle within priority tiers to add variety
      // Tier 1: struggled (has incorrect answers)
      // Tier 2: new (never reviewed)
      // Tier 3: strong (all correct)
      const struggled: ReviewCard[] = [];
      const newCards: ReviewCard[] = [];
      const strong: ReviewCard[] = [];

      for (const card of sorted) {
        if (card.lastReviewedAt === 0) newCards.push(card);
        else if (card.incorrectCount > 0) struggled.push(card);
        else strong.push(card);
      }

      return [...shuffle(struggled), ...shuffle(newCards), ...shuffle(strong)];
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
