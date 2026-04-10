import type { TaskList, UserInfo } from '../../types';
import styles from './Sidebar.module.css';

interface Props {
  taskLists: TaskList[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  user: UserInfo;
  onLogout: () => void;
}

export function Sidebar({ taskLists, selectedId, onSelect, user, onLogout }: Props) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Team Task Board</div>

      <p className={styles.sectionTitle}>プロジェクト</p>

      {taskLists.length === 0 ? (
        <p className={styles.empty}>タスクリストがありません</p>
      ) : (
        <ul className={styles.list}>
          {taskLists.map((list) => (
            <li
              key={list.id}
              className={`${styles.listItem} ${
                selectedId === list.id ? styles.listItemActive : ''
              }`}
              onClick={() => onSelect(list.id)}
            >
              {list.title}
            </li>
          ))}
        </ul>
      )}

      <div className={styles.userInfo}>
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name}
            className={styles.avatar}
            referrerPolicy="no-referrer"
          />
        )}
        <span className={styles.userName}>{user.name}</span>
        <button className={styles.logoutButton} onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </aside>
  );
}
