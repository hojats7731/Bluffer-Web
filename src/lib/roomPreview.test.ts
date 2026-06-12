import { describe, expect, it } from "vitest";
import { httpBaseFromWsUrl, roomPreviewMessage } from "./roomPreview";

describe("roomPreview", () => {
  it("converts ws url to http base", () => {
    expect(httpBaseFromWsUrl("ws://192.168.1.5:3000/ws")).toBe(
      "http://192.168.1.5:3000",
    );
  });

  it("formats joinable room message", () => {
    const msg = roomPreviewMessage(
      { exists: true, playerCount: 2, canJoin: true, maxPlayers: 8 },
      false,
    );
    expect(msg).toContain("2");
  });

  it("formats missing room message", () => {
    expect(roomPreviewMessage({ exists: false }, false)).toContain("پیدا نشد");
  });
});
