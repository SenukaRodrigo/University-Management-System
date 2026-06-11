package com.lecturesystem.backend.dto;

import jakarta.validation.constraints.NotBlank;

// Deliberately NO lecturer id field: the owner is always the authenticated
// caller, taken from the JWT. Accepting it in the body would let any lecturer
// create lectures "as" someone else.
public record CreateLectureRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description
) {}
