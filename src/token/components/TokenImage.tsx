import { useMemo } from 'react';

type TokenImageReact = {
  src: string | null;
  size?: number;
};

export function TokenImage({ src, size = 24 }: TokenImageReact) {
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
        background: 'blue',
        width: `${size}px`,
        height: `${size}px`,
      },
    };
  }, [size]);

  if (!src) {
    return (
      <div data-testid="ockTokenImage_NoImage" style={styles.image}>
        <div style={styles.placeholderImage} />
      </div>
    );
  }

  return <img data-testid="ockTokenImage_Image" style={styles.image} src={src} />;
}
