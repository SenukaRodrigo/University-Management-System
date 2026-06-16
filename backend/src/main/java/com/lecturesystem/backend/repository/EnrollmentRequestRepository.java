package com.lecturesystem.backend.repository;

import com.lecturesystem.backend.model.EnrollmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequest, Long> {

    List<EnrollmentRequest> findByStudentId(Long studentId);

    List<EnrollmentRequest> findByLectureId(Long lectureId);

    // Spring Data walks the property path: request.lecture.lecturer.id —
    // it generates a join across all of a lecturer's lectures in one query.
    List<EnrollmentRequest> findByLectureLecturerId(Long lecturerId);

    boolean existsByStudentIdAndLectureId(Long studentId, Long lectureId);
}
