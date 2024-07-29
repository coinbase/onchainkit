import { useCallback, useEffect, useState } from 'react';

export function usePopover(onClick?: () => Promise<boolean>) {
  const [popoverText, setPopoverText] = useState('Copy');
  const [showPopover, setShowPopover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setPopoverText('Copy');
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPopover(false);
  }, []);

  const handleClick = useCallback(async () => {
    if (onClick) {
      const result = await onClick();
      if (result) {
        setPopoverText('Copied');
        // istanbul ignore next
        setTimeout(() => {
          setShowPopover(false);
        }, 1000);
      }
    }
  }, [onClick]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => setShowPopover(true), 200);
    } else {
      setShowPopover(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  if (!onClick) {
    return {};
  }

  return {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    showPopover,
    popoverText,
  };
}
