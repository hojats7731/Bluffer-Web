import { beforeEach, describe, expect, it } from "vitest";
import { clearSession, loadSession, saveSession } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips player session", () => {
    const session = {
      roomCode: "ABCD",
      sessionToken: "tok",
      playerId: "p1",
      name: "Ali",
      wsUrl: "ws://localhost:3000/ws",
    };
    saveSession(session);
    expect(loadSession()).toEqual(session);
  });

  it("clears session", () => {
    saveSession({
      roomCode: "X",
      sessionToken: "t",
      playerId: "p",
      name: "n",
      wsUrl: "ws://x/ws",
    });
    clearSession();
    expect(loadSession()).toBeNull();
  });
});
