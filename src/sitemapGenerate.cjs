require('babel-register')({
  presets: ['es2015', 'react'],
});
require.extensions['.css'] = () => {};

const router = require('./sitemapRoutes').default;
const Sitemap = require('react-router-sitemap').default;

function generateSitemap() {
  return new Sitemap(router).build('http://localhost:5173').save('./public/sitemap.xml');
}

generateSitemap();
