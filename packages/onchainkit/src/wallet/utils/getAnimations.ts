import { prefixClassName } from '@/styles/theme';

export function getAnimations(
  isSubComponentClosing: boolean,
  showSubComponentAbove: boolean,
) {
  if (isSubComponentClosing) {
    return {
      container: showSubComponentAbove
        ? prefixClassName(
            'fade-out slide-out-to-bottom-1.5 animate-out fill-mode-forwards ease-in-out',
          )
        : prefixClassName(
            'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
          ),
      content: '',
    };
  }

  return {
    container: showSubComponentAbove
      ? prefixClassName(
          'fade-in slide-in-from-bottom-1.5 animate-in duration-300 ease-out',
        )
      : prefixClassName(
          'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
        ),
    content: showSubComponentAbove
      ? prefixClassName(
          'fade-in slide-in-from-bottom-2.5 animate-in fill-mode-forwards duration-300 ease-out',
        )
      : prefixClassName(
          'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out',
        ),
  };
}
