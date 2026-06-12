import type { ServerMessage } from "./protocol";

type MessageHandler = (message: ServerMessage) => void;
type VoidHandler = () => void;

export class BlufferSocket {
  private socket: WebSocket | null = null;
  url = "";
  private handshakeDone = false;

  onMessage: MessageHandler = () => {};
  onOpen: VoidHandler = () => {};
  onClose: VoidHandler = () => {};
  onError: VoidHandler = () => {};

  connect(url: string): void {
    this.disconnect();
    this.url = url;
    this.handshakeDone = false;
    this.socket = new WebSocket(url);
    this.socket.onopen = () => this.send("client:hello", { role: "player" });
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as ServerMessage;
        if (message.type === "server:hello") {
          this.handshakeDone = true;
          this.onOpen();
        }
        this.onMessage(message);
      } catch {
        // ignore malformed frames
      }
    };
    this.socket.onclose = () => {
      this.handshakeDone = false;
      this.onClose();
    };
    this.socket.onerror = () => this.onError();
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.handshakeDone = false;
  }

  isOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN && this.handshakeDone;
  }

  send(type: string, payload: Record<string, unknown> = {}): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify({ type, payload }));
  }

  join(roomCode: string, name: string): void {
    this.send("player:join", { roomCode: roomCode.toUpperCase(), name });
  }

  reconnect(roomCode: string, sessionToken: string): void {
    this.send("player:reconnect", { roomCode: roomCode.toUpperCase(), sessionToken });
  }

  submitLie(text: string): void {
    this.send("player:submit_lie", { text });
  }

  castVote(optionId: string): void {
    this.send("player:cast_vote", { optionId });
  }

  leave(): void {
    this.send("player:leave", {});
  }
}
