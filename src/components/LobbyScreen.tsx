import type { RoomState } from "../lib/protocol";

interface Props {
  room: RoomState;
  onLeave: () => void;
}

export function LobbyScreen({ room, onLeave }: Props) {
  return (
    <div className="screen">
      <h1>لابی</h1>
      <p className="room-code-display" dir="ltr">
        {room.roomCode}
      </p>
      <p className="subtitle">منتظر شروع بازی توسط میزبان...</p>
      <ul className="player-list">
        {room.players.map((p) => (
          <li key={p.id} className={p.connected ? "online" : "offline"}>
            <span className="dot" />
            {p.name}
          </li>
        ))}
      </ul>
      <p className="hint">
        {room.players.filter((p) => p.connected).length} / {room.maxPlayers} بازیکن
      </p>
      <button type="button" className="secondary" onClick={onLeave}>
        خروج
      </button>
    </div>
  );
}
