import { useMemo, Children } from 'react';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn, background, border, pressable, color } from '../../styles/theme.js';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription.js';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput.js';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function SwapSettingsSlippageLayoutBottomSheet({
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
    className: cn(background.default, border.default, pressable.shadow, 'right-0 z-10 h-full w-full rounded-t-lg px-3 pt-2 pb-3', className),
    "data-testid": "ockSwapSettingsLayout_container",
    children: [/*#__PURE__*/jsx("div", {
      className: cn(background.alternate, 'mx-auto mb-2 h-1 w-4 rounded-[6.25rem]')
    }), /*#__PURE__*/jsx("div", {
      className: "mb-4 flex items-center justify-center",
      children: /*#__PURE__*/jsx("h2", {
        className: cn(color.foreground, 'font-bold text-sm'),
        children: "Settings"
      })
    }), /*#__PURE__*/jsxs("div", {
      className: "flex flex-col",
      children: [title, /*#__PURE__*/jsx("div", {
        className: "pb-4",
        children: description
      }), input && /*#__PURE__*/jsx("div", {
        className: "flex-grow",
        children: input
      })]
    }), /*#__PURE__*/jsx("div", {
      className: "mt-4 flex justify-center",
      children: /*#__PURE__*/jsx("div", {
        className: cn(background.inverse, 'h-1 w-28 shrink-0 rounded-[0.43931rem]')
      })
    })]
  });
}
export { SwapSettingsSlippageLayoutBottomSheet };
//# sourceMappingURL=SwapSettingsSlippageLayoutBottomSheet.js.map
