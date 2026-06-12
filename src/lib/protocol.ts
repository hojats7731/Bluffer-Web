export const MAX_LIE_LENGTH = 120;

export type RoomPhase =
  | "lobby"
  | "prompt"
  | "submit"
  | "vote"
  | "reveal"
  | "score";

export interface PlayerSnapshot {
  id: string;
  name: string;
  connected: boolean;
  score?: number;
  avatarId?: number;
}

export interface RoomState {
  roomId: string;
  roomCode: string;
  phase: RoomPhase;
  hostConnected: boolean;
  players: PlayerSnapshot[];
  maxPlayers: number;
  createdAt: string;
  round?: number;
  totalRounds?: number;
  phaseDeadline?: string;
  submitProgress?: { submitted: number; total: number };
  voteProgress?: { voted: number; total: number };
}

export interface VoteOption {
  id: string;
  text: string;
}

export interface RevealVoter {
  playerId: string;
  name: string;
}

export interface RevealEntry {
  optionId: string;
  text: string;
  authorId: string | null;
  authorName?: string | null;
  fooledCount: number;
  pointsEarned?: number;
  voters?: RevealVoter[];
}

export interface ScoreRow {
  playerId: string;
  name: string;
  score: number;
}

export type ServerMessage =
  | { type: "server:hello"; payload: { connectionId: string; protocolVersion: number } }
  | { type: "player:session"; payload: { playerId: string; sessionToken: string } }
  | { type: "room:state"; payload: RoomState }
  | { type: "game:started"; payload: { totalRounds: number } }
  | {
      type: "round:prompt";
      payload: {
        round: number;
        promptId: string;
        text: string;
        submitDeadline: string;
        roundKind?: "classic" | "about";
        subjectPlayerId?: string;
        subjectName?: string;
      };
    }
  | { type: "round:submit_ack"; payload: { accepted: true } }
  | { type: "round:vote_options"; payload: { options: VoteOption[] } }
  | {
      type: "round:reveal";
      payload: {
        truth: string;
        roundKind?: "classic" | "about";
        entries: RevealEntry[];
      };
    }
  | { type: "round:scores"; payload: { roundScores: { playerId: string; points: number }[]; totals: ScoreRow[] } }
  | { type: "game:ended"; payload: { totals: ScoreRow[]; reason: string } }
  | { type: "room:closed"; payload: { roomId: string; reason: string } }
  | { type: "server:error"; payload: { code: string; message: string } };

export function defaultWsUrl(): string {
  const fromEnv = import.meta.env.VITE_WS_URL;
  if (fromEnv) return fromEnv;
  const host = window.location.hostname;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${host}:3000/ws`;
}

export function parseDeadlineMs(iso?: string): number | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}
