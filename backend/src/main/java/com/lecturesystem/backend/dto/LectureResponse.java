package com.lecturesystem.backend.dto;

import java.time.Instant;

public record LectureResponse(
        Long id,
        String title,
        String description,
        Long lecturerId,
        String lecturerName,
        Instant createdAt
) {}
