export default defineEventHandler(async (event) => {
    const apiProxyTarget = process.env.NUXT_API_PROXY_TARGET || 'http://localhost:3001';

    const response = await fetch(`${apiProxyTarget}/googleLogin/`, {
        redirect: 'manual',
    });

    if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
            return sendRedirect(event, location, response.status);
        }
    }

    throw createError({ statusCode: 502, statusMessage: 'Failed to get Google OAuth redirect URL from backend' });
});
