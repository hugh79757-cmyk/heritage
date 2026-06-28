import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals as any).runtime.env;
  const db = env.DB;

  const lat = parseFloat(url.searchParams.get('lat') || '37.5796');
  const lng = parseFloat(url.searchParams.get('lng') || '126.977');
  const radius = parseFloat(url.searchParams.get('radius') || '3');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  // Haversine distance in SQL (approximate using bounding box for performance)
  const latDelta = radius / 111.0;
  const lngDelta = radius / (111.0 * Math.cos((lat * Math.PI) / 180));

  const results = await db.prepare(`
    SELECT id, name_kr, name_hanja, type_name, sido_name, sigungu_name,
           latitude, longitude, image_url,
           ((latitude - ?) * (latitude - ?) + (longitude - ?) * (longitude - ?) * 0.64) as dist_sq
    FROM heritage_index
    WHERE latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
      AND cancel_yn = 'N'
      AND latitude != 0
      AND longitude != 0
    ORDER BY dist_sq ASC
    LIMIT ?
  `).bind(
    lat, lat, lng, lng,
    lat - latDelta, lat + latDelta,
    lng - lngDelta, lng + lngDelta,
    limit
  ).all();

  const items = (results.results || []).map((r: any) => ({
    id: String(r.id),
    nameKr: r.name_kr,
    nameH: r.name_hanja,
    type: r.type_name,
    sido: r.sido_name,
    sigungu: r.sigungu_name,
    lat: r.latitude,
    lng: r.longitude,
    image: r.image_url,
  }));

  return new Response(JSON.stringify({ items, count: items.length }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
