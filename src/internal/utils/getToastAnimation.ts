export function getToastAnimation(
  position: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'
) {
  switch (position) {
    case 'top-right':
      return 'animate-enterRight';
    case 'top-center':
      return 'animate-enterDown';
    case 'bottom-right':
      return 'animate-enterRight';
    case 'bottom-center':
      return 'animate-enterUp';
    default:
      throw new Error('Invalid toast position');
  }
}
