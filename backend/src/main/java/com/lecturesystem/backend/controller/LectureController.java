package com.lecturesystem.backend.controller;

import com.lecturesystem.backend.dto.CreateLectureRequest;
import com.lecturesystem.backend.dto.LectureResponse;
import com.lecturesystem.backend.dto.RequestResponse;
import com.lecturesystem.backend.dto.UpdateLectureRequest;
import com.lecturesystem.backend.service.EnrollmentRequestService;
import com.lecturesystem.backend.service.LectureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lectures")
public class LectureController {

    private final LectureService lectureService;
    private final EnrollmentRequestService requestService;

    public LectureController(LectureService lectureService,
                             EnrollmentRequestService requestService) {
        this.lectureService = lectureService;
        this.requestService = requestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LectureResponse create(@Valid @RequestBody CreateLectureRequest req) {
        return lectureService.create(req);
    }

    @GetMapping
    public List<LectureResponse> getAll() {
        return lectureService.getAll();
    }

    // Declared alongside /{id} — Spring MVC always prefers the exact literal
    // path over the path-variable pattern, so /mine is never parsed as an id.
    @GetMapping("/mine")
    public List<LectureResponse> getMine() {
        return lectureService.getMine();
    }

    @GetMapping("/{id}")
    public LectureResponse getOne(@PathVariable Long id) {
        return lectureService.getById(id);
    }

    @PutMapping("/{id}")
    public LectureResponse update(@PathVariable Long id, @Valid @RequestBody UpdateLectureRequest req) {
        return lectureService.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        lectureService.delete(id);
    }

    // --- nested enrollment-request routes ---

    // No request body: the lecture comes from the URL, the student from the token.
    @PostMapping("/{lectureId}/requests")
    @ResponseStatus(HttpStatus.CREATED)
    public RequestResponse createRequest(@PathVariable Long lectureId) {
        return requestService.createRequest(lectureId);
    }

    @GetMapping("/{lectureId}/requests")
    public List<RequestResponse> getRequestsForLecture(@PathVariable Long lectureId) {
        return requestService.getRequestsForLecture(lectureId);
    }
}
