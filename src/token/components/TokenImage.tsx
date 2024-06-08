import { useMemo } from 'react';
import { TokenImageReact } from '../types';
import { getTokenImageColor } from './getTokenImageColor';

export function TokenImage({ className, size = 24, token }: TokenImageReact) {
  const { image, name } = token;

  const styles = useMemo(() => {
    return {
      image: {
        width: `${size}px`,
        height: `${size}px`,
      },
      placeholderImage: {
        background: getTokenImageColor(name),
        width: `${size}px`,
        height: `${size}px`,
      },
    };
  }, [size]);

  if (!image) {
    return (
      <div
        className={className || 'ock-tokenimage'}
        data-testid="ockTokenImage_NoImage"
        style={styles.image}
      >
        <div style={styles.placeholderImage} />
      </div>
    );
  }

  return (
    <img
      className={className || 'ock-tokenimage'}
      data-testid="ockTokenImage_Image"
      style={styles.image}
      src={image}
    />
  );
}
