package com.lecturesystem.backend.dto;

import com.lecturesystem.backend.model.RequestStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateRequestStatus(
        @NotNull(message = "Status is required (ACCEPTED or REJECTED)")
        RequestStatus status
) {}
