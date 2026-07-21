package com.lecturesystem.backend.exception;

// Thrown by /api/auth/verify when the code doesn't match (or no code exists
// for the user). Handled in GlobalExceptionHandler as an HTTP 400.
public class InvalidVerificationCodeException extends RuntimeException {
    public InvalidVerificationCodeException() {
        super("Invalid code");
    }
}
