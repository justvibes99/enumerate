export interface SM2Input {
  quality: number; // 0-5 rating (0-2 = fail, 3-5 = pass)
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SM2Output {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
}

export function sm2(input: SM2Input): SM2Output {
  const { quality, easeFactor, interval, repetitions } = input;

  let newEF: number;
  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    // Failed -- reset reps and interval, but keep ease factor unchanged
    newReps = 0;
    newInterval = 1;
    newEF = easeFactor;
  } else {
    // Passed -- update ease factor
    newEF =
      easeFactor +
      (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEF = Math.max(1.3, newEF);

    newReps = repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  const now = Date.now();
  const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000;

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate,
  };
}
