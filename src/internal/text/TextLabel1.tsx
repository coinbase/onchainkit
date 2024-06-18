import { TextAs } from './TextAs';
import type { TextReact } from './types';

export function TextLabel1(props: TextReact) {
  return (
    <TextAs
      as="span"
      className="font-bold font-sans text-sm leading-5"
      {...props}
    />
  );
}
