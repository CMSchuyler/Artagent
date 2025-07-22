import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Edge Function 代理，将 /api/liblibai 的请求转发到 https://openapi.liblibai.cloud
 * 这样前端只需请求 /api/liblibai，无需担心跨域问题。
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 构造目标 API 的 URL
  const targetPath = req.url?.replace(/^\/api\/liblibai/, '') || '';
  const url = `https://openapi.liblibai.cloud${targetPath}`;

  // 构造 headers（可根据需要调整）
  const headers = {
    ...req.headers,
    referer: 'https://openapi.liblibai.cloud',
    origin: 'https://openapi.liblibai.cloud'
  };

  // 处理 body
  let body: any = undefined;
  if (req.method !== 'GET' && req.body) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  // 代理请求
  const apiRes = await fetch(url, {
    method: req.method,
    headers,
    body
  });

  const data = await apiRes.arrayBuffer();
  apiRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.status(apiRes.status).send(Buffer.from(data));
} 
