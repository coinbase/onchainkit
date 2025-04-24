import { isValidElement } from 'react';
import type { ComponentType, ReactElement, ReactNode } from 'react';

/** Type for Next.js Server Component Payload
 * Temporary patch until we update to default children and remove internal findComponent */
export interface ServerComponentPayload {
  _payload: {
    /** [modulePath, chunks, componentName] */
    value: [string, string[], string];
  };
}

export function findComponent<T>(Component: ComponentType<T>) {
  return (child: ReactNode): child is ReactElement<T> => {
    const childType = (child as ReactElement<T>)?.type;

    // Handle server component payload
    if (childType && typeof childType === 'object' && '_payload' in childType) {
      const serverPayload = childType as ServerComponentPayload;
      return serverPayload._payload.value[2] === Component.name;
    }

    // Handle client component
    return isValidElement(child) && child.type === Component;
  };
}
