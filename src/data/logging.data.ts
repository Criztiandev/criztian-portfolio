export const REDACTED_PLACEHOLDER = "[redacted]"

export const SENSITIVE_KEY_FRAGMENTS = [
  "password",
  "secret",
  "token",
  "credential",
  "authorization",
  "cookie",
  "apikey",
  "api_key",
  "session",
  "email",
  "message",
  "phone",
]

export const SENSITIVE_VALUE_PATTERNS = [
  /sb_(?:secret|publishable)_[A-Za-z0-9_-]+/g,
  /eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  /Bearer\s+[A-Za-z0-9._-]+/gi,
]

export const MAX_REDACTION_DEPTH = 4

export const MAX_LOGGED_STRING_LENGTH = 200

export const MAX_LOGGED_STACK_LENGTH = 2000
