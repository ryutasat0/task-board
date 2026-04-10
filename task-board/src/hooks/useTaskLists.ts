import { useState, useCallback } from 'react';
import { fetchTaskLists } from '../api/tasks';
import type { TaskList } from '../types';

export function useTaskLists(token: string | null) {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const lists = await fetchTaskLists(token);
      setTaskLists(lists);
    } catch (err) {
      console.error('Failed to fetch task lists:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return { taskLists, isLoading, load };
}
