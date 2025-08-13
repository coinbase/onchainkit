import { prefixClassName } from './theme';

export const zIndex = {
  base: prefixClassName('z-0'),
  navigation: prefixClassName('z-1'),
  dropdown: prefixClassName('z-10'),
  tooltip: prefixClassName('z-20'),
  modal: prefixClassName('z-40'),
  notification: prefixClassName('z-50'),
} as const;
