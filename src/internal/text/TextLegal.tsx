import { TextAs } from './TextAs';
import type { TextReact } from './types';

/* istanbul ignore next */
export function TextLegal(props: TextReact) {
  return (
    <TextAs as="span" className="font-sans text-xs leading-4" {...props} />
  );
}
