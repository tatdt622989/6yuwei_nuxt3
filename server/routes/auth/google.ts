export default defineEventHandler(async (event) => {
  const { apiProxyTarget } = useRuntimeConfig();
  const target = apiProxyTarget || 'http://localhost:3001';
  const url = `${target}/googleLogin/`;

  try {
    const res = await fetch(url, { redirect: 'manual' });
    const location = res.headers.get('location');
    if (location) {
      return sendRedirect(event, location, 302);
    }
    const body = await res.text();
    console.error(`[auth/google] Backend returned ${res.status}, body: ${body.slice(0, 500)}`);
    throw createError({ statusCode: 502, statusMessage: `Backend returned ${res.status} instead of redirect` });
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error(`[auth/google] Fetch to ${url} failed:`, err.message);
    throw createError({ statusCode: 502, statusMessage: `Failed to reach backend: ${err.message}` });
  }
});
