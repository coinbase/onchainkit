import { TextAs } from './TextAs';
import type { TextReact } from './types';

export function TextBody(props: TextReact) {
  return (
    <TextAs
      as="span"
      className="font-sans text-base leading-normal"
      {...props}
    />
  );
}
