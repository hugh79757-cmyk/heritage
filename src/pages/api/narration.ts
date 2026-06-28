import type { APIRoute } from 'astro';

const NARRATION_API = 'https://www.heritage.go.kr/cha/openapi/selectVoiceListOpenapi.do';

export const GET: APIRoute = async ({ url }) => {
  const kdcd = url.searchParams.get('kdcd') || '11';
  const asno = url.searchParams.get('asno') || '';
  const ctcd = url.searchParams.get('ctcd') || '';
  const gbn = url.searchParams.get('gbn') || 'kr';

  if (!asno || !ctcd) {
    return new Response(JSON.stringify({ items: [], count: 0 }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let items: { title: string; url: string }[] = [];
  let triedApi = false;

  // Try multiple API endpoints
  const endpoints = [
    `https://www.heritage.go.kr/cha/openapi/selectVoiceListOpenapi.do?ccbaKdcd=${kdcd}&ccbaAsno=${asno}&ccbaCtcd=${ctcd}&ccbaGbn=${gbn}`,
    `https://www.khs.go.kr/cha/SearchVoiceOpenapi.do?ccbaKdcd=${kdcd}&ccbaAsno=${asno}&ccbaCtcd=${ctcd}&ccbaGbn=${gbn}`,
  ];

  for (const apiUrl of endpoints) {
    try {
      triedApi = true;
      const res = await fetch(apiUrl, {
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KHeritage/1.0)',
          'Accept': 'application/xml, text/xml, */*',
          'Referer': 'https://www.heritage.go.kr/',
        },
        redirect: 'follow',
      });
      if (!res.ok) continue;

      const text = await res.text();

      const blocks = text.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const block of blocks) {
        const title = block.match(/<narration_title>([\s\S]*?)<\/narration_title>/)?.[1]?.trim() || '';
        const urlMatch = block.match(/<narration_url>([\s\S]*?)<\/narration_url>/)?.[1]?.trim() || '';
        if (urlMatch) {
          items.push({ title, url: urlMatch.startsWith('http') ? urlMatch : `https:${urlMatch}` });
        }
      }
      if (items.length > 0) break;
    } catch {
      continue;
    }
  }

  return new Response(JSON.stringify({ items, count: items.length }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};