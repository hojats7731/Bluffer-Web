import type { RoomState } from "../lib/protocol";
import { avatarEmoji } from "../lib/avatars";
import { toPersianDigits } from "../lib/persianDigits";

interface Props {
  room: RoomState;
  connected: boolean;
  onLeave: () => void;
}

export function LobbyScreen({ room, connected, onLeave }: Props) {
  return (
    <div className="screen">
      <div className={`connection-banner ${connected ? "online" : "offline"}`}>
        <span className="dot" />
        {connected ? "متصل به سرور" : "اتصال قطع شد — در حال تلاش مجدد..."}
      </div>
      <h1>لابی</h1>
      <p className="room-code-display" dir="ltr">
        {room.roomCode}
      </p>
      <p className="subtitle">منتظر شروع بازی توسط میزبان...</p>
      <ul className="player-list">
        {room.players.map((p) => (
          <li key={p.id} className={p.connected ? "online" : "offline"}>
            <span className="avatar">{avatarEmoji(p.avatarId, p.id)}</span>
            <span className="dot" />
            {p.name}
          </li>
        ))}
      </ul>
      <p className="hint">
        {toPersianDigits(room.players.filter((p) => p.connected).length)} /{" "}
        {toPersianDigits(room.maxPlayers)} بازیکن
      </p>
      <button type="button" className="secondary" onClick={onLeave}>
        خروج
      </button>
    </div>
  );
}
