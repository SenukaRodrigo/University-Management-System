package com.lecturesystem.backend.dto;

import com.lecturesystem.backend.model.RequestStatus;

import java.time.Instant;

public record RequestResponse(
        Long id,
        Long lectureId,
        String lectureTitle,
        Long studentId,
        String studentName,
        RequestStatus status,
        Instant createdAt
) {}
