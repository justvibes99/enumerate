import { useState, useEffect, useCallback } from "react";
import type { DataSet, SetProgress } from "../types";
import {
  getAllDataSets,
  getSetProgress,
  getAllDueCardCount,
  getDueSetsInfo,
  getGlobalStreak,
  getGlobalMasteredCount,
  getTodaySessionCount,
  initializeBuiltInSets,
} from "../lib/storage";
import { BUILT_IN_SETS } from "../data";

interface StorageState {
  dataSets: DataSet[];
  loading: boolean;
  dueCardCount: number;
  dueSets: Array<{ dataSetId: string; count: number }>;
  globalStreak: { current: number; longest: number };
  globalMastered: number;
  todaySessions: number;
}

export function useStorage() {
  const [state, setState] = useState<StorageState>({
    dataSets: [],
    loading: true,
    dueCardCount: 0,
    dueSets: [],
    globalStreak: { current: 0, longest: 0 },
    globalMastered: 0,
    todaySessions: 0,
  });

  const refresh = useCallback(async () => {
    try {
      await initializeBuiltInSets(BUILT_IN_SETS);
      const [dataSets, dueCardCount, dueSets, globalStreak, globalMastered, todaySessions] =
        await Promise.all([
          getAllDataSets(),
          getAllDueCardCount(),
          getDueSetsInfo(),
          getGlobalStreak(),
          getGlobalMasteredCount(),
          getTodaySessionCount(),
        ]);

      setState({
        dataSets,
        loading: false,
        dueCardCount,
        dueSets,
        globalStreak,
        globalMastered,
        todaySessions,
      });
    } catch (err) {
      console.error("Failed to load data:", err);
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}

export function useSetProgress(dataSetId: string) {
  const [progress, setProgress] = useState<SetProgress | null>(null);

  useEffect(() => {
    if (!dataSetId) return;
    getSetProgress(dataSetId).then(setProgress);
  }, [dataSetId]);

  const refresh = useCallback(() => {
    if (!dataSetId) return;
    getSetProgress(dataSetId).then(setProgress);
  }, [dataSetId]);

  return { progress, refresh };
}
