package com.lecturesystem.backend.exception;

// Thrown at signup when the email's domain doesn't map to a known role.
// Handled in GlobalExceptionHandler as an HTTP 400.
public class InvalidEmailDomainException extends RuntimeException {
    public InvalidEmailDomainException() {
        super("Please register with your university email address.");
    }
}
