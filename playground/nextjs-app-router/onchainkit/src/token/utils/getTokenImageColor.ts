function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function numberToRgb(hash: number) {
  const h = Math.abs(hash) % 360;
  const s = (Math.abs(hash >> 8) % 31) + 50;
  const l = (Math.abs(hash >> 16) % 21) + 40;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function getTokenImageColor(str: string) {
  const hash = hashStringToNumber(`${str}`);
  return numberToRgb(hash);
}
