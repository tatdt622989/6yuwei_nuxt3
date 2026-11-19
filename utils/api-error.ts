// The API's error codes ({ error: "<code>" }, 6yuwei_api/docs/Auth-v2.md) in words people understand
const ERROR_CODES: Record<string, string> = {
  unauthenticated: "請先登入",
  invalid_token: "登入已過期，請重新登入",
  forbidden: "這個帳號沒有權限",
  origin_not_allowed: "請重新整理頁面再試一次",
  not_found: "找不到資料",
  invalid_balance: "點數不能小於 0",
};

/** Fetch errors can contain a plain response or a structured API message. */
export function apiErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Request failed.';
  const value = error as { data?: unknown; message?: unknown };
  if (typeof value.data === 'string' && value.data) return value.data;
  if (value.data && typeof value.data === 'object') {
    const data = value.data as { msg?: unknown; message?: unknown; error?: unknown };
    if (typeof data.msg === 'string' && data.msg) return data.msg;
    const known = typeof data.error === 'string' ? ERROR_CODES[data.error] : undefined;
    if (known) return known;
    if (typeof data.message === 'string' && data.message) return data.message;
  }
  return typeof value.message === 'string' && value.message ? value.message : 'Request failed.';
}
