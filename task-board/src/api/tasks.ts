import type { TaskList, Task } from '../types';

const BASE_URL = 'https://tasks.googleapis.com/tasks/v1';

async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Google Tasks API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// タスクリスト一覧を取得
export async function fetchTaskLists(token: string): Promise<TaskList[]> {
  const data = await apiGet<{ items?: TaskList[] }>(
    '/users/@me/lists?maxResults=100',
    token,
  );
  return (data.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
  }));
}

// 指定リストのタスクを取得（完了タスク含む）
export async function fetchTasks(
  token: string,
  listId: string,
): Promise<Task[]> {
  // showCompleted=true & showHidden=true で完了タスクも取得
  const data = await apiGet<{ items?: Task[] }>(
    `/lists/${encodeURIComponent(listId)}/tasks?maxResults=100&showCompleted=true&showHidden=true`,
    token,
  );
  return (data.items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    notes: item.notes,
    status: item.status,
    due: item.due,
    completed: item.completed,
    updated: item.updated,
  }));
}
