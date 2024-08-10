import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Avatar } from '../../identity/components/Avatar';
import { Name } from '../../identity/components/Name';
import { findComponent } from './findComponent';

describe('findComponent', () => {
  it('should find the Name component in the array', () => {
    const childrenArray: ReactNode[] = [
      <div key="1">Random div</div>,
      <Name key="2" address="0x123456789" />,
      <Avatar key="3" address="0x123456789" />,
    ];
    const foundNameComponent = childrenArray.find(findComponent(Name));
    expect(foundNameComponent).toBeDefined();
    expect(foundNameComponent?.type).toBe(Name);
  });

  it('should find the Avatar component in the array', () => {
    const childrenArray: ReactNode[] = [
      <div key="1">Random div</div>,
      <Name key="2" address="0x123456789" />,
      <Avatar key="3" address="0x123456789" />,
    ];
    const foundAgeComponent = childrenArray.find(findComponent(Avatar));
    expect(foundAgeComponent).toBeDefined();
    expect(foundAgeComponent?.type).toBe(Avatar);
  });

  it('should return undefined if the component is not in the array', () => {
    const childrenArray: ReactNode[] = [<div key="1">Random div</div>];
    const foundNameComponent = childrenArray.find(findComponent(Name));
    expect(foundNameComponent).toBeUndefined();
  });
});
