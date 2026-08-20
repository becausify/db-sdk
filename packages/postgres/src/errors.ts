/**
 * Error thrown when a Postgres read is rejected by SQL policy or runtime limits.
 */
export class PostgresQueryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PostgresQueryError";
    this.code = code;
  }
}
