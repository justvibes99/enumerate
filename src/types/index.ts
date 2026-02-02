/** A single prompt-match pair within a dataset */
export interface Item {
  id: string;
  prompt: string;
  match: string;
}

/** A collection of items that can be studied together */
export interface DataSet {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  promptLabel: string;
  matchLabel: string;
  items: Item[];
  isBuiltIn: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Direction of quiz -- which side is the question */
export type QuizDirection = "prompt-to-match" | "match-to-prompt";

/** Per-item spaced repetition state (SM-2 fields) */
export interface ReviewCard {
  id: string; // composite: `${dataSetId}::${itemId}::${direction}`
  itemId: string;
  dataSetId: string;
  direction: QuizDirection;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt: number;
}

/** Aggregated stats for a dataset */
export interface SetProgress {
  dataSetId: string;
  totalItems: number;
  masteredCount: number;
  learningCount: number;
  newCount: number;
  currentStreak: number;
  longestStreak: number;
  lastStudiedAt: number;
}

export type QuizMode = "flashcard" | "multiple-choice" | "typed-answer";

/** A single quiz session record */
export interface QuizSession {
  id: string;
  dataSetId: string;
  mode: QuizMode;
  direction: QuizDirection;
  startedAt: number;
  completedAt: number;
  totalCards: number;
  correctCount: number;
  incorrectCount: number;
  itemResults: ItemResult[];
}

export interface ItemResult {
  itemId: string;
  correct: boolean;
  userAnswer?: string;
  timeSpentMs: number;
}

/** Quiz state machine for active session */
export interface QuizState {
  dataSetId: string;
  mode: QuizMode;
  direction: QuizDirection;
  cards: ReviewCard[];
  currentIndex: number;
  results: ItemResult[];
  isComplete: boolean;
  startedAt: number;
}

/** App settings stored in IndexedDB */
export interface AppSettings {
  id: "app-settings";
  newCardsPerDay: number;
  claudeApiKey?: string;
}
