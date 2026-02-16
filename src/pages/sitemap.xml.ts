import type { APIRoute } from 'astro';
import { PALACES, fetchPalaceList } from '../lib/api';

export const GET: APIRoute = async () => {
  const site = 'https://k-heritage.pages.dev';
  const langs = ['kr', 'en', 'ja', 'zh'];
  let urls = '';

  /* Home */
  for (const lang of langs) {
    urls += `<url><loc>${site}/?lang=${lang}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  }

  /* Palace pages + building pages */
  for (const palace of PALACES) {
    for (const lang of langs) {
      urls += `<url><loc>${site}/palace/${palace.id}?lang=${lang}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    }
    try {
      const buildings = await fetchPalaceList(palace.id);
      for (const b of buildings) {
        for (const lang of langs) {
          urls += `<url><loc>${site}/palace/${palace.id}/${b.detailCode}?sn=${b.serialNumber}&amp;lang=${lang}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
        }
      }
    } catch { /* skip on error */ }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
