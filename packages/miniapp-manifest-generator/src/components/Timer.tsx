'use client';

import { useEffect, useState } from 'react';

type TimerProps = {
  startMs: number;
  interval?: number;
  formatFunc?: (timeMs: number) => string;
  callback?: () => void;
};

/**
 * A timer component that displays a countdown timer and calls a callback when the timer is complete.
 * @param {number} props.startMs - The start time in milliseconds
 * @param {number} props.interval - The countdown interval in milliseconds, defaults to 1000
 * @param {function} props.formatFunc - The formatter function to display time, defaults to displaying seconds.
 * @param {function} props.callback - The callback to call on timer complete
 * @returns {React.ReactNode} The Timer component.
 */
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
