# Security policy

If you believe DB SDK can write to a customer database, bypass read-only policy, or leak credentials, report it privately. Do not open a public GitHub issue with an exploit.

- Email: security@becausify.com
- Include the provider (`postgres`, `firestore`, …), a minimal reproduction, and the impact (write, data leak, or credential leak).

This repository is documentation-first; there is no released implementation yet. The same reporting path applies to the documented design and to code once it lands.

SDK query validation is **not a security boundary**. Reports that assume a sanitizer is sufficient should still be filed if they show a write or a credential leak; the intended lock is a read-only database role. See [docs/security.md](docs/security.md).

We will acknowledge the report and fix before any disclosure.
