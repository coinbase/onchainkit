import type { ComponentType, ReactElement, ReactNode } from 'react';
export declare function findComponent<T>(component: ComponentType<T>): (child: ReactNode) => child is ReactElement<T, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=findComponent.d.ts.map