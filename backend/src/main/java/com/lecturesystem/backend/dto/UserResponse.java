package com.lecturesystem.backend.dto;

import com.lecturesystem.backend.model.Role;

import java.time.Instant;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        Instant createdAt
) {}
