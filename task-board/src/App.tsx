import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTaskLists } from './hooks/useTaskLists';
import { useTasks } from './hooks/useTasks';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { Board } from './components/Board/Board';
import styles from './App.module.css';

export default function App() {
  const { user, token, isLoading, error, login, logout } = useAuth();
  const { taskLists, load: loadTaskLists } = useTaskLists(token);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'needsAction'>('all');
  const { tasks, syncState, sync } = useTasks(token, selectedListId);

  // ログイン後にタスクリストを取得
  useEffect(() => {
    if (token) {
      loadTaskLists();
    }
  }, [token, loadTaskLists]);

  const handleSync = useCallback(() => {
    loadTaskLists();
    sync();
  }, [loadTaskLists, sync]);

  // 選択中のプロジェクト名
  const selectedProjectName =
    taskLists.find((l) => l.id === selectedListId)?.title ?? null;

  // 未ログイン → ログイン画面
  if (!user) {
    return <LoginScreen onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <div className={styles.app}>
      <Sidebar
        taskLists={taskLists}
        selectedId={selectedListId}
        onSelect={setSelectedListId}
        user={user}
        onLogout={logout}
      />
      <div className={styles.main}>
        <Header
          projectName={selectedProjectName}
          syncState={syncState}
          onSync={handleSync}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
        />
        <Board
          tasks={tasks}
          ownerName={user.name}
          selectedListId={selectedListId}
          filterStatus={filterStatus}
        />
      </div>
    </div>
  );
}
