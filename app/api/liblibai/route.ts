export const runtime = 'edge';

/**
 * Vercel Edge Function 代理，将 /api/liblibai 的请求转发到 https://openapi.liblibai.cloud
 * 这样前端只需请求 /api/liblibai，无需担心跨域问题。
 */
export default async function handler(req: Request) {
  // 构造目标 API 的 URL
  const targetPath = new URL(req.url).pathname.replace(/^\/api\/liblibai/, '') + (new URL(req.url).search || '');
  const url = `https://openapi.liblibai.cloud${targetPath}`;

  // 构造 headers（可根据需要调整）
  const headers = new Headers(req.headers);
  headers.set('referer', 'https://openapi.liblibai.cloud');
  headers.set('origin', 'https://openapi.liblibai.cloud');

  // 代理请求
  const apiRes = await fetch(url, {
    method: req.method,
    headers,
    body: req.method === 'GET' ? undefined : req.body
  });

  // 返回响应
  return new Response(apiRes.body, {
    status: apiRes.status,
    headers: apiRes.headers
  });
} 
