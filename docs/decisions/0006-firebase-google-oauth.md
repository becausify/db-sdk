# 0006. Firebase hosted provider uses Google OAuth

Status: **accepted**

## Context

A Firebase service account is a long-lived key. If the host product connects to a customer’s Firebase project, asking for that key means the host stores it. That is the wrong credential for a customer-attached database — same reason Supabase is OAuth plus a DB password, not “give us the service account.”

## Decision

1. **`@db-sdk/firebase` is a hosted provider.** It owns Google OAuth (and project pick). `id` is `"firebase"`. It opens the Firestore **driver** (`driver: "firestore"`). Realtime Database is a later driver on the same provider if needed ([ADR 0003](0003-providers-and-drivers.md)).
2. **The host must not require a Firebase service account JSON.** Tokens from Google OAuth are what the host stores (encrypted), then passes in memory to the SDK.
3. **`@db-sdk/firestore` is the driver only.** It runs catalog and document reads. It does not implement Google login.
4. **Do not ship `firestore({ serviceAccount })` as the product path** on the site or in examples. If the driver needs a credential after OAuth, that is a short-lived token or equivalent the provider already resolved.

## Consequences

- Implement Firebase like Supabase: connector (OAuth begin / exchange / refresh), list projects, `open()` → Firestore driver.
- Homepage and toolkit samples use `@db-sdk/firebase` + OAuth, not `FIREBASE_SERVICE_ACCOUNT`.
- A service account might still exist inside Google’s APIs after the user consents. That is Google’s side. The host never collects the JSON key.

## Not decided here

- Exact Google OAuth scopes and which Firebase Management / Google APIs list projects
- Whether a raw Firestore driver factory exists for non-host tools (only: not a service-account host flow)
