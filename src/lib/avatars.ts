const EMOJIS = ["🦊", "🐼", "🦁", "🐸", "🦄", "🐙", "🐯", "🐻", "🐶", "🐱", "🐨", "🐷"];

export function avatarEmoji(avatarId?: number, playerId?: string): string {
  if (avatarId !== undefined) return EMOJIS[avatarId % EMOJIS.length] ?? "🎭";
  if (!playerId) return "🎭";
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = (hash + playerId.charCodeAt(i) * (i + 1)) % EMOJIS.length;
  }
  return EMOJIS[hash] ?? "🎭";
}
