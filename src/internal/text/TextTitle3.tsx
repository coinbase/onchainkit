import { TextAs } from './TextAs';
import type { TextReact } from './types';

export function TextTitle3(props: TextReact) {
  return (
    <TextAs
      as="span"
      className="font-bold font-display text-xl leading-7"
      {...props}
    />
  );
}
