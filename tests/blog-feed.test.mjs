import assert from 'node:assert/strict';
import test from 'node:test';
import { postsFromBlogFeed } from '../utils/blog-feed.mjs';

const posts = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }, { title: 'Fourth' }];
test('renders the static JSON response already parsed by useFetch', () => {
  assert.deepEqual(postsFromBlogFeed({ posts }), posts.slice(0, 3));
  assert.equal(posts.length, 4);
});
test('preserves the legacy text response', () => {
  assert.deepEqual(postsFromBlogFeed(JSON.stringify({ posts })), posts.slice(0, 3));
});
test('keeps the homepage available when a feed is missing or invalid', () => {
  for (const feed of [undefined, null, '', '<html>unavailable</html>', {}, { posts: null }]) {
    assert.deepEqual(postsFromBlogFeed(feed), []);
  }
});
