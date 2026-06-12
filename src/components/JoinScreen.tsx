import { useEffect, useState, type FormEvent } from "react";
import { defaultWsUrl } from "../lib/protocol";
import type { PlayerSession } from "../lib/storage";
import {
  fetchRoomPreview,
  roomPreviewMessage,
  type RoomPreview,
} from "../lib/roomPreview";

interface Props {
  connecting: boolean;
  error: string | null;
  savedSession: PlayerSession | null;
  onJoin: (wsUrl: string, roomCode: string, name: string) => void;
  onReconnect: () => void;
}

function roomCodeFromUrl(): string {
  const fromQuery = new URLSearchParams(window.location.search)
    .get("room")
    ?.toUpperCase()
    .slice(0, 4);
  return fromQuery ?? "";
}

export function JoinScreen({
  connecting,
  error,
  savedSession,
  onJoin,
  onReconnect,
}: Props) {
  const [wsUrl, setWsUrl] = useState(defaultWsUrl());
  const [roomCode, setRoomCode] = useState(
    () => savedSession?.roomCode || roomCodeFromUrl() || "",
  );
  const [name, setName] = useState(savedSession?.name ?? "");
  const [preview, setPreview] = useState<RoomPreview | null>(null);
  const [previewMsg, setPreviewMsg] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (roomCode.length !== 4) {
      setPreview(null);
      setPreviewMsg(null);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);

    const timer = window.setTimeout(() => {
      fetchRoomPreview(wsUrl, roomCode)
        .then((result) => {
          if (cancelled) return;
          setPreview(result);
          setPreviewMsg(roomPreviewMessage(result, false));
        })
        .catch(() => {
          if (cancelled) return;
          setPreview(null);
          setPreviewMsg("خطا در بررسی اتاق — سرور در دسترس نیست؟");
        })
        .finally(() => {
          if (!cancelled) setPreviewLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [wsUrl, roomCode]);

  const previewHint =
    previewMsg ?? (previewLoading ? roomPreviewMessage(null, true) : null);
  const canSubmit =
    !connecting &&
    roomCode.length === 4 &&
    name.trim().length > 0 &&
    (!preview || preview.canJoin !== false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onJoin(wsUrl.trim(), roomCode.trim().toUpperCase(), name.trim());
  }

  return (
    <div className="screen">
      <h1>خالی‌بند</h1>
      <p className="subtitle">با کد اتاق به بازی بپیوندید</p>
      <form onSubmit={handleSubmit} className="card">
        <label>
          آدرس سرور
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            dir="ltr"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            required
          />
        </label>
        <label>
          کد اتاق
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={4}
            minLength={4}
            placeholder="ABCD"
            dir="ltr"
            className="room-code-input"
            required
          />
        </label>
        {previewHint && (
          <p
            className={
              preview?.exists === false || preview?.canJoin === false
                ? "error preview-hint"
                : "hint preview-hint"
            }
          >
            {previewHint}
          </p>
        )}
        <label>
          نام شما
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={!canSubmit}>
          {connecting ? "در حال اتصال..." : "ورود به بازی"}
        </button>
        {savedSession?.sessionToken && (
          <button
            type="button"
            className="secondary"
            disabled={connecting}
            onClick={onReconnect}
          >
            اتصال مجدد
          </button>
        )}
      </form>
    </div>
  );
}
