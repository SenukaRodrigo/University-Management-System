package com.lecturesystem.backend.exception;

// Thrown when an authenticated user tries to modify a resource they don't own.
// Distinct from the role rules in SecurityConfig: the role rule asks "is this
// user a LECTURER at all?", this asks "is this user THE lecturer of this lecture?".
public class NotResourceOwnerException extends RuntimeException {
    public NotResourceOwnerException(String message) {
        super(message);
    }
}
