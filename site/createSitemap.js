import SitemapGenerator from 'sitemap-generator';

let pagesInSitemap = 0;

const generator = SitemapGenerator('https://onchainkit.xyz', {
  changeFreq: 'daily',
  ignore: (url) => {
    // Ignore coverage pages
    const hasCoverage = url.includes('coverage');
    if (!hasCoverage) {
      pagesInSitemap += 1;
      console.log('🌊', url);
    }
    return hasCoverage;
  },
  filepath: './docs/public/sitemap.xml',
  lastMod: true,
  stripQuerystring: false,
});

generator.on('done', () => {
  console.log(`Sitemap created with ${pagesInSitemap} pages`);
});

// Start the crawler
generator.start();
