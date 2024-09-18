import { useCallback } from 'react';

const BAR_WIDTH = 2;
const BAR_SPACING = 4;
const MAX_BAR_HEIGHT = 100;
const INACTIVE_COLOR = "rgba(107, 114, 128, .2)";
const PLAYED_COLOR = "rgba(107, 114, 128, 1)";


export const useRenderAudio = (canvasRef: React.RefObject<HTMLCanvasElement>) => {

  const drawLine = useCallback((ctx: CanvasRenderingContext2D, value: number, index: number, height: number) => {
    // The highest amplitude part of audio will get a bar at the max height
    const barHeight = MAX_BAR_HEIGHT * value;
    // Spaces out the bars
    const x = index * (BAR_WIDTH + BAR_SPACING);
    // Centers the bars to the middle of the canvas
    const y = (height - barHeight) / 2;
    // Draws the bar at the calculated position and size
    ctx.fillRect(x, y, BAR_WIDTH, barHeight);
  }, []);

  const render = useCallback((filteredData: number[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    ctx.fillStyle = INACTIVE_COLOR;
    filteredData.forEach((value, index) => {
      drawLine(ctx, value, index, canvas.height);
    });
  }, [canvasRef.current, drawLine]);

  const renderTime = useCallback((value: number, index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      return;
    }

    ctx.fillStyle = PLAYED_COLOR;
    drawLine(ctx, value, index, canvas.height);
  }, [canvasRef.current, drawLine]);

  return { canvasRef, render, renderTime };
};