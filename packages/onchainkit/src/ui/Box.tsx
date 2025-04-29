import { cn } from '@/styles/theme';
import {
  forwardRef,
  type ElementType,
  type PropsWithoutRef,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ReactElement,
  type ReactNode,
} from 'react';

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<TElement extends ElementType, P> = keyof (AsProp<TElement> &
  P);

type PolymorphicComponentProp<
  TElement extends ElementType,
  Props,
> = PropsWithoutRef<Props & AsProp<TElement>> &
  Omit<ComponentPropsWithoutRef<TElement>, PropsToOmit<TElement, Props>>;

type PolymorphicRef<TElement extends ElementType> =
  ComponentPropsWithRef<TElement>['ref'];

type PolymorphicComponentPropWithRef<
  TElement extends ElementType,
  Props,
> = PolymorphicComponentProp<TElement, Props> & {
  ref?: PolymorphicRef<TElement>;
};

type PolymorphicComponent<TDefaultType extends ElementType> = <
  TElement extends ElementType = TDefaultType,
>(
  props: PolymorphicComponentPropWithRef<TElement, BoxProps>,
) => ReactElement;

type BoxProps = {
  className?: string;
  children?: ReactNode;
};

export const Box = forwardRef(function Box<TElement extends ElementType>(
  {
    as,
    className,
    children,
    ...props
  }: PolymorphicComponentProp<TElement, BoxProps>,
  ref?: PolymorphicRef<TElement>,
) {
  const Component = as || 'div';
  return (
    <Component ref={ref} className={cn('ock', className)} {...props}>
      {children}
    </Component>
  );
}) as PolymorphicComponent<'div'>;
