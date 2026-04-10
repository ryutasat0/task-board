import type { Task } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './Column.module.css';

interface Props {
  title: string;
  tasks: Task[];
  ownerName: string;
}

export function Column({ title, tasks, ownerName }: Props) {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{title}</h2>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      <div className={styles.cards}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>タスクなし</p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} ownerName={ownerName} />
          ))
        )}
      </div>
    </div>
  );
}
