export default defineEventHandler(async (event) => {
  const { apiProxyTarget } = useRuntimeConfig();
  const target = apiProxyTarget || 'http://localhost:3001';
  const res = await fetch(`${target}/googleLogin/`, { redirect: 'manual' });
  const location = res.headers.get('location');
  if (location) {
    return sendRedirect(event, location, 302);
  }
  throw createError({ statusCode: 502, statusMessage: 'No redirect from backend' });
});
