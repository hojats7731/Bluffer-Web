import type { ScoreRow } from "../lib/protocol";

interface Props {
  totals: ScoreRow[];
  reason: string;
  onPlayAgain: () => void;
}

export function ResultsScreen({ totals, reason, onPlayAgain }: Props) {
  const ranked = [...totals].sort((a, b) => b.score - a.score);

  return (
    <div className="screen">
      <h1>پایان بازی</h1>
      {reason && <p className="subtitle">{reason}</p>}
      <ol className="score-list">
        {ranked.map((row, i) => (
          <li key={row.playerId}>
            <span className="rank">{i + 1}</span>
            <span className="name">{row.name}</span>
            <span className="score">{row.score}</span>
          </li>
        ))}
      </ol>
      <button type="button" onClick={onPlayAgain}>
        بازی جدید
      </button>
    </div>
  );
}
