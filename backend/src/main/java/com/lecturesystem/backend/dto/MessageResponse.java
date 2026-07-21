package com.lecturesystem.backend.dto;

// Generic text-only response for endpoints that don't return a resource
// (signup, verify, resend) — the client shows `message` directly.
public record MessageResponse(String message) {}
