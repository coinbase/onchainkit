'use client';

import { useEffect, useState } from 'react';

type TimerProps = {
  /* start time in milliseconds */
  startMs: number;
  /* countdown interval in milliseconds, default 1000 */
  interval?: number;
  /* formatter function to display time */
  formatFunc?: (timeMs: number) => string;
  /* callback to call on timer complete */
  callback?: () => void;
};

export function Timer({
  startMs,
  interval = 1000,
  formatFunc = (time) => (time / 1000).toFixed(),
  callback = () => {},
}: TimerProps) {
  const [timeMs, setTimeMs] = useState(startMs);

  useEffect(() => {
    if (timeMs <= 0) {
      callback();
      return;
    }

    const timer = setInterval(() => {
      setTimeMs((prev) => prev - interval);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, callback, timeMs]);

  return <span className="font-mono">{formatFunc(timeMs)}</span>;
}
