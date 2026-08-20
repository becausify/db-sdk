export class SupabaseError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "SupabaseError";
    this.code = code;
  }
}
