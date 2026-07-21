package com.lecturesystem.backend.exception;

// Thrown by /api/auth/verify when the code matches but its expiry has passed.
// Handled in GlobalExceptionHandler as an HTTP 400.
public class VerificationCodeExpiredException extends RuntimeException {
    public VerificationCodeExpiredException() {
        super("Code expired. Please request a new one.");
    }
}
