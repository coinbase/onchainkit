export function getToastPosition(position: string) {
  if (position === 'bottom-right') {
    return 'bottom-5 left-3/4';
  }
  if (position === 'top-right') {
    return 'top-[100px] left-3/4';
  }
  if (position === 'top-center') {
    return 'top-[100px] left-2/4';
  }
  return 'bottom-5 left-2/4';
}
