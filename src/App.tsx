import { useBlufferGame } from "./hooks/useBlufferGame";
import { JoinScreen } from "./components/JoinScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { ClosedScreen } from "./components/ClosedScreen";
import "./App.css";

export default function App() {
  const game = useBlufferGame();

  if (game.screen === "join") {
    return (
      <JoinScreen
        connecting={game.connecting}
        error={game.error}
        savedSession={game.savedSession}
        onJoin={game.join}
        onReconnect={game.reconnect}
      />
    );
  }

  if (game.screen === "closed") {
    return (
      <ClosedScreen reason={game.closedReason} onReset={game.reset} />
    );
  }

  if (game.screen === "results") {
    return (
      <ResultsScreen
        totals={game.endTotals}
        reason={game.endReason}
        onPlayAgain={game.reset}
      />
    );
  }

  if (game.screen === "lobby" && game.room) {
    return (
      <LobbyScreen
        room={game.room}
        connected={game.connected}
        onLeave={game.leave}
      />
    );
  }

  if (game.screen === "game" && game.room) {
    return (
      <GameScreen
        room={game.room}
        promptText={game.promptText}
        voteOptions={game.voteOptions}
        hasSubmitted={game.hasSubmitted}
        hasVoted={game.hasVoted}
        deadlineMs={game.deadlineMs}
        onSubmitLie={game.submitLie}
        onCastVote={game.castVote}
      />
    );
  }

  return (
    <div className="screen">
      <p className="waiting">در حال بارگذاری...</p>
    </div>
  );
}
