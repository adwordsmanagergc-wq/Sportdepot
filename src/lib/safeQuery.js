// Wraps a Prisma call so a missing/unreachable database doesn't crash a
// server-rendered page. Returns the fallback (and logs) on any error.

export async function safeQuery(fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[safeQuery] DB query failed, using fallback:', err.message);
    }
    return typeof fallback === 'function' ? fallback() : fallback;
  }
}
