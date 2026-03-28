import type { APIRoute } from 'astro';
import { PALACES, fetchPalaceList } from '../lib/api';

export const GET: APIRoute = async () => {
  const site =  + SITE + ;
  const langs = ['kr', 'en', 'ja', 'zh'];
  const today = new Date().toISOString().split('T')[0];
  let urls = '';

  /* Home */
  for (const lang of langs) {
    urls += `<url><loc>${site}/?lang=${lang}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  }

  /* Palace list pages + building detail pages */
  for (const palace of PALACES) {
    for (const lang of langs) {
      urls += `<url><loc>${site}/palace/${palace.id}?lang=${lang}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    }
    try {
      const buildings = await fetchPalaceList(palace.id);
      console.log(`[sitemap] Palace ${palace.id}: ${buildings.length} buildings`);
      for (const b of buildings) {
        for (const lang of langs) {
          urls += `<url><loc>${site}/palace/${palace.id}/${b.detailCode}?sn=${b.serialNumber}&amp;lang=${lang}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`;
        }
      }
    } catch (err) {
      console.error(`[sitemap] Palace ${palace.id} fetch error:`, err);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
