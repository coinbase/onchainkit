import { TextAs } from './TextAs';
import type { TextReact } from './types';

export function TextHeadline(props: TextReact) {
  return (
    <TextAs
      as="span"
      className="font-bold font-sans text-base leading-normal"
      {...props}
    />
  );
}
