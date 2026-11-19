import assert from 'node:assert/strict';
import test from 'node:test';
import { apiErrorMessage } from '../utils/api-error.ts';

test('shows the API response in plain text and supported JSON formats', () => {
  for (const data of ['Please sign in', { msg: 'Please sign in' }, { message: 'Please sign in' }]) {
    assert.equal(apiErrorMessage({ data }), 'Please sign in');
  }
});
test('turns the API error codes into words instead of the raw fetch error', () => {
  const fetchError = (data) => ({ data, message: '[GET] "/api/3dcgs/admin/category/": 403 Forbidden' });
  assert.equal(apiErrorMessage(fetchError({ error: 'forbidden' })), '這個帳號沒有權限');
  assert.equal(apiErrorMessage(fetchError({ error: 'unauthenticated' })), '請先登入');
  assert.equal(apiErrorMessage(fetchError({ error: 'origin_not_allowed' })), '請重新整理頁面再試一次');
  // An unknown code keeps the API's own message
  assert.equal(apiErrorMessage(fetchError({ error: 'invalid_request', message: 'delta must be an integer' })), 'delta must be an integer');
});
test('falls back to the network error without displaying objects as text', () => {
  assert.equal(apiErrorMessage({ data: {}, message: 'Network unavailable' }), 'Network unavailable');
  assert.equal(apiErrorMessage(null), 'Request failed.');
});
