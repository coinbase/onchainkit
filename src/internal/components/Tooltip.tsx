import { infoSvg } from '@/internal/svg/infoSvg';
import type React from 'react';
import { useCallback, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DEBUG_STYLE = {
  position: 'fixed',
  background: 'rgba(255, 0, 0, 0.1)',
  border: '1px solid red',
  pointerEvents: 'none',
  zIndex: 9999,
} as const;

type Point = { x: number; y: number };
type Polygon = Point[];

type TooltipProps = {
  // The element that triggers the tooltip
  trigger?: React.ReactElement;
  // The tooltip content
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  // Optional config object pattern for less commonly used props
  config?: {
    offset?: number;
    delay?: number;
    showOnFocus?: boolean;
    hideDelay?: number;
  };
};

function DefaultTrigger() {
  return <div className="size-4">{infoSvg}</div>;
}

export function Tooltip({
  trigger = <DefaultTrigger />,
  children,
  side = 'top',
  align = 'center',
  config = {},
}: TooltipProps) {
  const { offset = 8, delay = 0, hideDelay = 0, showOnFocus = true } = config;

  const [isVisible, setIsVisible] = useState(false);
  console.log('isVisible:', isVisible);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [pointerGraceArea, setPointerGraceArea] = useState<Polygon | null>(
    null,
  );
  console.log('pointerGraceArea:', pointerGraceArea);
  const [graceAreaPath, setGraceAreaPath] = useState<string>('');
  console.log('graceAreaPath:', graceAreaPath);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Base positions for each side
    const basePositions = {
      top: { top: triggerRect.top - tooltipRect.height - offset },
      bottom: { top: triggerRect.bottom + offset },
      left: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.left - tooltipRect.width - offset,
      },
      right: {
        top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        left: triggerRect.right + offset,
      },
    };

    // Alignment adjustments
    const alignments = {
      start: {
        top: { left: triggerRect.left },
        bottom: { left: triggerRect.left },
        left: { top: triggerRect.top },
        right: { top: triggerRect.top },
      },
      center: {
        top: {
          left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        },
        bottom: {
          left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
        },
        left: {
          top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        },
        right: {
          top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
        },
      },
      end: {
        top: { left: triggerRect.right - tooltipRect.width },
        bottom: { left: triggerRect.right - tooltipRect.width },
        left: { top: triggerRect.bottom - tooltipRect.height },
        right: { top: triggerRect.bottom - tooltipRect.height },
      },
    };

    setPosition({
      ...basePositions[side],
      ...alignments[align][side],
    });
  }, [side, align, config.offset]);

  const handleCreateGraceArea = useCallback(
    (event: PointerEvent, hoverTarget: HTMLElement) => {
      const currentTarget = event.currentTarget as HTMLElement;
      const exitPoint = { x: event.clientX, y: event.clientY };
      const rect = currentTarget.getBoundingClientRect();
      const exitSide = getExitSide(exitPoint, rect);

      const paddedPoints = getPaddedPoints(exitPoint, exitSide, 15); // Increased padding
      const targetPoints = getPointsFromRect(
        hoverTarget.getBoundingClientRect(),
      );
      const hullPoints = getHull([...paddedPoints, ...targetPoints]);

      setPointerGraceArea(hullPoints);

      // Create SVG path for visualization
      const path = `M ${hullPoints.map((p) => `${p.x},${p.y}`).join(' L ')} Z`;
      setGraceAreaPath(path);
    },
    [],
  );

  const handleRemoveGraceArea = useCallback(() => {
    setPointerGraceArea(null);
  }, []);

  useEffect(() => {
    if (pointerGraceArea) {
      const handlePointerMove = (event: PointerEvent) => {
        const pointerPosition = { x: event.clientX, y: event.clientY };
        const target = event.target as HTMLElement;

        const hasEnteredTarget =
          triggerRef.current?.contains(target) ||
          tooltipRef.current?.contains(target);

        if (hasEnteredTarget) {
          // If we've entered either the trigger or tooltip, clear grace area but keep visible
          handleRemoveGraceArea();
          setIsVisible(true);
        } else if (!isPointInPolygon(pointerPosition, pointerGraceArea)) {
          // Only hide if we're outside both the grace area AND the targets
          handleRemoveGraceArea();
          setIsVisible(false);
        }
      };

      document.addEventListener('pointermove', handlePointerMove);
      return () =>
        document.removeEventListener('pointermove', handlePointerMove);
    }
  }, [pointerGraceArea, handleRemoveGraceArea]);

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(calculatePosition);
    }, config.delay || 0);
  }, [calculatePosition, config.delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  // Recalculate position on scroll/resize
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleUpdate = () => requestAnimationFrame(calculatePosition);

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isVisible, calculatePosition]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      showTooltip();
    },
    [showTooltip],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      hideTooltip();
    },
    [hideTooltip],
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(config.showOnFocus && {
          onFocus: showTooltip,
          onBlur: hideTooltip,
        })}
        onPointerEnter={() => {
          handleRemoveGraceArea(); // Clear any existing grace area
          showTooltip();
        }}
        onPointerLeave={(e) => {
          if (tooltipRef.current) {
            handleCreateGraceArea(e, tooltipRef.current);
            // Keep tooltip visible while in grace area
            setIsVisible(true);
            return;
          }
          hideTooltip();
        }}
      >
        {trigger}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded shadow-lg"
            style={{
              top: position.top,
              left: position.left,
            }}
            role="tooltip"
            data-side={side}
            data-align={align}
            onPointerEnter={() => {
              handleRemoveGraceArea(); // Clear grace area when entering tooltip
              setIsVisible(true);
            }}
            onPointerLeave={(e) => {
              if (triggerRef.current) {
                handleCreateGraceArea(e, triggerRef.current);
                // Keep tooltip visible while in grace area
                setIsVisible(true);
                return;
              }
              hideTooltip();
            }}
          >
            {children}
          </div>,
          document.body,
        )}

      {/* Debug visualization of grace area */}
      {pointerGraceArea && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 9998,
          }}
        >
          <path
            d={graceAreaPath}
            fill="rgba(255, 0, 0, 0.1)"
            stroke="red"
            strokeWidth="1"
          />
        </svg>
      )}
    </>
  );
}

// Helper functions
function getExitSide(
  point: Point,
  rect: DOMRect,
): 'top' | 'right' | 'bottom' | 'left' {
  const distTop = Math.abs(rect.top - point.y);
  const distRight = Math.abs(rect.right - point.x);
  const distBottom = Math.abs(rect.bottom - point.y);
  const distLeft = Math.abs(rect.left - point.x);
  const min = Math.min(distTop, distRight, distBottom, distLeft);

  if (min === distTop) return 'top';
  if (min === distRight) return 'right';
  if (min === distBottom) return 'bottom';
  return 'left';
}

function getPaddedPoints(point: Point, side: string, padding = 15): Point[] {
  const basePoints = [];
  const steps = 8; // Number of points to create

  for (let i = 0; i < steps; i++) {
    const angle = (i / (steps - 1)) * Math.PI;
    switch (side) {
      case 'top':
        basePoints.push({
          x: point.x + Math.cos(angle) * padding,
          y: point.y + Math.abs(Math.sin(angle) * padding),
        });
        break;
      case 'bottom':
        basePoints.push({
          x: point.x + Math.cos(angle) * padding,
          y: point.y - Math.abs(Math.sin(angle) * padding),
        });
        break;
      case 'left':
        basePoints.push({
          x: point.x + Math.abs(Math.sin(angle) * padding),
          y: point.y + Math.cos(angle) * padding,
        });
        break;
      case 'right':
        basePoints.push({
          x: point.x - Math.abs(Math.sin(angle) * padding),
          y: point.y + Math.cos(angle) * padding,
        });
        break;
    }
  }

  return basePoints;
}

function getPointsFromRect(rect: DOMRect): Point[] {
  return [
    { x: rect.left, y: rect.top },
    { x: rect.right, y: rect.top },
    { x: rect.right, y: rect.bottom },
    { x: rect.left, y: rect.bottom },
  ];
}

function isPointInPolygon(point: Point, polygon: Polygon): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function getHull(points: Point[]): Point[] {
  // Sort points by x, then y
  const sorted = [...points].sort((a, b) =>
    a.x === b.x ? a.y - b.y : a.x - b.x,
  );

  const upper: Point[] = [];
  const lower: Point[] = [];

  for (const point of sorted) {
    while (
      upper.length >= 2 &&
      isClockwiseTurn(upper[upper.length - 2], upper[upper.length - 1], point)
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  for (const point of sorted.reverse()) {
    while (
      lower.length >= 2 &&
      isClockwiseTurn(lower[lower.length - 2], lower[lower.length - 1], point)
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  // Remove duplicate points
  return [...upper.slice(0, -1), ...lower.slice(0, -1)];
}

function isClockwiseTurn(p1: Point, p2: Point, p3: Point): boolean {
  const cross = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
  return cross < 0;
}
