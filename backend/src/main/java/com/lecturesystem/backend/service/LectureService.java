package com.lecturesystem.backend.service;

import com.lecturesystem.backend.dto.CreateLectureRequest;
import com.lecturesystem.backend.dto.LectureResponse;
import com.lecturesystem.backend.dto.UpdateLectureRequest;
import com.lecturesystem.backend.exception.NotResourceOwnerException;
import com.lecturesystem.backend.model.Lecture;
import com.lecturesystem.backend.model.User;
import com.lecturesystem.backend.repository.EnrollmentRequestRepository;
import com.lecturesystem.backend.repository.LectureRepository;
import com.lecturesystem.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class LectureService {

    private final LectureRepository lectureRepository;
    private final UserRepository userRepository;
    private final EnrollmentRequestRepository enrollmentRequestRepository;

    public LectureService(LectureRepository lectureRepository,
                          UserRepository userRepository,
                          EnrollmentRequestRepository enrollmentRequestRepository) {
        this.lectureRepository = lectureRepository;
        this.userRepository = userRepository;
        this.enrollmentRequestRepository = enrollmentRequestRepository;
    }

    public LectureResponse create(CreateLectureRequest req) {
        Lecture lecture = new Lecture();
        // The owner comes from the token, never from the request body.
        // Whoever the JWT says is calling is who owns the new lecture.
        lecture.setLecturer(currentUser());
        lecture.setTitle(req.title());
        lecture.setDescription(req.description());
        return toResponse(lectureRepository.save(lecture));
    }

    public List<LectureResponse> getAll() {
        return lectureRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public LectureResponse getById(Long id) {
        return toResponse(loadLecture(id));
    }

    public List<LectureResponse> getMine() {
        return lectureRepository.findByLecturerId(currentUser().getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public LectureResponse update(Long id, UpdateLectureRequest req) {
        Lecture lecture = loadLecture(id);
        assertOwnedByCurrentUser(lecture);
        lecture.setTitle(req.title());
        lecture.setDescription(req.description());
        return toResponse(lectureRepository.save(lecture));
    }

    @Transactional
    public void delete(Long id) {
        Lecture lecture = loadLecture(id);
        assertOwnedByCurrentUser(lecture);
        // Remove child requests first so the FK constraint is not violated.
        // Both deletes share this transaction — if either fails, both roll back.
        enrollmentRequestRepository.deleteByLectureId(id);
        lectureRepository.delete(lecture);
    }

    // --- helpers ---

    // The JWT filter validated the token and stored the email as the principal
    // in the SecurityContext (a thread-local tied to the current request).
    // Here we turn that email back into the full User row.
    private User currentUser() {
        String email = (String) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Authenticated user no longer exists"));
    }

    private Lecture loadLecture(Long id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Lecture not found"));
    }

    // Ownership check: the role rule in SecurityConfig already guaranteed the
    // caller is a LECTURER; this guarantees they are THIS lecture's lecturer.
    // Compare ids, not entity references — the entities may be different
    // objects (or a Hibernate proxy) even when they represent the same row.
    private void assertOwnedByCurrentUser(Lecture lecture) {
        if (!lecture.getLecturer().getId().equals(currentUser().getId())) {
            throw new NotResourceOwnerException("You can only modify your own lectures");
        }
    }

    private LectureResponse toResponse(Lecture lecture) {
        return new LectureResponse(
                lecture.getId(),
                lecture.getTitle(),
                lecture.getDescription(),
                lecture.getLecturer().getId(),
                lecture.getLecturer().getFullName(),
                lecture.getCreatedAt()
        );
    }
}
