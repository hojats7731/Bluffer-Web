import { useCallback, useEffect, useRef, useState } from "react";
import { BlufferSocket } from "../lib/websocket";
import {
  clearSession,
  loadSession,
  saveSession,
  type PlayerSession,
} from "../lib/storage";
import type {
  RoomState,
  ScoreRow,
  ServerMessage,
  VoteOption,
} from "../lib/protocol";
import { defaultWsUrl } from "../lib/protocol";

export type Screen = "join" | "lobby" | "game" | "results" | "closed";

export interface GameViewModel {
  screen: Screen;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  room: RoomState | null;
  playerId: string | null;
  promptText: string;
  voteOptions: VoteOption[];
  hasSubmitted: boolean;
  hasVoted: boolean;
  endTotals: ScoreRow[];
  endReason: string;
  closedReason: string;
  savedSession: PlayerSession | null;
  deadlineMs: number | null;
  join: (wsUrl: string, roomCode: string, name: string) => void;
  reconnect: () => void;
  submitLie: (text: string) => void;
  castVote: (optionId: string) => void;
  leave: () => void;
  reset: () => void;
}

export function useBlufferGame(): GameViewModel {
  const socketRef = useRef(new BlufferSocket());
  const pendingJoinRef = useRef<{ roomCode: string; name: string } | null>(null);
  const pendingReconnectRef = useRef<PlayerSession | null>(null);

  const [screen, setScreen] = useState<Screen>("join");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [promptText, setPromptText] = useState("");
  const [voteOptions, setVoteOptions] = useState<VoteOption[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [endTotals, setEndTotals] = useState<ScoreRow[]>([]);
  const [endReason, setEndReason] = useState("");
  const [closedReason, setClosedReason] = useState("");
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [savedSession] = useState(() => loadSession());

  const applyRoom = useCallback((state: RoomState) => {
    setRoom(state);
    if (state.phase === "lobby") setScreen("lobby");
    else if (["prompt", "submit", "vote", "reveal", "score"].includes(state.phase))
      setScreen("game");
    if (state.phaseDeadline) {
      const ms = Date.parse(state.phaseDeadline);
      setDeadlineMs(Number.isNaN(ms) ? null : ms);
    }
  }, []);

  const handleMessage = useCallback(
    (message: ServerMessage) => {
      switch (message.type) {
        case "server:hello":
          if (pendingReconnectRef.current) {
            const s = pendingReconnectRef.current;
            socketRef.current.reconnect(s.roomCode, s.sessionToken);
            pendingReconnectRef.current = null;
          } else if (pendingJoinRef.current) {
            const j = pendingJoinRef.current;
            socketRef.current.join(j.roomCode, j.name);
            pendingJoinRef.current = null;
          }
          break;
        case "player:session": {
          setPlayerId(message.payload.playerId);
          const existing = loadSession();
          saveSession({
            roomCode: existing?.roomCode ?? room?.roomCode ?? "",
            sessionToken: message.payload.sessionToken,
            playerId: message.payload.playerId,
            name: existing?.name ?? "",
            wsUrl: socketRef.current.url,
          });
          break;
        }
        case "room:state":
          applyRoom(message.payload);
          break;
        case "round:prompt":
          setPromptText(message.payload.text);
          setHasSubmitted(false);
          setHasVoted(false);
          setVoteOptions([]);
          setDeadlineMs(Date.parse(message.payload.submitDeadline));
          setScreen("game");
          break;
        case "round:submit_ack":
          setHasSubmitted(true);
          break;
        case "round:vote_options":
          setVoteOptions(message.payload.options);
          break;
        case "game:ended":
          setEndTotals(message.payload.totals);
          setEndReason(message.payload.reason);
          setScreen("results");
          clearSession();
          break;
        case "room:closed":
          setClosedReason(message.payload.reason);
          setScreen("closed");
          clearSession();
          socketRef.current.disconnect();
          setConnected(false);
          break;
        case "server:error":
          setError(`[${message.payload.code}] ${message.payload.message}`);
          if (
            message.payload.code === "RECONNECT_FAILED" ||
            message.payload.code === "SESSION_EXPIRED"
          ) {
            clearSession();
          }
          break;
      }
    },
    [applyRoom, room?.roomCode],
  );

  useEffect(() => {
    const socket = socketRef.current;
    socket.onOpen = () => {
      setConnected(true);
      setConnecting(false);
      setError(null);
    };
    socket.onClose = () => {
      setConnected(false);
      setConnecting(false);
    };
    socket.onError = () => setError("خطا در اتصال به سرور");
    socket.onMessage = handleMessage;
    return () => socket.disconnect();
  }, [handleMessage]);

  const join = useCallback((wsUrl: string, roomCode: string, name: string) => {
    setError(null);
    setConnecting(true);
    setHasSubmitted(false);
    setHasVoted(false);
    pendingJoinRef.current = { roomCode, name };
    pendingReconnectRef.current = null;
    saveSession({
      roomCode: roomCode.toUpperCase(),
      sessionToken: "",
      playerId: "",
      name,
      wsUrl,
    });
    socketRef.current.connect(wsUrl);
  }, []);

  const reconnect = useCallback(() => {
    const session = loadSession();
    if (!session?.sessionToken) return;
    setError(null);
    setConnecting(true);
    pendingReconnectRef.current = session;
    pendingJoinRef.current = null;
    socketRef.current.connect(session.wsUrl || defaultWsUrl());
  }, []);

  const submitLie = useCallback((text: string) => {
    socketRef.current.submitLie(text);
  }, []);

  const castVote = useCallback((optionId: string) => {
    socketRef.current.castVote(optionId);
  }, []);

  const leave = useCallback(() => {
    socketRef.current.leave();
    socketRef.current.disconnect();
    clearSession();
    setConnected(false);
    setScreen("join");
    setRoom(null);
  }, []);

  const reset = useCallback(() => {
    socketRef.current.disconnect();
    clearSession();
    setScreen("join");
    setRoom(null);
    setError(null);
    setConnected(false);
    setConnecting(false);
  }, []);

  return {
    screen,
    connected,
    connecting,
    error,
    room,
    playerId,
    promptText,
    voteOptions,
    hasSubmitted,
    hasVoted,
    endTotals,
    endReason,
    closedReason,
    savedSession,
    deadlineMs,
    join,
    reconnect,
    submitLie,
    castVote,
    leave,
    reset,
  };
}
