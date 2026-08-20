export const securityLayers = [
  {
    title: "SDK",
    command: "await db.query()",
    body: "Read-oriented API, default time and row limits. Fail closed when unsure. Not a security boundary.",
    boundary: false,
  },
  {
    title: "Provider",
    command: "npm i @db-sdk/postgres",
    body: "Engine-specific checks. SQL policy on the Postgres driver. Read APIs only on Firestore. Not a security boundary.",
    boundary: false,
  },
  {
    title: "Runtime",
    command: "AbortSignal.timeout()",
    body: "Timeouts, required or injected limits, abort signals, and bounded result payloads.",
    boundary: false,
  },
  {
    title: "Database",
    command: "GRANT SELECT",
    body: "The lock: a dedicated read-only role or IAM principal, restricted schemas, TLS.",
    boundary: true,
  },
] as const;
