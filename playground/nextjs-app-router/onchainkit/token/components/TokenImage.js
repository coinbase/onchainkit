import { useMemo } from 'react';
import { cn } from '../../styles/theme.js';
import { getTokenImageColor } from '../utils/getTokenImageColor.js';
import { jsx } from 'react/jsx-runtime';
function TokenImage({
  className,
  size = 24,
  token
}) {
  const image = token.image,
    name = token.name;
  const styles = useMemo(() => {
    return {
      image: {
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      },
      placeholderImage: {
        background: getTokenImageColor(name),
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`
      }
    };
  }, [size, name]);
  if (!image) {
    return /*#__PURE__*/jsx("div", {
      className: cn('overflow-hidden rounded-full', className),
      "data-testid": "ockTokenImage_NoImage",
      style: styles.image,
      children: /*#__PURE__*/jsx("div", {
        style: styles.placeholderImage
      })
    });
  }
  return /*#__PURE__*/jsx("img", {
    className: cn('overflow-hidden rounded-[50%]', className),
    alt: "token-image",
    "data-testid": "ockTokenImage_Image",
    style: styles.image,
    src: image
  });
}
export { TokenImage };
//# sourceMappingURL=TokenImage.js.map
