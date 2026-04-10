import type { Task } from '../../types';
import styles from './TaskCard.module.css';

interface Props {
  task: Task;
  ownerName: string;
}

function formatDue(due?: string): string | null {
  if (!due) return null;
  const d = new Date(due);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function isOverdue(due?: string): boolean {
  if (!due) return false;
  return new Date(due) < new Date();
}

export function TaskCard({ task, ownerName }: Props) {
  const completed = task.status === 'completed';

  return (
    <div
      className={`${styles.card} ${
        completed ? styles.cardCompleted : styles.cardNeedsAction
      }`}
    >
      <p
        className={`${styles.title} ${
          completed ? styles.titleCompleted : ''
        }`}
      >
        {task.title}
      </p>

      <div className={styles.meta}>
        <span className={`${styles.badge} ${styles.owner}`}>{ownerName}</span>
        {task.due && (
          <span
            className={`${styles.badge} ${
              !completed && isOverdue(task.due) ? styles.dueOverdue : styles.due
            }`}
          >
            {formatDue(task.due)}
          </span>
        )}
      </div>

      {task.notes && (
        <p className={styles.notes}>{task.notes}</p>
      )}
    </div>
  );
}
