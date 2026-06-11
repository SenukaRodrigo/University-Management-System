package com.lecturesystem.backend.service;

import com.lecturesystem.backend.dto.RequestResponse;
import com.lecturesystem.backend.exception.NotResourceOwnerException;
import com.lecturesystem.backend.model.EnrollmentRequest;
import com.lecturesystem.backend.model.Lecture;
import com.lecturesystem.backend.model.RequestStatus;
import com.lecturesystem.backend.model.User;
import com.lecturesystem.backend.repository.EnrollmentRequestRepository;
import com.lecturesystem.backend.repository.LectureRepository;
import com.lecturesystem.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EnrollmentRequestService {

    private final EnrollmentRequestRepository requestRepository;
    private final LectureRepository lectureRepository;
    private final UserRepository userRepository;

    public EnrollmentRequestService(EnrollmentRequestRepository requestRepository,
                                    LectureRepository lectureRepository,
                                    UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.lectureRepository = lectureRepository;
        this.userRepository = userRepository;
    }

    public RequestResponse createRequest(Long lectureId) {
        // The student is the caller — from the token, never the body.
        User student = currentUser();

        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Lecture not found"));

        if (requestRepository.existsByStudentIdAndLectureId(student.getId(), lectureId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "You have already requested to join this lecture");
        }

        EnrollmentRequest request = new EnrollmentRequest();
        request.setStudent(student);
        request.setLecture(lecture);
        // status defaults to PENDING in the entity
        return toResponse(requestRepository.save(request));
    }

    public List<RequestResponse> getMyRequests() {
        return requestRepository.findByStudentId(currentUser().getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RequestResponse> getRequestsForLecture(Long lectureId) {
        Lecture lecture = lectureRepository.findById(lectureId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Lecture not found"));

        // One-hop ownership check, same as lecture update/delete:
        // only the lecture's own lecturer may see its requests.
        if (!lecture.getLecturer().getId().equals(currentUser().getId())) {
            throw new NotResourceOwnerException(
                    "You can only view requests for your own lectures");
        }

        return requestRepository.findByLectureId(lectureId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RequestResponse> getIncoming() {
        // All requests across every lecture this lecturer owns, then keep
        // only the ones still awaiting a decision.
        return requestRepository.findByLectureLecturerId(currentUser().getId()).stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING)
                .map(this::toResponse)
                .toList();
    }

    public RequestResponse updateStatus(Long requestId, RequestStatus status) {
        EnrollmentRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Request not found"));

        // Two-hop ownership check: the request doesn't belong to the lecturer
        // directly — we authorize through the lecture it points at.
        // request -> lecture -> lecturer must be the caller.
        if (!request.getLecture().getLecturer().getId().equals(currentUser().getId())) {
            throw new NotResourceOwnerException(
                    "You can only decide requests for your own lectures");
        }

        // A decision can only be ACCEPTED or REJECTED — you can't set a
        // request back to PENDING.
        if (status == RequestStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Status must be ACCEPTED or REJECTED");
        }

        // And only an undecided request can be decided.
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "This request has already been " + request.getStatus());
        }

        request.setStatus(status);
        return toResponse(requestRepository.save(request));
    }

    // --- helpers ---

    private User currentUser() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user no longer exists"));
    }

    private RequestResponse toResponse(EnrollmentRequest request) {
        return new RequestResponse(
                request.getId(),
                request.getLecture().getId(),
                request.getLecture().getTitle(),
                request.getStudent().getId(),
                request.getStudent().getFullName(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
