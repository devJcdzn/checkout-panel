import { Timer } from "lucide-react";
import { useState, useEffect } from "react";

interface TopBox {
  color: string;
  phrase: string;
}

interface BottomBox {
  color: string;
  phrase: string;
}

interface Props {
  topBox: TopBox;
  bottomBox: BottomBox;
  initialTime: number;
}

export const CountdownTimer = ({ topBox, bottomBox, initialTime }: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <div className="text-center">
      <div
        className="text-white p-3 text-semibold flex items-center justify-center gap-1"
        style={{ backgroundColor: topBox.color }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#fff"
          stroke="none"
          className="tabler-icon tabler-icon-shield-check-filled text-muted-foreground h-8 w-8"
        >
          <path d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"></path>
        </svg>
        <span>{topBox.phrase}</span>
      </div>

      <div
        className="p-3 text-white flex flex-col items-center gap-1"
        style={{ backgroundColor: bottomBox.color }}
      >
        <span>{bottomBox.phrase}</span>
        <span className="flex items-center gap-1">
          <Timer className="size-4" />
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};
