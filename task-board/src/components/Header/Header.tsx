import type { SyncState } from '../../types';
import styles from './Header.module.css';

interface Props {
  projectName: string | null;
  syncState: SyncState;
  onSync: () => void;
  filterStatus: 'all' | 'needsAction';
  onFilterStatusChange: (value: 'all' | 'needsAction') => void;
}

function formatTime(date: Date | null): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function Header({
  projectName,
  syncState,
  onSync,
  filterStatus,
  onFilterStatusChange,
}: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.projectName}>
        {projectName ?? 'プロジェクトを選択'}
      </h1>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>表示:</span>
        <select
          className={styles.filterSelect}
          value={filterStatus}
          onChange={(e) =>
            onFilterStatusChange(e.target.value as 'all' | 'needsAction')
          }
        >
          <option value="all">すべて</option>
          <option value="needsAction">未完了のみ</option>
        </select>
      </div>

      <button
        className={styles.syncButton}
        onClick={onSync}
        disabled={syncState.isSyncing || !projectName}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={syncState.isSyncing ? styles.spinning : ''}
        >
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
        {syncState.isSyncing ? '同期中...' : '同期'}
      </button>

      <span className={styles.syncTime}>
        最終同期: {formatTime(syncState.lastSyncedAt)}
      </span>
    </header>
  );
}
