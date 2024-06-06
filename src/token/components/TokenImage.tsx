import { useMemo } from 'react';
import type { TokenImageReact } from '../types';
import { getTokenImageColor } from './getTokenImageColor';

export function TokenImage({ token, size = 24 }: TokenImageReact) {
  const { image, name } = token;

  const styles = useMemo(() => {
    return {
      image: {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
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
      <div data-testid="ockTokenImage_NoImage" style={styles.image}>
        <div style={styles.placeholderImage} />
      </div>
    );
  }

  return <img data-testid="ockTokenImage_Image" style={styles.image} src={image} />;
}
