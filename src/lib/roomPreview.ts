export interface RoomPreview {
  exists: boolean;
  playerCount?: number;
  phase?: string;
  canJoin?: boolean;
  maxPlayers?: number;
}

export function httpBaseFromWsUrl(wsUrl: string): string {
  const normalized = wsUrl.trim().replace(/^ws/i, "http");
  const url = new URL(normalized);
  return `${url.protocol}//${url.host}`;
}

export async function fetchRoomPreview(
  wsUrl: string,
  roomCode: string,
): Promise<RoomPreview> {
  const base = httpBaseFromWsUrl(wsUrl);
  const code = roomCode.trim().toUpperCase();
  const response = await fetch(`${base}/rooms/${encodeURIComponent(code)}`);
  if (response.status === 404) {
    return { exists: false };
  }
  if (!response.ok) {
    throw new Error("ROOM_PREVIEW_FAILED");
  }
  return (await response.json()) as RoomPreview;
}

export function roomPreviewMessage(
  preview: RoomPreview | null,
  loading: boolean,
): string | null {
  if (loading) return "در حال بررسی اتاق...";
  if (!preview) return null;
  if (!preview.exists) return "اتاقی با این کد پیدا نشد";
  if (preview.canJoin === false) {
    if (preview.phase && preview.phase !== "lobby") {
      return "بازی در این اتاق شروع شده است";
    }
    return "اتاق پر است";
  }
  const count = preview.playerCount ?? 0;
  const max = preview.maxPlayers ?? 8;
  return `${count} بازیکن در لابی (حداکثر ${max})`;
}
