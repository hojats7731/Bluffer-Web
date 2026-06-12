import { useState, type FormEvent } from "react";
import { MAX_LIE_LENGTH } from "../lib/protocol";
import type { RoomState, VoteOption } from "../lib/protocol";
import { Countdown } from "./Countdown";

interface Props {
  room: RoomState;
  promptText: string;
  voteOptions: VoteOption[];
  hasSubmitted: boolean;
  hasVoted: boolean;
  deadlineMs: number | null;
  lastRoundPoints: number | null;
  totalScore: number | null;
  onSubmitLie: (text: string) => void;
  onCastVote: (optionId: string) => void;
}

const phaseLabels: Record<string, string> = {
  prompt: "سؤال",
  submit: "یک دروغ بنویسید",
  vote: "رأی دهید",
  reveal: "به صفحهٔ بزرگ نگاه کنید",
  score: "امتیازها",
};

export function GameScreen({
  room,
  promptText,
  voteOptions,
  hasSubmitted,
  hasVoted,
  deadlineMs,
  lastRoundPoints,
  totalScore,
  onSubmitLie,
  onCastVote,
}: Props) {
  const [lie, setLie] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (lie.trim()) onSubmitLie(lie.trim());
  }

  return (
    <div className="screen">
      <header className="game-header">
        <span>{phaseLabels[room.phase] ?? room.phase}</span>
        {room.round && room.totalRounds && (
          <span>
            دور {room.round}/{room.totalRounds}
          </span>
        )}
      </header>
      <Countdown deadlineMs={deadlineMs} />
      {promptText && <p className="prompt">{promptText}</p>}

      {room.phase === "submit" && !hasSubmitted && (
        <form onSubmit={handleSubmit} className="card">
          <label>
            دروغ باورپذیر خود را بنویسید
            <textarea
              value={lie}
              onChange={(e) => setLie(e.target.value)}
              maxLength={MAX_LIE_LENGTH}
              rows={4}
              required
            />
          </label>
          <p className="char-count">
            {lie.length}/{MAX_LIE_LENGTH}
          </p>
          <button type="submit">ارسال</button>
        </form>
      )}

      {room.phase === "submit" && hasSubmitted && (
        <p className="waiting">ارسال شد — منتظر بقیه بازیکنان...</p>
      )}

      {room.phase === "vote" && !hasVoted && (
        <div className="vote-list">
          {voteOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className="vote-option"
              onClick={() => onCastVote(opt.id)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {room.phase === "vote" && hasVoted && (
        <p className="waiting">رأی ثبت شد — منتظر بقیه...</p>
      )}

      {(room.phase === "prompt" || room.phase === "reveal") && (
        <p className="waiting">به صفحهٔ تلویزیون نگاه کنید</p>
      )}

      {room.phase === "score" && lastRoundPoints !== null && (
        <div className="card score-feedback">
          <p className="round-points">
            این دور: <strong>+{lastRoundPoints}</strong>
          </p>
          {totalScore !== null && (
            <p className="total-score">مجموع شما: {totalScore}</p>
          )}
          <p className="waiting">جزئیات روی تلویزیون</p>
        </div>
      )}
    </div>
  );
}
