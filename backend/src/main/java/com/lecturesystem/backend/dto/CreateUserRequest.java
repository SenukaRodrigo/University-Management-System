package com.lecturesystem.backend.dto;

import com.lecturesystem.backend.model.Role;

public record CreateUserRequest(
        String fullName,
        String email,
        String password,
        Role role
) {}
