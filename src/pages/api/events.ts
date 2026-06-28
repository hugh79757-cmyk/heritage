import type { APIRoute } from 'astro';

const EVENT_API = 'http://www.khs.go.kr/cha/openapi/selectEventListOpenapi.do';

export const GET: APIRoute = async ({ url }) => {
  const page = url.searchParams.get('page') || '1';
  const count = url.searchParams.get('count') || '10';

  try {
    const apiUrl = `${EVENT_API}?pageUnit=${count}&pageIndex=${page}`;
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `API ${res.status}` }), { status: 502 });
    }

    const xml = await res.text();

    // XML 파싱
    const items: any[] = [];
    const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

    for (const block of blocks) {
      const get = (tag: string) => block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() || '';
      items.push({
        name: get('evNm') || get('event_name'),
        date: get('evStartDate') || get('start_date'),
        endDate: get('evEndDate') || get('end_date'),
        place: get('place') || get('evPlace'),
        description: get('summary') || get('description'),
      });
    }

    const totalMatch = xml.match(/<totalCnt>(\d+)<\/totalCnt>/);
    const total = totalMatch ? parseInt(totalMatch[1]) : items.length;

    return new Response(JSON.stringify({ items, total, count: items.length }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
