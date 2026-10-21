import assert from 'node:assert/strict';
import test from 'node:test';
import { apiErrorMessage } from '../utils/api-error.ts';

test('shows the API response in plain text and supported JSON formats', () => {
  for (const data of ['Please sign in', { msg: 'Please sign in' }, { message: 'Please sign in' }]) {
    assert.equal(apiErrorMessage({ data }), 'Please sign in');
  }
});
test('falls back to the network error without displaying objects as text', () => {
  assert.equal(apiErrorMessage({ data: {}, message: 'Network unavailable' }), 'Network unavailable');
  assert.equal(apiErrorMessage(null), 'Request failed.');
});
