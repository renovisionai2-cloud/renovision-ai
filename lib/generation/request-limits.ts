/** Vercel serverless / edge — hard request+response body cap (documented). */
export const VERCEL_SERVERLESS_MAX_REQUEST_BYTES = Math.floor(4.5 * 1024 * 1024);

/** Next.js default `experimental.proxyClientMaxBodySize` (bytes). */
export const NEXTJS_DEFAULT_PROXY_CLIENT_MAX_BODY_BYTES = 10 * 1024 * 1024;

/** Safe max for multipart room upload through a Vercel function (encoding overhead). */
export const SERVER_ROOM_UPLOAD_MAX_BYTES = 4 * 1024 * 1024;
