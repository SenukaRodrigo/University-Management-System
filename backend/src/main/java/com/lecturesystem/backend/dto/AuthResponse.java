package com.lecturesystem.backend.dto;

import com.lecturesystem.backend.model.Role;

public record AuthResponse(String token, Role role, Long id) {}
