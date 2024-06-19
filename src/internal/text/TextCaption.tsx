import { TextAs } from './TextAs';
import type { TextReact } from './types';

/* istanbul ignore next */
export function TextCaption(props: TextReact) {
  return (
    <TextAs
      as="span"
      className="font-sans text-bold text-xs leading-4"
      {...props}
    />
  );
}
