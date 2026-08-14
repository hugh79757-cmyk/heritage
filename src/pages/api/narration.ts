import type { APIRoute } from 'astro';

const NARRATION_API = 'https://www.khs.go.kr/cha/SearchVoiceOpenapi.do';

export const GET: APIRoute = async ({ url }) => {
  const kdcd = url.searchParams.get('kdcd') || '11';
  const asno = url.searchParams.get('asno') || '';
  const ctcd = url.searchParams.get('ctcd') || '';
  const requestedGbn = url.searchParams.get('gbn') || 'kr';
  const gbn = requestedGbn === 'ja' ? 'jpn' : requestedGbn === 'zh' ? 'chn' : requestedGbn;

  if (!asno || !ctcd) {
    return new Response(JSON.stringify({ items: [], count: 0 }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let items: { title: string; url: string }[] = [];
  let triedApi = false;

  const endpoints = [
    `${NARRATION_API}?ccbaKdcd=${encodeURIComponent(kdcd)}&ccbaAsno=${encodeURIComponent(asno)}&ccbaCtcd=${encodeURIComponent(ctcd)}&ccbaGbn=${encodeURIComponent(gbn)}`,
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

      // Primary: parse <item> blocks
      const blocks = text.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const block of blocks) {
        const title = block.match(/<narration_title>([\s\S]*?)<\/narration_title>/)?.[1]?.trim() || block.match(/<ccbaMnm1>([\s\S]*?)<\/ccbaMnm1>/)?.[1]?.trim().replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim() || '';
        const urlMatch = block.match(/<voiceUrl>([\s\S]*?)<\/voiceUrl>/)?.[1]?.trim().replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim() || block.match(/<narration_url>([\s\S]*?)<\/narration_url>/)?.[1]?.trim() || '';
        if (urlMatch) {
          items.push({ title, url: urlMatch.startsWith('http') ? urlMatch : `https:${urlMatch}` });
        }
      }

      // Fallback: if no <item> blocks, try extracting any mp3/audio URL directly
      if (items.length === 0) {
        const audioUrl = text.match(/https?:\/\/[^\s"'<>]+\.(mp3|wav|m4a|ogg|aac)(\?[^\s"'<>]*)?/i)?.[0];
        if (audioUrl) items.push({ title: '', url: audioUrl });
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