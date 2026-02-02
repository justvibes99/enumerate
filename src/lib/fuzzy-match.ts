/**
 * Normalize a string for comparison:
 * lowercase, trim, collapse whitespace, remove diacritics
 */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Dice coefficient between two strings.
 * Returns a value between 0 (no similarity) and 1 (identical).
 */
function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigramsA = new Map<string, number>();
  for (let i = 0; i < a.length - 1; i++) {
    const bigram = a.substring(i, i + 2);
    bigramsA.set(bigram, (bigramsA.get(bigram) ?? 0) + 1);
  }

  let intersections = 0;
  for (let i = 0; i < b.length - 1; i++) {
    const bigram = b.substring(i, i + 2);
    const count = bigramsA.get(bigram) ?? 0;
    if (count > 0) {
      bigramsA.set(bigram, count - 1);
      intersections++;
    }
  }

  return (2 * intersections) / (a.length - 1 + (b.length - 1));
}

export interface MatchResult {
  exact: boolean;
  close: boolean; // Dice >= 0.8
  score: number;
  quality: number; // SM-2 quality: 5 = exact, 3 = close, 1 = wrong
}

export function fuzzyMatch(userAnswer: string, correctAnswer: string): MatchResult {
  const normUser = normalize(userAnswer);
  const normCorrect = normalize(correctAnswer);

  if (normUser === normCorrect) {
    return { exact: true, close: false, score: 1, quality: 5 };
  }

  const score = diceCoefficient(normUser, normCorrect);

  if (score >= 0.8) {
    return { exact: false, close: true, score, quality: 3 };
  }

  return { exact: false, close: false, score, quality: 1 };
}
