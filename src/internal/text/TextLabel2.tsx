import { TextAs } from './TextAs';
import type { TextReact } from './types';

export function TextLabel2(props: TextReact) {
  return (
    <TextAs as="span" className="font-sans text-sm leading-5" {...props} />
  );
}
