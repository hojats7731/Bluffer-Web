import { useState, type FormEvent } from "react";
import { defaultWsUrl } from "../lib/protocol";
import type { PlayerSession } from "../lib/storage";

interface Props {
  connecting: boolean;
  error: string | null;
  savedSession: PlayerSession | null;
  onJoin: (wsUrl: string, roomCode: string, name: string) => void;
  onReconnect: () => void;
}

export function JoinScreen({
  connecting,
  error,
  savedSession,
  onJoin,
  onReconnect,
}: Props) {
  const [wsUrl, setWsUrl] = useState(defaultWsUrl());
  const [roomCode, setRoomCode] = useState(savedSession?.roomCode ?? "");
  const [name, setName] = useState(savedSession?.name ?? "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
            type="url"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            dir="ltr"
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
        <button type="submit" disabled={connecting}>
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
