export default defineEventHandler(async (event) => {
  const { apiProxyTarget } = useRuntimeConfig();
  const target = apiProxyTarget || 'http://localhost:3001';
  const res = await fetch(`${target}/googleLogin/`, { redirect: 'manual' });
  const location = res.headers.get('location');
  if (location) {
    // The API ties the sign-in to this browser with a cookie, so it has to reach the browser
    for (const cookie of res.headers.getSetCookie()) {
      appendResponseHeader(event, 'set-cookie', cookie);
    }
    return sendRedirect(event, location, 302);
  }
  throw createError({ statusCode: 502, statusMessage: 'No redirect from backend' });
});
