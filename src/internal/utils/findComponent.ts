import { isValidElement } from 'react';
import type { ComponentType, ReactElement, ReactNode } from 'react';

export function findComponent<T>(component: ComponentType<T>) {
  return (child: ReactNode): child is ReactElement<T> => {
    return isValidElement(child) && child.type === component;
  };
}
