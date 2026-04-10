import { useMemo } from 'react';
import type { Task } from '../../types';
import { Column } from '../Column/Column';
import styles from './Board.module.css';

interface Props {
  tasks: Task[];
  ownerName: string;
  selectedListId: string | null;
  filterStatus: 'all' | 'needsAction';
}

export function Board({ tasks, ownerName, selectedListId, filterStatus }: Props) {
  const { needsAction, completed } = useMemo(() => {
    const needsAction: Task[] = [];
    const completed: Task[] = [];
    for (const task of tasks) {
      if (task.status === 'completed') {
        completed.push(task);
      } else {
        needsAction.push(task);
      }
    }
    return { needsAction, completed };
  }, [tasks]);

  if (!selectedListId) {
    return (
      <div className={styles.placeholder}>
        左のパネルからプロジェクトを選択してください
      </div>
    );
  }

  return (
    <div className={styles.board}>
      <Column title="未完了" tasks={needsAction} ownerName={ownerName} />
      {filterStatus === 'all' && (
        <Column title="完了" tasks={completed} ownerName={ownerName} />
      )}
    </div>
  );
}
