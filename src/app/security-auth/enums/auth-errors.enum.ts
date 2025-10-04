export enum AuthErrors {
    TOO_MANY_ATTEMPTS = 'Too many login attempts. Please try again later.',
    INVALID_EMAIL = "Invalid email address",
    PASSWORD_TOO_SHORT = "Password must be at least 8 characters",
    INVALID_CREDENTIALS = "Invalid credentials",
    INVALID_CREDENTIALS_FORMAT = "Invalid credentials format",
    ACCOUNT_DISABLED = "Account is disabled. Please contact support.",
    EMAIL_NOT_VERIFIED = "Email is not verified. Please verify your email address.",
}