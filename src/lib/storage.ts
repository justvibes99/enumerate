import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  DataSet,
  ReviewCard,
  QuizSession,
  QuizDirection,
  SetProgress,
  AppSettings,
} from "../types";
import { toDateKey, reviewCardId } from "./utils";

interface EnumerateDB extends DBSchema {
  datasets: {
    key: string;
    value: DataSet;
    indexes: {
      "by-builtin": number;
      "by-updated": number;
    };
  };
  reviewCards: {
    key: string;
    value: ReviewCard;
    indexes: {
      "by-dataset-direction": [string, string];
      "by-next-review": number;
    };
  };
  quizSessions: {
    key: string;
    value: QuizSession;
    indexes: {
      "by-dataset": string;
      "by-completed": number;
    };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

let dbPromise: Promise<IDBPDatabase<EnumerateDB>> | null = null;

function getDB(): Promise<IDBPDatabase<EnumerateDB>> {
  if (!dbPromise) {
    dbPromise = openDB<EnumerateDB>("enumerate-db", 1, {
      upgrade(db) {
        const datasetStore = db.createObjectStore("datasets", {
          keyPath: "id",
        });
        datasetStore.createIndex("by-builtin", "isBuiltIn" as never);
        datasetStore.createIndex("by-updated", "updatedAt");

        const reviewStore = db.createObjectStore("reviewCards", {
          keyPath: "id",
        });
        reviewStore.createIndex(
          "by-dataset-direction",
          ["dataSetId", "direction"] as never,
        );
        reviewStore.createIndex("by-next-review", "nextReviewDate");

        const sessionStore = db.createObjectStore("quizSessions", {
          keyPath: "id",
        });
        sessionStore.createIndex("by-dataset", "dataSetId");
        sessionStore.createIndex("by-completed", "completedAt");

        db.createObjectStore("settings", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

// ---- Datasets ----

export async function getAllDataSets(): Promise<DataSet[]> {
  const db = await getDB();
  return db.getAll("datasets");
}

export async function getDataSet(id: string): Promise<DataSet | undefined> {
  const db = await getDB();
  return db.get("datasets", id);
}

export async function saveDataSet(set: DataSet): Promise<void> {
  const db = await getDB();
  await db.put("datasets", set);
}

export async function deleteDataSet(id: string): Promise<void> {
  const db = await getDB();
  // Delete associated review cards and sessions
  const tx = db.transaction(
    ["datasets", "reviewCards", "quizSessions"],
    "readwrite",
  );
  const reviewIndex = tx.objectStore("reviewCards").index("by-dataset-direction");
  const sessionIndex = tx.objectStore("quizSessions").index("by-dataset");

  // Delete review cards for both directions
  for (const dir of ["prompt-to-match", "match-to-prompt"] as const) {
    let cursor = await reviewIndex.openCursor([id, dir]);
    while (cursor) {
      await cursor.delete();
      cursor = await cursor.continue();
    }
  }

  // Delete sessions
  let sessionCursor = await sessionIndex.openCursor(id);
  while (sessionCursor) {
    await sessionCursor.delete();
    sessionCursor = await sessionCursor.continue();
  }

  await tx.objectStore("datasets").delete(id);
  await tx.done;
}

// ---- Review Cards ----

export async function getReviewCards(
  dataSetId: string,
  direction: QuizDirection,
): Promise<ReviewCard[]> {
  const db = await getDB();
  return db.getAllFromIndex("reviewCards", "by-dataset-direction", [
    dataSetId,
    direction,
  ]);
}

export async function getDueCards(
  dataSetId: string,
  direction: QuizDirection,
): Promise<ReviewCard[]> {
  const now = Date.now();
  const cards = await getReviewCards(dataSetId, direction);
  return cards.filter((c) => c.nextReviewDate <= now && c.lastReviewedAt > 0);
}

export async function getAllDueCardCount(): Promise<number> {
  const db = await getDB();
  const now = Date.now();
  const all = await db.getAll("reviewCards");
  return all.filter((c) => c.nextReviewDate <= now && c.lastReviewedAt > 0)
    .length;
}

export async function getDueSetsInfo(): Promise<
  Array<{ dataSetId: string; count: number }>
> {
  const db = await getDB();
  const now = Date.now();
  const all = await db.getAll("reviewCards");
  const map = new Map<string, number>();
  for (const c of all) {
    if (c.nextReviewDate <= now && c.lastReviewedAt > 0) {
      map.set(c.dataSetId, (map.get(c.dataSetId) ?? 0) + 1);
    }
  }
  return Array.from(map.entries()).map(([dataSetId, count]) => ({
    dataSetId,
    count,
  }));
}

export async function upsertReviewCard(card: ReviewCard): Promise<void> {
  const db = await getDB();
  await db.put("reviewCards", card);
}

export async function batchUpsertReviewCards(
  cards: ReviewCard[],
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("reviewCards", "readwrite");
  for (const card of cards) {
    tx.store.put(card);
  }
  await tx.done;
}

// ---- Quiz Sessions ----

export async function saveQuizSession(session: QuizSession): Promise<void> {
  const db = await getDB();
  await db.put("quizSessions", session);
}

export async function getQuizSessions(
  dataSetId: string,
): Promise<QuizSession[]> {
  const db = await getDB();
  return db.getAllFromIndex("quizSessions", "by-dataset", dataSetId);
}

export async function getRecentSessions(
  limit: number,
): Promise<QuizSession[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("quizSessions", "by-completed");
  return all.reverse().slice(0, limit);
}

export async function getTodaySessionCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.getTime();
  const db = await getDB();
  const all = await db.getAllFromIndex("quizSessions", "by-completed");
  return all.filter((s) => s.completedAt >= startOfDay).length;
}

// ---- Stats ----

export async function getSetProgress(
  dataSetId: string,
): Promise<SetProgress> {
  const db = await getDB();
  const dataset = await db.get("datasets", dataSetId);
  const totalItems = dataset?.items.length ?? 0;

  const cards = await db.getAllFromIndex(
    "reviewCards",
    "by-dataset-direction",
    [dataSetId, "prompt-to-match"],
  );

  let masteredCount = 0;
  let learningCount = 0;
  let lastStudiedAt = 0;

  for (const card of cards) {
    if (card.lastReviewedAt > lastStudiedAt) {
      lastStudiedAt = card.lastReviewedAt;
    }
    if (card.lastReviewedAt === 0) continue;
    if (card.interval >= 21) {
      masteredCount++;
    } else {
      learningCount++;
    }
  }

  const newCount = totalItems - masteredCount - learningCount;

  const sessions = await getQuizSessions(dataSetId);
  const { current, longest } = calculateStreak(sessions);

  return {
    dataSetId,
    totalItems,
    masteredCount,
    learningCount,
    newCount,
    currentStreak: current,
    longestStreak: longest,
    lastStudiedAt,
  };
}

function calculateStreak(sessions: QuizSession[]): {
  current: number;
  longest: number;
} {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  const studyDays = new Set(
    sessions
      .filter((s) => s.completedAt > 0)
      .map((s) => toDateKey(s.completedAt)),
  );

  if (studyDays.size === 0) return { current: 0, longest: 0 };

  const sortedDays = Array.from(studyDays).sort().reverse();
  const today = toDateKey(Date.now());
  const yesterday = toDateKey(Date.now() - 86400000);

  // Current streak
  let current = 0;
  if (sortedDays[0] === today || sortedDays[0] === yesterday) {
    let checkDate = sortedDays[0] === today ? new Date() : new Date(Date.now() - 86400000);
    while (studyDays.has(toDateKey(checkDate.getTime()))) {
      current++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    }
  }

  // Longest streak
  let longest = 0;
  let streak = 1;
  const allDays = Array.from(studyDays).sort();
  for (let i = 1; i < allDays.length; i++) {
    const prev = new Date(allDays[i - 1]);
    const curr = new Date(allDays[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (Math.round(diff) === 1) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

export async function getGlobalStreak(): Promise<{
  current: number;
  longest: number;
}> {
  const db = await getDB();
  const sessions = await db.getAll("quizSessions");
  return calculateStreak(sessions);
}

export async function getGlobalMasteredCount(): Promise<number> {
  const db = await getDB();
  const all = await db.getAll("reviewCards");
  return all.filter((c) => c.interval >= 21).length;
}

// ---- Settings ----

export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  const settings = await db.get("settings", "app-settings");
  return settings ?? { id: "app-settings", newCardsPerDay: 15 };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB();
  await db.put("settings", settings);
}

// ---- Initialization ----

export async function initializeBuiltInSets(
  builtInSets: DataSet[],
): Promise<void> {
  const db = await getDB();
  const existing = await db.getAll("datasets");
  const existingIds = new Set(existing.map((s) => s.id));

  const tx = db.transaction("datasets", "readwrite");
  for (const set of builtInSets) {
    if (!existingIds.has(set.id)) {
      tx.store.put(set);
    }
  }
  await tx.done;
}

// ---- Ensure review cards exist for a dataset ----

export async function ensureReviewCards(
  dataSetId: string,
  direction: QuizDirection,
  items: Array<{ id: string }>,
): Promise<ReviewCard[]> {
  const db = await getDB();
  const existing = await getReviewCards(dataSetId, direction);
  const existingIds = new Set(existing.map((c) => c.itemId));

  const newCards: ReviewCard[] = [];
  for (const item of items) {
    if (!existingIds.has(item.id)) {
      const card: ReviewCard = {
        id: reviewCardId(dataSetId, item.id, direction),
        itemId: item.id,
        dataSetId,
        direction,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastReviewedAt: 0,
      };
      newCards.push(card);
    }
  }

  if (newCards.length > 0) {
    const tx = db.transaction("reviewCards", "readwrite");
    for (const card of newCards) {
      tx.store.put(card);
    }
    await tx.done;
  }

  return [...existing, ...newCards];
}

// ---- Export / Import ----

export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const datasets = await db.getAll("datasets");
  const reviewCards = await db.getAll("reviewCards");
  const quizSessions = await db.getAll("quizSessions");
  const settings = await getSettings();

  return JSON.stringify(
    { datasets, reviewCards, quizSessions, settings, exportedAt: Date.now() },
    null,
    2,
  );
}

export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  const db = await getDB();

  if (data.datasets) {
    const tx = db.transaction("datasets", "readwrite");
    for (const ds of data.datasets) {
      tx.store.put(ds);
    }
    await tx.done;
  }

  if (data.reviewCards) {
    const tx = db.transaction("reviewCards", "readwrite");
    for (const rc of data.reviewCards) {
      tx.store.put(rc);
    }
    await tx.done;
  }

  if (data.quizSessions) {
    const tx = db.transaction("quizSessions", "readwrite");
    for (const qs of data.quizSessions) {
      tx.store.put(qs);
    }
    await tx.done;
  }

  if (data.settings) {
    await saveSettings(data.settings);
  }
}
