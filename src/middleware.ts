import { defineMiddleware } from 'astro/middleware';

// 언어별 쿼리스트링(?lang=kr|en|ja|zh) 응답이 Cloudflare 엣지 캐시에
// 다른 언어로 잘못 캐시되는 것을 방지한다. (cache-control 없으면 캐시 가능으로 판단됨)
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  const lang = context.url.searchParams.get('lang');
  if (lang && response.headers.get('content-type')?.includes('text/html')) {
    response.headers.set('Cache-Control', 'private, no-cache');
  }

  return response;
});
