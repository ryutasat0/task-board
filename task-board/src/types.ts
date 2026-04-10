// Google Tasks API のレスポンス型定義

export interface TaskList {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;       // RFC 3339 timestamp
  completed?: string; // RFC 3339 timestamp
  updated: string;    // RFC 3339 timestamp
}

// アプリ内で使う拡張型
export interface TaskWithOwner extends Task {
  ownerName: string;
  ownerEmail: string;
}

export interface UserInfo {
  name: string;
  email: string;
  picture?: string;
}

export interface SyncState {
  lastSyncedAt: Date | null;
  isSyncing: boolean;
}
