import type { UserInfo } from '../types';

const SCOPES = 'https://www.googleapis.com/auth/tasks.readonly';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;

// Google Identity Services のスクリプトを読み込む
export function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('gis-script')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'gis-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

// OAuth トークンクライアントを初期化
export function initTokenClient(
  clientId: string,
  onSuccess: (token: string) => void,
  onError: (error: string) => void,
): void {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        onError(response.error);
        return;
      }
      accessToken = response.access_token;
      onSuccess(response.access_token);
    },
  });
}

// ログイン（トークン取得）
export function requestAccessToken(): void {
  if (!tokenClient) {
    throw new Error('Token client not initialized');
  }
  tokenClient.requestAccessToken();
}

// ログアウト
export function revokeToken(): void {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken, () => {
      accessToken = null;
    });
  }
}

// 現在のトークンを取得
export function getAccessToken(): string | null {
  return accessToken;
}

// ログイン中ユーザー情報を取得
export async function fetchUserInfo(token: string): Promise<UserInfo> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  const data = await res.json();
  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
  };
}
