package com.lecturesystem.backend.exception;

// Thrown by login when the account exists and the password is correct, but
// enabled==false. Distinct from the 401 for wrong credentials — the client
// uses this to point the user at the verification page instead of just
// telling them to retry. Handled in GlobalExceptionHandler as an HTTP 403.
public class UnverifiedEmailException extends RuntimeException {
    public UnverifiedEmailException() {
        super("Please verify your email before logging in.");
    }
}
