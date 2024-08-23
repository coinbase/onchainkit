import { useEffect, useRef, useState } from 'react';
import { cn } from '../../styles/theme';
import type { TextInputReact } from './TextInput';
import { TextInput } from './TextInput';

export function ScaledTextInput(props: TextInputReact) {
  const inputContainer = useRef<HTMLDivElement | null>(null);
  const offscreenRef = useRef<HTMLSpanElement | null>(null);
  const [containerScale, setContainerScale] = useState(1);

  useEffect(() => {
    if (props.value && offscreenRef.current && inputContainer.current) {
      const containerWidth = inputContainer.current.offsetWidth;
      const textWidth = offscreenRef.current.offsetWidth;
      const scaleFactor = containerWidth / textWidth;

      if (scaleFactor < 1) {
        setContainerScale(scaleFactor);
      } else {
        setContainerScale(1);
      }
    } else {
      setContainerScale(1);
    }
  }, [props.value]);

  return (
    <>
      <div ref={inputContainer}>
        <div
          className="origin-[0_50%] overflow-hidden"
          style={{
            transform: `scale(${containerScale})`,
            width: `${100 / containerScale}%`,
          }}
          data-testid="scaled-text-input-container"
        >
          <TextInput {...props} />
        </div>
      </div>
      <span
        ref={offscreenRef}
        className={cn(
          props.className,
          'invisible absolute right-0 bottom-0 w-auto translate-x-[-100%] opacity-0',
        )}
        aria-hidden="true"
      >
        {props.value}
      </span>
    </>
  );
}
