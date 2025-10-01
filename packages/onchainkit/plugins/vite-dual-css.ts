import type { Plugin } from 'vite';
import postcss from 'postcss';
import path from 'node:path';
import fs from 'fs';
import postcssCreateScopedStyles from './postcss-create-scoped-styles.js';

interface DualCSSOptions {
  scopedFileName?: string;
}

export function dualCSSPlugin(options: DualCSSOptions = {}): Plugin {
  const { scopedFileName = 'scoped-styles.css' } = options;

  return {
    name: 'dual-css',
    async writeBundle(outputOptions, bundle) {
      console.log('📦 Generating scoped styles...');

      // Find the main CSS file in the bundle
      const cssAsset = Object.values(bundle).find(
        (asset) =>
          asset.type === 'asset' && asset.fileName === 'assets/style.css',
      );

      if (!cssAsset || cssAsset.type !== 'asset') {
        console.warn('⚠️  No style.css found in bundle');
        return;
      }

      try {
        // Process the CSS with our scoping plugin and layer consolidation
        const result = await postcss([
          postcssCreateScopedStyles({
            consolidateLayers: true, // Enable layer consolidation for scoped styles
          }),
        ]).process(cssAsset.source as string, { from: undefined });

        // Write the scoped CSS file
        const outputDir =
          outputOptions.dir || path.dirname(outputOptions.file || '');
        const scopedPath = path.join(outputDir, 'assets', scopedFileName);

        // Ensure the assets directory exists
        const assetsDir = path.dirname(scopedPath);
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }

        fs.writeFileSync(scopedPath, result.css);
        console.log(`✅ Generated scoped styles: assets/${scopedFileName}`);
      } catch (error) {
        console.error('❌ Error generating scoped styles:', error);
      }
    },
  };
}
