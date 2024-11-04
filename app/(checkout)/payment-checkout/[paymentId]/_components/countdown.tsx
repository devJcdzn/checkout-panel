import { useEffect, useState } from "react";

function Countdown({
  initialSeconds,
  onExpire,
}: {
  initialSeconds: number;
  onExpire: (expired: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(interval);
    } else if (onExpire) {
      onExpire(true);
    }
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
  };

  const { hours, minutes, secs } = formatTime(timeLeft);

  return (
    <section className="flex w-fit flex-col">
      <h3 className="text-muted-foreground text-lg font-semibold sm:text-xl">
        Tempo restante para pagamento
      </h3>
      <div className="flex text-6xl sm:text-7xl text-blue-400">
        <div className="flex w-20 flex-col sm:w-24">
          <span className="font-bold">{String(hours).padStart(2, "0")}</span>
          <span className="text-muted-foreground w-full pr-2 text-right text-sm">
            Horas
          </span>
        </div>
        <span className="font-bold">:</span>
        <div className="flex w-20 flex-col sm:w-24">
          <span className="font-bold">{String(minutes).padStart(2, "0")}</span>
          <span className="text-muted-foreground w-full pr-2 text-right text-sm">
            Min
          </span>
        </div>
        <span className="font-bold">:</span>
        <div className="flex w-20 flex-col sm:w-24">
          <span className="font-bold">{String(secs).padStart(2, "0")}</span>
          <span className="text-muted-foreground w-full pr-2 text-right text-sm">
            Seg
          </span>
        </div>
      </div>
    </section>
  );
}

export default Countdown;
