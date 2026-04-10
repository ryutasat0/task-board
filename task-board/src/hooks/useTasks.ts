import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchTasks } from '../api/tasks';
import type { Task, SyncState } from '../types';

const AUTO_SYNC_INTERVAL = 60_000; // 60秒

export function useTasks(token: string | null, listId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [syncState, setSyncState] = useState<SyncState>({
    lastSyncedAt: null,
    isSyncing: false,
  });
  const intervalRef = useRef<number | null>(null);

  const sync = useCallback(async () => {
    if (!token || !listId) return;
    setSyncState((prev) => ({ ...prev, isSyncing: true }));
    try {
      const data = await fetchTasks(token, listId);
      setTasks(data);
      setSyncState({ lastSyncedAt: new Date(), isSyncing: false });
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setSyncState((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [token, listId]);

  // listId が変わったら即座に取得
  useEffect(() => {
    if (listId) {
      sync();
    } else {
      setTasks([]);
      setSyncState({ lastSyncedAt: null, isSyncing: false });
    }
  }, [listId, sync]);

  // 60秒ごとの自動同期
  useEffect(() => {
    if (!token || !listId) return;

    intervalRef.current = window.setInterval(sync, AUTO_SYNC_INTERVAL);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, listId, sync]);

  return { tasks, syncState, sync };
}
