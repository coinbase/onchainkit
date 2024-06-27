/**
 * @jest-environment jsdom
 */
import React, { type ReactNode } from 'react';
import '@testing-library/jest-dom';
import { findComponent } from './findComponent';

const ToThe = () => <div>Name Component</div>;
const Moon = () => <div>Age Component</div>;

describe('findComponent', () => {
  it('should find the Name component in the array', () => {
    const childrenArray: ReactNode[] = [
      <div key="1">Random div</div>,
      <ToThe key="2" />,
      <Moon key="3" />,
    ];

    const foundNameComponent = childrenArray.find(findComponent(ToThe));
    expect(foundNameComponent).toBeDefined();
    expect(foundNameComponent?.type).toBe(ToThe);
  });

  it('should find the Age component in the array', () => {
    const childrenArray: ReactNode[] = [
      <div key="1">Random div</div>,
      <ToThe key="2" />,
      <Moon key="3" />,
    ];

    const foundAgeComponent = childrenArray.find(findComponent(Moon));
    expect(foundAgeComponent).toBeDefined();
    expect(foundAgeComponent?.type).toBe(Moon);
  });

  it('should return undefined if the component is not in the array', () => {
    const childrenArray: ReactNode[] = [<div key="1">Random div</div>];

    const foundNameComponent = childrenArray.find(findComponent(ToThe));
    expect(foundNameComponent).toBeUndefined();
  });
});
