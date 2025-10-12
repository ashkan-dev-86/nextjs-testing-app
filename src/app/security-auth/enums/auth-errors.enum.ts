export enum AuthErrors {
    TOO_MANY_ATTEMPTS = 'Too many login attempts. Please try again later.',
    INVALID_EMAIL = "Invalid email address",
    PASSWORD_TOO_SHORT = "Password must be at least 8 characters",
    INVALID_CREDENTIALS = "Invalid credentials",
    INVALID_CREDENTIALS_FORMAT = "Invalid credentials format",
    ACCOUNT_DISABLED = "Account is disabled. Please contact support.",
    EMAIL_NOT_VERIFIED = "Email is not verified. Please verify your email address.",
    INVALID_EMAIL_PASSWORD = "Invalid email or password",
    NAME_REQUIRED = "Name must be at least 2 characters",
    PASSWORD_FORMAT = "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    PASSWORD_SPECIAL_CHAR = "Password must contain at least one special character",
    PASSWORD_MISMATCH = "Passwords don't match",
    EMAIL_EXISTS = "Email already exists",
    REGISTER_FAILED = "Registration failed",
    UNEXPECTED_ERROR = "An unexpected error occurred"
}