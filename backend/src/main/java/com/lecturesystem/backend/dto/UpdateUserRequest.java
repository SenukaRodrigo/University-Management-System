package com.lecturesystem.backend.dto;

import com.lecturesystem.backend.model.Role;

public record UpdateUserRequest(
        String fullName,
        String email,
        Role role
) {}
