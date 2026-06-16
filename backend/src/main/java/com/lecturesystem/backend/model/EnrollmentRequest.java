package com.lecturesystem.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

// The DB-level unique constraint backs up the service's duplicate check:
// if two identical requests race past existsByStudentIdAndLectureId, the
// second insert fails here and the GlobalExceptionHandler turns the
// DataIntegrityViolationException into a 409.
@Entity
@Table(name = "enrollment_requests",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "lecture_id"}))
@Getter
@Setter
public class EnrollmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lecture_id", nullable = false)
    private Lecture lecture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
