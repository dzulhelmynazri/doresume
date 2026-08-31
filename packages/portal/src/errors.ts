export const PORTAL_ERROR_CODES = [
  "job-not-found",
  "not-supported",
  "submission-failed",
] as const;

export type PortalErrorCode = (typeof PORTAL_ERROR_CODES)[number];

export class PortalError extends Error {
  readonly code: PortalErrorCode;

  constructor(code: PortalErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "PortalError";
  }
}
