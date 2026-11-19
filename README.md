# 6yuwei official website

Nuxt 4 portfolio and membership UI, deployed on Coolify as a prebuilt GHCR image.

## Runtime and dependencies

- Node **26.12.1**, pnpm **12.14.0** (exact versions in `.nvmrc` and `package.json`).
- Nuxt **4.6.2**, Vue **3.5.44**, Pinia **4.1.0**.
- Tiptap **3.32.0**, Swiper **14.3.0**, Vue Datepicker **14.0.0**.
- TypeScript **6.0.3**: Vue's latest `vue-tsc` currently requires the JavaScript compiler API that TypeScript 7 no longer exports.
- Node 26 is the latest stable **Current** release as checked on 2026-10-22; it has not entered LTS yet. Update it deliberately when future security releases appear.
- `pnpm-workspace.yaml` holds dependency overrides and the explicit list of allowed dependency build scripts. Use the committed lockfile.

## Local commands

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
NUXT_API_PROXY_TARGET=https://api.6yuwei.com pnpm build
PORT=3000 HOST=127.0.0.1 pnpm start
```

Run `pnpm dev` only when a development server is explicitly wanted.

## API and authentication

`NUXT_API_PROXY_TARGET` is required for a production image build. Keep the existing Coolify/GitHub secret value for the deployment; do not substitute localhost in production.

The browser uses the same-origin `/api` path. Nitro proxies `/api/**` to the configured backend. The API's own permissions still enforce access to member/admin data.

Sign-in uses the shared identity provider (`auth.6yuwei.com`) through the API's token handler; see `6yuwei_api/docs/Session-API.md`:

- The site never handles passwords or tokens. `useAuth()` reads `/api/session/me`, sends visitors to `/api/session/login?app=main&return=<path>`, and signs out with `POST /api/session/logout`.
- The session cookie is set on `6yuwei.com` through the proxy, so the API's callback URL for this site is `https://6yuwei.com/api/session/callback`.
- Every request to the API carries `X-Requested-With: 6yuwei` (`plugins/apiHeaders.client.ts`; the axios upload in `EditorModal.vue` sets it itself). The API refuses session requests that change data without it.
- A failed sign-in comes back as `/?login_error=<code>`; `plugins/loginError.client.ts` shows the reason.
- `/admin/login/` and `/admin/signup/` only forward to the identity provider, so old links still work.
- Account details (name, picture, password) are edited at the identity provider; `/admin/account/` only shows them. Admins adjust points at `/admin/points/`, and manage accounts at `auth.6yuwei.com/admin/users`.

| Variable | Purpose |
| --- | --- |
| `NUXT_PUBLIC_AUTH_URL` | Identity provider URL for the account and member links. Default `https://auth.6yuwei.com`; set `https://auth-stg.6yuwei.com` on staging. |

The homepage accepts both the old text response and the parsed JSON response from `https://blog.6yuwei.com/api.php`. An invalid feed no longer prevents the rest of the homepage from rendering.

## Deployment and rollback

A push to `main` runs the existing GitHub workflow:

1. Build the pinned official Node image, install the lockfile, run tests/type checking, and build Nuxt.
2. Publish `latest` and an immutable `sha-<commit>` tag to GHCR, with the source revision in the image labels.
3. Start an isolated Linux smoke-test container as UID 1000 on port 80, matching Coolify's current `PORT=80` runtime, and verify `/health`.
4. Trigger Coolify once through its supported **POST** deployment API using the existing `COOLIFY_WEBHOOK_URL` and `COOLIFY_API_TOKEN` secrets.

Do not additionally queue a manual deployment after a successful workflow. A new image is applied by Coolify's rolling deployment and health check. Keep the existing application domains, port 80 setting, and environment variables.

To roll back, use the Coolify UI to select a previously verified image/release, or set the image tag to a verified `sha-<commit>` and deploy through the UI/API. Retain the prior image and deployment backup until the release is verified. Do not modify Coolify's internal database/models to deploy.

## Security verification on 2026-10-22

The refreshed production dependency audit reports zero known advisories. The full build-tool audit still reports two high-severity advisories without an upstream patch: `node-forge@1.4.0` through Nitro's local development listener, and `braces@3.0.3` through Nitro's build-time file discovery. These are not included in the production dependency audit; inspect the final server artifact separately when updating tooling. Do not describe this as a guarantee that all software has no vulnerabilities.
