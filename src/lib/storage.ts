const KEY = "bluffer_player_session";

export interface PlayerSession {
  roomCode: string;
  sessionToken: string;
  playerId: string;
  name: string;
  wsUrl: string;
}

export function loadSession(): PlayerSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerSession;
  } catch {
    return null;
  }
}

export function saveSession(session: PlayerSession): void {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}
