import { useEffect, useState } from "react";

export function Countdown({ deadlineMs }: { deadlineMs: number | null }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!deadlineMs) {
      setSeconds(0);
      return;
    }
    const tick = () => {
      setSeconds(Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [deadlineMs]);

  if (!deadlineMs || seconds <= 0) return null;
  return <p className="countdown">⏱ {seconds} ثانیه</p>;
}
