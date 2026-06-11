package com.lecturesystem.backend.controller;

import com.lecturesystem.backend.dto.RequestResponse;
import com.lecturesystem.backend.dto.UpdateRequestStatus;
import com.lecturesystem.backend.service.EnrollmentRequestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final EnrollmentRequestService requestService;

    public RequestController(EnrollmentRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/mine")
    public List<RequestResponse> getMine() {
        return requestService.getMyRequests();
    }

    @GetMapping("/incoming")
    public List<RequestResponse> getIncoming() {
        return requestService.getIncoming();
    }

    @PutMapping("/{id}")
    public RequestResponse updateStatus(@PathVariable Long id,
                                        @Valid @RequestBody UpdateRequestStatus req) {
        return requestService.updateStatus(id, req.status());
    }
}
