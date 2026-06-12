# Bluffer Web

Mobile web controller for [Bluffer](https://github.com/hojats7731/Bluffer) — a Persian Fibbage-style party game.

Players join with a room code on their phone while the [Bluffer-Host](https://github.com/hojats7731/Bluffer-Host) Godot app runs on the big screen.

## Quickstart

```bash
# Terminal 1 — server
cd ../Bluffer && docker compose up

# Terminal 2 — Godot host (create room, get code)

# Terminal 3 — web players
npm install
npm run dev
```

Open `http://<your-lan-ip>:5173` on phones (not `localhost`). Set WebSocket URL to `ws://<your-lan-ip>:3000/ws`.

## Player flow

1. Enter server URL, 4-letter room code, and display name
2. Wait in lobby until host starts
3. **Submit** a believable lie when prompted
4. **Vote** for what you think is true
5. Watch reveals on the TV — see final scores on phone

## Stack

- React 19 + TypeScript + Vite
- Native WebSocket (protocol v2)
- Persian RTL UI (Vazirmatn)

## Related repos

| Repo | Role |
|------|------|
| [Bluffer](https://github.com/hojats7731/Bluffer) | Game server |
| [Bluffer-Host](https://github.com/hojats7731/Bluffer-Host) | Godot TV host |
| **Bluffer-Web** (this) | Phone controllers |

## Configuration

Default WebSocket URL: `ws://<current-hostname>:3000/ws`

Player session tokens are stored in `localStorage` for reconnect within 60 seconds.

## License

MIT
