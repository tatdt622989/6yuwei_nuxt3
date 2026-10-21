/** Fetch errors can contain a plain response or a structured API message. */
export function apiErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Request failed.';
  const value = error as { data?: unknown; message?: unknown };
  if (typeof value.data === 'string' && value.data) return value.data;
  if (value.data && typeof value.data === 'object') {
    const data = value.data as { msg?: unknown; message?: unknown };
    if (typeof data.msg === 'string' && data.msg) return data.msg;
    if (typeof data.message === 'string' && data.message) return data.message;
  }
  return typeof value.message === 'string' && value.message ? value.message : 'Request failed.';
}
