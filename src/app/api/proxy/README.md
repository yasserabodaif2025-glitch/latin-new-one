This folder contains a simple server-side proxy route at /api/proxy/[...path].

Usage:

- Client code should call endpoints under `/api/proxy/<target-path>` which will be forwarded to the configured `API_URL`.
- The proxy will read the `token` httpOnly cookie from the incoming request (server-side via `next/headers`) and attach it as `Authorization: Bearer <token>` to the outgoing request.

Example:

- Client GET /api/proxy/Roles/pagination -> forwarded to ${process.env.API_URL}/Roles/pagination with Authorization header (if cookie present).

Notes:

- Make sure `API_URL` is set in your environment when running the Next.js server.
- This proxy is intended for development and to bridge the server/client cookie auth gap. For production you may want a more robust proxy or to have the backend accept cookie-based auth directly.
