package com.lecturesystem.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateLectureRequest(
        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description
) {}
