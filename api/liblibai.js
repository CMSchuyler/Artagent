export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const { pathname, search } = new URL(req.url);
  // 去掉 /api/liblibai 前缀
  const targetPath = pathname.replace(/^\/api\/liblibai/, '');
  const url = `https://openapi.liblibai.cloud${targetPath}${search}`;

  // 构造 headers
  const headers = new Headers(req.headers);
  headers.set('referer', 'https://openapi.liblibai.cloud');
  headers.set('origin', 'https://openapi.liblibai.cloud');

  // 处理 body
  let body: BodyInit | null = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = req.body;
  }

  // 代理请求
  const apiRes = await fetch(url, {
    method: req.method,
    headers,
    body,
    redirect: 'manual',
  });

  // 构造响应
  const resHeaders = new Headers(apiRes.headers);
  // 可根据需要过滤/修改响应头

  return new Response(apiRes.body, {
    status: apiRes.status,
    headers: resHeaders,
  });
} 
