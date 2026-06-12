import { useState, type FormEvent } from "react";
import { MAX_LIE_LENGTH } from "../lib/protocol";
import type { RoomState, VoteOption } from "../lib/protocol";
import { toPersianDigits } from "../lib/persianDigits";
import { Countdown } from "./Countdown";

interface Props {
  room: RoomState;
  promptText: string;
  roundKind: "classic" | "about";
  subjectPlayerId: string | null;
  subjectName: string;
  playerId: string | null;
  voteOptions: VoteOption[];
  hasSubmitted: boolean;
  hasVoted: boolean;
  deadlineMs: number | null;
  lastRoundPoints: number | null;
  totalScore: number | null;
  onSubmitLie: (text: string) => void;
  onCastVote: (optionId: string) => void;
}

export function GameScreen({
  room,
  promptText,
  roundKind,
  subjectPlayerId,
  subjectName,
  playerId,
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
  const isAboutSubject =
    roundKind === "about" && playerId !== null && playerId === subjectPlayerId;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (lie.trim()) onSubmitLie(lie.trim());
  }

  const phaseLabel =
    room.phase === "submit" && roundKind === "about"
      ? isAboutSubject
        ? "دربارهٔ شما — پاسخ واقعی"
        : "دربارهٔ بازیکن — دروغ بنویسید"
      : room.phase === "submit"
        ? "یک دروغ بنویسید"
        : room.phase === "vote"
          ? "رأی دهید"
          : room.phase === "reveal"
            ? "به صفحهٔ بزرگ نگاه کنید"
            : room.phase === "score"
              ? "امتیازها"
              : "سؤال";

  const submitLabel = isAboutSubject
    ? "پاسخ واقعی خود را بنویسید"
    : roundKind === "about"
      ? `دروغی دربارهٔ ${subjectName} بنویسید`
      : "دروغ باورپذیر خود را بنویسید";

  const isAboutNonVoter =
    roundKind === "about" && playerId !== null && playerId === subjectPlayerId;

  return (
    <div className="screen">
      <header className="game-header">
        <span>{phaseLabel}</span>
        {room.round && room.totalRounds && (
          <span>
            دور {toPersianDigits(room.round)}/{toPersianDigits(room.totalRounds)}
          </span>
        )}
      </header>
      <Countdown deadlineMs={deadlineMs} />
      {roundKind === "about" && subjectName && !isAboutSubject && (
        <p className="about-badge">دربارهٔ {subjectName}</p>
      )}
      {promptText && <p className="prompt">{promptText}</p>}

      {room.phase === "submit" && !hasSubmitted && (
        <form onSubmit={handleSubmit} className="card">
          <label>
            {submitLabel}
            <textarea
              value={lie}
              onChange={(e) => setLie(e.target.value)}
              maxLength={MAX_LIE_LENGTH}
              rows={4}
              required
            />
          </label>
          <p className="char-count">
            {toPersianDigits(lie.length)}/{toPersianDigits(MAX_LIE_LENGTH)}
          </p>
          <button type="submit">ارسال</button>
        </form>
      )}

      {room.phase === "submit" && hasSubmitted && (
        <p className="waiting">ارسال شد — منتظر بقیه بازیکنان...</p>
      )}

      {room.phase === "vote" && isAboutNonVoter && (
        <p className="waiting">شما موضوع این دور هستید — رأی نمی‌دهید</p>
      )}

      {room.phase === "vote" && !hasVoted && !isAboutNonVoter && (
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
            این دور: <strong>+{toPersianDigits(lastRoundPoints)}</strong>
          </p>
          {totalScore !== null && (
            <p className="total-score">
              مجموع شما: {toPersianDigits(totalScore)}
            </p>
          )}
          <p className="waiting">جزئیات روی تلویزیون</p>
        </div>
      )}
    </div>
  );
}
