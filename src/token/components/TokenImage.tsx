import { useMemo } from 'react';
import { TokenImageReact } from '../types';
import { getTokenImageColor } from './getTokenImageColor';

export function TokenImage({ token, size = 24 }: TokenImageReact) {
  const { image, symbol, name } = token;

  const styles = useMemo(() => {
    return {
      image: {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'blue',
      },
      placeholderImage: {
        background: getTokenImageColor(name),
        width: `${size}px`,
        height: `${size}px`,
        color: 'white',
        fontSize: `${size / 4}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 1,
      },
    };
  }, [size]);

  if (!image) {
    return (
      <div data-testid="ockTokenImage_NoImage" style={styles.image}>
        <div style={styles.placeholderImage}>{symbol.slice(0, 3)}</div>
      </div>
    );
  }

  return <img data-testid="ockTokenImage_Image" style={styles.image} src={image} />;
}
