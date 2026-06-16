package com.lecturesystem.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotResourceOwnerException.class)
    public ResponseEntity<Map<String, String>> handleNotResourceOwner(NotResourceOwnerException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        // getMostSpecificCause() unwraps to the JDBC driver exception whose message
        // is filled by the database. PostgreSQL always says "duplicate key" for a
        // unique violation (23505) and "violates foreign key constraint" for an FK
        // violation (23503). Checking the message text avoids importing
        // driver-specific classes like PSQLException just to read the SQL state.
        String rootMessage = ex.getMostSpecificCause().getMessage();
        boolean isDuplicateKey = rootMessage != null
                && (rootMessage.contains("duplicate key") || rootMessage.contains("unique constraint"));

        String message = isDuplicateKey
                ? "A record with the given data already exists"
                : "The operation could not be completed due to a data constraint violation";

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (first, second) -> first));
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Validation failed", "errors", fieldErrors));
    }
}
