import { useMemo, Children } from 'react';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn, background, border, line } from '../../styles/theme.js';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription.js';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput.js';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function SwapSettingsSlippageLayout({
  children,
  className
}) {
  const _useMemo = useMemo(() => {
      const childrenArray = Children.toArray(children);
      return {
        title: childrenArray.find(findComponent(SwapSettingsSlippageTitle)),
        description: childrenArray.find(findComponent(SwapSettingsSlippageDescription)),
        input: childrenArray.find(findComponent(SwapSettingsSlippageInput))
      };
    }, [children]),
    title = _useMemo.title,
    description = _useMemo.description,
    input = _useMemo.input;
  return /*#__PURE__*/jsxs("div", {
    className: cn(background.default, border.radius, line.default, 'right-0 z-10 w-[21.75rem] px-3 py-3', className),
    "data-testid": "ockSwapSettingsLayout_container",
    children: [title, description, /*#__PURE__*/jsx("div", {
      className: "flex items-center justify-between gap-2",
      children: input && /*#__PURE__*/jsx("div", {
        className: "flex-grow",
        children: input
      })
    })]
  });
}
export { SwapSettingsSlippageLayout };
//# sourceMappingURL=SwapSettingsSlippageLayout.js.map
