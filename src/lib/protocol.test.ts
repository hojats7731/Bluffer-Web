import { describe, expect, it } from "vitest";
import { defaultWsUrl, parseDeadlineMs } from "./protocol";

describe("protocol", () => {
  it("parses deadline iso strings", () => {
    const ms = parseDeadlineMs("2026-06-11T18:00:00.000Z");
    expect(ms).not.toBeNull();
  });

  it("builds default ws url from hostname", () => {
    Object.defineProperty(window, "location", {
      value: { hostname: "192.168.1.5", protocol: "http:" },
      writable: true,
    });
    expect(defaultWsUrl()).toBe("ws://192.168.1.5:3000/ws");
  });
});
