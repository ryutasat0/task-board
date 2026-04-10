import { useState, useEffect, useCallback } from 'react';
import {
  loadGisScript,
  initTokenClient,
  requestAccessToken,
  revokeToken,
  fetchUserInfo,
} from '../api/auth';
import type { UserInfo } from '../types';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGisScript()
      .then(() => {
        initTokenClient(
          CLIENT_ID,
          async (accessToken) => {
            setToken(accessToken);
            try {
              const info = await fetchUserInfo(accessToken);
              setUser(info);
              setError(null);
            } catch {
              setError('ユーザー情報の取得に失敗しました');
            }
          },
          (err) => setError(err),
        );
        setIsLoading(false);
      })
      .catch(() => {
        setError('Google認証の初期化に失敗しました');
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(() => {
    setError(null);
    requestAccessToken();
  }, []);

  const logout = useCallback(() => {
    revokeToken();
    setUser(null);
    setToken(null);
  }, []);

  return { user, token, isLoading, error, login, logout };
}
