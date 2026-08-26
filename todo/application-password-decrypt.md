# Application password: decrypt for apply-agent

Onboarding already encrypts and stores `user.application_password`. Skip Infisical for now. Do this when apply-agent needs to fill Workday / iCIMS / Oracle.

## Do

- Add `decryptApplicationPassword(userId)` next to encrypt in `packages/db/src/user-application-password.ts`. Ciphertext format: `v1.{iv}.{authTag}.{ciphertext}` (base64url, AES-256-GCM).
- Stop deriving the AES key from `BETTER_AUTH_SECRET`. Add `APPLICATION_PASSWORD_KEY` in `packages/env/src/server.ts` and use that for encrypt/decrypt.
- Call decrypt only at fill time in apply-agent (or an API it calls). Do not return plaintext to the web client. Drop the plaintext after the job.

## Do not

- Infisical KMS (optional later if the key should never live in app env).
- A decrypt API for the browser.
