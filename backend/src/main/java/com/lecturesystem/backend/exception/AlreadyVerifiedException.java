package com.lecturesystem.backend.exception;

// Thrown by /api/auth/verify when the account is already enabled.
// Handled in GlobalExceptionHandler as an HTTP 400.
public class AlreadyVerifiedException extends RuntimeException {
    public AlreadyVerifiedException() {
        super("Already verified");
    }
}
