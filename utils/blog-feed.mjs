/** Accept both the legacy text response and the static JSON feed. */
export function postsFromBlogFeed(response) {
  try {
    const feed = typeof response === 'string' ? JSON.parse(response) : response;
    return Array.isArray(feed?.posts) ? feed.posts.slice(0, 3) : [];
  } catch {
    return [];
  }
}
